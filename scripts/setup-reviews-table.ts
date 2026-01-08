import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL!);

async function setupReviewsTable() {
    try {
        console.log("Checking if templateReview table exists...");

        // Check if table exists
        const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'templateReview'
      );
    `;

        if (tableExists[0].exists) {
            console.log("✓ templateReview table already exists!");
            return;
        }

        console.log("Creating templateReview table...");

        // Create the table
        await sql`
      CREATE TABLE "templateReview" (
        "id" text PRIMARY KEY NOT NULL,
        "templateId" text NOT NULL REFERENCES "webTemplate"("id") ON DELETE CASCADE,
        "userId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
        "userName" text NOT NULL,
        "userEmail" text NOT NULL,
        "rating" integer NOT NULL,
        "reviewText" text,
        "createdAt" timestamp NOT NULL,
        "updatedAt" timestamp NOT NULL
      );
    `;

        // Create indexes
        await sql`CREATE INDEX "templateReview_templateId_idx" ON "templateReview"("templateId");`;
        await sql`CREATE INDEX "templateReview_userId_idx" ON "templateReview"("userId");`;
        await sql`CREATE INDEX "templateReview_createdAt_idx" ON "templateReview"("createdAt");`;

        console.log("✓ templateReview table created successfully!");
    } catch (error) {
        console.error(" Migration failed:", error);
        process.exit(1);
    }
}

setupReviewsTable();
