import json

from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton


def main_menu_markup():
    kb = InlineKeyboardMarkup()
    kb.add(
        InlineKeyboardButton(
            text="Остатки",
            callback_data=json.dumps({"block": "manage_leftovers", "action": "init"}),
        ),
    )
    kb.add(
        InlineKeyboardButton(
            text="Диалоги",
            callback_data=json.dumps({"block": "manage_dialogs", "action": "init"}),
        )
    )
    kb.row()
    kb.add(
        InlineKeyboardButton(
            text="Обновить пост",
            callback_data=json.dumps({"block": "update_post", "action": "init"}),
        )
    )

    return kb
