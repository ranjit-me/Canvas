import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";

config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL!);

async function runMigration() {
    console.log("🔄 Running migration: Adding translations column...\n");

    try {
        // Add translations column to webTemplate
        await sql`
      ALTER TABLE "webTemplate" 
      ADD COLUMN IF NOT EXISTS "translations" text
    `;
        console.log("✅ Added translations column to webTemplate table");

        // Add translations column to htmlTemplate
        await sql`
      ALTER TABLE "htmlTemplate" 
      ADD COLUMN IF NOT EXISTS "translations" text
    `;
        console.log("✅ Added translations column to htmlTemplate table");

        console.log("\n🎉 Migration completed successfully!");
        console.log("\nYou can now:");
        console.log("- Create templates with auto-translation");
        console.log("- Set up Google Cloud Translation API (see TRANSLATION_SETUP.md)");

    } catch (error) {
        console.error("❌ Migration failed:", error);
        process.exit(1);
    }
}

runMigration();
