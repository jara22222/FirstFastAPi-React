from datetime import datetime
from uuid import UUID
from pydantic import BaseModel
from fastapi_users import schemas
import uuid

class PostResponse(BaseModel):
    id:UUID
    caption:str
    url:str
    file_type:str
    file_name:str
    public_id:str
    user_id:UUID
    created_at:datetime
    model_config={'from_attributes':True}

class UserRead(schemas.BaseUser[uuid.UUID]):
    pass

class UserCreate(schemas.BaseUserCreate):
    pass

class UserUpdate(schemas.BaseUserUpdate):
    pass



