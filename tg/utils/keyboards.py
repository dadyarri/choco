import json

from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton
from vkbottle import API

from utils.client import Good
from utils.client.models import Chat


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
            callback_data=json.dumps({"block": "leftovers", "action": "init"}),
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
            text="Обновить пост",
            callback_data=json.dumps({"block": "update_post", "action": "init"}),
        )
    )
    kb.insert(
        InlineKeyboardButton(
            text="Список",
            callback_data=json.dumps({"block": "list", "action": "init"}),
        )
    )

    return kb


def list_goods(goods: list[Good], page: int):
    buttons = [[]]
    for good in goods:
        if len(buttons[-1]) == 2:
            buttons.append([])

        buttons[-1].append(
            InlineKeyboardButton(
                text=good.name,
                callback_data=json.dumps(
                    {
                        "block": "leftovers",
                        "action": "select_product",
                        "value": good.id,
                    }
                ),
            )
        )

    if buttons[-1]:
        buttons.append([])

    backward = InlineKeyboardButton(
        text="<",
        callback_data=json.dumps(
            {"block": "leftovers", "action": "backward", "page": page - 1}
        ),
    )
    back = InlineKeyboardButton(
        text="Назад", callback_data=json.dumps({"block": "main_menu"})
    )
    forward = InlineKeyboardButton(
        text=">",
        callback_data=json.dumps(
            {"block": "leftovers", "action": "forward", "page": page + 1}
        ),
    )
    buttons[-1].extend([backward, back, forward])

    return InlineKeyboardMarkup(inline_keyboard=buttons)


def manage_leftovers(is_float: bool):
    buttons = [[]]

    buttons[-1].extend(
        [
            InlineKeyboardButton(
                "+",
                callback_data=json.dumps(
                    {"block": "leftovers", "action": "plus", "value": 1}
                ),
            ),
            InlineKeyboardButton(
                "-",
                callback_data=json.dumps(
                    {"block": "leftovers", "action": "minus", "value": 1}
                ),
            ),
        ]
    )

    if is_float:
        buttons.append([])
        buttons[-1].extend(
            [
                InlineKeyboardButton(
                    "-0.3",
                    callback_data=json.dumps(
                        {"block": "leftovers", "action": "minus", "value": 0.3}
                    ),
                ),
                InlineKeyboardButton(
                    "-0.8",
                    callback_data=json.dumps(
                        {"block": "leftovers", "action": "minus", "value": 0.8}
                    ),
                ),
            ]
        )

    buttons.append([])
    buttons[-1].append(
        InlineKeyboardButton(
            "Назад", callback_data=json.dumps({"block": "leftovers", "action": "init"})
        )
    )

    return InlineKeyboardMarkup(inline_keyboard=buttons)


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
