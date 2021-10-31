import json
import os
import typing

from aiogram import types
from aiogram.dispatcher.filters import AbstractFilter


class IsAdmin(AbstractFilter):

    admin_ids = map(int, os.getenv("SEND_IDS").split(","))

    def __init__(self, is_admin):
        self.is_admin = is_admin

    @classmethod
    def validate(
        cls, full_config: typing.Dict[str, typing.Any]
    ) -> typing.Optional[typing.Dict[str, typing.Any]]:
        pass

    async def check(self, message: types.Message):
        return (message.from_user.id in self.admin_ids) == self.is_admin


class CallbackFilter(AbstractFilter):
    def __init__(self, data: dict):
        self.callback_data = data

    @classmethod
    def validate(
        cls, full_config: typing.Dict[str, typing.Any]
    ) -> typing.Optional[typing.Dict[str, typing.Any]]:
        pass

    async def check(self, query: types.CallbackQuery) -> bool:
        return all(
            json.loads(query.data).get(k) == v for k, v in self.callback_data.items()
        )
