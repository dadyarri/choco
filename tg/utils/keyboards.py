import json

from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton

from utils.client import Good


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
            callback_data=json.dumps({"block": "manage_dialogs", "action": "init"}),
        )
    )
    kb.add(
        InlineKeyboardButton(
            text="Обновить пост",
            callback_data=json.dumps({"block": "update_post", "action": "init"}),
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
