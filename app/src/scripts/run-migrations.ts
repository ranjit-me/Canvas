// Script to run SQL migrations
import { neon } from "@neondatabase/serverless";
import * as fs from "fs";
import * as path from "path";
import { config } from "dotenv";

config({ path: ".env.local" });

async function runMigrations() {
    const sql = neon(process.env.DATABASE_URL!);

    console.log("🚀 Starting migrations...");

    try {
        // Run categories migration
        console.log("📦 Creating categories and subcategories tables...");
        const categoriesSql = fs.readFileSync(
            path.join(__dirname, "../drizzle/0003_create_categories.sql"),
            "utf8"
        );
        await sql(categoriesSql as any);
        console.log("✅ Categories tables created");

        // Run seed data
        console.log("🌱 Seeding categories and subcategories...");
        const seedSql = fs.readFileSync(
            path.join(__dirname, "../drizzle/0004_seed_categories.sql"),
            "utf8"
        );
        await sql(seedSql as any);
        console.log("✅ Categories seeded");

        console.log("🎉 All migrations completed successfully!");
    } catch (error) {
        console.error("❌ Migration failed:", error);
        process.exit(1);
    }
}

runMigrations();
