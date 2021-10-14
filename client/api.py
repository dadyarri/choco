from typing import Optional


class ChocoManagerClient:
    async def _make_get_request(self, endpoint: str, **kwargs: dict):
        pass

    async def _make_post_request(self, endpoint: str, **kwargs: dict):
        pass

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
