from fastapi import APIRouter, HTTPException, UploadFile, Depends, File
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
import shutil
from pathlib import Path

from schemas.restaurant import RestaurantCreate, RestaurantItemCreate, RestaurantItemUpdate, RestaurantItemBase
from db.get_db import get_db
from models.database import User, Order, Restaurant, RestaurantItem

router = APIRouter()

@router.get("/list_restaurants/")
async def list_restaurants(db: Session = Depends(get_db)):
    # Logic to list all restaurants
    all_rest = db.query(Restaurant).all()

    if not all_rest:
        # Option 1: Raise an error
        raise HTTPException(status_code=404, detail="No restaurants found")

    rests = [{"id": rest.id, "name": rest.name, "address": rest.address} for rest in all_rest]
    return {"restaurants": rests}


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

@router.post("/upload_restaurant_image/")
async def upload_restaurant_image(restaurant_name: str, image: UploadFile = File(...)):
    try:
        image_path = Path(f"assets/{restaurant_name}.jpg")  # Adjust the path and naming as needed
        with image_path.open("wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        return {"filename": image_path.name}

    except Exception as e:
        raise HTTPException(status_code=500, detail="Could not save image")


@router.get("/{restaurant_id}/")
async def get_restaurant(restaurant_id: int, db: Session = Depends(get_db)):
    # Logic to fetch specific restaurant details
    rest = db.query(Restaurant).filter(Restaurant.id == restaurant_id).first()
    if not rest:
        raise HTTPException(status_code=404, detail="No restaurant found for this id")
    return {"restaurant": rest.__dict__}

@router.get("/{restaurant_id}/menu/")
async def restaurant_menu(restaurant_id: int, db: Session = Depends(get_db)):
    # Query to fetch all menu items of a restaurant
    items = db.query(RestaurantItem).filter(RestaurantItem.restaurant_id == restaurant_id).all()
    
    if not items:
        raise HTTPException(status_code=404, detail="No items found for this restaurant")
    
    # Convert the ORM objects to a list of dictionaries
    food_items = [{"id": item.id, "name": item.name, "description": item.description, "price": item.price} for item in items]
    
    return {"menu": food_items}


@router.post("/{restaurant_id}/menu/", status_code=201)
async def add_menu_item(restaurant_id: int, item: RestaurantItemBase, db: Session = Depends(get_db)):
    
    # Check if restaurant exists
    db_restaurant = db.query(Restaurant).filter(Restaurant.id == restaurant_id).first()
    if not db_restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    
    # Logic to add a new menu item for a restaurant
    db_menu_item = RestaurantItem(name=item.name, description=item.description, price=item.price, restaurant_id=restaurant_id)
    
    db.add(db_menu_item)
    db.commit()
    db.refresh(db_menu_item)
    
    return {"message": "Menu item added", "item_id": db_menu_item.id}


@router.put("/{restaurant_id}/menu/{item_id}/")
async def update_menu_item(restaurant_id: int, item_id: int, item: RestaurantItemUpdate, db: Session = Depends(get_db)):
    # Logic to update a menu item for a restaurant
    item = db.query(RestaurantItem).filter(RestaurantItem.id == item_id).update(item.model_dump(exclude_unset=True))
    db.commit()
    return {"message": "Menu item updated"}

