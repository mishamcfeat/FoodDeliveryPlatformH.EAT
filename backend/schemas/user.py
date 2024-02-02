from pydantic import BaseModel, ConfigDict
from typing import Optional


# For user registration
class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    address: str


# For user login
class UserLogin(BaseModel):
    email: str
    password: str


# For updating user profile
class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    phone_number: Optional[str] = None


# Data structure returned to user
class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)  # This allows for ORM objects to be converted to this Pydantic model

    id: int
    username: str
    email: str
    address: Optional[str] = None
    phone_number: Optional[str] = None
