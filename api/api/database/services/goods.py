from tortoise.transactions import in_transaction

from api.database import models


async def fetch_all_goods() -> list[models.Good]:
    async with in_transaction():
        return await models.Good.all()


async def fetch_good(good_id: int) -> models.Good:
    async with in_transaction():
        return await models.Good.get(id=good_id)


async def create_good(name: str, wholesale_price: int, retail_price: int, leftover: int):
    async with in_transaction():
        return await models.Good.create(
            name=name,
            wholesale_price=wholesale_price,
            retail_price=retail_price,
            leftover=leftover
        )


async def rename_good(good_id: int, new_name: str):
    async with in_transaction():
        good = await models.Good.get(id=good_id)
        return await good.update_from_dict({"name": new_name})


async def increment_good_leftover(good_id: int):
    async with in_transaction():
        good = await models.Good.get(id=good_id)
        return await good.update_from_dict({"leftover": good.leftover + 1})


async def decrement_good_leftover(good_id: int):
    async with in_transaction():
        good = await models.Good.get(id=good_id)
        return await good.update_from_dict({"leftover": good.leftover - 1})


async def change_good_wholesale_price(good_id: int, new_price: int):
    async with in_transaction():
        good = await models.Good.get(id=good_id)
        return await good.update_from_dict({"wholesale_price": new_price})


async def change_good_retail_price(good_id: int, new_price: int):
    async with in_transaction():
        good = await models.Good.get(id=good_id)
        return await good.update_from_dict({"retail_price": new_price})



