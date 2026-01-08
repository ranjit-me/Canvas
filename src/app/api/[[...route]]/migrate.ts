import { Hono } from "hono";
import { db } from "@/db/drizzle";
import { categories, subcategories } from "@/db/schema";
import { sql } from "drizzle-orm";

const app = new Hono()
    // Run database migrations and seeding
    .post("/run-migrations", async (c) => {
        try {
            console.log("🚀 Running category migrations...");

            // Create categories table (if not exists)
            await db.execute(sql`
        CREATE TABLE IF NOT EXISTS "category" (
          "id" TEXT PRIMARY KEY NOT NULL,
          "name" TEXT NOT NULL UNIQUE,
          "description" TEXT,
          "icon" TEXT,
          "displayOrder" INTEGER DEFAULT 0,
          "createdAt" TIMESTAMP NOT NULL,
          "updatedAt" TIMESTAMP NOT NULL
        )
      `);

            // Create subcategories table (if not exists)
            await db.execute(sql`
        CREATE TABLE IF NOT EXISTS "subcategory" (
          "id" TEXT PRIMARY KEY NOT NULL,
          "categoryId" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "description" TEXT,
          "icon" TEXT,
          "displayOrder" INTEGER DEFAULT 0,
          "createdAt" TIMESTAMP NOT NULL,
          "updatedAt" TIMESTAMP NOT NULL,
          CONSTRAINT "subcategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE
        )
      `);

            // Add columns to webTemplate (if not exists)
            try {
                await db.execute(sql`ALTER TABLE "webTemplate" ADD COLUMN IF NOT EXISTS "categoryId" TEXT`);
                await db.execute(sql`ALTER TABLE "webTemplate" ADD COLUMN IF NOT EXISTS "subcategoryId" TEXT`);
            } catch (e) {
                console.log("webTemplate columns might already exist");
            }

            // Add columns to htmlTemplate (if not exists)
            try {
                await db.execute(sql`ALTER TABLE "htmlTemplate" ADD COLUMN IF NOT EXISTS "categoryId" TEXT`);
                await db.execute(sql`ALTER TABLE "htmlTemplate" ADD COLUMN IF NOT  EXISTS "subcategoryId" TEXT`);
                await db.execute(sql`ALTER TABLE "htmlTemplate" ADD COLUMN IF NOT EXISTS "slug" TEXT`);
                await db.execute(sql`ALTER TABLE "htmlTemplate" ADD COLUMN IF NOT EXISTS "isPublished" BOOLEAN DEFAULT false`);
                // Add unique constraint only if it doesn't exist
                await db.execute(sql`DO $$ BEGIN
                    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'htmlTemplate_slug_unique') THEN
                        ALTER TABLE "htmlTemplate" ADD CONSTRAINT "htmlTemplate_slug_unique" UNIQUE("slug");
                    END IF;
                END $$`);
            } catch (e) {
                console.log("htmlTemplate columns might already exist");
            }

            console.log("✅ Tables created/verified");

            // Insert categories
            const categoriesToInsert = [
                { id: 'birthday', name: 'Birthday', description: 'Birthday celebration templates', displayOrder: 1 },
                { id: 'anniversary', name: 'Anniversary', description: 'Anniversary celebration templates', displayOrder: 2 },
                { id: 'wedding', name: 'Wedding', description: 'Wedding and engagement templates', displayOrder: 3 },
                { id: 'valentine', name: 'Valentine', description: 'Valentine\'s Day special templates', displayOrder: 4 },
                { id: 'special-days', name: 'Special Days', description: 'Special occasion templates', displayOrder: 5 },
                { id: 'religious-cultural', name: 'Religious and Cultural', description: 'Religious and cultural celebration templates', displayOrder: 6 },
            ];

            const now = new Date();
            for (const cat of categoriesToInsert) {
                try {
                    await db.insert(categories).values({ ...cat, createdAt: now, updatedAt: now }).onConflictDoNothing();
                } catch (e) {
                    console.log(`Category ${cat.id} might already exist`);
                }
            }

            console.log("✅ Categories seeded");

            // Insert subcategories
            const subcategoriesToInsert = [
                // Birthday
                { id: 'birthday-girlfriend', categoryId: 'birthday', name: 'Girlfriend', displayOrder: 1 },
                { id: 'birthday-boyfriend', categoryId: 'birthday', name: 'Boyfriend', displayOrder: 2 },
                { id: 'birthday-mom', categoryId: 'birthday', name: 'Mom', displayOrder: 3 },
                { id: 'birthday-dad', categoryId: 'birthday', name: 'Dad', displayOrder: 4 },
                { id: 'birthday-sister', categoryId: 'birthday', name: 'Sister', displayOrder: 5 },
                { id: 'birthday-brother', categoryId: 'birthday', name: 'Brother', displayOrder: 6 },
                { id: 'birthday-kids', categoryId: 'birthday', name: 'Kids', displayOrder: 7 },
                { id: 'birthday-friend', categoryId: 'birthday', name: 'Friend', displayOrder: 8 },
                // Anniversary
                { id: 'anniversary-romantic', categoryId: 'anniversary', name: 'Romantic', displayOrder: 1 },
                { id: 'anniversary-parents', categoryId: 'anniversary', name: 'Parents', displayOrder: 2 },
                { id: 'anniversary-couple', categoryId: 'anniversary', name: 'Couple', displayOrder: 3 },
                { id: 'anniversary-spouse', categoryId: 'anniversary', name: 'Spouse', displayOrder: 4 },
                // Wedding
                { id: 'wedding-grand', categoryId: 'wedding', name: 'Grand Wedding', displayOrder: 1 },
                { id: 'wedding-engagement', categoryId: 'wedding', name: 'Engagement', displayOrder: 2 },
                { id: 'wedding-destination', categoryId: 'wedding', name: 'Destination', displayOrder: 3 },
                // Valentine
                { id: 'valentine-day', categoryId: 'valentine', name: 'Valentine\'s Day', displayOrder: 1 },
                { id: 'valentine-rose', categoryId: 'valentine', name: 'Rose Day', displayOrder: 2 },
                { id: 'valentine-chocolate', categoryId: 'valentine', name: 'Chocolate Day', displayOrder: 3 },
                { id: 'valentine-teddy', categoryId: 'valentine', name: 'Teddy Day', displayOrder: 4 },
                { id: 'valentine-promise', categoryId: 'valentine', name: 'Promise Day', displayOrder: 5 },
                { id: 'valentine-hug', categoryId: 'valentine', name: 'Hug Day', displayOrder: 6 },
                { id: 'valentine-kiss', categoryId: 'valentine', name: 'Kiss Day', displayOrder: 7 },
                // Special Days
                { id: 'special-graduation', categoryId: 'special-days', name: 'Graduation', displayOrder: 1 },
                { id: 'special-babyshower', categoryId: 'special-days', name: 'Baby Shower', displayOrder: 2 },
                { id: 'special-housewarming', categoryId: 'special-days', name: 'Housewarming', displayOrder: 3 },
                { id: 'special-achievements', categoryId: 'special-days', name: 'Achievements', displayOrder: 4 },
                { id: 'special-reunion', categoryId: 'special-days', name: 'Reunion', displayOrder: 5 },
                { id: 'special-thankyou', categoryId: 'special-days', name: 'Thank You', displayOrder: 6 },
                // Religious and Cultural
                { id: 'religious-diwali', categoryId: 'religious-cultural', name: 'Diwali', displayOrder: 1 },
                { id: 'religious-eid', categoryId: 'religious-cultural', name: 'Eid', displayOrder: 2 },
                { id: 'religious-christmas', categoryId: 'religious-cultural', name: 'Christmas', displayOrder: 3 },
                { id: 'religious-holi', categoryId: 'religious-cultural', name: 'Holi', displayOrder: 4 },
                { id: 'religious-navratri', categoryId: 'religious-cultural', name: 'Navratri', displayOrder: 5 },
                { id: 'religious-ganeshchaturthi', categoryId: 'religious-cultural', name: 'Ganesh Chaturthi', displayOrder: 6 },
                { id: 'religious-nationaldays', categoryId: 'religious-cultural', name: 'National Days', displayOrder: 7 },
            ];

            for (const subcat of subcategoriesToInsert) {
                try {
                    await db.insert(subcategories).values({ ...subcat, createdAt: now, updatedAt: now }).onConflictDoNothing();
                } catch (e) {
                    console.log(`Subcategory ${subcat.id} might already exist`);
                }
            }

            console.log("✅ Subcategories seeded");
            console.log("🎉 All migrations completed successfully!");

            return c.json({ success: true, message: "Migrations and seeding completed" });
        } catch (error) {
            console.error("❌ Migration failed:", error);
            return c.json({ error: "Migration failed", details: String(error) }, 500);
        }
    });

export default app;
