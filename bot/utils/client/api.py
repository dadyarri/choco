from typing import Optional

import aiohttp

from utils.core import get_api_host


class ChocoManagerClient:
    @staticmethod
    def _get_request_url(endpoint: str):
        return f"http://{get_api_host()}/{endpoint}"

    async def _make_get_request(self, endpoint: str, **kwargs: dict):
        async with aiohttp.ClientSession() as session:
            url = self._get_request_url(endpoint)
            async with session.get(url, params=kwargs) as resp:
                result = await resp.json()
            await session.close()

        return result

    async def _make_post_request(self, endpoint: str, **kwargs: dict):
        async with aiohttp.ClientSession() as session:
            url = self._get_request_url(endpoint)
            async with session.post(url, params=kwargs) as resp:
                result = await resp.json()
            await session.close()

        return result

    async def get_all_goods(self):
        pass

    async def get_good_by_id(self, good_id: int):
        pass

    async def get_good_by_market_id(self, good_id: int):
        pass

    async def rename_good(self, good_id: int, value: str):
        pass

    async def update_leftover(self, good_id: int, value: float):
        pass

    async def increment_leftover(self, good_id: int):
        pass

    async def decrement_leftover(self, good_id: int):
        pass

    async def update_wholesale_price(self, good_id: int, value: int):
        pass

    async def update_retail_price(self, good_id: int, value: int):
        pass

    async def create_good(
        self,
        name: str,
        wholesale_price: int,
        retail_price: int,
        leftover: float,
        market_id: Optional[int],
    ):
        pass
