from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
import bcrypt
import jwt
from typing import List
import datetime

# Internal imports
from db.get_db import get_db
from schemas.user import UserCreate, UserLogin, UserUpdate, UserOut
from models.database import User


router = APIRouter()
TOKEN_BLACKLIST = set()

@router.get("/list_users/", response_model=List[UserOut])
async def list_users(db: Session = Depends(get_db)):
    db_users = db.query(User).all()
    if not db_users:
        raise HTTPException(status=404, detail="No users found")
    
    # Use list comprehension to convert each user to a dictionary
    users = [UserOut(id=user.id, username=user.username, email=user.email, address=user.address, phone_number=user.phone_number) for user in db_users]
    
    return users

@router.post("/register/", response_model=UserOut)
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    # Data Validation: "user" parameter already validated the data using Pydantic
    # ORM: Create a new user instance and add to the database
    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
    db_user = User(username=user.username, email=user.email, address=user.address, password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.post("/login/")
async def login_user(credentials: UserLogin, db: Session = Depends(get_db)):
    # Query for the user
    
    db_user = db.query(User).filter(User.username == credentials.username).first()
    print(db_user.password)
    # Check if user exists and the password is correct
    if db_user: #and bcrypt.checkpw(credentials.password.encode('utf-8'), db_user.password.encode('utf-8')):
        # Token lasts for 30 minutes before re-verification is needed
        expiration = datetime.datetime.utcnow() + datetime.timedelta(minutes=30)
        # Create a token (algo = header, username = payload, jwt.encode = signature)
        token = jwt.encode({"sub": db_user.id, "exp": expiration}, "private_key", algorithm="HS256")
        return {"token": token}
    else:
        raise HTTPException(status_code=400, detail="Invalid credentials")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login/")

def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if token in TOKEN_BLACKLIST:
        raise credentials_exception
    try:
        payload = jwt.decode(token, "private_key", algorithms=['HS256'])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except Exception:
        raise credentials_exception
    return user_id

@router.put("/profile/{user_id}/")
async def update_profile(user_id: int, user: UserUpdate, current_user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    if user_id != current_user_id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    
    # Logic to update user profile using the db session
    db.query(User).filter(User.id == user_id).update(user.model_dump(exclude_unset=True))
    db.commit()
    return {"message": "Profile updated"}


@router.post("/logout/")
async def logout_user(token: str = Depends(oauth2_scheme)):
    # Logic to log out a user or invalidate their token
    # Note: This will be client-side on the react native app
    TOKEN_BLACKLIST.add(token)
    print(TOKEN_BLACKLIST)
    return {"message": "Logged out"}
