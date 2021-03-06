import asyncio
import json
import logging
import os

from aiogram import Bot, Dispatcher, executor, types
from aiogram.contrib.fsm_storage.memory import MemoryStorage
from aiogram.dispatcher import FSMContext
from aiogram.dispatcher.filters import CommandStart, Command
from aiogram.dispatcher.filters.filters import AndFilter, OrFilter
from aiogram.dispatcher.filters.state import StatesGroup, State
from client import ChocoManagerClient
from thefuzz import process
from vkbottle import API, VKAPIError

from utils.core import get_tg_token, round_leftover, generate_post_message
from utils.filters import IsAdmin, CallbackFilter
from utils.keyboards import (
    main_menu_markup,
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


@dp.inline_handler()
async def _search_goods(query: types.InlineQuery):
    text = query.query or ""
    logging.debug(f"Inline query: {text}")
    goods = await client.get_all_goods()
    choices = [g.name for g in goods.response.items]
    logging.debug(f"{choices=}")
    search_results = process.extract(text, choices, limit=5)
    logging.debug(f"{search_results=}")
    items = []
    for result in search_results:
        item = next(
            filter(
                lambda y: y.name == result[0] and y.id not in [i.id for i in items],
                goods.response.items,
            ),
            None,
        )
        desc = f"Цена: {item.retail_price}/{item.wholesale_price}₽\nОстаток: {round_leftover(item.leftover)} шт."
        if item:
            items.append(
                types.InlineQueryResultArticle(
                    id=item.id,
                    title=result[0],
                    description=desc,
                    input_message_content=types.InputTextMessageContent(
                        f"<b>{item.name}</b>\n{desc}",
                        parse_mode="html",
                    ),
                    reply_markup=manage_leftovers(item.is_by_weight, item.id),
                ),
            )

    await query.answer(results=items, cache_time=10)


@dp.callback_query_handler(CallbackFilter({"b": "lo", "a": "p"}))
async def _manage_leftovers_plus(query: types.CallbackQuery):
    payload = json.loads(query.data)
    value = payload["v"]
    product_id = payload["id"]
    resp = await client.increment_leftover(product_id, value)
    if resp.response.market_id:
        await user_vk.market.edit(
            -int(os.getenv("VK_GROUP")),
            resp.response.market_id,
            stock_amount=resp.response.leftover,
        )
    await query.answer(f"Продукту {resp.response.name} добавлено {value} кг.")


@dp.callback_query_handler(CallbackFilter({"b": "lo", "a": "m"}))
async def _manage_leftovers_minus(query: types.CallbackQuery):
    payload = json.loads(query.data)
    value = payload["v"]
    product_id = payload["id"]
    resp = await client.decrement_leftover(product_id, value)
    if resp.response.market_id:
        await user_vk.market.edit(
            -int(os.getenv("VK_GROUP")),
            resp.response.market_id,
            stock_amount=resp.response.leftover,
        )
    await query.answer(f"У продукта {resp.response.name} убрано {value} кг.")


@dp.callback_query_handler(CallbackFilter({"block": "update", "action": "init"}))
async def _update_post(query: types.CallbackQuery):
    vk_group = -int(os.getenv("VK_GROUP"))

    await query.message.edit_text("Удаление старого поста...")
    last_post = await user_vk.wall.get(vk_group, count=1)
    post_id = last_post.items[0].id
    await user_vk.wall.delete(vk_group, post_id)

    await query.message.edit_text("Генерация текста...")
    message_ = await generate_post_message(True)

    await query.message.edit_text("Публикация поста...")
    resp = await user_vk.wall.post(
        vk_group,
        message=message_,
        from_group=True,
        close_comments=True,
    )
    post_id = resp.post_id
    await user_vk.wall.pin(post_id, vk_group)

    resp = await client.get_all_goods()
    goods = [good for good in resp.response.items if good.market_id]
    amount_of_goods = len(goods)
    processed = 0
    await query.message.edit_text(
        f"Синхронизация остатков... [{processed}/{amount_of_goods}]"
    )
    for item in goods:
        try:
            await user_vk.market.edit(
                -int(os.getenv("VK_GROUP")),
                item.market_id,
                stock_amount=round(item.leftover),
            )
        except VKAPIError as e:
            logging.error(f"VK API Error [{e.code}]: {e.description}")
        processed += 1
        await query.message.edit_text(
            f"Синхронизация остатков... [{processed}/{amount_of_goods}]"
        )
        await asyncio.sleep(0.333333)

    await query.message.edit_text(
        f"Обновлено!\nСсылка на пост: https://vk.com/public{os.getenv('VK_GROUP')}?w=wall{vk_group}_{post_id}",
        reply_markup=main_menu_markup(),
    )


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
    await query.message.edit_text("Введите текст сообщения\n/cancel для отмены")
    await query.answer()


@dp.message_handler(state=States.input_message, commands=["cancel"])
async def _cancel_send_message_to_vk(message: types.Message, state: FSMContext):
    data = await state.get_data()
    await state.finish()
    await message.answer(
        "Отправка отменена", reply_markup=dialog_menu(data.get("active_chat"))
    )


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
        await generate_post_message(False), reply_markup=back_markup()
    )
    await query.answer()


if __name__ == "__main__":
    executor.start_polling(dp, skip_updates=True)
