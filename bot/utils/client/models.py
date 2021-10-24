from typing import Optional

from pydantic import BaseModel


class Good(BaseModel):
    id: int
    name: str
    wholesale_price: int
    retail_price: int
    leftover: float
    market_id: Optional[int]


class BaseResponseModel(BaseModel):
    response: str


class BaseGoodResponse(BaseModel):
    response: Good


class GetAllGoodsResponseModel(BaseModel):
    count: int
    items: list[Good]


class GetAllGoodsResponse(BaseModel):
    response: GetAllGoodsResponseModel
