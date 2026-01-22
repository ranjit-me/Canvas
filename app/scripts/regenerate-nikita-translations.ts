import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { translationService } from "../src/lib/translation-service";

config({ path: ".env" });
const sql = neon(process.env.DATABASE_URL!);

async function regenerateTranslations() {
    console.log("🔄 Regenerating Translations for Nik ita Template\n");

    // Get the template
    const templates = await sql`
    SELECT id, name, "htmlCode"
    FROM "htmlTemplate"
    WHERE id = 'html-1767876384317'
  `;

    if (templates.length === 0) {
        console.log("Template not found");
        return;
    }

    const template = templates[0];
    console.log(`📄 Template: ${template.name} (${template.id})\n`);

    // Extract fields with the FIXED function
    console.log("🔍 Extracting text fields...");
    const fields = await translationService.extractEditableFields(template.htmlCode);
    console.log(`✅ Found ${Object.keys(fields).length} fields:\n`);
    Object.entries(fields).forEach(([key, value]) => {
        console.log(`   ${key}: "${value}"`);
    });

    if (Object.keys(fields).length === 0) {
        console.log("\n❌ No fields extracted - extraction still not working!");
        return;
    }

    // Create mock translations (since Google API not configured)
    console.log("\n🌐 Creating translations (mock data - no Google API)...\n");

    const mockTranslations: any = {
        en: fields,
        hi: {},
        es: {},
        fr: {}
    };

    // Manually translate the key phrases for demo
    Object.keys(fields).forEach(key => {
        const text = fields[key];

        // Simple mappings for demo
        if (text.includes("Happy Birthday")) {
            mockTranslations.hi[key] = "जन्मदिन मुबारक हो!";
            mockTranslations.es[key] = "¡Feliz Cumpleaños!";
            mockTranslations.fr[key] = "Joyeux Anniversaire!";
        } else if (text.includes("Dear Friend")) {
            mockTranslations.hi[key] = "प्रिय मित्र";
            mockTranslations.es[key] = "Querido Amigo";
            mockTranslations.fr[key] = "Cher Ami";
        } else if (text.includes("Wishing you")) {
            mockTranslations.hi[key] = "आपको प्यार, हंसी और अद्भुत यादों से भरे दिन की शुभकामनाएं! आपके सभी सपने सच हों! 🎉";
            mockTranslations.es[key] = "¡Te deseo un día lleno de amor, risas y recuerdos maravillosos! ¡Que todos tus sueños se hagan realidad! 🎉";
            mockTranslations.fr[key] = "Je te souhaite une journée remplie d'amour, de rires et de merveilleux souvenirs! Que tous tes rêves se réalisent! 🎉";
        }
    });

    console.log("Languages:", Object.keys(mockTranslations).join(", "));
    console.log("\nSample Hindi translations:");
    Object.entries(mockTranslations.hi).forEach(([key, value]) => {
        console.log(`   ${key}: "${value}"`);
    });

    // Update database
    console.log("\n💾 Updating database...");
    await sql`
    UPDATE "htmlTemplate"
    SET translations = ${JSON.stringify(mockTranslations)},
        "updatedAt" = NOW()
    WHERE id = 'html-1767876384317'
  `;

    console.log("✅ Database updated!\n");

    // Verify
    const verify = await sql`
    SELECT translations FROM "htmlTemplate" WHERE id = 'html-1767876384317'
  `;

    const stored = JSON.parse(verify[0].translations);
    console.log("✅ Verification: Translations stored successfully");
    console.log(`   Languages in database: ${Object.keys(stored).join(", ")}`);
    console.log(`   Hindi fields: ${Object.keys(stored.hi).length}`);

    console.log("\n🎉 Done! Template now has translations.");
    console.log("\n📝 Next steps:");
    console.log("   1. Refresh your browser");
    console.log("   2. Change language to Hindi (हिं)");
    console.log("   3. Template should now show in Hindi!");
}

regenerateTranslations();
