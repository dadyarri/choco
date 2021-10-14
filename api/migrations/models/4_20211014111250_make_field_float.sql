-- upgrade --
ALTER TABLE "good" ALTER COLUMN "leftover" TYPE DOUBLE PRECISION USING "leftover"::DOUBLE PRECISION;
-- downgrade --
ALTER TABLE "good" ALTER COLUMN "leftover" TYPE INT USING "leftover"::INT;
