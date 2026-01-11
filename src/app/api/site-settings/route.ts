import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { siteSettings } from "@/db/schema";
import { eq } from "drizzle-orm";

const SETTINGS_ID = "main";

// Public GET endpoint for site settings
export async function GET() {
    try {
        const settings = await db
            .select()
            .from(siteSettings)
            .where(eq(siteSettings.id, SETTINGS_ID))
            .limit(1);

        if (settings.length === 0) {
            return NextResponse.json({
                siteName: "Giftora",
                siteLogo: null,
                contactEmail: null,
                contactPhone: null,
                contactAddress: null,
                aboutUsContent: null,
                socialLinks: null,
                defaultTemplateLanguage: "en",
            });
        }

        // Parse socialLinks JSON if it exists
        const settingsData = settings[0];
        return NextResponse.json({
            ...settingsData,
            socialLinks: settingsData.socialLinks ? JSON.parse(settingsData.socialLinks) : null,
        });
    } catch (error) {
        console.error("[PUBLIC_SITE_SETTINGS_GET]", error);
        return NextResponse.json(
            { error: "Failed to fetch site settings" },
            { status: 500 }
        );
    }
}
