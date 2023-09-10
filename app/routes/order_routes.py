from fastapi import APIRouter, HTTPException
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
import datetime

from schemas.order import OrderCreate, OrderUpdate, OrderItem, OrderOut
from db.get_db import get_db
from models.database import User, Order, OrderItem


router = APIRouter()

@router.post("/neworder/", response_model=OrderOut)
async def place_order(order: OrderCreate, db: Session = Depends(get_db)):
    # Fetch user's default address if delivery_address is not provided
    if not order.delivery_address:
        user = db.query(User).filter(User.id == order.user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        order.delivery_address = user.address

    # Compute total_amount
    total_amount = sum(item.quantity * item.price_at_time_of_order for item in order.order_items)

    # Set time_placed if not provided
    time_placed = order.time_placed or datetime.datetime.utcnow()
    
    # Data Validation: "user" parameter already validated the data using Pydantic
    # ORM: Create a new user instance and add to the database
    db_order = Order(
        user_id=order.user_id,
        restaurant_id=order.restaurant_id,
        delivery_address=order.delivery_address,
        total_amount=total_amount,
        status= "Pending",
        time_placed=time_placed
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    
    # ORM: Create order items associated with the order
    # Pydantic validaes that order_items field contains list of items that conforms to OrderItem model 
    # This is because order_items is defined as List[OrderItem] within the OrderCreate model
    for item in order.order_items:
        db_item = OrderItem(
            order_id=db_order.id,
            restaurant_item_id=item.restaurant_item_id,
            quantity=item.quantity,
            price_at_time_of_order=item.price_at_time_of_order
        )
        db.add(db_item)
    db.commit()
    # Add order items (if you're saving them separately)

    return {"order_id": db_order.order_id}

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
