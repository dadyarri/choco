import json
import logging
import os

from client import ChocoManagerClient
from pydantic import ValidationError
from vkbottle import Bot, API
from vkbottle.bot import Message
from vkbottle_types.events import GroupEventType, MarketOrderNew

from utils.core import (
    get_vk_token,
    get_admins_ids,
    send_message_to_telegram,
    send_photo_to_telegram,
)

logging.basicConfig(level="DEBUG")

bot = Bot(token=get_vk_token())
vk = API(token=os.getenv("VK_USER_TOKEN"))
client = ChocoManagerClient()


@bot.on.message()
async def send_user_message_to_admins(message: Message):
    if message.from_id not in get_admins_ids():
        resp = await message.ctx_api.users.get(user_ids=[str(message.from_id)])
        first_name = resp[0].first_name
        last_name = resp[0].last_name
        try:
            chat = await client.get_chat_by_vk_id(message.from_id)
        except ValidationError:
            chat = await client.create_chat(message.from_id)
        await client.enable_chat(chat.response.id)
        tg_msg = "**Новое сообщение от {0} {1}**:\n{2}".format(
            first_name, last_name, message.text
        )
        tg_markup = {
            "inline_keyboard": [
                [
                    {
                        "text": "Открыть",
                        "callback_data": json.dumps(
                            {
                                "block": "dialogs",
                                "action": "select",
                                "value": chat.response.id,
                            }
                        ),
                    },
                ],
            ],
        }
        await send_message_to_telegram(tg_msg, tg_markup)

        if message.attachments is not None:
            for attach in message.attachments:
                if attach.photo is not None:
                    await send_photo_to_telegram(
                        attach.photo.sizes[-1].url,
                        first_name=first_name,
                        last_name=last_name,
                    )
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


@bot.on.raw_event(GroupEventType.MARKET_ORDER_NEW, dataclass=MarketOrderNew)
async def new_order(order: MarketOrderNew):
    """
    Когда поступает новый заказ, прислать пользователю его содержимое и спросить данные для доставки.
    Отправить содержимое заказа и количество товара в наличии (из нашей базы) в телеграм.
    """
    order_items = "\n".join(
        f"- {item.title} {item.quantity} x {item.price.text} = {item.quantity * int(item.price.amount) / 100} ₽"
        for item in order.object.preview_order_items
    )
    # FIXME: Временное решение, пока в VKbottle не появятся необходимые поля
    order_info = await vk.request("market.getOrderById", {"order_id": order.object.id})
    customer = await order.ctx_api.users.get([str(order.object.user_id)])

    await order.ctx_api.messages.send(
        user_id=order.object.user_id,
        message=(
            f"Здравствуйте. Вы заказали {order.object.items_count} товар(ов) на сумму {order.object.total_price.text}:\n"
            f"{order_items}"
        ),
        random_id=0,
    )

    for item in order.object.preview_order_items:
        try:
            item_object = await client.get_good_by_market_id(item.item_id)
        except ValidationError:
            logging.debug("Item not found")
        else:
            await client.decrement_leftover(item_object.response.id, item.quantity)

    await send_message_to_telegram(
        f"Новый заказ от {customer[0].last_name} {customer[0].first_name}:\n{order_items}\nОстатки обновлены."
    )

    if not (delivery := order_info["response"]["order"]["delivery"]):
        await order.ctx_api.messages.send(
            user_id=order.object.user_id,
            message="Укажите адрес доставки, номер телефона и удобное время получения заказа.",
            random_id=0,
        )
    else:
        await send_message_to_telegram(
            f"""\
        Адрес: {delivery['address']};
        Телефон: {order_info['response']['order']['recipient']['phone']}
        Имя: {order_info['response']['order']['recipient']['name']}"""
        )


if __name__ == "__main__":
    bot.run_forever()
