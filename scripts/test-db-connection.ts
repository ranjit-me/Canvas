import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../src/db/schema";

config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function main() {
    try {
        console.log("Testing database connection...");
        const allUsers = await db.select().from(schema.users).limit(1);
        console.log("Users found:", allUsers.length);

        console.log("Testing creatorApplications table...");
        const apps = await db.select().from(schema.creatorApplications).limit(1);
        console.log("Applications found:", apps.length);

        process.exit(0);
    } catch (error) {
        console.error("Database test failed:", error);
        process.exit(1);
    }
}

main();
