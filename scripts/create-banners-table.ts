import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

// Load environment variables
config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL!);

async function createBannersTable() {
    try {
        console.log("Creating promotional banners table...");

        // Create table
        await sql`
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
      )
    `;

        console.log("✅ Table created successfully!");

        // Insert sample banner
        console.log("Inserting sample banner...");

        await sql`
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
        'Birthday Templates',
        'Create beautiful celebration websites',
        'Starting from ₹299',
        'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800',
        '/web/birthday',
        '#4F46E5',
        true,
        1,
        NOW(),
        NOW()
      ) ON CONFLICT ("id") DO NOTHING
    `;

        console.log("✅ Sample banner inserted!");
        console.log("\n🎉 Migration completed successfully!");

    } catch (error) {
        console.error("❌ Migration failed:", error);
        process.exit(1);
    }
}

createBannersTable();
