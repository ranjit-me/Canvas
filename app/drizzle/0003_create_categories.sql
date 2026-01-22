-- Create categories table
CREATE TABLE IF NOT EXISTS "category" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "name" TEXT NOT NULL UNIQUE,
  "description" TEXT,
  "icon" TEXT,
  "displayOrder" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP NOT NULL
);

-- Create subcategories table
CREATE TABLE IF NOT EXISTS "subcategory" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "categoryId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "icon" TEXT,
  "displayOrder" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP NOT NULL,
  CONSTRAINT "subcategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE
);

-- Add category columns to webTemplate table
ALTER TABLE "webTemplate" ADD COLUMN IF NOT EXISTS "categoryId" TEXT;
ALTER TABLE "webTemplate" ADD COLUMN IF NOT EXISTS "subcategoryId" TEXT;
ALTER TABLE "webTemplate" ADD CONSTRAINT "webTemplate_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id");
ALTER TABLE "webTemplate" ADD CONSTRAINT "webTemplate_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "subcategory"("id");

-- Add category columns to htmlTemplate table
ALTER TABLE "htmlTemplate" ADD COLUMN IF NOT EXISTS "categoryId" TEXT;
ALTER TABLE "htmlTemplate" ADD COLUMN IF NOT EXISTS "subcategoryId" TEXT;
ALTER TABLE "htmlTemplate" ADD CONSTRAINT "htmlTemplate_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id");
ALTER TABLE "htmlTemplate" ADD CONSTRAINT "htmlTemplate_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "subcategory"("id");
