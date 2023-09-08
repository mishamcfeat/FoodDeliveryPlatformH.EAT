from sqlalchemy import create_engine
from db.get_db import Base, engine
from models.database import User

# Drop the users table
#User.__table__.drop(engine)

# Recreate the table
#Base.metadata.create_all(engine)
