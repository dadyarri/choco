from tortoise import fields, Model


class Good(Model):
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=255)
    wholesale_price = fields.IntField()
    retail_price = fields.IntField()
    leftover = fields.FloatField()
    market_id = fields.IntField(null=True)


class Chat(Model):
    id = fields.IntField(pk=True)
    vk_id = fields.IntField(unique=True)
    is_active = fields.BooleanField()
