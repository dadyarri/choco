from tortoise import fields, Model


class Good(Model):
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=255)
    wholesale_price = fields.IntField()
    retail_price = fields.IntField()
    leftover = fields.FloatField()
    market_id = fields.IntField(null=True)
    is_by_weight = fields.BooleanField(default=False)


class Chat(Model):
    id = fields.IntField(pk=True)
    vk_id = fields.IntField(unique=True)
    is_active = fields.BooleanField()


class OrderSource(Model):
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=255)


class OrderState(Model):
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=255)


class OrderCity(Model):
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=255)


class Order(Model):
    id = fields.IntField(pk=True)
    source = fields.ForeignKeyField('models.OrderSource', on_delete=fields.CASCADE)
    state = fields.ForeignKeyField('models.OrderState', on_delete=fields.CASCADE)
    city = fields.ForeignKeyField('models.OrderCity', on_delete=fields.CASCADE)


class OrderItems(Model):
    id = fields.IntField(pk=True)
    order_id = fields.ForeignKeyField('models.Order', on_delete=fields.CASCADE)
    good_id = fields.ForeignKeyField('models.Good', on_delete=fields.CASCADE)
    quantity = fields.IntField()
