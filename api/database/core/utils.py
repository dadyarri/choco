import logging
import os


def get_database_url():
    """
    Получает URL базы данных.

    Returns:
        str: URL базы данных
    """
    return os.getenv("DATABASE_URL")
