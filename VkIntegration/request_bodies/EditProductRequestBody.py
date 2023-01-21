from pydantic import BaseModel


class EditProductRequestBody(BaseModel):
    marketId: int
    name: str | None
    price: str | None
    leftover: int | None
    deleted: bool | None
