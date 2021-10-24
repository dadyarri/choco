import aiohttp
import logging
import os
from typing import Union


def get_vk_token():
    return os.getenv("VK_TOKEN")


def get_api_host():
    if os.getenv("ENV") == "DEV":
        return os.getenv("DEV_API_HOST")
    return os.getenv("API_HOST")


def get_admins_ids():
    return list(map(int, os.getenv("ADMINS_IDS").split(",")))


def get_request_url(endpoint: str):
    return f"http://{get_api_host()}/{endpoint}"


async def send_message_to_telegram(message: str):
    token = os.getenv("TG_TOKEN")
    chats = os.getenv("SEND_IDS")
    async with aiohttp.ClientSession() as session:
        for chat in chats.split(","):
            await session.post(
                "https://api.telegram.org/bot{0}/sendMessage".format(token),
                params={"chat_id": chat, "text": message, "parse_mode": "Markdown"},
            )


async def send_photo_to_telegram(photo_url: str, **kwargs):
    token = os.getenv("TG_TOKEN")
    chats = os.getenv("SEND_IDS")
    async with aiohttp.ClientSession() as session:
        for chat in chats.split(","):
            await session.post(
                "https://api.telegram.org/bot{0}/sendPhoto".format(token),
                params={
                    "chat_id": chat,
                    "photo": photo_url,
                    "caption": f"Вложение от {kwargs['first_name']} {kwargs['last_name']}",
                },
            )


async def generate_post_message():
    result = await get_all_goods()
    return "\n".join(result)


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


async def get_all_goods():
    resp = await make_get_request("goods/")
    result = []
    for item in resp["response"]["items"]:
        if item["leftover"]:
            leftover = round_leftover(item["leftover"])
            result.append(f"{item['name']} x{leftover} ({item['retail_price']}₽)")
    return result


def shorten_name(name: str) -> str:
    return (
        name.replace("Горький", "Г.")
        .replace("Молочный тёмный", "Мол/т.")
        .replace("Молочный", "Мол.")
        .replace("Масса", "М.")
        .replace("Мармелад", "М/м")
        .replace(" (на развес)", "")
    )
