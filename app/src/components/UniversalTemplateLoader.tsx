"use client";

import React from "react";
import { EditableText } from "@/app/(dashboard)/web/features/components/EditableText";
import { EditableImage } from "@/app/(dashboard)/web/features/components/EditableImage";
import { useLanguage } from "@/contexts/LanguageContext";

interface UniversalTemplateLoaderProps {
    code: string;
    data?: Record<string, string>; // Initial values mapped by ID
    config?: Record<string, any>; // Props config from creator/user
    translations?: string | null; // JSON string of translations: { en: {...}, hi: {...}, ... }
}

/**
 * UniversalTemplateLoader
 * 
 * Takes "Infected" code and renders it by interleaving standard HTML
 * with our interactive Editable components.
 */
export interface UniversalTemplateLoaderHandle {
    getData: () => Record<string, string>;
}

export const UniversalTemplateLoader = React.forwardRef<UniversalTemplateLoaderHandle, UniversalTemplateLoaderProps>(
    ({ code, data = {}, config = {}, translations = null }, ref) => {
        const [selectedId, setSelectedId] = React.useState<string | null>(null);
        const [localData, setLocalData] = React.useState<Record<string, string>>(data);
        const { language } = useLanguage();

        React.useImperativeHandle(ref, () => ({
            getData: () => localData,
        }));

        // Apply translations to code if available
        const translatedCode = React.useMemo(() => {
            if (!translations) return code;

            try {
                const translationsObj = JSON.parse(translations);
                const langTranslations = translationsObj[language] || translationsObj['en'];

                if (!langTranslations) return code;

                let result = code;
                // Replace translated text in data-editable and id-based elements
                Object.entries(langTranslations).forEach(([fieldName, translatedText]) => {
                    // Replace in data-editable elements
                    const editableRegex = new RegExp(
                        `(data-editable="${fieldName}"[^>]*>)(.*?)(</)`,
                        'gi'
                    );
                    result = result.replace(editableRegex, `$1${translatedText}$3`);

                    // Replace in ID-based elements  
                    const idRegex = new RegExp(
                        `(id="${fieldName}"[^>]*>)(.*?)(</)`,
                        'gi'
                    );
                    result = result.replace(idRegex, `$1${translatedText}$3`);
                });

                return result;
            } catch (error) {
                console.error('Failed to apply translations:', error);
                return code;
            }
        }, [code, translations, language]);

        // Helper to replace {config.key} in strings
        const injectConfig = (str: string) => {
            let res = str;
            Object.entries(config).forEach(([key, value]) => {
                const regex = new RegExp(`\\{\\s*config\\.${key}\\s*\\}`, 'g');
                res = res.replace(regex, String(value));
            });
            return res;
        };

        // 1. Split the code into chunks of HTML and Component tags
        const componentRegex = /<(EditableText|EditableImage)\s+([^>]+?)\/>/gi;

        const chunks: React.ReactNode[] = [];
        let lastIndex = 0;
        let match;

        while ((match = componentRegex.exec(translatedCode)) !== null) {
            // Add preceding HTML chunk
            const htmlBefore = translatedCode.substring(lastIndex, match.index).trim();
            if (htmlBefore) {
                chunks.push(<div key={`html_${lastIndex}`} dangerouslySetInnerHTML={{ __html: injectConfig(htmlBefore) }} className="inline" />);
            }

            const [fullTag, tagName, attributesStr] = match;
            const attributes = parseAttributes(attributesStr);
            const id = attributes.id || `el_${match.index}`;

            // Render the appropriate component
            if (tagName === "EditableText") {
                chunks.push(
                    <EditableText
                        key={id}
                        elementId={id}
                        value={localData[id] || injectConfig(attributes.value)}
                        onChange={(val) => setLocalData(prev => ({ ...prev, [id]: val }))}
                        className={attributes.className}
                        as={attributes.as as any || "span"}
                        isSelected={selectedId === id}
                        onSelect={() => setSelectedId(id)}
                    />
                );
            } else if (tagName === "EditableImage") {
                chunks.push(
                    <EditableImage
                        key={id}
                        elementId={id}
                        src={localData[id] || injectConfig(attributes.src)}
                        onChange={(val) => setLocalData(prev => ({ ...prev, [id]: val }))}
                        className={attributes.className}
                        alt={attributes.alt}
                        isSelected={selectedId === id}
                        onSelect={() => setSelectedId(id)}
                    />
                );
            }

            lastIndex = componentRegex.lastIndex;
        }

        // Add remaining HTML chunk
        const htmlAfter = translatedCode.substring(lastIndex).trim();
        if (htmlAfter) {
            chunks.push(<div key={`html_${lastIndex}`} dangerouslySetInnerHTML={{ __html: injectConfig(htmlAfter) }} className="inline" />);
        }

        return (
            <div className="universal-template-container w-full h-full overflow-auto">
                {chunks}
            </div>
        );
    }
);

UniversalTemplateLoader.displayName = "UniversalTemplateLoader";

/**
 * Basic attribute parser for stringified JSX-like tags
 */
function parseAttributes(str: string): Record<string, string> {
    const attrs: Record<string, string> = {};
    const regex = /([a-z0-9]+)=\{?["']?(.*?)["']?\}?/gi;
    let match;
    while ((match = regex.exec(str)) !== null) {
        attrs[match[1]] = match[2];
    }
    return attrs;
}
