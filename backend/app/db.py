from collections.abc import AsyncGenerator
import uuid
from sqlalchemy import Column,String,Text,DateTime,ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine,async_sessionmaker
from sqlalchemy.orm import DeclarativeBase, relationship
import datetime
from fastapi_users.db import SQLAlchemyUserDatabase,SQLAlchemyBaseUserTableUUID
from fastapi import Depends
from dotenv import load_dotenv
import os
load_dotenv()

DATABASE_URL= os.getenv("DATABASE_URL")

class Base(DeclarativeBase):
    pass



class Users(SQLAlchemyBaseUserTableUUID,Base):
    __tablename__ = "users"
    posts = relationship("Post",back_populates="author")


class Post(Base):
    __tablename__ = "post"
    id = Column(UUID(as_uuid=True),primary_key=True,default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    caption = Column(Text)
    url = Column(String, nullable=False)
    file_type = Column(String, nullable=False)
    public_id = Column(String, nullable=False)
    file_name = Column(String, nullable=False)
    author = relationship("Users",back_populates="posts")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


engine = create_async_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    connect_args={"ssl": "require"} 
)
                            
Async_sessionmaker = async_sessionmaker(engine,expire_on_commit=False)

async def create_db_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

async def get_async_session()->AsyncGenerator[AsyncSession,None]:
    async with Async_sessionmaker() as session:
        yield session

async def get_users_db(session:AsyncSession = Depends(get_async_session)):
    yield SQLAlchemyUserDatabase(session,Users)