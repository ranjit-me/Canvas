import { Translate } from '@google-cloud/translate/build/src/v2';

// Supported languages matching LanguageContext.tsx
const SUPPORTED_LANGUAGES = [
    'en', 'hi', 'es', 'fr', 'de', 'ar', 'zh', 'pt', 'bn', 'ru', 'ur', 'id'
] as const;

type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

interface ExtractedFields {
    [key: string]: string;
}

interface TranslationResult {
    [language: string]: {
        [field: string]: string;
    };
}

export class TemplateTranslationService {
    private translate: Translate;

    constructor() {
        // Initialize Google Cloud Translation API
        // Make sure to set GOOGLE_APPLICATION_CREDENTIALS env variable
        this.translate = new Translate({
            projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
        });
    }

    /**
   * Extract editable text fields from HTML template
   * Looks for data-editable attributes and common text elements with IDs
   */
    async extractEditableFields(htmlCode: string): Promise<ExtractedFields> {
        const fields: ExtractedFields = {};

        // Extract from data-editable elements
        // Format: data-editable="fieldName">text content</tag>
        const editableRegex = /data-editable="([^"]+)"[^>]*>([\s\S]*?)<\//gi;
        let match;

        while ((match = editableRegex.exec(htmlCode)) !== null) {
            const fieldName = match[1];
            let textContent = match[2];

            // Clean HTML tags and extra whitespace from content
            textContent = textContent
                .replace(/<[^>]+>/g, '') // Remove HTML tags
                .replace(/\s+/g, ' ')     // Normalize whitespace
                .trim();

            if (textContent && textContent.length > 0) {
                fields[fieldName] = textContent;
            }
        }

        // Also extract from common elements with IDs (h1, h2, h3, h4, h5, h6, p, span, div, button, a, li)
        // This handles templates without data-editable attributes
        const idTextRegex = /<(h1|h2|h3|h4|h5|h6|p|span|div|button|a|li)[^>]+id="([^"]+)"[^>]*>([\s\S]*?)<\/\1>/gi;

        while ((match = idTextRegex.exec(htmlCode)) !== null) {
            const tagName = match[1];
            const fieldName = match[2];
            let textContent = match[3];

            // Clean HTML tags and extra whitespace from content
            textContent = textContent
                .replace(/<[^>]+>/g, '') // Remove HTML tags
                .replace(/\s+/g, ' ')     // Normalize whitespace
                .trim();

            // Only add if not already extracted and has meaningful content
            if (textContent && textContent.length > 0 && !fields[fieldName]) {
                fields[fieldName] = textContent;
            }
        }

        return fields;
    }

    /**
     * Batch translate all fields to all supported languages
     * Uses Google Translate API - CALLED ONLY ONCE when template is saved
     */
    async batchTranslateToAllLanguages(
        sourceFields: ExtractedFields,
        sourceLang: string = 'en'
    ): Promise<TranslationResult> {
        const translations: TranslationResult = {};

        // Initialize with source language
        translations[sourceLang] = sourceFields;

        // Get all field values to translate
        const textsToTranslate = Object.values(sourceFields);
        const fieldNames = Object.keys(sourceFields);

        // Translate to each target language
        for (const targetLang of SUPPORTED_LANGUAGES) {
            if (targetLang === sourceLang) continue; // Skip source language

            try {
                // Batch translate all texts at once
                const [translatedTexts] = await this.translate.translate(
                    textsToTranslate,
                    {
                        from: sourceLang,
                        to: targetLang,
                    }
                );

                // Map translated texts back to field names
                const translatedFields: { [field: string]: string } = {};
                fieldNames.forEach((fieldName, index) => {
                    translatedFields[fieldName] = Array.isArray(translatedTexts)
                        ? translatedTexts[index]
                        : translatedTexts;
                });

                translations[targetLang] = translatedFields;
            } catch (error) {
                console.error(`Translation error for ${targetLang}:`, error);
                // Fallback: use original text if translation fails
                translations[targetLang] = sourceFields;
            }
        }

        return translations;
    }

    /**
     * Main method: Extract text from template and translate to all languages
     */
    async translateTemplate(htmlCode: string): Promise<TranslationResult> {
        // 1. Extract editable fields
        const fields = await this.extractEditableFields(htmlCode);

        // If no fields found, return empty translations
        if (Object.keys(fields).length === 0) {
            console.warn('No editable fields found in template');
            return { en: {} };
        }

        // 2. Batch translate to all languages
        const translations = await this.batchTranslateToAllLanguages(fields);

        return translations;
    }

    /**
     * Get translation for specific field and language
     */
    getTranslation(
        translations: TranslationResult,
        fieldName: string,
        language: string
    ): string | null {
        return translations[language]?.[fieldName] || translations['en']?.[fieldName] || null;
    }

    /**
     * Apply translations to HTML template
     * Replaces original text with translated text based on selected language
     */
    applyTranslations(
        htmlCode: string,
        translations: TranslationResult,
        language: string
    ): string {
        let translatedHtml = htmlCode;

        const langTranslations = translations[language] || translations['en'];
        if (!langTranslations) return htmlCode;

        // Replace data-editable fields
        Object.entries(langTranslations).forEach(([fieldName, translatedText]) => {
            // Replace in data-editable elements
            const editableRegex = new RegExp(
                `(data-editable="${fieldName}"[^>]*>)(.*?)(</)`,
                'gi'
            );
            translatedHtml = translatedHtml.replace(
                editableRegex,
                `$1${translatedText}$3`
            );

            // Replace in ID-based elements
            const idRegex = new RegExp(
                `(id="${fieldName}"[^>]*>)(.*?)(</)`,
                'gi'
            );
            translatedHtml = translatedHtml.replace(
                idRegex,
                `$1${translatedText}$3`
            );
        });

        return translatedHtml;
    }
}

// Export singleton instance
export const translationService = new TemplateTranslationService();
