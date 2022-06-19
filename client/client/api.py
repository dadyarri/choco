import logging
import os
from typing import Optional, List

import aiohttp

from .models import (
    GetAllGoodsResponse,
    BaseGoodResponse,
    GetAllChatsResponse,
    BaseChatResponse,
    Order,
    BaseOrderResponse,
    GetAllOrdersResponseModel,
    OrderCity,
    OrderState,
    OrderSource,
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

    async def _make_put_request(self, endpoint: str, params: dict = None):
        async with aiohttp.ClientSession() as session:
            url = self._get_request_url(endpoint)
            async with session.put(url, params=params) as resp:
                logging.debug(resp)
                result = await resp.json()
            await session.close()

        return result

    async def _make_patch_request(self, endpoint: str, params: dict = None):
        async with aiohttp.ClientSession() as session:
            url = self._get_request_url(endpoint)
            async with session.patch(url, params=params) as resp:
                logging.debug(resp)
                result = await resp.json()
            await session.close()

        return result

    async def _make_delete_request(self, endpoint: str, params: dict = None):
        async with aiohttp.ClientSession() as session:
            url = self._get_request_url(endpoint)
            async with session.delete(url, params=params) as resp:
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

    async def invert_by_weight(self, good_id: int):
        return BaseGoodResponse(
            **await self._make_put_request(f"goods/{good_id}/invert_by_weight")
        )

    async def create_good(
        self,
        name: str,
        wholesale_price: int,
        retail_price: int,
        leftover: float,
        market_id: Optional[int] = None,
        is_by_weight: bool = False,
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
                    "is_by_weight": is_by_weight,
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

    async def get_all_orders(self, page: int = 0):
        query = await self._make_get_request("orders", {"page": page})
        return GetAllOrdersResponseModel(**query)

    async def create_order(
        self, source: OrderSource, state: OrderState, city: OrderCity
    ):
        return BaseOrderResponse(
            **await self._make_post_request(
                "orders/create",
                {"source": source, "state": state, "city": city},
            )
        )

    async def get_order_by_id(self, order_id: int):
        return BaseOrderResponse(
            **await self._make_get_request(f"orders/id/{order_id}")
        )

    async def update_order(self, order: Order):
        return BaseOrderResponse(
            **await self._make_patch_request(f"orders/{order.id}", {"order": order})
        )

    async def get_order_cities(self):
        return [
            OrderCity(**city) for city in await self._make_get_request("orderCities")
        ]

    async def create_order_city(self, name: str):
        return OrderCity(**await self._make_post_request("orderCities", {"name": name}))

    async def get_order_city_by_id(self, city_id: int):
        return OrderCity(**await self._make_get_request(f"orderCities/{city_id}"))

    async def update_order_city(self, city: OrderCity):
        return OrderCity(
            **await self._make_patch_request(f"orderCities/{city.id}", {"city": city})
        )

    async def delete_order_city(self, city_id: int):
        return OrderCity(**await self._make_delete_request(f"orderCities/{city_id}"))

    async def get_order_states(self):
        return [
            OrderState(**state) for state in await self._make_get_request("orderStates")
        ]

    async def create_order_state(self, name: str):
        return OrderState(
            **await self._make_post_request("orderStates", {"name": name})
        )

    async def get_order_state_by_id(self, state_id: int):
        return OrderState(**await self._make_get_request(f"orderStates/{state_id}"))

    async def update_order_state(self, state: OrderState):
        return OrderState(
            **await self._make_patch_request(
                f"orderStates/{state.id}", {"order_state": state}
            )
        )

    async def delete_order_state(self, state_id: int):
        return OrderState(**await self._make_delete_request(f"orderStates/{state_id}"))

    async def get_order_sources(self):
        return [
            OrderSource(**source)
            for source in await self._make_get_request("orderSources")
        ]

    async def create_order_source(self, name: str):
        return OrderSource(
            **await self._make_post_request("orderSources", {"name": name})
        )

    async def get_order_source_by_id(self, source_id: int):
        return OrderSource(**await self._make_get_request(f"orderSources/{source_id}"))

    async def update_order_source(self, source: OrderSource):
        return OrderSource(
            **await self._make_patch_request(
                f"orderSources/{source.id}", {"order_source": source}
            )
        )

    async def delete_order_source(self, source_id: int):
        return OrderSource(
            **await self._make_delete_request(f"orderSources/{source_id}")
        )
