import os
from typing import Union

from utils.client import ChocoManagerClient


def get_tg_token() -> str:
    if os.getenv("ENV") == "DEV":
        return os.getenv("TG_TOKEN_DEV")
    return os.getenv("TG_TOKEN")


def is_float(leftover: float) -> bool:
    if leftover - int(leftover) == 0:
        return False
    return True


def round_leftover(leftover: float) -> Union[float, int]:
    if is_float(leftover):
        res = round(leftover, 1)
    else:
        res = int(leftover)

    return res


async def generate_post_message():
    result = await get_all_goods()
    return "\n".join(result)


async def get_all_goods():
    client = ChocoManagerClient()
    resp = await client.get_all_goods()
    result = []
    for item in resp.response.items:
        if leftover := round_leftover(item.leftover):
            result.append(f"{item.name} x{leftover} ({item.retail_price}₽)")
    return result
