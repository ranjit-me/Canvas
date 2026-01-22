-- Create promotional banners table
CREATE TABLE IF NOT EXISTS "promotionalBanner" (
  "id" text PRIMARY KEY NOT NULL,
  "title" text NOT NULL,
  "subtitle" text,
  "price" text,
  "imageUrl" text NOT NULL,
  "linkUrl" text NOT NULL,
  "backgroundColor" text DEFAULT '#4F46E5',
  "isActive" boolean DEFAULT true,
  "displayOrder" integer DEFAULT 0,
  "createdAt" timestamp NOT NULL,
  "updatedAt" timestamp NOT NULL
);

-- Insert sample banner for testing
INSERT INTO "promotionalBanner" (
  "id",
  "title",
  "subtitle",
  "price",
  "imageUrl",
  "linkUrl",
  "backgroundColor",
  "isActive",
  "displayOrder",
  "createdAt",
  "updatedAt"
) VALUES (
  'sample-banner-1',
  'Office Chairs',
  'Green Soul, Cell Bell & more',
  'From ₹2,999',
  'https://via.placeholder.com/400x300?text=Office+Chairs',
  '/web/birthday',
  '#4F46E5',
  true,
  1,
  NOW(),
  NOW()
) ON CONFLICT ("id") DO NOTHING;
