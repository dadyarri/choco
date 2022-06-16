from client.models import OrderCity
from tortoise.transactions import in_transaction

from database import models


async def fetch_all_orders_cities(page) -> list[models.OrderCity]:
    async with in_transaction():
        if page == 0:
            return await models.OrderCity.all().order_by("id")
        limit = 4
        return (
            await models.OrderCity.all()
            .order_by("id")
            .limit(limit)
            .offset((page - 1) * limit)
        )


async def create_order_city(order_city: OrderCity) -> models.OrderCity:
    async with in_transaction():
        return await models.OrderCity.create(name=order_city.name)


async def get_order_city_by_id(order_city_id: int) -> models.OrderCity:
    async with in_transaction():
        return await models.OrderCity.get(id=order_city_id)


async def update_order_city(order_city: OrderCity) -> models.OrderCity:
    async with in_transaction():
        order_city_to_update = await models.OrderCity.get(id=order_city.id)
        new_order_city = (
            await order_city_to_update.update_or_create(dict(order_city))
        )[0]
        await new_order_city.save()
        return new_order_city


async def delete_order_city(order_city_id: int) -> models.OrderCity:
    async with in_transaction():
        order_city_to_delete = await models.OrderCity.get(id=order_city_id)
        await order_city_to_delete.delete()
        return order_city_to_delete
