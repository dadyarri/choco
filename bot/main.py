import json
import logging
import os

from vkbottle import Bot, OrFilter, CtxStorage, API, Token
from vkbottle.bot import Message
from vkbottle.dispatch.rules.bot import VBMLRule

from utils import keyboards
from utils.core import (
    get_vk_token,
    get_admins_ids,
    make_get_request,
    make_post_request,
    send_message_to_telegram,
    send_photo_to_telegram,
    generate_post_message,
)
from utils.rules import EventPayloadContainsRule

logging.basicConfig(level="DEBUG")

bot = Bot(token=get_vk_token())
bot.labeler.vbml_ignore_case = True
vbml_rule = VBMLRule.with_config(
    bot.labeler.rule_config,
)  # FIXME: temporary fix, bug in vkbottle
ctx_storage = CtxStorage()
user_api = API(os.getenv("VK_USER_TOKEN"))


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
    goods = await make_get_request("goods/", params={"page": 0})
    await message.answer(
        "Управление остатками",
        keyboard=keyboards.list_goods(goods["response"]["items"], page=0),
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
            keyboard=keyboards.list_goods(goods["response"]["items"], page=page),
        )


@bot.on.message(
    EventPayloadContainsRule({"block": "manage_leftovers", "action": "forward"}),
)
async def leftovers_managing_go_forward(message: Message):
    payload = json.loads(message.payload)
    page = payload["page"]
    goods = await make_get_request("goods/", params={"page": page})
    if goods["response"]["items"]:
        await message.answer(
            "Управление остатками",
            keyboard=keyboards.list_goods(goods["response"]["items"], page=page),
        )
    else:
        await message.answer("Элементов больше нет")


@bot.on.message(
    EventPayloadContainsRule({"block": "manage_leftovers", "action": "select_good"}),
)
async def leftovers_managing_select_good(message: Message):
    payload = json.loads(message.payload)
    good_id = payload["id"]
    good = await make_get_request(f"goods/id/{good_id}")
    ctx_storage.set(f"{message.peer_id}.selected_good", good["response"]["id"])
    await message.answer(
        f"Товар: {good['response']['name']}\nОстаток: {good['response']['leftover']}",
        keyboard=keyboards.manage_leftovers(),
    )


@bot.on.message(
    EventPayloadContainsRule({"block": "manage_leftovers", "action": "plus"}),
)
async def leftovers_managing_increment_good(message: Message):
    good_id = int(ctx_storage.get(f"{message.peer_id}.selected_good"))
    resp = await make_post_request(f"goods/leftover/{good_id}/inc/")
    logging.debug(resp)
    good = resp["response"]
    await message.answer(
        f"Товар: {good['name']}\nОстаток: {good['leftover']}",
        keyboard=keyboards.manage_leftovers(),
    )


@bot.on.message(
    EventPayloadContainsRule({"block": "manage_leftovers", "action": "minus"}),
)
async def leftovers_managing_decrement_good(message: Message):
    good_id = int(ctx_storage.get(f"{message.peer_id}.selected_good"))
    resp = await make_post_request(f"goods/leftover/{good_id}/dec")
    good = resp["response"]
    await message.answer(
        f"Товар: {good['name']}\nОстаток: {good['leftover']}",
        keyboard=keyboards.manage_leftovers(),
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
                    await send_message_to_telegram(attach.market.title)


if __name__ == "__main__":
    bot.run_forever()
