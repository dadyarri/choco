import logging

from tortoise.transactions import in_transaction

from database import models


async def fetch_all_goods(page: int = 0) -> list[models.Good]:
    async with in_transaction():
        if page == 0:
            return await models.Good.all().order_by("name")
        limit = 4
        return (
            await models.Good.all()
            .order_by("name")
            .limit(limit)
            .offset((page - 1) * limit)
        )


async def get_good_by_id(good_id: int) -> models.Good:
    async with in_transaction():
        return await models.Good.get(id=good_id)


async def get_good_by_market_id(market_id: int) -> models.Good:
    async with in_transaction():
        return await models.Good.get(market_id=market_id)


async def create_good(
    name: str,
    wholesale_price: int,
    retail_price: int,
    leftover: float,
    market_id: int,
):
    async with in_transaction():
        return await models.Good.create(
            name=name,
            wholesale_price=wholesale_price,
            retail_price=retail_price,
            leftover=leftover,
            market_id=market_id,
        )


async def rename_good(good_id: int, new_name: str):
    async with in_transaction():
        good = await models.Good.get(id=good_id)
        new_good = await good.update_from_dict({"name": new_name})
        await new_good.save()
        return new_good


async def update_good_leftover(good_id: int, value: float):
    async with in_transaction():
        good = await models.Good.get(id=good_id)
        new_good = await good.update_from_dict({"leftover": value})
        await new_good.save()
        return new_good


async def increment_good_leftover(good_id: int, value: float):
    async with in_transaction():
        good = await models.Good.get(id=good_id)
        return await update_good_leftover(good_id, good.leftover + value)


async def decrement_good_leftover(good_id: int, value: float):
    async with in_transaction():
        good = await models.Good.get(id=good_id)
        return await update_good_leftover(good_id, good.leftover - value)


async def change_good_wholesale_price(good_id: int, new_price: int):
    async with in_transaction():
        good = await models.Good.get(id=good_id)
        new_good = await good.update_from_dict({"wholesale_price": new_price})
        await new_good.save()
        return new_good


async def change_good_retail_price(good_id: int, new_price: int):
    async with in_transaction():
        good = await models.Good.get(id=good_id)
        new_good = await good.update_from_dict({"retail_price": new_price})
        await new_good.save()
        return new_good


async def change_good_market_id(goods_id: int, market_id: int):
    async with in_transaction():
        good = await models.Good.get(id=goods_id)
        new_good = await good.update_from_dict({"market_id": market_id})
        await new_good.save()
        return new_good
