import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";

config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL!);

async function checkTemplateTranslations() {
    console.log("🔍 Checking Template Translations\n");
    console.log("=".repeat(60));

    // Get the most recent HTML template
    const templates = await sql`
    SELECT id, name, translations, "createdAt"
    FROM "htmlTemplate"
    ORDER BY "createdAt" DESC
    LIMIT 5
  `;

    if (templates.length === 0) {
        console.log("❌ No templates found in database");
        return;
    }

    console.log(`\n📋 Found ${templates.length} recent templates:\n`);

    templates.forEach((template, index) => {
        console.log(`${index + 1}. ${template.name} (${template.id})`);
        console.log(`   Created: ${template.createdAt}`);

        if (template.translations) {
            try {
                const trans = JSON.parse(template.translations);
                const languages = Object.keys(trans);
                console.log(`   ✅ HAS translations: ${languages.join(", ")}`);

                // Show sample Hindi translation if exists
                if (trans.hi) {
                    const firstKey = Object.keys(trans.hi)[0];
                    console.log(`   🇮🇳 Hindi sample: "${trans.hi[firstKey]}"`);
                }
            } catch (e) {
                console.log(`   ❌ Invalid translation JSON`);
            }
        } else {
            console.log(`   ❌ NO translations stored`);
            console.log(`   → This template won't translate!`);
        }
        console.log("");
    });

    // Check the most recent one in detail
    const latest = templates[0];
    console.log("=".repeat(60));
    console.log("\n🔍 Detailed Check of Latest Template:");
    console.log(`Name: ${latest.name}`);
    console.log(`ID: ${latest.id}\n`);

    if (!latest.translations) {
        console.log("❌ PROBLEM FOUND: No translations stored!");
        console.log("\n💡 This means:");
        console.log("   1. Google API credentials are NOT configured");
        console.log("   2. Translation failed when template was saved");
        console.log("   3. Template was saved without translations field\n");
        console.log("📝 Solution:");
        console.log("   1. Set up Google Cloud credentials (see TRANSLATION_SETUP.md)");
        console.log("   2. Re-save the template to trigger translation");
        console.log("   3. OR manually add translations using test script\n");
    } else {
        const trans = JSON.parse(latest.translations);
        console.log("✅ Translations are stored!\n");

        Object.entries(trans).forEach(([lang, fields]: [string, any]) => {
            console.log(`${lang.toUpperCase()}: ${Object.keys(fields).length} fields`);
            Object.entries(fields).slice(0, 2).forEach(([key, value]) => {
                console.log(`  - ${key}: "${value}"`);
            });
            console.log("");
        });

        console.log("\n💡 If translations exist but don't show:");
        console.log("   1. Check if UniversalTemplateLoader is being used");
        console.log("   2. Check if 'translations' prop is passed to loader");
        console.log("   3. Check browser console for errors");
    }
}

checkTemplateTranslations().catch(console.error);
