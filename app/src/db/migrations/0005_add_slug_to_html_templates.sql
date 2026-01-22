-- Migration: Add slug and isPublished to htmlTemplate table
-- Created: 2026-01-07

ALTER TABLE "htmlTemplate" ADD COLUMN "slug" TEXT;
ALTER TABLE "htmlTemplate" ADD COLUMN "isPublished" BOOLEAN DEFAULT false;

-- Add unique constraint to slug
ALTER TABLE "htmlTemplate" ADD CONSTRAINT "htmlTemplate_slug_unique" UNIQUE("slug");
