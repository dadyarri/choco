from client.models import OrderCity, OrderState
from tortoise.transactions import in_transaction

from database import models


async def fetch_all_orders_states(page) -> list[models.OrderState]:
    async with in_transaction():
        if page == 0:
            return await models.OrderState.all().order_by("id")
        limit = 4
        return (
            await models.OrderState.all()
            .order_by("id")
            .limit(limit)
            .offset((page - 1) * limit)
        )


async def create_order_state(order_state: OrderState) -> models.OrderState:
    async with in_transaction():
        return await models.OrderState.create(name=order_state.name)


async def get_order_state_by_id(order_state_id: int) -> models.OrderState:
    async with in_transaction():
        return await models.OrderState.get(id=order_state_id)


async def update_order_state(order_state: OrderState) -> models.OrderState:
    async with in_transaction():
        order_state_to_update = await models.OrderState.get(id=order_state.id)
        new_order_state = (
            await order_state_to_update.update_or_create(dict(order_state))
        )[0]
        await new_order_state.save()
        return new_order_state


async def delete_order_state(order_state_id: int) -> models.OrderState:
    async with in_transaction():
        order_state_to_delete = await models.OrderState.get(id=order_state_id)
        await order_state_to_delete.delete()
        return order_state_to_delete
