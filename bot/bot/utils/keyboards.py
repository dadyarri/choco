from vkbottle import Keyboard, Text


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
