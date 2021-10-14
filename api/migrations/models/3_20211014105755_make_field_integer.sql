-- upgrade --
ALTER TABLE "good" ALTER COLUMN "market_id" TYPE INT USING "market_id"::INT;
-- downgrade --
ALTER TABLE "good" ALTER COLUMN "market_id" TYPE VARCHAR(255) USING "market_id"::VARCHAR(255);
