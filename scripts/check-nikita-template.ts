import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";

config({ path: ".env" });
const sql = neon(process.env.DATABASE_URL!);

async function checkTemplate() {
    const result = await sql`
    SELECT "htmlCode", "translations" 
    FROM "htmlTemplate" 
    WHERE id = 'html-1767876384317'
  `;

    if (result.length === 0) {
        console.log("Template not found");
        return;
    }

    const template = result[0];

    console.log("📄 Template HTML Code:");
    console.log("=".repeat(60));
    console.log(template.htmlCode);
    console.log("\n" + "=".repeat(60));

    console.log("\n📋 Translations:");
    console.log("=".repeat(60));
    if (template.translations) {
        const trans = JSON.parse(template.translations);
        console.log(JSON.stringify(trans, null, 2));
    } else {
        console.log("No translations");
    }

    console.log("\n" + "=".repeat(60));
    console.log("\n🔍 Analysis:");

    // Check for data-editable
    const dataEditable = template.htmlCode.match(/data-editable="([^"]+)"/g);
    console.log("\ndata-editable attributes found:", dataEditable?.length || 0);
    if (dataEditable) {
        dataEditable.forEach(attr => console.log("  -", attr));
    }

    // Check for id attributes
    const ids = template.htmlCode.match(/id="([^"]+)"/g);
    console.log("\nid attributes found:", ids?.length || 0);

    console.log("\n💡 Issue:");
    if (!dataEditable || dataEditable.length === 0) {
        console.log("❌ Template has NO data-editable attributes!");
        console.log("   Translation service couldn't find any text to translate.");
        console.log("\n📝 Solution:");
        console.log("   Add data-editable attributes to text elements:");
        console.log('   <h1 data-editable="title">Happy Birthday!</h1>');
    }
}

checkTemplate();
