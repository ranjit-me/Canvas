import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";

config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL!);

async function main() {
    try {
        console.log("Adding missing column 'mobile' to 'creatorApplication' table...");
        await sql`ALTER TABLE "creatorApplication" ADD COLUMN IF NOT EXISTS "mobile" text NOT NULL DEFAULT '';`;
        console.log("Column 'mobile' added successfully!");

        console.log("Adding missing columns to 'user' table...");
        await sql`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "creatorStatus" text DEFAULT 'none';`;

        console.log("Adding missing columns to 'webTemplate' table...");
        await sql`ALTER TABLE "webTemplate" ADD COLUMN IF NOT EXISTS "categoryId" text;`;
        await sql`ALTER TABLE "webTemplate" ADD COLUMN IF NOT EXISTS "subcategoryId" text;`;
        await sql`ALTER TABLE "webTemplate" ADD COLUMN IF NOT EXISTS "translations" text;`;

        console.log("Database schema updated!");
        process.exit(0);
    } catch (error) {
        console.error("Schema update failed:", error);
        process.exit(1);
    }
}

main();
