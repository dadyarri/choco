-- upgrade --
ALTER TABLE "good" RENAME COLUMN "market_link" TO "market_id";
-- downgrade --
ALTER TABLE "good" RENAME COLUMN "market_id" TO "market_link";
