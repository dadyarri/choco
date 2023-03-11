from pydantic import BaseModel


class SendMessagesRequestBody(BaseModel):
    message: str
    user_ids: list[int]
