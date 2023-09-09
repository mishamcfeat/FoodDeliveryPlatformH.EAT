from pydantic import BaseModel, ConfigDict
from typing import List, Optional

class MenuItemBase(BaseModel):
    name: str
    price: float

class MenuItemCreate(MenuItemBase):
    pass

class MenuItemUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None

class MenuItem(MenuItemBase):
    item_id: int

class Restaurant(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    restaurant_id: int
    name: str
    address: str
    menu: List[MenuItem]

