import logging
import os
from typing import Optional

import aiohttp

from .models import (
    GetAllGoodsResponse,
    BaseGoodResponse,
    GetAllChatsResponse,
    BaseChatResponse,
)


class ChocoManagerClient:
    def __init__(self):
        pass

    @staticmethod
    def _get_api_host():
        if os.getenv("ENV") == "DEV":
            return os.getenv("DEV_API_HOST")
        return os.getenv("API_HOST")

    def _get_request_url(self, endpoint: str):
        return f"http://{self._get_api_host()}/{endpoint}"

    async def _make_get_request(self, endpoint: str, params: dict = None):
        async with aiohttp.ClientSession() as session:
            url = self._get_request_url(endpoint)
            async with session.get(url, params=params) as resp:
                logging.debug(resp)
                result = await resp.json()
            await session.close()

        return result

    async def _make_post_request(self, endpoint: str, params: dict = None):
        async with aiohttp.ClientSession() as session:
            url = self._get_request_url(endpoint)
            async with session.post(url, params=params) as resp:
                logging.debug(resp)
                result = await resp.json()
            await session.close()

        return result

    async def get_all_goods(self, page: int = 0):
        page_ = await self._make_get_request("goods/", {"page": page})
        return GetAllGoodsResponse(**page_)

    async def get_good_by_id(self, good_id: int):
        return BaseGoodResponse(**await self._make_get_request(f"goods/id/{good_id}"))

    async def get_good_by_market_id(self, good_id: int):
        return BaseGoodResponse(
            **await self._make_get_request(f"goods/market/{good_id}")
        )

    async def rename_good(self, good_id: int, value: str):
        return BaseGoodResponse(
            **await self._make_post_request(f"goods/name/{good_id}", {"value": value})
        )

    async def update_leftover(self, good_id: int, value: float):
        return BaseGoodResponse(
            **await self._make_post_request(
                f"goods/leftover/{good_id}/set",
                {"value": value},
            )
        )

    async def increment_leftover(self, good_id: int, value: float = 1):
        return BaseGoodResponse(
            **await self._make_post_request(
                f"goods/leftover/{good_id}/inc/by",
                {"value": value},
            )
        )

    async def decrement_leftover(self, good_id: int, value: float = 1):
        return BaseGoodResponse(
            **await self._make_post_request(
                f"goods/leftover/{good_id}/dec/by",
                {"value": value},
            )
        )

    async def update_wholesale_price(self, good_id: int, value: int):
        return BaseGoodResponse(
            **await self._make_post_request(
                f"goods/price/wholesale/{good_id}/set",
                {"value": value},
            )
        )

    async def update_retail_price(self, good_id: int, value: int):
        return BaseGoodResponse(
            **await self._make_post_request(
                f"goods/price/retail/{good_id}/set",
                {"value": value},
            )
        )

    async def create_good(
        self,
        name: str,
        wholesale_price: int,
        retail_price: int,
        leftover: float,
        market_id: Optional[int] = None,
    ):
        return BaseGoodResponse(
            **await self._make_post_request(
                "goods/create",
                {
                    "name": name,
                    "wholesale_price": wholesale_price,
                    "retail_price": retail_price,
                    "leftover": leftover,
                    "market_id": market_id,
                },
            )
        )

    async def get_all_chats(self, page: int = 0) -> GetAllChatsResponse:
        page_ = await self._make_get_request("chats", {"page": page})
        return GetAllChatsResponse(**page_)

    async def get_chat_by_id(self, chat_id: int):
        resp = await self._make_get_request(f"chats/id/{chat_id}")
        return BaseChatResponse(**resp)

    async def get_chat_by_vk_id(self, vk_id: int):
        return BaseChatResponse(**await self._make_get_request(f"chats/vk_id/{vk_id}"))

    async def create_chat(self, vk_id: int):
        return BaseChatResponse(
            **await self._make_post_request("chats/create", {"vk_id": vk_id})
        )

    async def enable_chat(self, chat_id: int):
        return BaseChatResponse(
            **await self._make_post_request(f"chats/{chat_id}/enable")
        )

    async def disable_chat(self, chat_id: int):
        return BaseChatResponse(
            **await self._make_post_request(f"chats/{chat_id}/disable")
        )
