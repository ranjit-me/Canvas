import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: '.env' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function runMigration() {
    const client = await pool.connect();

    try {
        const migrationPath = path.join(process.cwd(), 'drizzle', '0007_thankful_the_stranger.sql');
        const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

        // Split by statement breakpoint and execute each statement
        const statements = migrationSQL
            .split('-->statement-breakpoint')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        console.log(`Executing ${statements.length} SQL statements...`);

        for (const statement of statements) {
            console.log(`Executing: ${statement.substring(0, 80)}...`);
            await client.query(statement);
            console.log('✓ Success');
        }

        console.log('\n✅ Migration completed successfully!');
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

runMigration();
