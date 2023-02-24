import os

from fastapi import FastAPI, File, UploadFile
from fastapi import Response
from fastapi.responses import JSONResponse
from vkbottle import API, VKAPIError
from vkbottle import PhotoWallUploader

from request_bodies.EditProductRequestBody import EditProductRequestBody
from request_bodies.ReplacePostRequestBody import ReplacePostRequestBody

app = FastAPI()
user_vk = API(os.getenv("VK_TOKEN"))
user_vk.API_VERSION = "5.140"


@app.get("/ping")
async def ping():
    return {"message": "pong"}


@app.get("/productUrl/{market_id}")
async def get_product_url(market_id: int) -> Response:
    return JSONResponse(content={"url": f"https://vk.com/product-{os.getenv('VK_GROUP')}_{market_id}"})


@app.post("/uploadImage")
async def upload_image(photo: UploadFile = File(...)) -> Response:
    uploader = PhotoWallUploader(generate_attachment_strings=True, api=user_vk)
    try:
        photo_id = await uploader.upload(await photo.read())
    except VKAPIError[6] as rate_error_ex:
        return JSONResponse(content={"error": rate_error_ex.message}, status_code=429)
    except VKAPIError[8] as bad_request_ex:
        return JSONResponse(content={"error": bad_request_ex.message}, status_code=400)
    except VKAPIError[10] | VKAPIError as internal_ex:
        return JSONResponse(content={"error": internal_ex.message}, status_code=500)
    else:
        return JSONResponse(content={"photo": photo_id})


@app.post("/editProduct")
async def edit_product(body: EditProductRequestBody):
    try:
        await user_vk.market.edit(
            -int(os.getenv("VK_GROUP")),
            body.marketId,
            name=body.name,
            price=body.price,
            stock_amount=body.leftover,
            deleted=body.deleted
        )
    except VKAPIError[6] as rate_error_ex:
        return JSONResponse(content={"error": rate_error_ex.message}, status_code=429)
    except VKAPIError[8] as bad_request_ex:
        return JSONResponse(content={"error": bad_request_ex.message}, status_code=400)
    except VKAPIError[10] | VKAPIError as internal_ex:
        return JSONResponse(content={"error": internal_ex.message}, status_code=500)
    else:
        return JSONResponse(content={"message": "success"})


@app.post("/replacePinned")
async def replace_post(body: ReplacePostRequestBody) -> Response:
    owner_id = -int(os.getenv("VK_GROUP"))
    try:
        result = await user_vk.wall.get(owner_id, count=1)
        if len(result.items) > 0:
            post_id = result.items[0].id
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
    except VKAPIError[6] as rate_error_ex:
        return JSONResponse(content={"error": rate_error_ex.message}, status_code=429)
    except VKAPIError[8] as bad_request_ex:
        return JSONResponse(content={"error": bad_request_ex.message}, status_code=400)
    except VKAPIError[10] | VKAPIError as internal_ex:
        return JSONResponse(content={"error": internal_ex.message}, status_code=500)
    else:
        return JSONResponse(content={"message": "success"})
