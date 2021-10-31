import logging
import os
import re

from aiogram import Bot, Dispatcher, executor, types
from aiogram.dispatcher.filters import Command
from vkbottle import API

from utils.core import get_tg_token
from utils.filters import IsAdmin

logging.basicConfig(level=logging.INFO)

bot = Bot(token=get_tg_token())
vk = API(os.getenv("VK_TOKEN"))
dp = Dispatcher(bot)


def extract_chat_id(msg: str) -> int:
    return int(re.search(r"\?sel=(\d+)", msg)[1])


@dp.message_handler(Command("start", prefixes="!/"), IsAdmin(True))
async def _main_menu(message: types.Message):
    await message.answer("Добро пожаловать")


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


if __name__ == "__main__":
    executor.start_polling(dp, skip_updates=True)
