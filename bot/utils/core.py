import logging
import os

import aiohttp


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


async def make_get_request(endpoint: str, params: dict = None) -> dict:
    async with aiohttp.ClientSession() as session:
        url = get_request_url(endpoint)
        async with session.get(url, params=params) as resp:
            result = await resp.json()

    return result


async def make_post_request(endpoint: str, params: dict = None) -> dict:
    async with aiohttp.ClientSession() as session:
        url = get_request_url(endpoint)
        async with session.post(url, params=params) as resp:
            result = await resp.json()

    return result


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


async def get_all_goods():
    page_num = 0
    resp = await make_get_request("goods/", params={"page": page_num})
    result = []
    while resp["items"]:
        for item in resp["items"]:
            if item["leftover"]:
                result.append(
                    f"{item['name']} x{item['leftover']} ({item['retail_price']}₽)"
                )
        page_num += 1
        resp = await make_get_request("goods/", params={"page": page_num})
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
