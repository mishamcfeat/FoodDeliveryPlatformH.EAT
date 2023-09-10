from pydantic import BaseModel, ConfigDict
from typing import List, Optional
import datetime

class OrderItem(BaseModel):
    order_id: int
    restaurant_item_id: int
    quantity: int
    price_at_time_of_order: float
    
class OrderInit(BaseModel):
    restaurant_id: int
    delivery_address: Optional[str] = None


# total_amount, status, time_places, are all set server side
class OrderCreate(BaseModel):
    user_id: int
    restaurant_id: int
    total_amount: Optional[float]
    status: Optional[str]
    delivery_address: str
    time_placed: Optional[datetime.datetime]
    order_items: List[OrderItem]

    
class OrderUpdate(BaseModel):
    delivery_address: Optional[str]

class OrderOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    order_id: int
    user_id: int
    restaurant_id: int
    total_amount: float
    status: str
    delivery_address: str
    time_placed: datetime.datetime
    
    order_items: List[OrderItem]

    
