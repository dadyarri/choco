from tortoise.transactions import in_transaction

from database import models


async def fetch_all_goods(page: int = 0) -> list[models.Good]:
    limit = 4
    async with in_transaction():
        return await models.Good.all().limit(limit).offset(page * limit)


async def fetch_good(good_id: int) -> models.Good:
    async with in_transaction():
        return await models.Good.get(id=good_id)


async def create_good(
    name: str,
    wholesale_price: int,
    retail_price: int,
    leftover: int,
):
    async with in_transaction():
        return await models.Good.create(
            name=name,
            wholesale_price=wholesale_price,
            retail_price=retail_price,
            leftover=leftover,
        )


async def rename_good(good_id: int, new_name: str):
    async with in_transaction():
        good = await models.Good.get(id=good_id)
        new_good = await good.update_from_dict({"name": new_name})
        await new_good.save()
        return new_good


async def increment_good_leftover(good_id: int):
    async with in_transaction():
        good = await models.Good.get(id=good_id)
        new_good = await good.update_from_dict({"leftover": good.leftover + 1})
        await new_good.save()
        return new_good


async def decrement_good_leftover(good_id: int):
    async with in_transaction():
        good = await models.Good.get(id=good_id)
        new_good = await good.update_from_dict({"leftover": good.leftover - 1})
        await new_good.save()
        return new_good


async def change_good_wholesale_price(good_id: int, new_price: int):
    async with in_transaction():
        good = await models.Good.get(id=good_id)
        new_good = await good.update_from_dict({"wholesale_price": new_price})
        await new_good.save()
        return new_good


async def change_good_retail_price(good_id: int, new_price: int):
    async with in_transaction():
        good = await models.Good.get(id=good_id)
        new_good = await good.update_from_dict({"wholesale_price": new_price})
        await new_good.save()
        return new_good
