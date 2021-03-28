from pony import orm

db = orm.Database()


class Taste(db.Entity):
    code = orm.Required(int)
    price = orm.Required(int)


class Leftover(db.Entity):
    taste = orm.Required(Taste)
    amount = orm.Required(int)


class Admin(db.Entity):
    vk_id = orm.Required(int)


db.bind(
    provider="postgres",
    user="dadyarri",
    password="mjro10011",
    host="localhost",
    database="choco",
)

db.generate_mapping(create_tables=True)
