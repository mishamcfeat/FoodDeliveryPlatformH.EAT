from sqlalchemy import create_engine
from db.get_db import Base, engine
from models.database import User, Restaurant, RestaurantItem, Order, OrderItem, Payment

# Drop the users table
def reset_database():
    try:
        OrderItem.__table__.drop(engine)
        Payment.__table__.drop(engine)
        Order.__table__.drop(engine)
        RestaurantItem.__table__.drop(engine)
        Restaurant.__table__.drop(engine)
        User.__table__.drop(engine)
        
        
        Base.metadata.create_all(engine)
    except Exception as e:
        print(f"An error occurred: {e}")


if __name__ == "__main__":
    reset_database()
    print("Database reset successfully!")

