from fastapi import APIRouter, HTTPException
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
import datetime

from schemas.restaurant import RestaurantCreate, RestaurantItemCreate, RestaurantItemUpdate
from routes.user_routes import get_current_user
from schemas.order import OrderCreate, OrderInit, OrderUpdate, OrderItem, OrderOut
from db.get_db import get_db
from models.database import User, Order, Restaurant, RestaurantItem

router = APIRouter()

@router.get("/")
async def list_restaurants():
    # Logic to list all restaurants
    return {"restaurants": ["restaurant1", "restaurant2"]}

@router.post("/create_restaurant/")
async def create_restaurant(restaurant: RestaurantCreate, db: Session = Depends(get_db)):
    db_rest = Restaurant(name=restaurant.name, address=restaurant.address)
    try:
        db.add(db_rest)
        db.commit()
        db.refresh(db_rest)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    
    return {"restaurant": db_rest}


@router.get("/{restaurant_id}/")
async def get_restaurant(restaurant_id: int):
    # Logic to fetch specific restaurant details
    return {"restaurant": "restaurant_data"}

@router.get("/{restaurant_id}/menu/")
async def restaurant_menu(restaurant_id: int):
    # Logic to fetch the menu of a restaurant
    return {"menu": ["item1", "item2"]}

@router.post("/{restaurant_id}/menu/")
async def add_menu_item(restaurant_id: int, item: RestaurantItemCreate):
    # Logic to add a new menu item for a restaurant
    return {"message": "Menu item added"}

@router.put("/{restaurant_id}/menu/{item_id}/")
async def update_menu_item(restaurant_id: int, item_id: int, item: RestaurantItemUpdate):
    # Logic to update a menu item for a restaurant
    return {"message": "Menu item updated"}
