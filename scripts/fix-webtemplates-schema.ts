import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function runFix() {
    const client = await pool.connect();

    try {
        console.log("Checking webTemplate table for missing columns...");

        // Add componentCode if it doesn't exist
        const addComponentCode = `
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='webTemplate' AND column_name='componentCode') THEN
                    ALTER TABLE "webTemplate" ADD COLUMN "componentCode" text;
                    RAISE NOTICE 'Added componentCode column';
                END IF;
            END $$;
        `;

        // Add isDynamic if it doesn't exist
        const addIsDynamic = `
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='webTemplate' AND column_name='isDynamic') THEN
                    ALTER TABLE "webTemplate" ADD COLUMN "isDynamic" boolean DEFAULT false;
                    RAISE NOTICE 'Added isDynamic column';
                END IF;
            END $$;
        `;

        await client.query(addComponentCode);
        await client.query(addIsDynamic);

        console.log('\n✅ webTemplate table updated successfully!');
    } catch (error) {
        console.error('❌ Fix failed:', error);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

runFix();
