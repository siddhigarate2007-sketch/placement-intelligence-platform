from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str = "STUDENT" # STUDENT, OFFICER, FACULTY, ADMIN

class UserCreate(UserBase):
    password: str
    department_code: Optional[str] = "CSE"
    roll_number: Optional[str] = None
    batch_year: Optional[int] = 2026

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    user_id: int
    full_name: str
    email: str

class UserResponse(UserBase):
    id: int
    department_id: Optional[int] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
