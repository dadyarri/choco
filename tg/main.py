import json
import logging
import os
import re

from aiogram import Bot, Dispatcher, executor, types
from aiogram.contrib.fsm_storage.memory import MemoryStorage
from aiogram.dispatcher import FSMContext
from aiogram.dispatcher.filters import CommandStart, Command
from aiogram.dispatcher.filters.filters import AndFilter, OrFilter
from aiogram.dispatcher.filters.state import StatesGroup, State
from client import ChocoManagerClient
from vkbottle import API

from utils.core import get_tg_token, is_float, round_leftover, generate_post_message
from utils.filters import IsAdmin, CallbackFilter
from utils.keyboards import (
    main_menu_markup,
    list_goods,
    manage_leftovers,
    back_markup,
    active_chats,
    dialog_menu,
    back_to_dialog_menu,
)

logging.basicConfig(level=logging.DEBUG)

bot = Bot(token=get_tg_token())
vk = API(os.getenv("VK_TOKEN"))
user_vk = API(os.getenv("VK_USER_TOKEN"))
user_vk.API_VERSION = "5.140"
client = ChocoManagerClient()
storage = MemoryStorage()
dp = Dispatcher(bot, storage=storage)


def extract_chat_id(msg: str) -> int:
    return int(re.search(r"\?sel=(\d+)", msg)[1])


class States(StatesGroup):
    input_message = State()


@dp.message_handler(
    OrFilter(
        AndFilter(CommandStart(), IsAdmin(True)),
        Command("menu"),
    ),
)
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


@dp.callback_query_handler(CallbackFilter({"block": "leftovers", "action": "plus"}))
async def _manage_leftovers_plus(query: types.CallbackQuery):
    data = await storage.get_data(
        chat=query.message.chat.id,
        user=query.from_user.id,
    )
    value = json.loads(query.data)["value"]
    product_id = data["product_id"]
    resp = await client.increment_leftover(product_id, value)
    if resp.response.market_id:
        product = await user_vk.market.get_by_id(
            [f"-{os.getenv('VK_GROUP')}_{resp.response.market_id}"]
        )
        await user_vk.market.edit(
            -int(os.getenv("VK_GROUP")),
            resp.response.market_id,
            name=product.items[0].title,
            description=product.items[0].description,
            category_id=product.items[0].category.id,
            stock_amount=resp.response.leftover,
        )
    await query.message.edit_text(
        (
            f"Товар: {resp.response.name}\n"
            f"Розничная цена: {resp.response.retail_price}₽\n"
            f"Оптовая цена: {resp.response.wholesale_price}₽\n"
            f"Остаток: {round_leftover(resp.response.leftover)} шт."
        ),
        reply_markup=manage_leftovers(is_float(resp.response.leftover)),
    )
    await query.answer(f"Продукту {resp.response.name} добавлено {value} кг.")


@dp.callback_query_handler(CallbackFilter({"block": "leftovers", "action": "minus"}))
async def _manage_leftovers_minus(query: types.CallbackQuery):
    data = await storage.get_data(
        chat=query.message.chat.id,
        user=query.from_user.id,
    )
    value = json.loads(query.data)["value"]
    product_id = data["product_id"]
    resp = await client.decrement_leftover(product_id, value)
    await query.message.edit_text(
        (
            f"Товар: {resp.response.name}\n"
            f"Розничная цена: {resp.response.retail_price}₽\n"
            f"Оптовая цена: {resp.response.wholesale_price}₽\n"
            f"Остаток: {round_leftover(resp.response.leftover)} шт."
        ),
        reply_markup=manage_leftovers(is_float(resp.response.leftover)),
    )
    if resp.response.market_id:
        product = await user_vk.market.get_by_id(
            [f"-{os.getenv('VK_GROUP')}_{resp.response.market_id}"]
        )
        await user_vk.market.edit(
            -int(os.getenv("VK_GROUP")),
            resp.response.market_id,
            name=product.items[0].title,
            description=product.items[0].description,
            category_id=product.items[0].category.id,
            stock_amount=resp.response.leftover,
        )
    await query.answer(f"У продукта {resp.response.name} убрано {value} кг.")


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


@dp.callback_query_handler(CallbackFilter({"block": "update_post", "action": "init"}))
async def _update_post(query: types.CallbackQuery):
    vk_group = -int(os.getenv("VK_GROUP"))

    await query.message.edit_text("Удаление старого поста...")
    last_post = await user_vk.wall.get(vk_group, count=1)
    post_id = last_post.items[0].id
    await user_vk.wall.delete(vk_group, post_id)

    await query.message.edit_text("Генерация текста...")
    message_ = await generate_post_message()

    await query.message.edit_text("Публикация поста...")
    resp = await user_vk.wall.post(
        vk_group,
        message=message_,
        from_group=True,
        close_comments=True,
    )
    await user_vk.wall.pin(resp.post_id, vk_group)
    await query.message.edit_text("Пост обновлён!", reply_markup=main_menu_markup())


