from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from routes import user_routes, order_routes, restaurant_routes

app = FastAPI()

origins = [
    "http://localhost:3000",  # Assuming your React frontend runs on this origin
    # Add any other origins you might want to allow in the future
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],
)

app.include_router(user_routes.router, prefix="/users", tags=["users"])
app.include_router(order_routes.router, prefix="/orders", tags=["orders"])
app.include_router(restaurant_routes.router, prefix="/restaurants", tags=["restaurants"])

