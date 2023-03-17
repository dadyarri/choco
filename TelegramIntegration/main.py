import os

from fastapi import FastAPI
from aiogram import Bot

from request_bodies.send_messages_request_body import SendMessagesRequestBody

app = FastAPI()
bot = Bot(os.getenv("TELEGRAM_BOT_TOKEN"))


@app.get("/ping")
async def ping():
    return {"message": "pong"}


@app.post("/sendMessages")
async def root(body: SendMessagesRequestBody):
    for userId in body.user_ids:
        await bot.send_message(chat_id=userId, text=body.message)

    return {"message": "message was sent successfully"}

