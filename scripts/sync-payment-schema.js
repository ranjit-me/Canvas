const { neon } = require("@neondatabase/serverless");
const dotenv = require("dotenv");

dotenv.config({ path: ".env" });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    console.error("DATABASE_URL is not defined");
    process.exit(1);
}

const sql = neon(DATABASE_URL);

async function main() {
    console.log("Updating webProject table schema...");
    try {
        try {
            await sql`ALTER TABLE "webProject" ADD COLUMN IF NOT EXISTS "paymentStatus" text DEFAULT 'pending'`;
            console.log("Success: Added paymentStatus");
        } catch (e) { console.error("Error adding paymentStatus:", e.message); }

        try {
            await sql`ALTER TABLE "webProject" ADD COLUMN IF NOT EXISTS "razorpayOrderId" text`;
            console.log("Success: Added razorpayOrderId");
        } catch (e) { console.error("Error adding razorpayOrderId:", e.message); }

        try {
            await sql`ALTER TABLE "webProject" ADD COLUMN IF NOT EXISTS "razorpayPaymentId" text`;
            console.log("Success: Added razorpayPaymentId");
        } catch (e) { console.error("Error adding razorpayPaymentId:", e.message); }

        try {
            await sql`ALTER TABLE "webProject" ADD COLUMN IF NOT EXISTS "pricePaid" integer`;
            console.log("Success: Added pricePaid");
        } catch (e) { console.error("Error adding pricePaid:", e.message); }

        console.log("Schema sync completed!");
    } catch (error) {
        console.error("Fatal error during schema sync:", error);
    }
}

main();
