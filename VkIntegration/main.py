from fastapi import FastAPI

app = FastAPI()


@app.get("/uploadImage")
async def upload_image():
    return {"message": "Hello World"}


@app.get("/updateLeftover")
async def update_leftover():
    return {"message": f""}
