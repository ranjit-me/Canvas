import { NextRequest, NextResponse } from "next/server";
import { getTranslation } from "@/lib/translations";

const LIBRETRANSLATE_API = "https://libretranslate.com/translate";

export async function POST(req: NextRequest) {
    try {
        const { text, targetLang, sourceLang = "en" } = await req.json();

        if (!text || !targetLang) {
            return NextResponse.json(
                { error: "Missing text or target language" },
                { status: 400 }
            );
        }

        // If target language is English, return original text
        if (targetLang === "en") {
            return NextResponse.json({ translatedText: text });
        }

        // Try local dictionary first (instant, no API call)
        const localTranslation = getTranslation(text, targetLang);
        if (localTranslation) {
            console.log(`Using local translation for: "${text}"`);
            return NextResponse.json({ translatedText: localTranslation });
        }

        // Fallback to LibreTranslate API for dynamic content
        console.log(`Calling LibreTranslate API for: "${text.substring(0, 50)}..."`);

        try {
            const response = await fetch(LIBRETRANSLATE_API, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    q: text,
                    source: sourceLang,
                    target: targetLang,
                    format: "text",
                }),
                signal: AbortSignal.timeout(5000), // 5 second timeout
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("LibreTranslate API error:", response.status, errorText);

                // Return original text as fallback
                return NextResponse.json({
                    translatedText: text,
                    warning: "Translation service unavailable"
                });
            }

            const data = await response.json();
            console.log(`Translation successful`);

            return NextResponse.json({
                translatedText: data.translatedText || text
            });
        } catch (apiError) {
            console.error("LibreTranslate API call failed:", apiError);

            // Return original text when API fails
            return NextResponse.json({
                translatedText: text,
                warning: "Using original text (API unavailable)"
            });
        }
    } catch (error) {
        console.error("Translation error:", error);

        // Final fallback - return empty or original text
        return NextResponse.json({
            translatedText: "",
            error: "Translation failed"
        });
    }
}
