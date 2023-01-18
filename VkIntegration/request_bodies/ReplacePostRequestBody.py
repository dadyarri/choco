from typing import Optional

from pydantic import BaseModel


class ReplacePostRequestBody(BaseModel):
    photo: str
    text: str | None = None

