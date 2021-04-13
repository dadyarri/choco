import logging
import os

import requests
from vkwave import bots

import filters

bot = bots.SimpleLongPollBot(
    tokens=os.getenv("VK_TOKEN"),
    group_id=os.getenv("VK_GROUP"),
)
router = bots.DefaultRouter()
logging.basicConfig(level=logging.DEBUG)
telegram_token = os.getenv("TG_TOKEN")
telegram_chats = os.getenv("SEND_IDS")


def send_message_to_tg(token: str, chats: str, message: str):
    for chat in chats.split(","):
        requests.post(
            "https://api.telegram.org/bot{0}/sendMessage".format(token),
            params={"chat_id": chat, "text": message, "parse_mode": "Markdown"},
        )


@bots.simple_bot_handler(router, filters.OrderNewFilter())
async def _new_order(event: bots.SimpleBotEvent):
    order_items = []
    newline = "\n"
    price = event.object.object.total_price
    for item in event.object.object.preview_order_items:
        title = "{}".format(item.title.replace("&", "%26"))
        order_items.append(
            f"- {title} ({int(item.price.amount) / 100}{item.price.currency.name})"
        )
    tg_msg = f"""
**Новый заказ от https://vk.com/id{event.object.object.user_id}**
Содержимое:
{newline.join(order_items)}
*Итого: {int(price.amount) / 100}{price.currency.name}*
    """
    vk_msg = f"""Здравствуйте. Вы сделали заказ на сумму {int(price.amount) / 100}{price.currency.name}:
{newline.join(order_items)}
Укажите ваш номер телефона, адрес и удобное время для доставки, мы всё привезём."""
    await event.api_ctx.messages.send(
        random_id=0, peer_id=event.object.object.user_id, message=vk_msg
    )
    send_message_to_tg(telegram_token, telegram_chats, tg_msg)


@bots.simple_bot_message_handler(router)
async def _new_message(event: bots.SimpleBotEvent):
    message = event.object.object.message
    request = await event.api_ctx.users.get(user_ids=message.from_id)
    fname = request.response[0].first_name
    lname = request.response[0].last_name
    group_id = os.getenv("VK_GROUP")
    tg_msg = "**Новое сообщение от {0} {1}**:\n{2}\nLink: https://vk.com/gim{3}?sel={4}".format(
        fname, lname, message.text, group_id, message.from_id
    )

    send_message_to_tg(telegram_token, telegram_chats, tg_msg)

    for chat in telegram_chats.split(","):

        if message.attachments is not None:
            for attach in message.attachments:
                if attach.photo is not None:
                    requests.post(
                        "https://api.telegram.org/bot{0}/sendPhoto".format(
                            telegram_token
                        ),
                        params={
                            "chat_id": chat,
                            "photo": attach.photo.sizes[-1].url,
                            "caption": "Вложение от {0} {1}".format(fname, lname),
                        },
                    )


bot.dispatcher.add_router(router)

bot.run_forever()
