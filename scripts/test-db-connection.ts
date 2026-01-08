import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env" });

async function testConnection() {
    try {
        console.log("Testing database connection...");
        console.log("DATABASE_URL:", process.env.DATABASE_URL?.substring(0, 50) + "...");

        const sql = neon(process.env.DATABASE_URL!);

        const result = await sql`SELECT NOW() as current_time`;
        console.log("✓ Database connection successful!");
        console.log("Current database time:", result[0].current_time);

        // Test if templateReview table exists
        const tableCheck = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'templateReview'
    `;

        if (tableCheck.length > 0) {
            console.log("✓ templateReview table exists");
        } else {
            console.log("⚠ templateReview table does NOT exist");
        }

    } catch (error) {
        console.error("✗ Database connection failed:");
        console.error(error);
        process.exit(1);
    }
}

testConnection();
