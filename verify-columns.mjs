import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const sql = neon(process.env.DATABASE_URL);

async function verifyColumns() {
    try {
        console.log('Checking user table schema...\n');

        const result = await sql`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'user' 
            ORDER BY ordinal_position;
        `;

        console.log('Columns in "user" table:');
        console.table(result);

        // Check specifically for our new columns
        const bioExists = result.some(col => col.column_name === 'bio');
        const portfolioExists = result.some(col => col.column_name === 'portfolioUrl');
        const socialExists = result.some(col => col.column_name === 'socialLinks');

        console.log('\n✅ Verification:');
        console.log(`  bio: ${bioExists ? '✓' : '✗'}`);
        console.log(`  portfolioUrl: ${portfolioExists ? '✓' : '✗'}`);
        console.log(`  socialLinks: ${socialExists ? '✓' : '✗'}`);

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

verifyColumns();
