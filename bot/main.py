import json
import logging
import os

import sentry_sdk
from sentry_sdk.integrations.logging import LoggingIntegration
from vkbottle import Bot, OrFilter, CtxStorage, API
from vkbottle.bot import Message
from vkbottle.dispatch.rules.bot import VBMLRule

from utils import keyboards
from utils.client import ChocoManagerClient
from utils.core import (
    get_vk_token,
    get_admins_ids,
    send_message_to_telegram,
    send_photo_to_telegram,
    generate_post_message,
    round_leftover,
    is_float,
)
from utils.rules import EventPayloadContainsRule

logging.basicConfig(level="DEBUG")

bot = Bot(token=get_vk_token())
bot.labeler.vbml_ignore_case = True
vbml_rule = VBMLRule.with_config(
    bot.labeler.rule_config,
)  # FIXME: temporary fix, bug in vkbottle
sentry_logging = LoggingIntegration(
    level=logging.INFO,
    event_level=logging.ERROR,
)
sentry_sdk.init(
    os.getenv("SENTRY_URL"),
    environment=os.getenv("ENV"),
    traces_sample_rate=1.0,
    integrations=[sentry_logging],
)
ctx_storage = CtxStorage()
user_api = API(os.getenv("VK_USER_TOKEN"))
client = ChocoManagerClient()


@bot.on.message(
    OrFilter(
        vbml_rule(["привет", "начать", "hello", "hi"]),
        EventPayloadContainsRule({"block": "main_menu"}),
    ),
)
async def greeting(message: Message):
    if message.from_id in get_admins_ids():
        await message.answer("Добро пожаловать", keyboard=keyboards.main_menu())


@bot.on.message(
    EventPayloadContainsRule({"block": "manage_leftovers", "action": "init"}),
)
async def init_leftovers_managing(message: Message):
    goods = await client.get_all_goods(page=1)
    await message.answer(
        "Управление остатками",
        keyboard=keyboards.list_goods(goods.response.items, page=1),
    )


@bot.on.message(
    EventPayloadContainsRule({"block": "manage_leftovers", "action": "back"}),
)
async def leftovers_managing_go_back(message: Message):
    payload = json.loads(message.payload)
    page = payload["page"]
    if page == 0:
        await message.answer("Уже выбрана первая страница!")
    else:
        goods = await client.get_all_goods(page)
        await message.answer(
            "Управление остатками",
            keyboard=keyboards.list_goods(goods.response.items, page=page),
        )


@bot.on.message(
    EventPayloadContainsRule({"block": "manage_leftovers", "action": "forward"}),
)
async def leftovers_managing_go_forward(message: Message):
    payload = json.loads(message.payload)
    page = payload["page"]
    goods = await client.get_all_goods(page)
    if goods.response.items:
        await message.answer(
            "Управление остатками",
            keyboard=keyboards.list_goods(goods.response.items, page=page),
        )
    else:
        await message.answer("Элементов больше нет")


@bot.on.message(
    EventPayloadContainsRule({"block": "manage_leftovers", "action": "select_good"}),
)
async def leftovers_managing_select_good(message: Message):
    payload = json.loads(message.payload)
    good_id = payload["id"]
    good = await client.get_good_by_id(good_id)
    ctx_storage.set(f"{message.peer_id}.selected_good", good.response.id)
    await message.answer(
        f"Товар: {good.response.name}\nОстаток: {round_leftover(good.response.leftover)}",
        keyboard=keyboards.manage_leftovers(is_float(good.response.leftover)),
    )


@bot.on.message(
    EventPayloadContainsRule({"block": "manage_leftovers", "action": "plus_one"}),
)
async def leftovers_managing_increment_good(message: Message):
    good_id = int(ctx_storage.get(f"{message.peer_id}.selected_good"))
    resp = await client.increment_leftover(good_id)
    good = resp.response
    await message.answer(
        f"Товар: {good.name}\nОстаток: {round_leftover(good.leftover)}",
        keyboard=keyboards.manage_leftovers(is_float(good.leftover)),
    )


@bot.on.message(
    EventPayloadContainsRule({"block": "manage_leftovers", "action": "minus_one"}),
)
async def leftovers_managing_decrement_good(message: Message):
    good_id = int(ctx_storage.get(f"{message.peer_id}.selected_good"))
    resp = await client.decrement_leftover(good_id)
    good = resp.response
    await message.answer(
        f"Товар: {good.name}\nОстаток: {round_leftover(good.leftover)}",
        keyboard=keyboards.manage_leftovers(is_float(good.leftover)),
    )


@bot.on.message(
    EventPayloadContainsRule({"block": "manage_leftovers", "action": "minus_small"}),
)
async def leftovers_managing_increment_good(message: Message):
    good_id = int(ctx_storage.get(f"{message.peer_id}.selected_good"))
    resp = await client.decrement_leftover(good_id, 0.3)
    good = resp.response
    await message.answer(
        f"Товар: {good.name}\nОстаток: {round_leftover(good.leftover)}",
        keyboard=keyboards.manage_leftovers(is_float(good.leftover)),
    )


@bot.on.message(
    EventPayloadContainsRule({"block": "manage_leftovers", "action": "minus_big"}),
)
async def leftovers_managing_decrement_good(message: Message):
    good_id = int(ctx_storage.get(f"{message.peer_id}.selected_good"))
    resp = await client.decrement_leftover(good_id, 0.8)
    good = resp.response
    await message.answer(
        f"Товар: {good.name}\nОстаток: {round_leftover(good.leftover)}",
        keyboard=keyboards.manage_leftovers(is_float(good.leftover)),
    )


@bot.on.message(
    EventPayloadContainsRule({"block": "update_post"}),
)
async def update_post(message: Message):
    vk_group = -int(os.getenv("VK_GROUP"))

    await message.answer("Удаление старого поста...")
    last_post = await user_api.wall.get(vk_group, count=1)
    post_id = last_post.items[0].id
    await user_api.wall.delete(vk_group, post_id)

    await message.answer("Генерация текста сообщения...")
    message_ = await generate_post_message()

    await message.answer("Публикация нового поста...")
    resp = await user_api.wall.post(
        vk_group,
        message=message_,
        from_group=True,
        close_comments=True,
    )
    await user_api.wall.pin(resp.post_id, vk_group)
    await message.answer("Пост обновлён!")


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
                    resp = await client.get_good_by_market_id(attach.market.id)
                    await send_message_to_telegram(
                        f"{resp.response.name} x{resp.response.leftover} ({resp.response.retail_price}₽)"
                    )


if __name__ == "__main__":
    bot.run_forever()
