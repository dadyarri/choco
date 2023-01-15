import os

from fastapi import FastAPI
from vkbottle import API
from vkbottle import PhotoWallUploader

from request_bodies import EditProductRequestBody
from request_bodies import ReplacePostRequestBody
from request_bodies import UploadImageRequestBody

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


@app.post("/replacePinned")
async def replace_post(body: ReplacePostRequestBody):
    owner_id = -int(os.getenv("VK_GROUP"))
    last_post = await user_vk.wall.get(owner_id, count=1)
    post_id = last_post.items[0].id
    await user_vk.wall.delete(owner_id, post_id)
    resp = await user_vk.wall.post(
        owner_id,
        message=body.text,
        attachments=[body.photo],
        from_group=True,
        close_comments=True,
    )
    post_id = resp.post_id
    await user_vk.wall.pin(post_id, owner_id)
