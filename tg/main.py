import json
import logging
import os
import re

from aiogram import Bot, Dispatcher, executor, types
from aiogram.contrib.fsm_storage.memory import MemoryStorage
from aiogram.dispatcher.filters import CommandStart, Command
from aiogram.dispatcher.filters.filters import AndFilter, OrFilter
from vkbottle import API

from utils.client import ChocoManagerClient
from utils.core import get_tg_token, is_float, round_leftover
from utils.filters import IsAdmin, CallbackFilter
from utils.keyboards import main_menu_markup, list_goods, manage_leftovers

logging.basicConfig(level=logging.DEBUG)

bot = Bot(token=get_tg_token())
vk = API(os.getenv("VK_TOKEN"))
dp = Dispatcher(bot)
client = ChocoManagerClient()
storage = MemoryStorage()


def extract_chat_id(msg: str) -> int:
    return int(re.search(r"\?sel=(\d+)", msg)[1])


@dp.message_handler(OrFilter(AndFilter(CommandStart(), IsAdmin(True)), Command("menu")))
async def _main_menu(message: types.Message):
    await message.answer("Добро пожаловать", reply_markup=main_menu_markup())


@dp.callback_query_handler(CallbackFilter({"block": "main_menu"}))
async def _main_menu_callback(query: types.CallbackQuery):
    await query.message.edit_text("Добро пожаловать", reply_markup=main_menu_markup())
    await query.answer()


@dp.callback_query_handler(CallbackFilter({"block": "leftovers", "action": "init"}))
async def _manage_leftovers(query: types.CallbackQuery):
    goods = await client.get_all_goods(page=1)
    await query.message.edit_text(
        "Управление остатками", reply_markup=list_goods(goods.response.items, page=1)
    )
    await query.answer()


@dp.callback_query_handler(CallbackFilter({"block": "leftovers", "action": "backward"}))
async def _manage_leftovers_go_backward(query: types.CallbackQuery):
    page = json.loads(query.data)["page"]
    if page == 0:
        await query.answer("Уже выбрана первая страница!")
    else:
        goods = await client.get_all_goods(page)
        await query.message.edit_text(
            "Управление остатками",
            reply_markup=list_goods(goods.response.items, page=page),
        )
        await query.answer()


@dp.callback_query_handler(CallbackFilter({"block": "leftovers", "action": "forward"}))
async def _manage_leftovers_go_forward(query: types.CallbackQuery):
    page = json.loads(query.data)["page"]
    goods = await client.get_all_goods(page)
    if goods.response.items:
        await query.message.edit_text(
            "Управление остатками",
            reply_markup=list_goods(goods.response.items, page=page),
        )
        await query.answer()
    else:
        await query.answer("Элементов больше нет")


@dp.callback_query_handler(
    CallbackFilter({"block": "leftovers", "action": "select_product"})
)
async def _manage_leftovers_select_product(query: types.CallbackQuery):
    product_id = json.loads(query.data)["value"]
    product = await client.get_good_by_id(product_id)
    await storage.set_data(
        chat=query.message.chat.id,
        user=query.from_user.id,
        data={"product_id": product_id},
    )
    await query.message.edit_text(
        (
            f"Товар: {product.response.name}\n"
            f"Розничная цена: {product.response.retail_price}₽\n"
            f"Оптовая цена: {product.response.wholesale_price}₽\n"
            f"Остаток: {round_leftover(product.response.leftover)} шт."
        ),
        reply_markup=manage_leftovers(is_float(product.response.leftover)),
    )
    await query.answer()


@dp.message_handler()
async def reply_to_vk(message: types.Message):

    if message.reply_to_message is not None:
        replied_msg = message.reply_to_message.text
        msg = message.text

        chat_id = extract_chat_id(replied_msg)

        await vk.messages.send(random_id=0, peer_id=chat_id, message=msg)
        await message.answer("Сообщение отправлено")

        tg_msg = "Администратор ответил на сообщение '{0}':\n{1}".format(
            replied_msg.split("\n")[1], msg
        )

        for chat in os.getenv("SEND_IDS").split(","):
            if int(chat) != message["from"]["id"]:
                await bot.send_message(chat_id=chat, text=tg_msg)


if __name__ == "__main__":
    executor.start_polling(dp, skip_updates=True)
