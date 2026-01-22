-- Migration to add secondaryImage column to htmlTemplate table
-- Run this on your database: psql $DATABASE_URL < fix-secondary-image.sql

ALTER TABLE "htmlTemplate" ADD COLUMN IF NOT EXISTS "secondaryImage" TEXT;

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'htmlTemplate' 
ORDER BY ordinal_position;
