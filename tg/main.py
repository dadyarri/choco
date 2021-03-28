import logging
import os
import re

from aiogram import Bot, Dispatcher, executor, types
from vkwave_api import API


logging.basicConfig(level=logging.INFO)

bot = Bot(token=os.getenv("TG_TOKEN"))
vk_api = API(os.getenv("VK_TOKEN"))
vk = vk_api.get_api()
dp = Dispatcher(bot)


def extract_chat_id(msg: str) -> int:
    return int(re.search(r"\?sel=(\d+)", msg)[1])


@dp.message_handler()
async def _resender(message: types.Message):

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
