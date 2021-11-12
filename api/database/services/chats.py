from tortoise.transactions import in_transaction

from database import models


async def fetch_all_chats(page):
    async with in_transaction():
        if page == 0:
            return await models.Chat.all().order_by("vk_id")
        limit = 4
        return (
            await models.Chat.all()
            .order_by("vk_id")
            .limit(limit)
            .offset((page - 1) * limit)
        )
