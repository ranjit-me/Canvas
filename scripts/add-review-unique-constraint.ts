import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env" });

async function cleanupDuplicatesAndAddConstraint() {
    try {
        console.log("Cleaning up duplicate reviews...");

        const sql = neon(process.env.DATABASE_URL!);

        // Find duplicate reviews (same userId and templateId)
        const duplicates = await sql`
      SELECT "userId", "templateId", COUNT(*) as count
      FROM "templateReview"
      GROUP BY "userId", "templateId"
      HAVING COUNT(*) > 1
    `;

        if (duplicates.length > 0) {
            console.log(`Found ${duplicates.length} users with duplicate reviews`);

            for (const dup of duplicates) {
                console.log(`  Cleaning up duplicates for user ${dup.userId} on template ${dup.templateId}`);

                // Keep only the most recent review, delete others
                await sql`
          DELETE FROM "templateReview"
          WHERE id IN (
            SELECT id
            FROM "templateReview"
            WHERE "userId" = ${dup.userId}
            AND "templateId" = ${dup.templateId}
            ORDER BY "createdAt" DESC
            OFFSET 1
          )
        `;
            }

            console.log("✓ Duplicates cleaned up successfully");
        } else {
            console.log("✓ No duplicate reviews found");
        }

        // Now add the unique constraint
        const constraintCheck = await sql`
      SELECT constraint_name 
      FROM information_schema.table_constraints 
      WHERE table_name = 'templateReview' 
      AND constraint_name = 'unique_user_template_review'
    `;

        if (constraintCheck.length > 0) {
            console.log("✓ Unique constraint already exists");
        } else {
            await sql`
        ALTER TABLE "templateReview" 
        ADD CONSTRAINT unique_user_template_review 
        UNIQUE ("userId", "templateId")
      `;
            console.log("✓ Successfully added unique constraint: unique_user_template_review");
        }

        console.log("\n✓ Database migration complete!");

    } catch (error) {
        console.error("✗ Migration failed:");
        console.error(error);
        process.exit(1);
    }
}

cleanupDuplicatesAndAddConstraint();