@dp.callback_query_handler(CallbackFilter({"block": "dialogs", "action": "init"}))
async def _dialogs(query: types.CallbackQuery):
    chats = await client.get_all_chats()
    await query.message.edit_text(
        "Активные чаты", reply_markup=await active_chats(vk, chats.response.items)
    )
    await query.answer()


@dp.callback_query_handler(CallbackFilter({"block": "dialogs", "action": "backward"}))
async def _dialogs_go_backward(query: types.CallbackQuery):
    page = json.loads(query.data)["page"]
    if page == 0:
        await query.answer("Уже выбрана первая страница!")
    else:
        chats = await client.get_all_chats(page)
        await query.message.edit_text(
            "Активные диалоги",
            reply_markup=await active_chats(vk, chats.response.items, page=page),
        )
        await query.answer()


@dp.callback_query_handler(CallbackFilter({"block": "dialogs", "action": "forward"}))
async def _dialogs_go_forward(query: types.CallbackQuery):
    page = json.loads(query.data)["page"]
    chats = await client.get_all_chats(page)
    if chats.response.items:
        await query.message.edit_text(
            "Активные диалоги",
            reply_markup=await active_chats(vk, chats.response.items, page),
        )
        await query.answer()
    else:
        await query.answer("Элементов больше нет")


@dp.callback_query_handler(CallbackFilter({"block": "dialogs", "action": "select"}))
async def _dialog_menu(query: types.CallbackQuery, state: FSMContext):
    chat_id = json.loads(query.data)["value"]
    chat = await client.get_chat_by_id(chat_id)
    user = (await vk.users.get([str(chat.response.vk_id)]))[0]
    full_name = f"{user.first_name} {user.last_name}"
    await state.set_data(
        data={
            "active_chat": chat.response.id,
        },
    )
    await query.message.edit_text(
        f"Диалог с {full_name}",
        reply_markup=dialog_menu(chat_id),
    )
    await query.answer()


@dp.callback_query_handler(CallbackFilter({"block": "dialogs", "action": "read"}))
async def _dialogs_show_history(query: types.CallbackQuery):
    chat_id = json.loads(query.data)["value"]
    chat = await client.get_chat_by_id(chat_id)
    await vk.messages.mark_as_read(
        mark_conversation_as_read=True,
        peer_id=chat.response.vk_id,
    )
    await vk.messages.mark_as_answered_conversation(
        peer_id=chat.response.vk_id,
        group_id=os.getenv("VK_GROUP"),
    )
    await query.answer("Диалог отмечен прочитанным")


@dp.callback_query_handler(
    CallbackFilter({"block": "dialogs", "action": "show_history"})
)
async def _dialogs_show_history(query: types.CallbackQuery):
    chat_id = json.loads(query.data)["value"]
    chat = await client.get_chat_by_id(chat_id)
    history = await vk.messages.get_history(user_id=chat.response.vk_id)
    messages = "\n".join(
        f"{'А' if item.out else 'К'}: {item.text}" for item in history.items
    )
    await query.message.edit_text(messages, reply_markup=back_to_dialog_menu(chat_id))
    await query.answer()


@dp.callback_query_handler(CallbackFilter({"block": "dialogs", "action": "write"}))
async def _dialogs_ask_message(query: types.CallbackQuery):
    await States.input_message.set()
    await query.message.edit_text("Введите текст сообщения")
    await query.answer()


@dp.message_handler(state=States.input_message)
async def _send_message_to_vk(message: types.Message, state: FSMContext):
    text = message.text
    data = await state.get_data()
    chat = await client.get_chat_by_id(data.get("active_chat"))
    await vk.messages.send(user_id=chat.response.vk_id, random_id=0, message=text)

    await message.delete()

    await state.finish()
    await message.answer(
        "Сообщение отправлено",
        reply_markup=back_to_dialog_menu(data.get("active_chat")),
    )


@dp.callback_query_handler(CallbackFilter({"block": "dialogs", "action": "disable"}))
async def _dialogs_disable(query: types.CallbackQuery):
    chat_id = json.loads(query.data)["value"]
    await client.disable_chat(chat_id)
    chats = await client.get_all_chats()
    await query.message.edit_text(
        "Чат отключен", reply_markup=await active_chats(vk, chats.response.items)
    )


@dp.callback_query_handler(CallbackFilter({"block": "list", "action": "init"}))
async def _show_list(query: types.CallbackQuery):
    await query.message.edit_text(
        await generate_post_message(), reply_markup=back_markup()
    )
    await query.answer()


if __name__ == "__main__":
    executor.start_polling(dp, skip_updates=True)
