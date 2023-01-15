import os

from fastapi import FastAPI
from vkbottle import API

from request_bodies.EditProductRequestBody import EditProductRequestBody

app = FastAPI()
user_vk = API(os.getenv("VK_TOKEN"))
user_vk.API_VERSION = "5.140"


@app.get("/uploadImage")
async def upload_image():
    return {"message": "Hello World"}


@app.post("/editProduct")
async def edit_product(body: EditProductRequestBody):
    await user_vk.market.edit(
        -int(os.getenv("VK_GROUP")),
        body.marketId,
        name=body.name,
        price=body.price,
        stock_amount=body.leftover,
    )
