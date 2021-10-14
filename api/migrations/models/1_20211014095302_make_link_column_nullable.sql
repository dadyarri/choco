-- upgrade --
ALTER TABLE "good" ADD "market_link" VARCHAR(255);
-- downgrade --
ALTER TABLE "good" DROP COLUMN "market_link";
