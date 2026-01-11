"use client";

import { Globe, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/contexts/translation-context";
import { motion, AnimatePresence } from "framer-motion";

const languages = [
    { code: 'en', name: 'English', countryCode: 'gb', flagUrl: 'https://flagcdn.com/w40/gb.png' },
    { code: 'es', name: 'Español', countryCode: 'es', flagUrl: 'https://flagcdn.com/w40/es.png' },
    { code: 'hi', name: 'हिन्दी', countryCode: 'in', flagUrl: 'https://flagcdn.com/w40/in.png' },
    { code: 'fr', name: 'Français', countryCode: 'fr', flagUrl: 'https://flagcdn.com/w40/fr.png' },
    { code: 'ar', name: 'العربية', countryCode: 'sa', flagUrl: 'https://flagcdn.com/w40/sa.png' },
    { code: 'zh', name: '中文', countryCode: 'cn', flagUrl: 'https://flagcdn.com/w40/cn.png' },
    { code: 'pt', name: 'Português', countryCode: 'pt', flagUrl: 'https://flagcdn.com/w40/pt.png' },
    { code: 'bn', name: 'বাংলা', countryCode: 'bd', flagUrl: 'https://flagcdn.com/w40/bd.png' },
    { code: 'ru', name: 'Русский', countryCode: 'ru', flagUrl: 'https://flagcdn.com/w40/ru.png' },
    { code: 'ur', name: 'اردو', countryCode: 'pk', flagUrl: 'https://flagcdn.com/w40/pk.png' },
    { code: 'id', name: 'Bahasa Indonesia', countryCode: 'id', flagUrl: 'https://flagcdn.com/w40/id.png' },
    { code: 'de', name: 'Deutsch', countryCode: 'de', flagUrl: 'https://flagcdn.com/w40/de.png' },
];

export function LanguageSelector({ value, onChange }: { value?: string, onChange?: (lang: string) => void } = {}) {
    const { language: contextLanguage, setLanguage: setContextLanguage } = useLanguage();
    const { setLanguage: setTranslationLanguage } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const language = value || contextLanguage;

    const currentLanguage = languages.find(l => l.code === language) || languages[0];

    // Sync language changes
    const handleLanguageChange = (langCode: string) => {
        if (onChange) {
            onChange(langCode);
        } else {
            setContextLanguage(langCode as any);
            setTranslationLanguage(langCode);
        }
        setIsOpen(false);
    };

    // Sync on mount
    useEffect(() => {
        setTranslationLanguage(language);
    }, [language, setTranslationLanguage]);

    return (
        <div className="relative z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-lg transition-all"
            >
                <Globe className="w-4 h-4 text-gray-600" />
                <img
                    src={currentLanguage.flagUrl}
                    alt={currentLanguage.name}
                    className="w-6 h-6 rounded object-cover shadow-sm"
                />
                <span className="font-bold text-sm text-gray-700 hidden sm:inline">
                    {currentLanguage.name}
                </span>
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 -z-10"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Menu */}
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border-2 border-gray-100 overflow-hidden"
                        >
                            <div className="p-2 space-y-1 max-h-96 overflow-y-auto">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => handleLanguageChange(lang.code)}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${language === lang.code
                                            ? 'bg-purple-50 text-purple-700'
                                            : 'hover:bg-gray-50 text-gray-700'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={lang.flagUrl}
                                                alt={lang.name}
                                                className="w-7 h-7 rounded object-cover shadow-sm"
                                            />
                                            <span className="font-bold text-sm">{lang.name}</span>
                                        </div>
                                        {language === lang.code && (
                                            <Check className="w-4 h-4 text-purple-600" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                                <p className="text-xs text-gray-500 text-center">
                                    Auto-translate enabled ✨
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
