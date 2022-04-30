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


class BaseResponseModel(BaseModel):
    response: str


class BaseGoodResponse(BaseModel):
    response: Good


class BaseChatResponse(BaseModel):
    response: Chat


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
