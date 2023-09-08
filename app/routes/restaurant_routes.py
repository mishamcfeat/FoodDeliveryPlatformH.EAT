from fastapi import APIRouter, HTTPException

router = APIRouter()

@router.get("/")
async def list_restaurants():
    # Logic to list all restaurants
    return {"restaurants": ["restaurant1", "restaurant2"]}

@router.get("/{restaurant_id}/")
async def get_restaurant(restaurant_id: int):
    # Logic to fetch specific restaurant details
    return {"restaurant": "restaurant_data"}

@router.get("/{restaurant_id}/menu/")
async def restaurant_menu(restaurant_id: int):
    # Logic to fetch the menu of a restaurant
    return {"menu": ["item1", "item2"]}

@router.post("/{restaurant_id}/menu/")
async def add_menu_item(restaurant_id: int, item: MenuItemCreate):
    # Logic to add a new menu item for a restaurant
    return {"message": "Menu item added"}

@router.put("/{restaurant_id}/menu/{item_id}/")
async def update_menu_item(restaurant_id: int, item_id: int, item: MenuItemUpdate):
    # Logic to update a menu item for a restaurant
    return {"message": "Menu item updated"}
