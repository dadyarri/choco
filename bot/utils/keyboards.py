from vkbottle import Keyboard, Text, KeyboardButtonColor

from utils.core import shorten_name


def main_menu() -> str:
    kb = Keyboard()
    kb.add(
        Text(
            "Управлять остатками",
            payload={"block": "manage_leftovers", "action": "init"},
        ),
    )
    kb.add(
        Text(
            "Обновить пост",
            payload={"block": "update_post"},
        ),
    )
    return kb.get_json()


def list_goods(goods: list[dict], page: int) -> str:
    kb = Keyboard()
    kb.row()
    for good in goods:
        if len(kb.buttons[-1]) == 2:
            kb.row()
        if good["leftover"]:
            if len(good["name"]) > 40:
                name_ = shorten_name(good["name"])
            else:
                name_ = good["name"]
            kb.add(
                Text(
                    name_,
                    payload={
                        "block": "manage_leftovers",
                        "action": "select_good",
                        "id": good["id"],
                    },
                )
            )

    if kb.buttons[-1]:
        kb.row()

    kb.add(Text("<", {"block": "manage_leftovers", "action": "back", "page": page - 1}))
    kb.add(Text("Назад", payload={"block": "main_menu"}))
    kb.add(
        Text(">", {"block": "manage_leftovers", "action": "forward", "page": page + 1})
    )

    return kb.get_json()


def manage_leftovers():
    kb = Keyboard(inline=True)

    kb.add(
        Text("+", payload={"block": "manage_leftovers", "action": "plus"}),
        color=KeyboardButtonColor.POSITIVE,
    )
    kb.add(
        Text("-", payload={"block": "manage_leftovers", "action": "minus"}),
        color=KeyboardButtonColor.NEGATIVE,
    )

    return kb.get_json()
