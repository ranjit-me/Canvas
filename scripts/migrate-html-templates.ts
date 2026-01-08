import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
config({ path: ".env" });

if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL not found in environment variables");
    process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function migrate() {
    console.log("Starting migration...");

    try {
        // Create HTML Templates table
        await sql`
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
      )
    `;
        console.log("✓ Created htmlTemplate table");

        // Create Template Assets table
        await sql`
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
      )
    `;
        console.log("✓ Created templateAsset table");

        // Create Template Customizations table
        await sql`
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
      )
    `;
        console.log("✓ Created templateCustomization table");

        // Create indexes
        await sql`CREATE INDEX IF NOT EXISTS "htmlTemplate_creatorId_idx" ON "htmlTemplate"("creatorId")`;
        await sql`CREATE INDEX IF NOT EXISTS "htmlTemplate_status_idx" ON "htmlTemplate"("status")`;
        await sql`CREATE INDEX IF NOT EXISTS "htmlTemplate_category_idx" ON "htmlTemplate"("category")`;
        await sql`CREATE INDEX IF NOT EXISTS "templateAsset_templateId_idx" ON "templateAsset"("templateId")`;
        await sql`CREATE INDEX IF NOT EXISTS "templateCustomization_templateId_idx" ON "templateCustomization"("templateId")`;
        await sql`CREATE INDEX IF NOT EXISTS "templateCustomization_userId_idx" ON "templateCustomization"("userId")`;
        console.log("✓ Created indexes");

        console.log("\n✅ Migration completed successfully!");
    } catch (error) {
        console.error("❌ Migration failed:", error);
        process.exit(1);
    }
}

migrate();
