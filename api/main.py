import logging
from typing import List

from client.models import (
    BaseGoodResponse,
    GetAllGoodsResponse,
    BaseChatResponse,
    GetAllChatsResponse,
    GetAllOrdersResponseModel, BaseOrderResponse, Order, OrderCity, OrderState, OrderSource,
)
from fastapi import FastAPI
from starlette import status
from tortoise.contrib.fastapi import register_tortoise

from database.services import orders, order_cities, order_states, order_sources
from .database.core.init import TORTOISE_ORM
from .database.services import goods, chats

logging.basicConfig(level="DEBUG")
version = "1.5.1"
tags_metadata = [
    {"name": "products", "description": "Управление остатками и ценами товара"},
    {"name": "chats", "description": "Управление чатами"},
    {"name": "orders", "description": "Управление заказами"},
    {"name": "order-cities", "description": "Управление городами заказов"},
    {"name": "order-sources", "description": "Управление источниками заказов"},
    {"name": "order-states", "description": "Управление статусами заказов"},
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


@app.put(
    "/goods/{goods_id}/invert_by_weight",
    response_model=BaseGoodResponse,
    tags=["products"],
)
async def invert_by_weight(goods_id: int):
    """
    PUT invert good by its id

    :param goods_id: ID of good
    :return: dict
    """
    return {"response": await goods.invert_good_by_weight(goods_id)}


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
    is_by_weight: bool = False,
):
    """
    POST create new good

    :param name: title of good
    :param wholesale_price: wholesale price (internal)
    :param retail_price: retail price (for customers)
    :param leftover: leftover
    :param market_id: ID of market card in VK
    :param is_by_weight: is good sells by weight
    :return: dict
    """
    return {
        "response": await goods.create_good(
            name,
            wholesale_price,
            retail_price,
            leftover,
            market_id,
            is_by_weight,
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


@app.get("/orders", response_model=GetAllOrdersResponseModel, tags=["orders"])
async def get_list_of_orders(page: int = 0):
    items = await orders.fetch_all_orders(page)
    return {
        "count": len(items),
        "items": items,
    }


@app.post("/orders", response_model=BaseOrderResponse, tags=["orders"])
async def create_order(order: Order):
    return {
        "response": await orders.create_order(order),
    }


@app.get("/orders/{order_id}", response_model=BaseOrderResponse, tags=["orders"])
async def get_order_by_id(order_id: int):
    return {
        "response": await orders.get_order_by_id(order_id),
    }


@app.patch("/orders", response_model=BaseOrderResponse, tags=["orders"])
async def update_order(order: Order):
    return {
        "response": await orders.update_order(order),
    }


@app.get("/orderCities", response_model=List[OrderCity], tags=["order-cities"])
async def get_order_cities(page: int = 0):
    return await order_cities.fetch_all_orders_cities(page)


@app.post("/orderCities", response_model=OrderCity, tags=["order-cities"])
async def create_order_city(order_city: OrderCity):
    return await order_cities.create_order_city(order_city)


@app.get("/orderCities/{id}", response_model=OrderCity, tags=["order-cities"])
async def get_order_city_by_id(id: int):
    return await order_cities.get_order_city_by_id(id)


@app.patch("/orderCities", response_model=OrderCity, tags=["order-cities"])
async def update_order_city(order_city: OrderCity):
    return await order_cities.update_order_city(order_city)


@app.delete("/orderCities/{id}", response_model=OrderCity, tags=["order-cities"])
async def delete_order_city(id: int):
    return await order_cities.delete_order_city(id)


@app.get("/orderStates", response_model=List[OrderState], tags=["order-states"])
async def get_order_states(page: int = 0):
    return await order_states.fetch_all_orders_states(page)


@app.post("/orderStates", response_model=OrderState, tags=["order-states"])
async def create_order_state(order_state: OrderState):
    return await order_states.create_order_state(order_state)


@app.get("/orderStates/{id}", response_model=OrderState, tags=["order-states"])
async def get_order_state_by_id(id: int):
    return await order_states.get_order_state_by_id(id)


@app.patch("/orderStates", response_model=OrderState, tags=["order-states"])
async def update_order_state(order_state: OrderState):
    return await order_states.update_order_state(order_state)


@app.delete("/orderStates/{id}", response_model=OrderState, tags=["order-states"])
async def delete_order_state(id: int):
    return await order_states.delete_order_state(id)


@app.get("/orderSources", response_model=List[OrderSource], tags=["order-sources"])
async def get_order_sources(page: int = 0):
    return await order_sources.fetch_all_orders_sources(page)


@app.post("/orderSources", response_model=OrderSource, tags=["order-sources"])
async def create_order_source(order_source: OrderSource):
    return await order_sources.create_order_source(order_source)


@app.get("/orderSources/{id}", response_model=OrderSource, tags=["order-sources"])
async def get_order_source_by_id(id: int):
    return await order_sources.get_order_source_by_id(id)


@app.patch("/orderSources", response_model=OrderSource, tags=["order-sources"])
async def update_order_source(order_source: OrderSource):
    return await order_sources.update_order_source(order_source)


@app.delete("/orderSources/{id}", response_model=OrderSource, tags=["order-sources"])
async def delete_order_source(id: int):
    return await order_sources.delete_order_source(id)


register_tortoise(
    app,
    config=TORTOISE_ORM,
    generate_schemas=True,
    add_exception_handlers=True,
)
