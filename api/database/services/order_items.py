from client import Good
from client.models import OrderFull, OrderedGood
from tortoise.transactions import in_transaction

from database.models import OrderItems, Order


async def add_item_to_order(order_id: int, item: Good, quantity: int):
    async with in_transaction():
        order_item = OrderItems(
            order_id=order_id,
            good_id=item.id,
            quantity=quantity
        )
        await order_item.save()
        return _get_full_order(order_id)


async def _get_full_order(order_id: int):
    order = await Order.get(id=order_id)
    order_items = await OrderItems.filter(order_id=order_id).all()
    items = [OrderedGood(good=item.good_id, quantity=item.quantity) for item in order_items]
    return OrderFull(id=order.id, source=order.source, state=order.state, city=order.city, items=items)
