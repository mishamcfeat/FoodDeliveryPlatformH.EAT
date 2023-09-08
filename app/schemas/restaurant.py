from pydantic import BaseModel
from typing import List, Optional

class MenuItemBase(BaseModel):
    name: str
    price: float

class MenuItemCreate(MenuItemBase):
    pass

class MenuItemUpdate(MenuItemBase):
    pass

class MenuItem(MenuItemBase):
    item_id: int

class Restaurant(BaseModel):
    restaurant_id: int
    name: str
    address: str
    menu: List[MenuItem]

    class Config:
        orm_mode = True
