from sqlalchemy import create_engine
from db.get_db import Base, engine
from models.database import User, Restaurant, RestaurantItem, Order, OrderItem, Payment

def create_tables():
    try:
        # Create tables in an order that respects their dependencies
        User.__table__.create(engine)
        Restaurant.__table__.create(engine)
        RestaurantItem.__table__.create(engine)
        Order.__table__.create(engine)
        OrderItem.__table__.create(engine)
        Payment.__table__.create(engine)
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    create_tables()
    print("Tables created successfully!")


