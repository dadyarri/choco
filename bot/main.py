import logging
import os

from pydantic import ValidationError
from vkbottle import Bot
from vkbottle.bot import Message

from utils.client import ChocoManagerClient
from utils.core import (
    get_vk_token,
    get_admins_ids,
    send_message_to_telegram,
    send_photo_to_telegram,
)

logging.basicConfig(level="DEBUG")

bot = Bot(token=get_vk_token())
client = ChocoManagerClient()


@bot.on.message()
async def send_user_message_to_admins(message: Message):
    if message.from_id not in get_admins_ids():
        resp = await message.ctx_api.users.get(user_ids=[str(message.from_id)])
        first_name = resp[0].first_name
        last_name = resp[0].last_name
        group_id = os.getenv("VK_GROUP")
        tg_msg = "**Новое сообщение от {0} {1}**:\n{2}\nLink: https://vk.com/gim{3}?sel={4}".format(
            first_name, last_name, message.text, group_id, message.from_id
        )
        await send_message_to_telegram(tg_msg)

        if message.attachments is not None:
            for attach in message.attachments:
                if attach.photo is not None:
                    await send_photo_to_telegram(attach.photo.sizes[-1].url)
                if attach.market is not None:
                    await send_photo_to_telegram(
                        attach.market.thumb_photo,
                        first_name=first_name,
                        last_name=last_name,
                    )
                    try:
                        resp = await client.get_good_by_market_id(attach.market.id)
                    except ValidationError:
                        logging.error("Item was not found")
                    else:
                        await send_message_to_telegram(
                            f"{resp.response.name} x{resp.response.leftover} ({resp.response.retail_price}₽)"
                        )


if __name__ == "__main__":
    bot.run_forever()
