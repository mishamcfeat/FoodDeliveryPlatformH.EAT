from pydantic import BaseModel
from typing import List, Optional

class RestaurantBase(BaseModel):
    name: str
    address: str

class RestaurantCreate(RestaurantBase):
    pass

class Restaurant(RestaurantBase):
    id: int

class RestaurantItemBase(BaseModel):
    name: str
    description: str
    price: float

class RestaurantItemCreate(RestaurantItemBase):
    restaurant_id: int

class RestaurantItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None

class RestaurantItem(RestaurantItemBase):
    id: int
    restaurant_id: int

class RestaurantWithMenu(Restaurant):
    items: List[RestaurantItem]
