from pydantic import BaseModel


class SendMessagesRequestBody(BaseModel):
    message: str
    userIds: list[int]
