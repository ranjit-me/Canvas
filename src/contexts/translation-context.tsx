"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

interface TranslationContextType {
    language: string;
    setLanguage: (lang: string) => void;
    translate: (text: string) => Promise<string>;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// Translation cache to avoid re-translating the same text
const translationCache = new Map<string, string>();
if (typeof window !== "undefined") {
    (window as any)._translationCache = translationCache;
}

export function TranslationProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState("en");

    // Clear cache when language changes
    useEffect(() => {
        translationCache.clear();
    }, [language]);

    const translate = useCallback(async (text: string): Promise<string> => {
        // Return original text if English or empty
        if (!text || language === "en") {
            return text;
        }

        // Check cache first
        const cacheKey = `${language}:${text}`;
        if (translationCache.has(cacheKey)) {
            return translationCache.get(cacheKey)!;
        }

        try {
            const response = await fetch("/api/translate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    text,
                    targetLang: language,
                    sourceLang: "en",
                }),
            });

            const data = await response.json();
            const translatedText = data.translatedText || text;

            // Cache the translation
            translationCache.set(cacheKey, translatedText);

            return translatedText;
        } catch (error) {
            console.error("Translation error:", error);
            return text; // Return original text on error
        }
    }, [language]);

    return (
        <TranslationContext.Provider value={{ language, setLanguage, translate }}>
            {children}
        </TranslationContext.Provider>
    );
}

export function useTranslation() {
    const context = useContext(TranslationContext);
    if (!context) {
        throw new Error("useTranslation must be used within TranslationProvider");
    }
    return context;
}
