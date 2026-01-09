-- Migration: Add translations column to webTemplate and htmlTemplate tables
-- Created: 2026-01-08
-- Purpose: Store multi-language translations for templates

-- Add translations column to webTemplate
ALTER TABLE "webTemplate" 
ADD COLUMN IF NOT EXISTS "translations" text;

-- Add translations column to htmlTemplate
ALTER TABLE "htmlTemplate" 
ADD COLUMN IF NOT EXISTS "translations" text;

-- Add comment to describe the column
COMMENT ON COLUMN "webTemplate"."translations" IS 'JSON: Multi-language translations { en: {...}, hi: {...}, es: {...}, ... }';
COMMENT ON COLUMN "htmlTemplate"."translations" IS 'JSON: Multi-language translations { en: {...}, hi: {...}, es: {...}, ... }';
