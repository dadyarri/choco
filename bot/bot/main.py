import logging

from vkbottle import Bot, OrFilter
from vkbottle.bot import Message
from vkbottle.dispatch.rules.bot import VBMLRule

from bot.utils import keyboards
from bot.utils.core import get_vk_token, get_admins_ids
from bot.utils.rules import EventPayloadContainsRule

logging.basicConfig(level="DEBUG")

bot = Bot(token=get_vk_token())
bot.labeler.vbml_ignore_case = True
vbml_rule = VBMLRule.with_config(
    bot.labeler.rule_config,
)  # FIXME: temporary fix, bug in vkbottle


@bot.on.message(
    OrFilter(
        vbml_rule(["привет", "начать", "hello", "hi"]),
        EventPayloadContainsRule({"block": "main_menu"}),
    ),
)
async def greeting(message: Message):
    if message.from_id in get_admins_ids():
        await message.answer("Добро пожаловать", keyboard=keyboards.main_menu())
    else:
        await message.answer(
            "Этот бот не имеет пользовательского интерфейса. Для заказа воспользуйтесь вкладкой Товары"
        )


if __name__ == "__main__":
    bot.run_forever()
