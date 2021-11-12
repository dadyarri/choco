-- upgrade --
CREATE TABLE IF NOT EXISTS "chat" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "vk_id" INT NOT NULL,
    "is_active" BOOL NOT NULL
);
CREATE TABLE IF NOT EXISTS "good" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "wholesale_price" INT NOT NULL,
    "retail_price" INT NOT NULL,
    "leftover" DOUBLE PRECISION NOT NULL,
    "market_id" INT
);
CREATE TABLE IF NOT EXISTS "aerich" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "version" VARCHAR(255) NOT NULL,
    "app" VARCHAR(20) NOT NULL,
    "content" JSONB NOT NULL
);
