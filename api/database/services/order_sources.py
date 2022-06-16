from client.models import OrderSource
from tortoise.transactions import in_transaction

from database import models


async def fetch_all_orders_sources(page) -> list[models.OrderSource]:
    async with in_transaction():
        if page == 0:
            return await models.OrderSource.all().order_by("id")
        limit = 4
        return (
            await models.OrderSource.all()
            .order_by("id")
            .limit(limit)
            .offset((page - 1) * limit)
        )


async def create_order_source(order_source: OrderSource) -> models.OrderSource:
    async with in_transaction():
        return await models.OrderSource.create(name=order_source.name)


async def get_order_source_by_id(order_source_id: int) -> models.OrderSource:
    async with in_transaction():
        return await models.OrderSource.get(id=order_source_id)


async def update_order_source(order_source: OrderSource) -> models.OrderSource:
    async with in_transaction():
        order_source_to_update = await models.OrderSource.get(id=order_source.id)
        new_order_source = (
            await order_source_to_update.update_or_create(dict(order_source))
        )[0]
        await new_order_source.save()
        return new_order_source


async def delete_order_source(order_source_id: int) -> models.OrderSource:
    async with in_transaction():
        order_source_to_delete = await models.OrderSource.get(id=order_source_id)
        await order_source_to_delete.delete()
        return order_source_to_delete
