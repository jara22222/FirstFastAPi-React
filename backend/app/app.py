import uvicorn
from fastapi import FastAPI,HTTPException,File,UploadFile,Form,Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from app.db import Post, Users, create_db_tables, get_async_session
from sqlalchemy.ext.asyncio import AsyncSession
from contextlib import asynccontextmanager
from sqlalchemy import select
from uuid import UUID
from datetime import datetime
import shutil,os,uuid,tempfile
from app.images import cloudinary
from fastapi.concurrency import run_in_threadpool
import cloudinary.uploader
from app.users import auth_backend,current_active_users,fastapi_users
from app.schema import PostResponse,UserCreate,UserRead,UserUpdate


@asynccontextmanager
async def lifespan(app:FastAPI):
    await create_db_tables()
    yield

app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # Allows your React app to connect
    allow_credentials=True,           # Required for JWT/cookies
    allow_methods=["*"],              # Allows GET, POST, DELETE, etc.
    allow_headers=["*"],              # Allows the Authorization header
)


app.include_router(fastapi_users.get_auth_router(auth_backend),prefix='/auth/jwt', tags=['auth'])
app.include_router(fastapi_users.get_register_router(UserRead,UserCreate),prefix='/auth', tags=['auth'])
app.include_router(fastapi_users.get_reset_password_router(),prefix='/auth', tags=['auth'])
app.include_router(fastapi_users.get_verify_router(UserRead),prefix='/auth', tags=['auth'])
app.include_router(fastapi_users.get_users_router(UserRead,UserUpdate),prefix='/users', tags=['users'])


#uploading Post
@app.post("/upload")
async def upload_file(
    file:UploadFile = File(...),
    caption:str = Form(""),
    user:Users = Depends(current_active_users),
    session: AsyncSession = Depends(get_async_session)
):
   
    file_content = await file.read()
   
    upload_result = await run_in_threadpool(
        cloudinary.uploader.upload,
        file_content,
        overwrite=True,
        invalidate=True,
        asset_folder="dumps",
        resource_type="auto"
    )

    
    file_name = file.filename
    file_type = file.content_type
    image_url = upload_result.get('secure_url')
    public_id = upload_result.get('public_id')

    new_post = Post(
        caption=caption,
        url=image_url,
        public_id=public_id,
        file_type=file_type,
        file_name=file_name,
        user_id = user.id,
    )
    session.add(new_post)
    await session.commit()
    await session.refresh(new_post)
    return new_post


#get all posts
@app.get("/feed",response_model=List[PostResponse])
async def get_post(
    user:Users = Depends(current_active_users),
    session:AsyncSession = Depends(get_async_session)
):
    result = await session.execute(select(Post).order_by(Post.created_at.desc()))
    posts = result.scalars().all()
    return posts

@app.get("/feed/mine", response_model=List[PostResponse])
async def get_my_post(
    user:Users = Depends(current_active_users),
    session:AsyncSession = Depends(get_async_session)
):
    result = await session.execute(select(Post).where(Post.user_id == user.id).order_by(Post.created_at.desc()))
    posts = result.scalars().all()
    return posts

#Deleting post
@app.delete("/posts/{post_id}")
async def delete_post(
    post_id:str,
    user:Users = Depends(current_active_users),
    session:AsyncSession = Depends(get_async_session)
):
    try:
        post_uuid = uuid.UUID(post_id)
        result = await session.execute(
            select(Post).where(Post.id == post_uuid)
        )
        post = result.scalar_one_or_none()



        if not post:
            raise HTTPException(status_code=404,detail="Post not found!")
        
        if post.user_id != user.id:
            raise HTTPException(status_code=403,detail="Unauthorized Action")
        
        public_id = post.public_id
        resource_type = "video" if "video" in  post.file_type else "image"
        delete_result = await run_in_threadpool(
                cloudinary.uploader.destroy,
                public_id,
                resource_type= resource_type,
                invalidate=True)
            
        
        await session.delete(post)
        await session.commit()
        return{"success":True,
               "message":"Post deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500,detail=str(e))





