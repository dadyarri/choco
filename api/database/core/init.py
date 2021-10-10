from database.core.utils import get_database_url

TORTOISE_ORM = {
    "connections": {"default": get_database_url()},
    "apps": {
        "models": {
            "models": [
                "api.database.models",
                "aerich.models",
            ],
        },
    },
}
