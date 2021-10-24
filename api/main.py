import logging

import toml
from fastapi import FastAPI
from starlette import status
from tortoise.contrib.fastapi import register_tortoise

from database.core.init import TORTOISE_ORM
from database.services import goods
from models import (
    BaseResponseModel,
    BaseGoodResponse,
    GetAllGoodsResponse,
)

logging.basicConfig(level="DEBUG")
version = toml.load("pyproject.toml")["tool"]["poetry"]["version"]
app = FastAPI(
    title="ChocoManager API",
    description="Internal API for ChocoManager system",
    version=version,
    contact={
        "name": "Daniil Golubev",
        "url": "https://t.me/dadyarri",
        "email": "dadyarri@gmail.com",
    },
    license_info={"name": "Proprietary"},
)


@app.get(
    "/",
    status_code=status.HTTP_418_IM_A_TEAPOT,
    response_model=BaseResponseModel,
)
async def teapot():
    """
    GET to root returns 418

    :return: dict
    """
    return {"response": "i'm a teapot"}


@app.get(
    "/goods/",
    response_model=GetAllGoodsResponse,
)
async def get_all_goods(page: int = None):
    """
    GET returns list of goods (may be paged)

    :param page: number of page (4 items on page)
    :return: dict
    """
    items = await goods.fetch_all_goods(page)
    return {
        "response": {
            "count": len(items),
            "items": items,
        },
    }


@app.get(
    "/goods/id/{goods_id}",
    response_model=BaseGoodResponse,
)
async def get_good(goods_id: int):
    """
    GET return one good by its id

    :param goods_id: ID of good
    :return: dict
    """
    return {"response": await goods.get_good_by_id(goods_id)}


@app.get(
    "/goods/market/{market_id}",
    response_model=BaseGoodResponse,
)
async def find_good_by_market_id(market_id: int):
    """
    GET return one good by its id of market card in VK

    :param market_id: ID of market card in VK
    :return: dict
    """
    return {"response": await goods.get_good_by_market_id(market_id)}


@app.post(
    "/goods/market/{goods_id}/set",
    response_model=BaseGoodResponse,
)
async def set_market_id(goods_id: int, value: int):
    """
    POST return one good by its id

    :param goods_id: ID of good
    :param value: ID of market card
    :return: dict
    """
    return {"response": await goods.change_good_market_id(goods_id, value)}


@app.post(
    "/goods/name/{goods_id}",
    response_model=BaseGoodResponse,
)
async def rename_goods(goods_id: int, value: str):
    """
    POST rename good by its id

    :param goods_id: ID of good
    :param value: New name
    :return: dict
    """
    return {"response": await goods.rename_good(goods_id, value)}


@app.post(
    "/goods/leftover/{goods_id}/inc",
    response_model=BaseGoodResponse,
)
async def increment_leftover(goods_id: int):
    """
    POST increment leftover by one

    :param goods_id: ID of good
    :return: dict
    """
    return {"response": await goods.increment_good_leftover(goods_id)}


@app.post(
    "/goods/leftover/{goods_id}/dec",
    response_model=BaseGoodResponse,
)
async def decrement_leftover(goods_id: int):
    """
    POST decrement leftover by one

    :param goods_id: ID of good
    :return: dict
    """
    return {"response": await goods.decrement_good_leftover(goods_id)}


@app.post(
    "/goods/leftover/{goods_id}/set",
    response_model=BaseGoodResponse,
)
async def update_leftover(goods_id: int, value: float):
    """
    POST set leftover

    :param goods_id: ID of good
    :param value: new leftover
    :return: dict
    """
    return {"response": await goods.update_good_leftover(goods_id, value)}


@app.post(
    "/goods/price/wholesale/{goods_id}/set",
    response_model=BaseGoodResponse,
)
async def set_wholesale_price(goods_id: int, value: int):
    """
    POST update wholesale price

    :param goods_id: ID of good
    :param value: New wholesale price
    :return: dict
    """
    return {"response": await goods.change_good_wholesale_price(goods_id, value)}


@app.post(
    "/goods/price/retail/{goods_id}/set",
    response_model=BaseGoodResponse,
)
async def set_retail_price(goods_id: int, value: int):
    """
    POST update retail price

    :param goods_id: ID of good
    :param value: New wholesale price
    :return: dict
    """
    return {"response": await goods.change_good_retail_price(goods_id, value)}


@app.post(
    "/goods/create",
    status_code=status.HTTP_201_CREATED,
    response_model=BaseGoodResponse,
)
async def create_goods(
    name: str,
    wholesale_price: int,
    retail_price: int,
    leftover: float,
    market_id: int = None,
):
    """
    POST create new good

    :param name: title of good
    :param wholesale_price: wholesale price (internal)
    :param retail_price: retail price (for customers)
    :param leftover: leftover
    :param market_id: ID of market card in VK
    :return: dict
    """
    return {
        "response": await goods.create_good(
            name, wholesale_price, retail_price, leftover, market_id
        )
    }


register_tortoise(
    app,
    config=TORTOISE_ORM,
    generate_schemas=True,
    add_exception_handlers=True,
)
