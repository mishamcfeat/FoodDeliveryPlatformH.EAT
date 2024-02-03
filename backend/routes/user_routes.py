from fastapi import APIRouter, HTTPException, Depends, status, Response, Request
from fastapi.security import OAuth2PasswordBearer
from starlette.responses import JSONResponse
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
    users = [UserOut(id=user.id, username=user.username, email=user.email,
                     address=user.address, phone_number=user.phone_number) for user in db_users]

    return users


@router.post("/register/", response_model=UserOut)
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    # Data Validation: "user" parameter already validated the data using Pydantic
    # ORM: Create a new user instance and add to the database
    # It's hashed in byte format and then changed to string format to be stored
    hashed_password = bcrypt.hashpw(user.password.encode(
        'utf-8'), bcrypt.gensalt()).decode('utf-8')
    db_user = User(username=user.username, email=user.email,
                   password=hashed_password, address=user.address)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.post("/login/")
async def login_user(credentials: UserLogin, db: Session = Depends(get_db)):
    # Query for the user

    db_user = db.query(User).filter(User.email == credentials.email).first()
    # Check if user exists and the password is correct
    # .encode('utf-8) changes string to byte format
    # The salt used to hash the password is contained in the db_user.password along with the password
    if db_user and bcrypt.checkpw(credentials.password.encode('utf-8'), db_user.password.encode('utf-8')):
        # Token lasts for 30 minutes before re-verification is needed
        expiration = datetime.datetime.utcnow() + datetime.timedelta(minutes=30)
        # Create a token (algo = header, username = payload, jwt.encode = signature)
        token_data = {
            "sub": db_user.id,
            "exp": expiration,
            "scopes": db_user.scopes
        }
        token = jwt.encode(token_data, "private_key", algorithm="HS256")
        # Create a response object
        content = {"token": token}
        response = JSONResponse(content=content)

        # Set the JWT as a cookie on the response object
        response.set_cookie(key="jwt_token", value=token,
                            httponly=True, secure=False, samesite="lax")
        return response
    else:
        raise HTTPException(status_code=400, detail="Invalid credentials")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login/")


def get_current_user(request: Request):
    token = request.cookies.get("jwt_token")

    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

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
        user_scopes: str = payload.get("scopes", "")
        if user_id is None:
            raise credentials_exception
    except Exception:
        raise credentials_exception
    return {"user_id": user_id, "scopes": user_scopes.split()}


@router.get("/profile/{user_email}/")
async def get_profile_by_email(user_email: str, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    user_details = db.query(User).filter(User.email == user_email).first()

    if not user_details:
        raise HTTPException(status_code=404, detail="User not found")

    # Check if the user_id from JWT matches the user_id fetched using email
    if user_details.id != current_user["user_id"]:
        raise HTTPException(status_code=403, detail="Access Denied")

    exclude_fields = {"password", "_sa_instance_state"}
    user_dict = {k: v for k, v in user_details.__dict__.items() if k not in exclude_fields}

    return {"user": user_dict}


@router.put("/profile/{user_id}/")
async def update_profile(user_id: int, user: UserUpdate, current_user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    if user_id != current_user_id:
        raise HTTPException(status_code=400, detail="Not enough permissions")

    # Logic to update user profile using the db session
    db.query(User).filter(User.id == user_id).update(
        user.model_dump(exclude_unset=True))
    db.commit()
    return {"message": "Profile updated"}


@router.post("/logout/")
async def logout_user(response: Response):
    # Clear the JWT cookie
    response.delete_cookie(key="jwt_token")
    return {"message": "Logged out"}
