from fastapi import APIRouter, HTTPException
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
import datetime
import logging

from routes.user_routes import get_current_user
from schemas.order import OrderItemSchema, OrderInit, OrderCreate, OrderUpdate, OrderOut
from db.get_db import get_db
from models.database import User, Order, OrderItem, Restaurant, RestaurantItem


router = APIRouter()


@router.post("/initiate_order/")
async def initiate_order(init: OrderInit, db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    
    current_user = db.query(User).filter(User.id == user["user_id"]).first()
    
    # Check for an existing 'In Progress' order for the user (and restaurant if required)
    existing_order = db.query(Order).filter(
        Order.user_id == current_user.id, 
        Order.status == "In Progress"
        # If you want to also check per restaurant, add:
        #, Order.restaurant_id == init.restaurant_id
    ).first()
    
    if existing_order:
        # Handle adding items to this existing order, as per your logic. 
        # (You may need to adjust this based on how you manage order items)
        return {"order_id": existing_order.order_id}
    
    if not init.delivery_address:
        init.delivery_address = current_user.address
    
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
async def add_item(order_id: int, item: OrderItemSchema, db: Session = Depends(get_db)):
    db_order = db.query(Order).filter(Order.order_id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    db_restaurant_item = db.query(RestaurantItem).filter(RestaurantItem.id == item.restaurant_item_id).first()
    if not db_restaurant_item:
        raise HTTPException(status_code=404, detail="Restaurant item not found")

    if not item.price_at_time_of_order:
        item.price_at_time_of_order = db_restaurant_item.price

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
    db_order = db.query(Order).filter(Order.order_id == order_id).first()
    
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
     
    response = OrderOut(**db_order.__dict__)
    
    return response

@router.put("/{order_id}/", response_model=OrderOut)
async def update_order(order_id: int, update_address: OrderUpdate, db: Session = Depends(get_db)):
    db_order = db.query(Order).filter(Order.order_id == order_id).first()
    
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")

    db_order.delivery_address = update_address.delivery_address
    db.commit()
    return db_order

@router.get("/history/{user_id}/")
async def order_history(user_id: int):
    # (Future Logic to fetch all orders of a user will go here)
    return {"orders": ["order1", "order2"]}

@router.get("/status/{order_id}/")
async def order_status(order_id: int, db: Session = Depends(get_db)):
    db_order = db.query(Order).filter(Order.order_id == order_id).first()
    
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return {"status": db_order.status}