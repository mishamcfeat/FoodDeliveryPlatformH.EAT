from pydantic import BaseModel
from typing import List, Optional

class OrderItem(BaseModel):
    item_id: int
    quantity: int

class OrderCreate(BaseModel):
    user_id: int
    restaurant_id: int
    items: List[OrderItem]
    
class OrderUpdate(BaseModel):
    delivery_address: Optional[str]

class Order(BaseModel):
    order_id: int
    user_id: int
    restaurant_id: int
    total_amount: float
    status: str
    items: List[OrderItem]

    class Config:
        orm_mode = True
