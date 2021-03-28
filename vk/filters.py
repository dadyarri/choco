from vkwave.bots.core.dispatching.filters.base import BaseFilter
from vkwave.bots.core.dispatching.filters.base import FilterResult
from vkwave.bots import SimpleBotEvent


class OrderNewFilter(BaseFilter):
    async def check(self, event: SimpleBotEvent) -> FilterResult:
        return FilterResult(event.object.type == "market_order_new")
