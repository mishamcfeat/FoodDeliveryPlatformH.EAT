from fastapi import FastAPI
from routes import user_routes
#, order_routes, restaurant_routes

app = FastAPI()

app.include_router(user_routes.router, prefix="/users", tags=["users"])
#app.include_router(order_routes.router, prefix="/orders", tags=["orders"])
#app.include_router(restaurant_routes.router, prefix="/restaurants", tags=["restaurants"])
