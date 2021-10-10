import json
import logging
import os

from vkbottle import Bot, OrFilter, CtxStorage
from vkbottle.bot import Message
from vkbottle.dispatch.rules.bot import VBMLRule

from bot.utils import keyboards
from bot.utils.core import (
    get_vk_token,
    get_admins_ids,
    make_get_request,
    make_post_request,
    send_message_to_telegram,
    send_photo_to_telegram,
)
from bot.utils.rules import EventPayloadContainsRule

logging.basicConfig(level="DEBUG")

bot = Bot(token=get_vk_token())
bot.labeler.vbml_ignore_case = True
vbml_rule = VBMLRule.with_config(
    bot.labeler.rule_config,
)  # FIXME: temporary fix, bug in vkbottle
ctx_storage = CtxStorage()


@bot.on.message(
    OrFilter(
        vbml_rule(["привет", "начать", "hello", "hi"]),
        EventPayloadContainsRule({"block": "main_menu"}),
    ),
)
async def greeting(message: Message):
    if message.from_id in get_admins_ids():
        await message.answer("Добро пожаловать", keyboard=keyboards.main_menu())
    else:
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


@bot.on.message(
    EventPayloadContainsRule({"block": "manage_leftovers", "action": "init"}),
)
async def init_leftovers_managing(message: Message):
    goods = await make_get_request("goods/", params={"page": 0})
    await message.answer(
        "Управление остатками", keyboard=keyboards.list_goods(goods["items"], page=0)
    )


@bot.on.message(
    EventPayloadContainsRule({"block": "manage_leftovers", "action": "back"}),
)
async def leftovers_managing_go_back(message: Message):
    payload = json.loads(message.payload)
    page = payload["page"]
    if page == -1:
        await message.answer("Нельзя перейти на страницу с отрицательным номером")
    else:
        goods = await make_get_request("goods/", params={"page": page})
        await message.answer(
            "Управление остатками",
            keyboard=keyboards.list_goods(goods["items"], page=page),
        )


@bot.on.message(
    EventPayloadContainsRule({"block": "manage_leftovers", "action": "forward"}),
)
async def leftovers_managing_go_forward(message: Message):
    payload = json.loads(message.payload)
    page = payload["page"]
    goods = await make_get_request("goods/", params={"page": page})
    if goods["items"]:
        await message.answer(
            "Управление остатками",
            keyboard=keyboards.list_goods(goods["items"], page=page),
        )
    else:
        await message.answer("Элементов больше нет")


@bot.on.message(
    EventPayloadContainsRule({"block": "manage_leftovers", "action": "select_good"}),
)
async def leftovers_managing_select_good(message: Message):
    payload = json.loads(message.payload)
    good_id = payload["id"]
    good = await make_get_request(f"goods/{good_id}")
    ctx_storage.set(f"{message.peer_id}.selected_good", good["id"])
    await message.answer(
        f"Товар: {good['name']}\nОстаток: {good['leftover']}",
        keyboard=keyboards.manage_leftovers(),
    )


@bot.on.message(
    EventPayloadContainsRule({"block": "manage_leftovers", "action": "plus"}),
)
async def leftovers_managing_increment_good(message: Message):
    good_id = int(ctx_storage.get(f"{message.peer_id}.selected_good"))
    resp = await make_post_request(f"goods/increment/{good_id}/")
    logging.debug(resp)
    good = resp["incremented"]
    await message.answer(
        f"Товар: {good['name']}\nОстаток: {good['leftover']}",
        keyboard=keyboards.manage_leftovers(),
    )


@bot.on.message(
    EventPayloadContainsRule({"block": "manage_leftovers", "action": "minus"}),
)
async def leftovers_managing_decrement_good(message: Message):
    good_id = int(ctx_storage.get(f"{message.peer_id}.selected_good"))
    resp = await make_post_request(f"goods/decrement/{good_id}")
    good = resp["decremented"]
    await message.answer(
        f"Товар: {good['name']}\nОстаток: {good['leftover']}",
        keyboard=keyboards.manage_leftovers(),
    )


if __name__ == "__main__":
    bot.run_forever()
