"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/contexts/translation-context";

export function useTranslate(text: string): string {
    const { translate, language } = useTranslation();

    // Check cache synchronously if possible to avoid extra re-render
    const cacheKey = `${language}:${text}`;
    const cached = language === "en" ? text : (typeof window !== "undefined" ? (window as any)._translationCache?.get(cacheKey) : null);

    const [translatedText, setTranslatedText] = useState(cached || text);

    useEffect(() => {
        if (language === "en") {
            setTranslatedText(text);
            return;
        }

        // If already cached and we have it, skip async call
        if (cached && translatedText === cached) return;

        let isMounted = true;

        translate(text).then((result) => {
            if (isMounted) {
                setTranslatedText(result);
            }
        });

        return () => {
            isMounted = false;
        };
    }, [text, language, translate, cached]);

    return translatedText;
}
