import os


def get_vk_token():
    return os.getenv("VK_TOKEN")


def get_api_host():
    if os.getenv("ENV") == "DEV":
        return os.getenv("DEV_API_HOST")
    return os.getenv("API_HOST")


def get_admins_ids():
    return list(map(int, os.getenv("ADMINS_IDS").split(",")))
