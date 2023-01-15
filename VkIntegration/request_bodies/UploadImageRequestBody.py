from pydantic import BaseModel


class UploadImageRequestBody(BaseModel):
    photo: bytearray
