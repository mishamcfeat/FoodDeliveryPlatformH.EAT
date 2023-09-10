from fastapi import APIRouter, HTTPException
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
import datetime
import logging

from routes.user_routes import get_current_user
from schemas.order import OrderCreate, OrderInit, OrderUpdate, OrderItem, OrderOut
from db.get_db import get_db
from models.database import User, Order


router = APIRouter()


@router.get("/test/")
async def test_route():
    return {"message": "Test route works!"}


@router.post("/initiate_order/")
async def initiate_order(init: OrderInit, db: Session = Depends(get_db), user: int = Depends(get_current_user)):
    
    # Fetch all of users data through users table
    current_user = db.query(User).filter(User.id == user).first()
    
    # Fetch user's default address if delivery_address is not provided
    if not init.delivery_address:
        init.delivery_address = current_user.address
    
    # Initialise order details using restaurant_id & delivery_address
    db_order = Order(
        user_id=current_user.id,
        restaurant_id=init.restaurant_id,
        delivery_address=init.delivery_address,
        total_amount=0,
        status="In Progress"
    )
    db.add(db_order)
    db.commit()

    return {"order_id": db_order.order_id}



@router.post("/add_item_to_order/{order_id}/")
async def add_item(order_id: int, item: OrderItem, db: Session = Depends(get_db)):
    db_order = db.query(Order).filter(Order.order_id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")

    db_item = OrderItem(
        order_id=order_id,
        restaurant_item_id=item.restaurant_item_id,
        quantity=item.quantity,
        price_at_time_of_order=item.price_at_time_of_order
    )
    db.add(db_item)
    db_order.total_amount += item.quantity * item.price_at_time_of_order
    db.commit()
    return {"message": "Item added successfully"}

@router.post("/finalize_order/{order_id}/")
async def finalize_order(order_id: int, db: Session = Depends(get_db)):
    db_order = db.query(Order).filter(Order.order_id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")

    db_order.status = "Placed"
    db_order.time_placed = datetime.datetime.utcnow()

    db.commit()
    return {"message": "Order finalized"}

@router.get("/{order_id}/", response_model=OrderOut)
async def get_order(order_id: int, db: Session = Depends(get_db)):
    # Logic to fetch specific order details
    db_order = db.query(Order).filter(Order.order_id == order_id).first()
    
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
     
    # Convert the SQLAlchemy object to the Pydantic model
    # __dict__ works on SQLAlchemy objects
    response = OrderOut(**db_order.__dict__)
    
    return response

@router.put("/{order_id}/", response_model=OrderOut)
async def update_order(order_id: int, update_address: OrderUpdate, db: Session = Depends(get_db)):
    # Logic to modify an order
    db_order = db.query(Order).filter(Order.order_id == order_id).first()
    
    # If the order doesn't exist, raise an error
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Update the delivery_address of the order
    db_order.delivery_address = update_address.delivery_address

    # Commit the changes to the database
    db.commit()

    # Return the updated order
    return db_order

@router.get("/history/{user_id}/")
async def order_history(user_id: int):
    # Logic to fetch all orders of a user
    return {"orders": ["order1", "order2"]}

@router.get("/status/{order_id}/")
async def order_status(order_id: int, db: Session = Depends(get_db)):
    # Logic to fetch the status of an order
    db_order = db.query(Order).filter(Order.order_id == order_id).first()
    
    # If the order doesn't exist, raise an error
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return db_order.status
