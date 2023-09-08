from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

# Internal imports
from db.get_db import get_db
from schemas.user import UserCreate, UserLogin, UserUpdate, UserOut
from models.database import User


router = APIRouter()


@router.post("/register/", response_model=UserOut)
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    # Data Validation: "user" parameter already validated the data using Pydantic
    # ORM: Create a new user instance and add to the database
    db_user = User(username=user.username, email=user.email, password=user.password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.post("/login/")
async def login_user(credentials: UserLogin, db: Session = Depends(get_db)):
    # Logic to authenticate and log in a user using the db session
    # Example: user = db.query(User).filter(User.username == credentials.username).first()
    return {"token": "some_token"}


@router.get("/profile/")
async def get_profile(user_id: int, db: Session = Depends(get_db)):
    # Logic to fetch user profile using the db session
    # Example: user = db.query(User).filter(User.id == user_id).first()
    return {"user": "user_data"}


@router.put("/profile/")
async def update_profile(user: UserUpdate, db: Session = Depends(get_db)):
    # Logic to update user profile using the db session
    # Example: db.query(User).filter(User.id == user.id).update({...})
    return {"message": "Profile updated"}


@router.post("/logout/")
async def logout_user(db: Session = Depends(get_db)):
    # Logic to log out a user or invalidate their token
    # Note: Depending on your authentication method, you might not need the db session for this route.
    return {"message": "Logged out"}
