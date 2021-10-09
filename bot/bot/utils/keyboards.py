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


def list_goods(goods: list[dict]) -> str:
    kb = Keyboard()
    for good in goods:
        kb.add(Text(good["name"], payload={"goods_id": good["id"]}))

        if len(kb.buttons[-1]) == 2:
            kb.row()

    return kb.get_json()
