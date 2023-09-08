from pydantic import BaseModel, ConfigDict
from typing import Optional

# For user registration
class UserCreate(BaseModel):
    username: str
    email: str
    password: str

# For user login
class UserLogin(BaseModel):
    username: str
    password: str

# For updating user profile
class UserUpdate(BaseModel):
    email: Optional[str]
    # ... Add other fields if needed, like address, phone_number etc.
    
# Data structure returned to user
class UserOut(BaseModel):
    #model_config = ConfigDict(from_attributes=True)  # This allows for ORM objects to be converted to this Pydantic model
    
    id: int
    username: str
    email: str
    address: Optional[str]
    phone_number: Optional[str]
    
    class Config:
        orm_mode = True



