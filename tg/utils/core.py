import os
from typing import Union


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
