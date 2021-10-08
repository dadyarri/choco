from fastapi import FastAPI

app = FastAPI()


@app.get("/goods/")
async def get_all_goods():
    pass


@app.get("/goods/{goods_id}")
async def get_goods(goods_id: int):
    pass


@app.post("/goods/create")
async def create_goods(name: str, wholesale_price: int, retail_price: int, leftover: int):
    pass


@app.post("/goods/rename/{goods_id}")
async def rename_goods(goods_id: int, new_name: str):
    pass


@app.post("/goods/increment/{goods_id}")
async def increment_goods(goods_id: int):
    pass


@app.post("/goods/decrement/{goods_id}")
async def decrement_goods(goods_id: int):
    pass


@app.post("/goods/price/wholesale/set/{goods_id}")
async def set_wholesale_price(goods_id: int, new_price: int):
    pass


@app.post("/goods/price/retail/set/{goods_id}")
async def set_retail_price(goods_id: int, new_price: int):
    pass
