-- Add userId column with a temporary default
ALTER TABLE "sessions" ADD COLUMN "userId" UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';

-- Set userId to the existing id (which was the old user FK)
UPDATE "sessions" SET "userId" = "id" WHERE "userId" = '00000000-0000-0000-0000-000000000000';

-- Remove the temporary default
ALTER TABLE "sessions" ALTER COLUMN "userId" DROP DEFAULT;