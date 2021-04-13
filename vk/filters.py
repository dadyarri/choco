from typing import AnyStr, Callable, Dict, Optional

import ujson
from vkwave.bots import BaseEvent
from vkwave.bots.core import BaseFilter
from vkwave.bots.core.dispatching import filters


class OrderNewFilter(BaseFilter):
    async def check(self, event: BaseEvent) -> filters.base.FilterResult:
        return filters.base.FilterResult(event.object.type == "market_order_new")


class ButtonFilter(BaseFilter):
    def __init__(
        self,
        payload: str,
        json_loader: Callable[[AnyStr], Dict] = ujson.loads,
    ):
        self.payload = {"button": payload}
        self.json_loader = json_loader

    async def check(self, event: BaseEvent) -> filters.base.FilterResult:
        payload: Optional[str] = filters.builtin.get_payload(event)

        if payload is None:
            return filters.base.FilterResult(False)

        current_payload = self.json_loader(payload)

        return filters.base.FilterResult(
            any(
                self.payload.get(key, None) == val
                for key, val in current_payload.items()
            ),
        )
