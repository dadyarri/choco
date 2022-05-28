import json

from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton
from vkbottle import API

from client.models import Good, Chat

from utils.core import abbreviate_name


def back_markup():
    kb = InlineKeyboardMarkup()
    kb.insert(
        InlineKeyboardButton(
            text="Назад", callback_data=json.dumps({"block": "main_menu"})
        )
    )

    return kb


def main_menu_markup():
    kb = InlineKeyboardMarkup()
    kb.insert(
        InlineKeyboardButton(
            text="Остатки",
            switch_inline_query_current_chat="",
        ),
    )
    kb.insert(
        InlineKeyboardButton(
            text="Диалоги",
            callback_data=json.dumps({"block": "dialogs", "action": "init"}),
        )
    )
    kb.add(
        InlineKeyboardButton(
            text="Обновить",
            callback_data=json.dumps({"block": "update", "action": "init"}),
        )
    )
    kb.insert(
        InlineKeyboardButton(
            text="Список",
            callback_data=json.dumps({"block": "list", "action": "init"}),
        )
    )

    return kb


def manage_leftovers(is_float: bool, item_id: int):
    kb = InlineKeyboardMarkup()
    kb.add(
        InlineKeyboardButton(
            "+",
            callback_data=json.dumps({"b": "lo", "a": "p", "v": 1, "id": item_id}),
        ),
        InlineKeyboardButton(
            "-",
            callback_data=json.dumps({"b": "lo", "a": "m", "v": 1, "id": item_id}),
        ),
    )
    if is_float:
        kb.row()
        kb.insert(
            InlineKeyboardButton(
                "-0.3",
                callback_data=json.dumps(
                    {
                        "b": "lo",
                        "a": "m",
                        "v": 0.3,
                        "id": item_id,
                    }
                ),
            ),
        )
        kb.insert(
            InlineKeyboardButton(
                "-0.4",
                callback_data=json.dumps(
                    {
                        "b": "lo",
                        "a": "m",
                        "v": 0.4,
                        "id": item_id,
                    }
                ),
            ),
        )
        kb.insert(
            InlineKeyboardButton(
                "-0.5",
                callback_data=json.dumps(
                    {
                        "b": "lo",
                        "a": "m",
                        "v": 0.5,
                        "id": item_id,
                    }
                ),
            ),
        )
        kb.row()
        kb.insert(
            InlineKeyboardButton(
                "-0.6",
                callback_data=json.dumps(
                    {
                        "b": "lo",
                        "a": "m",
                        "v": 0.6,
                        "id": item_id,
                    }
                ),
            ),
        )
        kb.insert(
            InlineKeyboardButton(
                "-0.8",
                callback_data=json.dumps(
                    {
                        "b": "lo",
                        "a": "m",
                        "v": 0.8,
                        "id": item_id,
                    }
                ),
            ),
        )

    return kb


async def active_chats(api: API, chats: list[Chat], page: int = 0):
    buttons = [[]]
    for chat in chats:
        if len(buttons[-1]) == 2:
            buttons.append([])
        if chat.is_active:
            user = (await api.users.get([str(chat.vk_id)]))[0]
            full_name = f"{user.first_name} {user.last_name}"
            buttons[-1].append(
                InlineKeyboardButton(
                    full_name,
                    callback_data=json.dumps(
                        {
                            "block": "dialogs",
                            "action": "select",
                            "value": chat.id,
                        }
                    ),
                )
            )

    if buttons[-1]:
        buttons.append([])

    backward = InlineKeyboardButton(
        text="<",
        callback_data=json.dumps(
            {"block": "dialogs", "action": "backward", "page": page - 1}
        ),
    )
    back = InlineKeyboardButton(
        text="Назад", callback_data=json.dumps({"block": "main_menu"})
    )
    forward = InlineKeyboardButton(
        text=">",
        callback_data=json.dumps(
            {"block": "dialogs", "action": "forward", "page": page + 1}
        ),
    )
    buttons[-1].extend([backward, back, forward])

    return InlineKeyboardMarkup(inline_keyboard=buttons)


def dialog_menu(chat_id: int):
    buttons = [[]]
    history = InlineKeyboardButton(
        "Показать историю",
        callback_data=json.dumps(
            {
                "block": "dialogs",
                "action": "show_history",
                "value": chat_id,
            },
        ),
    )
    write = InlineKeyboardButton(
        "Написать",
        callback_data=json.dumps(
            {
                "block": "dialogs",
                "action": "write",
                "value": chat_id,
            },
        ),
    )
    buttons[-1].extend([history, write])
    buttons.append([])

    disable = InlineKeyboardButton(
        "Отключить",
        callback_data=json.dumps(
            {
                "block": "dialogs",
                "action": "disable",
                "value": chat_id,
            },
        ),
    )

    read = InlineKeyboardButton(
        "Прочитать",
        callback_data=json.dumps(
            {
                "block": "dialogs",
                "action": "read",
                "value": chat_id,
            },
        ),
    )

    buttons[-1].extend([disable, read])

    buttons.append([])
    back = InlineKeyboardButton(
        text="Назад", callback_data=json.dumps({"block": "dialogs", "action": "init"})
    )
    buttons[-1].append(back)

    return InlineKeyboardMarkup(inline_keyboard=buttons)


def back_to_dialog_menu(chat_id: int):
    buttons = [[]]
    back = InlineKeyboardButton(
        text="Назад",
        callback_data=json.dumps(
            {
                "block": "dialogs",
                "action": "select",
                "value": chat_id,
            },
        ),
    )
    buttons[-1].append(back)
    return InlineKeyboardMarkup(inline_keyboard=buttons)
