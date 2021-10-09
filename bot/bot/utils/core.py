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
