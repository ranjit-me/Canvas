const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

async function createSiteSettingsTable() {
    const sql = neon(process.env.DATABASE_URL);

    try {
        console.log('Creating siteSettings table...');

        // Create table
        await sql`
      CREATE TABLE IF NOT EXISTS "siteSettings" (
        "id" TEXT PRIMARY KEY,
        "siteName" TEXT NOT NULL DEFAULT 'Giftora',
        "siteLogo" TEXT,
        "contactEmail" TEXT,
        "contactPhone" TEXT,
        "contactAddress" TEXT,
        "aboutUsContent" TEXT,
        "socialLinks" TEXT,
        "createdAt" TIMESTAMP NOT NULL,
        "updatedAt" TIMESTAMP NOT NULL
      )
    `;

        console.log('✅ Table created successfully!');

        // Insert default settings
        console.log('Inserting default settings...');
        await sql`
      INSERT INTO "siteSettings" (id, "siteName", "createdAt", "updatedAt")
      VALUES ('main', 'Giftora', NOW(), NOW())
      ON CONFLICT (id) DO NOTHING
    `;

        console.log('✅ Default settings inserted!');
        console.log('\n🎉 Migration completed successfully!');
        console.log('\n📝 You can now use the Site Settings in the admin panel!');

    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

createSiteSettingsTable();
