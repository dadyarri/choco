import logging

import toml
from client.models import (
    BaseGoodResponse,
    GetAllGoodsResponse,
    BaseChatResponse,
    GetAllChatsResponse,
)
from fastapi import FastAPI
from starlette import status
from tortoise.contrib.fastapi import register_tortoise

from database.core.init import TORTOISE_ORM
from database.services import goods, chats

logging.basicConfig(level="DEBUG")
version = toml.load("pyproject.toml")["tool"]["poetry"]["version"]
tags_metadata = [
    {"name": "products", "description": "Управление остатками и ценами товара"},
    {"name": "chats", "description": "Управление чатами"},
]
app = FastAPI(
    title="ChocoManager API",
    description="Internal API for ChocoManager system",
    version=version,
    contact={
        "name": "Daniil Golubev",
        "url": "https://t.me/dadyarri",
        "email": "dadyarri@gmail.com",
    },
    license_info={"name": "Unlicensed"},
    openapi_tags=tags_metadata,
)


@app.get(
    "/goods/",
    response_model=GetAllGoodsResponse,
    tags=["products"],
)
async def get_all_goods(page: int = 0):
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
    tags=["products"],
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
    tags=["products"],
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
    tags=["products"],
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
    tags=["products"],
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
    "/goods/leftover/{goods_id}/inc/by",
    response_model=BaseGoodResponse,
    tags=["products"],
)
async def increment_leftover(
    goods_id: int,
    value: float = 1,
):
    """
    POST increment leftover by one

    :param goods_id: ID of good
    :param value: Value to increment
    :return: dict
    """
    return {"response": await goods.increment_good_leftover(goods_id, value)}


@app.post(
    "/goods/leftover/{goods_id}/dec/by",
    response_model=BaseGoodResponse,
    tags=["products"],
)
async def decrement_leftover(
    goods_id: int,
    value: float = 1,
):
    """
    POST decrement leftover by one

    :param goods_id: ID of good
    :param value: Value to decrement
    :return: dict
    """
    return {"response": await goods.decrement_good_leftover(goods_id, value)}


@app.post(
    "/goods/leftover/{goods_id}/set",
    response_model=BaseGoodResponse,
    tags=["products"],
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
    tags=["products"],
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
    tags=["products"],
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
    tags=["products"],
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


@app.get(
    "/chats",
    response_model=GetAllChatsResponse,
    tags=["chats"],
)
async def get_list_of_chats(page: int = 0):
    items = await chats.fetch_all_chats(page)
    return {
        "response": {
            "count": len(items),
            "items": items,
        },
    }


@app.get("/chats/id/{chat_id}", response_model=BaseChatResponse, tags=["chats"])
async def get_chat_by_id(chat_id: int):
    return {
        "response": await chats.get_chat_by_id(chat_id),
    }


@app.get("/chats/vk_id/{vk_id}", response_model=BaseChatResponse, tags=["chats"])
async def get_chat_by_vk_id(vk_id: int):
    return {
        "response": await chats.get_chat_by_vk_id(vk_id),
    }


@app.post("/chats/create", response_model=BaseChatResponse, tags=["chats"])
async def create_chat(vk_id: int):
    return {
        "response": await chats.create_chat(vk_id),
    }


@app.post("/chats/{chat_id}/enable", response_model=BaseChatResponse, tags=["chats"])
async def enable_chat(chat_id: int):
    return {"response": await chats.set_activity(chat_id, True)}


@app.post("/chats/{chat_id}/disable", response_model=BaseChatResponse, tags=["chats"])
async def disable_chat(chat_id: int):
    return {"response": await chats.set_activity(chat_id, False)}


register_tortoise(
    app,
    config=TORTOISE_ORM,
    generate_schemas=True,
    add_exception_handlers=True,
)
