-- Create HTML Templates table
CREATE TABLE IF NOT EXISTS "htmlTemplate" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "description" text,
  "htmlCode" text NOT NULL,
  "cssCode" text,
  "jsCode" text,
  "creatorId" text NOT NULL,
  "category" text NOT NULL,
  "thumbnail" text,
  "price" integer DEFAULT 0,
  "pricingByCountry" text,
  "status" text DEFAULT 'draft',
  "isActive" boolean DEFAULT false,
  "isFree" boolean DEFAULT false,
  "editableFields" text,
  "createdAt" timestamp NOT NULL,
  "updatedAt" timestamp NOT NULL,
  CONSTRAINT "htmlTemplate_creatorId_user_id_fk" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE CASCADE
);

-- Create Template Assets table
CREATE TABLE IF NOT EXISTS "templateAsset" (
  "id" text PRIMARY KEY NOT NULL,
  "templateId" text NOT NULL,
  "fileName" text NOT NULL,
  "fileUrl" text NOT NULL,
  "fileType" text NOT NULL,
  "fileSize" integer,
  "elementId" text,
  "createdAt" timestamp NOT NULL,
  CONSTRAINT "templateAsset_templateId_htmlTemplate_id_fk" FOREIGN KEY ("templateId") REFERENCES "htmlTemplate"("id") ON DELETE CASCADE
);

-- Create Template Customizations table
CREATE TABLE IF NOT EXISTS "templateCustomization" (
  "id" text PRIMARY KEY NOT NULL,
  "templateId" text NOT NULL,
  "userId" text NOT NULL,
  "customData" text NOT NULL,
  "customAssets" text,
  "slug" text UNIQUE,
  "isPublished" boolean DEFAULT false,
  "createdAt" timestamp NOT NULL,
  "updatedAt" timestamp NOT NULL,
  CONSTRAINT "templateCustomization_templateId_htmlTemplate_id_fk" FOREIGN KEY ("templateId") REFERENCES "htmlTemplate"("id") ON DELETE CASCADE,
  CONSTRAINT "templateCustomization_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "htmlTemplate_creatorId_idx" ON "htmlTemplate"("creatorId");
CREATE INDEX IF NOT EXISTS "htmlTemplate_status_idx" ON "htmlTemplate"("status");
CREATE INDEX IF NOT EXISTS "htmlTemplate_category_idx" ON "htmlTemplate"("category");
CREATE INDEX IF NOT EXISTS "templateAsset_templateId_idx" ON "templateAsset"("templateId");
CREATE INDEX IF NOT EXISTS "templateCustomization_templateId_idx" ON "templateCustomization"("templateId");
CREATE INDEX IF NOT EXISTS "templateCustomization_userId_idx" ON "templateCustomization"("userId");
