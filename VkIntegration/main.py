import os

from fastapi import FastAPI
from vkbottle import API

app = FastAPI()
user_vk = API(os.getenv("VK_TOKEN"))
user_vk.API_VERSION = "5.140"


@app.get("/uploadImage")
async def upload_image():
    return {"message": "Hello World"}


@app.get("/updateLeftover")
async def update_leftover():
    return {"message": f""}
