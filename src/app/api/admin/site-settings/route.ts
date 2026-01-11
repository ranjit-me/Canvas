import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { siteSettings } from "@/db/schema";
import { eq } from "drizzle-orm";

const SETTINGS_ID = "main"; // Single settings record

// GET: Fetch site settings
export async function GET() {
    try {
        const settings = await db
            .select()
            .from(siteSettings)
            .where(eq(siteSettings.id, SETTINGS_ID))
            .limit(1);

        if (settings.length === 0) {
            // Return default settings if none exist
            return NextResponse.json({
                id: SETTINGS_ID,
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

        return NextResponse.json(settings[0]);
    } catch (error) {
        console.error("[SITE_SETTINGS_GET]", error);
        return NextResponse.json(
            { error: "Failed to fetch site settings" },
            { status: 500 }
        );
    }
}

// PATCH: Update site settings
export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();

        const {
            siteName,
            siteLogo,
            contactEmail,
            contactPhone,
            contactAddress,
            aboutUsContent,
            socialLinks,
            defaultTemplateLanguage,
        } = body;

        // Check if settings exist
        const existing = await db
            .select()
            .from(siteSettings)
            .where(eq(siteSettings.id, SETTINGS_ID))
            .limit(1);

        if (existing.length === 0) {
            // Create initial settings
            const newSettings = await db
                .insert(siteSettings)
                .values({
                    id: SETTINGS_ID,
                    siteName: siteName || "Giftora",
                    siteLogo,
                    contactEmail,
                    contactPhone,
                    contactAddress,
                    aboutUsContent,
                    socialLinks: socialLinks ? JSON.stringify(socialLinks) : null,
                    defaultTemplateLanguage: defaultTemplateLanguage || "en",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })
                .returning();

            return NextResponse.json(newSettings[0]);
        }

        // Update existing settings
        const updated = await db
            .update(siteSettings)
            .set({
                siteName,
                siteLogo,
                contactEmail,
                contactPhone,
                contactAddress,
                aboutUsContent,
                socialLinks: socialLinks ? JSON.stringify(socialLinks) : null,
                defaultTemplateLanguage: defaultTemplateLanguage || "en",
                updatedAt: new Date(),
            })
            .where(eq(siteSettings.id, SETTINGS_ID))
            .returning();

        return NextResponse.json(updated[0]);
    } catch (error) {
        console.error("[SITE_SETTINGS_PATCH]", error);
        return NextResponse.json(
            { error: "Failed to update site settings" },
            { status: 500 }
        );
    }
}
