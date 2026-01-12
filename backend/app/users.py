import uuid,os
from typing import Optional
from fastapi import Depends,Request
from fastapi_users import BaseUserManager,FastAPIUsers,UUIDIDMixin,models
from fastapi_users.authentication import(
    AuthenticationBackend,
    BearerTransport,
    JWTStrategy
)
from fastapi_users.db import SQLAlchemyUserDatabase
from app.db import Users,get_users_db
from dotenv import load_dotenv

load_dotenv()

JWT_SECRET_KEY = os.getenv("JWT_SECRET")

class UserManager(UUIDIDMixin,BaseUserManager[Users,uuid.UUID]):
    reset_password_token_secret = JWT_SECRET_KEY
    verification_token_secret = JWT_SECRET_KEY

    async def on_after_register(self,user:Users,request:Optional[Request]=None):
        print(f"User {user.id} has registered!")
    async def on_after_forgot_password(self,user:Users,token:str,request:Optional[Request]=None):
        print(f"User {user.id} has forgot password, here's the token {token}")
    async def on_after_request_verify(self,user:Users,token:str,request:Optional[Request]=None):
        print(f"verification requested for {user.id}, verification token {token} ")

async def get_user_manager(user_db:SQLAlchemyUserDatabase = Depends(get_users_db)):
    yield UserManager(user_db)

bearer_transport  = BearerTransport(tokenUrl="auth/jwt/login")


def get_jwt_strategy():
    return JWTStrategy(secret=JWT_SECRET_KEY,lifetime_seconds=3600)

auth_backend = AuthenticationBackend(
    name="jwt",
    transport=bearer_transport,
    get_strategy=get_jwt_strategy

)

fastapi_users = FastAPIUsers[Users,uuid.UUID](get_user_manager,[auth_backend])
current_active_users = fastapi_users.current_user(active=True)