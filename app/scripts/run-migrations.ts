import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { migrate } from "drizzle-orm/neon-http/migrator";
import path from "path";

config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function main() {
    try {
        console.log("Running migrations...");
        await migrate(db, { migrationsFolder: path.join(__dirname, "../drizzle") });
        console.log("Migrations completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}

main();
