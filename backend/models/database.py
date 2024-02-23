from sqlalchemy import create_engine, Column, Integer, Float, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship, backref
from sqlalchemy.ext.declarative import declarative_base
import datetime

Base = declarative_base()


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(150), unique=True, index=True)
    email = Column(String(150), unique=True, index=True)
    password = Column(String(200))
    address = Column(String(300), index=True)
    phone_number = Column(String(20), unique=True, index=True)
    scopes = Column(String, default="read:profile")


class Restaurant(Base):
    __tablename__ = 'restaurants'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), unique=True, index=True)
    address = Column(String(300), index=True)
    # Additional restaurant-related fields can be added here

    items = relationship("RestaurantItem", backref="restaurant")


class RestaurantItem(Base):
    __tablename__ = 'restaurant_items'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), index=True)
    description = Column(String(300))
    price = Column(Float)
    restaurant_id = Column(Integer, ForeignKey('restaurants.id'))


class Order(Base):
    __tablename__ = 'orders'

    order_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    restaurant_id = Column(Integer, ForeignKey('restaurants.id'), nullable=False)
    total_amount = Column(Float, nullable=False)
    status = Column(String, nullable=False)
    delivery_address = Column(String, nullable=False)
    time_placed = Column(DateTime, default=datetime.datetime.utcnow)

    order_items = relationship("OrderItem", backref="order")


class OrderItem(Base):
    __tablename__ = 'order_items'

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey('orders.order_id'), nullable=False)
    restaurant_item_id = Column(Integer, ForeignKey('restaurant_items.id'), nullable=False)
    quantity = Column(Integer, nullable=False)
    price_at_time_of_order = Column(Float, nullable=False)


class Payment(Base):
    __tablename__ = 'payments'

    transaction_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    order_id = Column(Integer, ForeignKey('orders.order_id'), nullable=True) # Nullable because not all payments are linked to orders
    amount = Column(Float, nullable=False)
    status = Column(String, nullable=False) # Can use Enum like "SUCCESS", "FAILED", "PENDING", etc.
    transaction_time = Column(DateTime, default=datetime.datetime.utcnow)