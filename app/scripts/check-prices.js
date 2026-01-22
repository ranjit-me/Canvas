
const { neon } = require('@neondatabase/serverless');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });
if (!process.env.DATABASE_URL) {
    dotenv.config({ path: '.env' });
}

const sql = neon(process.env.DATABASE_URL);

async function checkPrices() {
    try {
        const templates = await sql`SELECT id, name, price, "isFree" FROM "webTemplate"`;
        console.log("Template Prices in DB:");
        console.table(templates);
    } catch (error) {
        console.error("Error checking prices:", error);
    }
}

checkPrices();
