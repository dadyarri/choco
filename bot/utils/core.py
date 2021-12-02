import json
import logging
import os
from typing import Optional

import aiohttp


def get_vk_token():
    return os.getenv("VK_TOKEN")


def get_tg_token() -> str:
    if os.getenv("ENV") == "DEV":
        return os.getenv("TG_TOKEN_DEV")
    return os.getenv("TG_TOKEN")


def get_admins_ids():
    return list(map(int, os.getenv("ADMINS_IDS").split(",")))


async def send_message_to_telegram(
    message: str,
    markup: Optional[dict[str, list[list[dict[str, str]]]]] = None,
):
    token = get_tg_token()
    chats = os.getenv("SEND_IDS")
    async with aiohttp.ClientSession() as session:
        for chat in chats.split(","):
            resp = await session.post(
                "https://api.telegram.org/bot{0}/sendMessage".format(token),
                params={
                    "chat_id": chat,
                    "text": message,
                    "parse_mode": "MarkdownV2",
                    "reply_markup": json.dumps(markup),
                },
            )
            logging.debug(resp.json())


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
