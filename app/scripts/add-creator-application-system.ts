import { config } from "dotenv";
import { neon } from '@neondatabase/serverless';

config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL!);

async function addCreatorApplicationSystem() {
    try {
        console.log('Starting creator application system migration...');

        // Add creatorStatus column to users table
        console.log('Adding creatorStatus column to users table...');
        await sql`
      ALTER TABLE "user" 
      ADD COLUMN IF NOT EXISTS "creatorStatus" TEXT DEFAULT 'none'
    `;
        console.log('✓ Added creatorStatus column');

        // Create creatorApplications table
        console.log('Creating creatorApplication table...');
        await sql`
      CREATE TABLE IF NOT EXISTS "creatorApplication" (
        "id" TEXT PRIMARY KEY,
        "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
        "fullName" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "country" TEXT NOT NULL,
        "state" TEXT NOT NULL,
        "qualification" TEXT NOT NULL,
        "resumeUrl" TEXT NOT NULL,
        "profilePhotoUrl" TEXT NOT NULL,
        "portfolioUrl" TEXT,
        "bio" TEXT,
        "specialization" TEXT,
        "status" TEXT NOT NULL DEFAULT 'pending',
        "adminNotes" TEXT,
        "submittedAt" TIMESTAMP NOT NULL,
        "reviewedAt" TIMESTAMP,
        "reviewedBy" TEXT REFERENCES "user"("id")
      )
    `;
        console.log('✓ Created creatorApplication table');

        // Create index for faster queries
        console.log('Creating indexes...');
        await sql`
      CREATE INDEX IF NOT EXISTS idx_creator_app_user 
      ON "creatorApplication"("userId")
    `;
        await sql`
      CREATE INDEX IF NOT EXISTS idx_creator_app_status 
      ON "creatorApplication"("status")
    `;
        await sql`
      CREATE INDEX IF NOT EXISTS idx_user_creator_status 
      ON "user"("creatorStatus")
    `;
        console.log('✓ Created indexes');

        console.log('Migration completed successfully! ✅');
    } catch (error) {
        console.error('Migration failed:', error);
        throw error;
    }
}

// Run the migration
addCreatorApplicationSystem()
    .then(() => {
        console.log('All done!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('Failed:', err);
        process.exit(1);
    });
