from typing import List
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
import datetime

from routes.user_routes import get_current_user
from schemas.order import OrderItemSchema, OrderInit, OrderUpdate, OrderOut, TotalCostSchema
from db.get_db import get_db
from models.database import User, Order, OrderItem, RestaurantItem

# Create a new router for our order-related routes
router = APIRouter()

# This route initiates an order
@router.post("/initiate_order/")
async def initiate_order(init: OrderInit, db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    # Get the current user from the database
    current_user = db.query(User).filter(User.id == user["user_id"]).first()

    # Check for an existing 'In Progress' order for the user (and restaurant if required)
    existing_order = db.query(Order).filter(
        Order.user_id == current_user.id,
        Order.status == "In Progress"
    ).first()

    # If an existing order is found, return its ID
    if existing_order:
        return {"order_id": existing_order.order_id}

    # If no delivery address is provided, use the user's address
    if not init.delivery_address:
        init.delivery_address = current_user.address

    # Create a new order
    db_order = Order(
        user_id=current_user.id,
        restaurant_id=init.restaurant_id,
        delivery_address=init.delivery_address,
        total_amount=0,
        status="In Progress"
    )
    db.add(db_order)
    db.commit()

    # Return the new order's ID
    return {"order_id": db_order.order_id}

# This route adds an item to an order
@router.post("/add_item_to_order/{order_id}/")
async def add_item(order_id: int, item: OrderItemSchema, db: Session = Depends(get_db)):
    # Get the order from the database
    db_order = db.query(Order).filter(Order.order_id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Get the restaurant item from the database
    db_restaurant_item = db.query(RestaurantItem).filter(
        RestaurantItem.id == item.restaurant_item_id).first()
    if not db_restaurant_item:
        raise HTTPException(
            status_code=404, detail="Restaurant item not found")

    # If no price is provided, use the restaurant item's price
    if not item.price_at_time_of_order:
        item.price_at_time_of_order = db_restaurant_item.price

    # Create a new order item
    db_item = OrderItem(
        order_id=order_id,
        restaurant_item_id=item.restaurant_item_id,
        quantity=item.quantity,
        price_at_time_of_order=item.price_at_time_of_order
    )
    db.add(db_item)

    # Update the total amount of the order
    db_order.total_amount += item.quantity * item.price_at_time_of_order
    db.commit()

    # Return a success message
    return {"message": "Item added successfully"}


# This route finalises an order
@router.post("/finalise_order/{order_id}/")
async def finalise_order(order_id: int, db: Session = Depends(get_db)):
    # Get the order from the database
    db_order = db.query(Order).filter(Order.order_id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Update the order status and time placed
    db_order.status = "Placed"
    db_order.time_placed = datetime.datetime.utcnow()

    # Commit the changes to the database
    db.commit()
    return {"message": "Order finalised"}


# This route gets an order
@router.get("/{order_id}/", response_model=OrderOut)
async def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    # Extract the user's ID from the returned user dictionary
    user_id = user["user_id"]

    # Get the order from the database
    db_order = db.query(Order).filter(
        Order.order_id == order_id, Order.user_id == user_id).first()

    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Create the response object
    response = OrderOut(**db_order.__dict__)

    return response


# This route updates an order
@router.put("/{order_id}/", response_model=OrderOut)
async def update_order(order_id: int, update_address: OrderUpdate, db: Session = Depends(get_db)):
    # Get the order from the database
    db_order = db.query(Order).filter(Order.order_id == order_id).first()

    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Update the delivery address
    db_order.delivery_address = update_address.delivery_address
    db.commit()
    return db_order


# This route gets the items for a user's order
@router.get("/orders/items", response_model=List[OrderItemSchema])
async def get_order_items_for_user(db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    user_id = user["user_id"]
    # Get the order items from the database
    order_items = db.query(OrderItem)\
        .join(Order, Order.order_id == OrderItem.order_id)\
        .filter(Order.user_id == user_id, Order.status == "In Progress")\
        .all()
    return [OrderItemSchema(
        restaurant_item_id=item.restaurant_item_id,
        quantity=item.quantity,
        price_at_time_of_order=item.price_at_time_of_order
    ) for item in order_items]


# This route gets the total cost for a user's order
@router.get("/orders/total", response_model=TotalCostSchema)
async def get_total_cost_for_user(db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    user_id = user["user_id"]
    # Calculate the total cost
    total = db.query(func.sum(OrderItem.price_at_time_of_order * OrderItem.quantity))\
        .join(Order, Order.order_id == OrderItem.order_id)\
        .filter(Order.user_id == user_id, Order.status == "In Progress")\
        .scalar() or 0
    return TotalCostSchema(total_cost=total)


# This route gets the order history for a user
@router.get("/history/{user_id}/")
async def order_history(user_id: int):
    # (Future Logic to fetch all orders of a user will go here)
    return {"orders": ["order1", "order2"]}


# This route gets the status of an order
@router.get("/status/{order_id}/")
async def order_status(order_id: int, db: Session = Depends(get_db)):
    # Get the order from the database
    db_order = db.query(Order).filter(Order.order_id == order_id).first()

    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")

    return {"status": db_order.status}
