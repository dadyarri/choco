from .utils import get_database_url

TORTOISE_ORM = {
    "connections": {"default": get_database_url()},
    "apps": {
        "models": {
            "models": [
                "database.models",
                "aerich.models",
            ],
        },
    },
}
