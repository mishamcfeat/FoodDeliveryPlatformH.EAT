from fastapi import FastAPI, WebSocket, Depends
import redis

app = FastAPI()

r = redis.Redis(host='localhost', port=6379, db=0)

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: int):
    await websocket.accept()
    channel_name = f"updates_{client_id}"  # Each client gets its own channel
    pubsub = r.pubsub()
    pubsub.subscribe(channel_name)
    
    for message in pubsub.listen():
        if message['type'] == 'message':
            await websocket.send_text(message['data'].decode())
