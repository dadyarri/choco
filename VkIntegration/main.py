import os

from fastapi import FastAPI
from vkbottle import API
from vkbottle import PhotoWallUploader

from request_bodies.EditProductRequestBody import EditProductRequestBody
from request_bodies.UploadImageRequestBody import UploadImageRequestBody

app = FastAPI()
user_vk = API(os.getenv("VK_TOKEN"))
user_vk.API_VERSION = "5.140"


@app.post("/uploadImage")
async def upload_image(body: UploadImageRequestBody):
    uploader = PhotoWallUploader(generate_attachment_strings=True)
    return await uploader.upload(body.photo)


@app.post("/editProduct")
async def edit_product(body: EditProductRequestBody):
    await user_vk.market.edit(
        -int(os.getenv("VK_GROUP")),
        body.marketId,
        name=body.name,
        price=body.price,
        stock_amount=body.leftover,
    )
