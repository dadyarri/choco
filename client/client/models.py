from typing import Optional

from pydantic import BaseModel


class Good(BaseModel):
    id: int
    name: str
    wholesale_price: int
    retail_price: int
    leftover: float
    market_id: Optional[int]
    is_by_weight: bool


class Chat(BaseModel):
    id: int
    vk_id: int
    is_active: bool


class OrderSource(BaseModel):
    id: int
    name: str


class OrderState(BaseModel):
    id: int
    name: str


class OrderCity(BaseModel):
    id: int
    name: str


class Order(Model):
    id: int
    source: OrderSource
    state: OrderState
    city: OrderCity


class OrderItems(Model):
    id: int
    order_id: Order
    good_id: Good
    quantity: int


class BaseResponseModel(BaseModel):
    response: str


class BaseGoodResponse(BaseModel):
    response: Good


class BaseChatResponse(BaseModel):
    response: Chat


class BaseOrderResponse(BaseModel):
    response: Order


class BaseOrderCityResponse(BaseModel):
    response: OrderCity


class BaseOrderStateResponse(BaseModel):
    response: OrderState


class BaseOrderSourceResponse(BaseModel):
    response: OrderSource


class GetAllGoodsResponseModel(BaseModel):
    count: int
    items: list[Good]


class GetAllChatsResponseModel(BaseModel):
    count: int
    items: list[Chat]


class GetAllGoodsResponse(BaseModel):
    response: GetAllGoodsResponseModel


class GetAllChatsResponse(BaseModel):
    response: GetAllChatsResponseModel


class GetAllOrdersResponseModel(BaseModel):
    count: int
    items: list[Order]
