from client.models import Order
from tortoise.transactions import in_transaction

from database import models


async def fetch_all_orders(page) -> list[models.Order]:
    async with in_transaction():
        if page == 0:
            return await models.Order.all().order_by("id")
        limit = 4
        return (
            await models.Order.all()
            .order_by("id")
            .limit(limit)
            .offset((page - 1) * limit)
        )


async def create_order(order: Order) -> models.Order:
    async with in_transaction():
        return await models.Order.create(
            source=order.source,
            state=order.state,
            city=order.city,
        )


async def get_order_by_id(order_id: int) -> models.Order:
    async with in_transaction():
        return await models.Order.get(id=order_id)


async def update_order(order: Order) -> models.Order:
    async with in_transaction():
        order_to_update = await models.Order.get(id=order.id)
        new_order = (await order_to_update.update_or_create(dict(order)))[0]
        await new_order.save()
        return new_order
