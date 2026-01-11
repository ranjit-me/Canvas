"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Globe, Languages, Save, Loader2, Info } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "hi", name: "हिंदी", flag: "🇮🇳" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
    { code: "pt", name: "Português", flag: "🇵🇹" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
    { code: "bn", name: "বাংলা", flag: "🇧🇩" },
    { code: "ru", name: "Русский", flag: "🇷🇺" },
    { code: "ur", name: "اردو", flag: "🇵🇰" },
    { code: "te", name: "తెలుగు", flag: "🇮🇳" },
] as const;

export const SettingsForm = () => {
    const { data: session, update: updateSession } = useSession();
    const router = useRouter();
    const { language: uiLanguage, setLanguage: setUiLanguage } = useLanguage();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    // This tracks what's practically in the DB
    const [dbTemplateLanguage, setDbTemplateLanguage] = useState<string | null>(null);

    // Local state for the selector
    const [selectedTemplateLanguage, setSelectedTemplateLanguage] = useState<string>(uiLanguage);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch("/api/profile");
                if (response.ok) {
                    const data = await response.json();
                    if (data.templateLanguage) {
                        setDbTemplateLanguage(data.templateLanguage);
                        setSelectedTemplateLanguage(data.templateLanguage);
                    } else {
                        setDbTemplateLanguage(null);
                        setSelectedTemplateLanguage(uiLanguage);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            } finally {
                setIsFetching(false);
            }
        };

        if (session) {
            fetchProfile();
        }
    }, [session]);

    // Twist: logic: If user hasn't saved a template language, it follows UI language
    useEffect(() => {
        if (!dbTemplateLanguage && !isFetching) {
            setSelectedTemplateLanguage(uiLanguage);
        }
    }, [uiLanguage, dbTemplateLanguage, isFetching]);

    const handleSave = async () => {
        setIsLoading(true);

        try {
            const response = await fetch("/api/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    templateLanguage: selectedTemplateLanguage,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update settings");
            }

            setDbTemplateLanguage(selectedTemplateLanguage);
            toast.success("Settings updated successfully!");
        } catch (error) {
            toast.error("Failed to update settings");
            console.error("Settings update error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-purple-600">
                <Loader2 className="size-10 animate-spin" />
                <p className="font-medium animate-pulse">Loading settings...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* UI Language Section */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-purple-100 rounded-lg">
                        <Globe className="size-5 text-purple-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 tracking-tight">Interface Language</h3>
                        <p className="text-sm text-gray-500 font-medium">Change the language of the dashboard UI</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => setUiLanguage(lang.code as any)}
                            className={cn(
                                "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300 group",
                                uiLanguage === lang.code
                                    ? "bg-purple-600 border-purple-600 text-white shadow-[0_8px_16px_rgba(147,51,234,0.3)] scale-105"
                                    : "bg-white border-gray-100 text-gray-600 hover:border-purple-200 hover:bg-purple-50"
                            )}
                        >
                            <span className="text-3xl group-hover:scale-110 transition-transform">{lang.flag}</span>
                            <span className="text-xs font-bold tracking-tight uppercase">
                                {lang.name}
                            </span>
                        </button>
                    ))}
                </div>
            </section>

            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

            {/* Template Language Section */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-pink-100 rounded-lg">
                        <Languages className="size-5 text-pink-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 tracking-tight">Default Template Language</h3>
                        <p className="text-sm text-gray-500 font-medium">Default language for your website templates</p>
                    </div>
                </div>

                {!dbTemplateLanguage && (
                    <div className="bg-blue-50 border-1 border-blue-100 text-blue-700 p-4 rounded-2xl flex gap-3 items-center text-sm font-medium">
                        <Info className="size-5 flex-shrink-0" />
                        <p>Currently syncing with your Interface Language. Once you save a selection here, it will remain fixed.</p>
                    </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => setSelectedTemplateLanguage(lang.code)}
                            className={cn(
                                "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300 group",
                                selectedTemplateLanguage === lang.code
                                    ? "bg-pink-600 border-pink-600 text-white shadow-[0_8px_16px_rgba(219,39,119,0.3)] scale-105"
                                    : "bg-white border-gray-100 text-gray-600 hover:border-pink-200 hover:bg-pink-50"
                            )}
                        >
                            <span className="text-3xl group-hover:scale-110 transition-transform">{lang.flag}</span>
                            <span className="text-xs font-bold tracking-tight uppercase">
                                {lang.name}
                            </span>
                        </button>
                    ))}
                </div>
            </section>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 pt-8 shrink-0">
                <Button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-10 py-6 rounded-2xl font-bold shadow-lg gap-2 text-lg active:scale-95 transition-all"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="size-5 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="size-5" />
                            Save Preferences
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
};
