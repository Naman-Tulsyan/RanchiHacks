"""Authentication Models"""
from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime

# Define role types
RoleType = Literal["police", "forensic_lab", "prosecutor", "judge"]

class User(BaseModel):
    """User model with role"""
    id: str
    username: str
    role: RoleType
    full_name: str
    department: Optional[str] = None

class UserLogin(BaseModel):
    """Login request model"""
    username: str
    password: str
    role: RoleType

class Token(BaseModel):
    """JWT Token response"""
    access_token: str
    token_type: str = "bearer"
    user: User
    expires_at: datetime
