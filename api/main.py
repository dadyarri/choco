import logging
import os

from fastapi import FastAPI
from tortoise.contrib.fastapi import register_tortoise

from database.core.init import TORTOISE_ORM
from database.services import goods

logging.basicConfig(level="DEBUG")
logging.info(os.getenv("DATABASE_URL"))
app = FastAPI()


@app.get("/goods/")
async def get_all_goods(page: int = 0):
    return {"items": await goods.fetch_all_goods(page)}


@app.get("/goods/{goods_id}")
async def get_goods(goods_id: int):
    return await goods.fetch_good(goods_id)


@app.post("/goods/create")
async def create_goods(
    name: str, wholesale_price: int, retail_price: int, leftover: int
):
    return {
        "created": await goods.create_good(
            name, wholesale_price, retail_price, leftover
        )
    }


@app.post("/goods/rename/{goods_id}")
async def rename_goods(goods_id: int, new_name: str):
    return {"renamed": await goods.rename_good(goods_id, new_name)}


@app.post("/goods/increment/{goods_id}")
async def increment_goods(goods_id: int):
    return {"incremented": await goods.increment_good_leftover(goods_id)}


@app.post("/goods/decrement/{goods_id}")
async def decrement_goods(goods_id: int):
    return {"decremented": await goods.decrement_good_leftover(goods_id)}


@app.post("/goods/price/wholesale/set/{goods_id}")
async def set_wholesale_price(goods_id: int, new_price: int):
    return {
        "wholesale_price_updated": await goods.change_good_wholesale_price(
            goods_id, new_price
        )
    }


@app.post("/goods/price/retail/set/{goods_id}")
async def set_retail_price(goods_id: int, new_price: int):
    return {
        "retail_price_updated": await goods.change_good_retail_price(
            goods_id, new_price
        )
    }


register_tortoise(
    app,
    config=TORTOISE_ORM,
    generate_schemas=True,
    add_exception_handlers=True,
)
