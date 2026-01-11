import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const sql = neon(process.env.DATABASE_URL);

async function addCreatorProfileColumns() {
    try {
        console.log('Adding creator profile columns to users table...');

        // Add bio column
        await sql`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "bio" TEXT`;
        console.log('✅ Added bio column');

        // Add portfolioUrl column
        await sql`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "portfolioUrl" TEXT`;
        console.log('✅ Added portfolioUrl column');

        // Add socialLinks column
        await sql`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "socialLinks" TEXT`;
        console.log('✅ Added socialLinks column');

        console.log('🎉 All creator profile columns added successfully!');
    } catch (error) {
        console.error('❌ Error adding columns:', error);
        process.exit(1);
    }
}

addCreatorProfileColumns();
