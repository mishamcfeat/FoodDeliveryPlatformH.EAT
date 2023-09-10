from sqlalchemy import create_engine
from db.get_db import Base, engine
from models.database import User, Order, OrderItem, Restaurant, RestaurantItem, Payment

try:
    Payment.__table__.create(bind=engine)
    print("Tables created!")
except Exception as e:
    print(f"Error occurred: {e}")

