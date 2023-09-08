from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)  # ORM: This is our primary key, auto-incremented by the database
    username = Column(String(150), unique=True, index=True)  # ORM: A unique username column
    email = Column(String(150), unique=True, index=True)     # ORM: A unique email column
    password = Column(String(200))                           # ORM: Password column
    address = Column(String(300), index=True)
    phone_number = Column(String(20), unique=True, index=True)
    # ... Add other fields if needed, like address, phone_number etc.
