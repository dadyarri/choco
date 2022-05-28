import os
import re
from typing import Union

from client import ChocoManagerClient


def get_tg_token() -> str:
    if os.getenv("ENV") == "DEV":
        return os.getenv("TG_TOKEN_DEV")
    return os.getenv("TG_TOKEN")


def is_float(leftover: float) -> bool:
    return leftover - int(leftover) != 0


def round_leftover(leftover: float) -> Union[float, int]:
    if is_float(leftover):
        res = round(leftover, 1)
    else:
        res = int(leftover)

    return res


async def generate_post_message(verbose: bool = False):
    result = await get_all_goods(verbose)
    return "\n".join(result)


async def get_all_goods(verbose: bool):
    client = ChocoManagerClient()
    resp = await client.get_all_goods()
    result = []
    for item in resp.response.items:
        if leftover := round_leftover(item.leftover):
            if verbose:
                result.append(f"{item.name} {'(на развес)' if item.is_by_weight else ''}\n"
                              f"\tВ наличии: {round(item.leftover, 2)} {'кг.' if item.is_by_weight else 'шт.'}\n"
                              f"\tЦена: {item.retail_price}₽\n")
            else:
                result.append(f"{item.name} x{leftover} ({item.retail_price}₽)")
    return result


def abbreviate_name(name: str) -> str:
    abbr = re.sub("молочный", "Мол.", name, re.IGNORECASE)
    abbr = re.sub("т[её]мный", "Т.", abbr, re.IGNORECASE)
    abbr = re.sub("мармелад", "Мар.", abbr, re.IGNORECASE)
    abbr = re.sub("белый", "Б.", abbr, re.IGNORECASE)
    abbr = re.sub("масса", "М.", abbr, re.IGNORECASE)
    abbr = re.sub("паста", "П.", abbr, re.IGNORECASE)
    abbr = re.sub("шоколад", "Ш.", abbr, re.IGNORECASE)
    return abbr
