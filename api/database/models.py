from tortoise import fields, Model


class Good(Model):
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=255)
    wholesale_price = fields.IntField()
    retail_price = fields.IntField()
    leftover = fields.IntField()
    market_link = fields.CharField(max_length=255, null=True)
