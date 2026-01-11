"use client";

import React, { useState, useEffect } from "react";
import { Edit3, Save, Eye, Globe, ArrowDownToLine, Rocket, Sparkles } from "lucide-react";
import { PublishDialog } from "@/features/web-projects/components/publish-dialog";
import { motion, AnimatePresence } from "framer-motion";

import { useUpdateHtmlTemplate } from "@/features/html-templates/api/use-update-html-template";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface HtmlTemplateEditorProps {
    template: any;
}

export default function HtmlTemplateEditor({ template }: HtmlTemplateEditorProps) {
    const [isEditMode, setIsEditMode] = useState(false);
    const [htmlCode, setHtmlCode] = useState(template.htmlCode || "");
    const [cssCode, setCssCode] = useState(template.cssCode || "");
    const [jsCode, setJsCode] = useState(template.jsCode || "");
    const [showPreview, setShowPreview] = useState(true);
    const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
    const { language: uiLanguage } = useLanguage();
    const [templateLanguage, setTemplateLanguage] = useState<string>(uiLanguage);

    useEffect(() => {
        const fetchPreferences = async () => {
            try {
                const response = await fetch("/api/profile");
                if (response.ok) {
                    const data = await response.json();
                    if (data.templateLanguage) {
                        setTemplateLanguage(data.templateLanguage);
                    } else {
                        setTemplateLanguage(uiLanguage);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch preferences", error);
            }
        };
        fetchPreferences();
    }, [uiLanguage]);

    const updateMutation = useUpdateHtmlTemplate(template.id);

    // Update state when template changes, but only if we haven't started editing
    // or if the server has a significantly different version (optional, but tricky)
    // For now, let's strictly INITIALIZE. 
    // Actually, if we want to support "undo" or external updates, we might need a more complex strategy.
    // But to stop "auto reloading" (resetting user work), we should NOT overwrite state on every template refetch.

    // We'll remove the auto-sync effect for now and rely on initial prop pass.
    // If we truly need to sync external changes, we should add a manual "Reset" button or clearer logic.
    /* 
    useEffect(() => {
        setHtmlCode(template.htmlCode || "");
        setCssCode(template.cssCode || "");
        setJsCode(template.jsCode || "");
    }, [template]);
    */

    const handleSave = async () => {
        try {
            await updateMutation.mutateAsync({
                htmlCode,
                cssCode,
                jsCode,
            });
            toast.success("Template saved successfully!");
            setIsEditMode(false);
        } catch (error) {
            toast.error("Failed to save template");
        }
    };

    const handlePublish = async (slug: string) => {
        try {
            await updateMutation.mutateAsync({
                slug,
                isPublished: true,
                // Ensure latest code is also saved
                htmlCode,
                cssCode,
                jsCode
            });
            toast.success("Template published successfully!");
            // Dialog closes automatically via callback, or we can close it here if needed
        } catch (error) {
            toast.error("Failed to publish template");
        }
    };

    const getPreviewHtml = () => {
        // Check if the code is already a full HTML document
        const isFullDocument = htmlCode.trim().toLowerCase().startsWith('<!doctype html') ||
            htmlCode.trim().toLowerCase().startsWith('<html');

        if (isFullDocument) {
            let processedHtml = htmlCode;

            // Inject CSS into <head>
            if (cssCode) {
                if (processedHtml.includes('</head>')) {
                    processedHtml = processedHtml.replace('</head>', `<style>${cssCode}</style></head>`);
                } else {
                    // If no head, try to inject after <html>
                    processedHtml = processedHtml.replace('<html>', `<html><head><style>${cssCode}</style></head>`);
                }
            }

            // Inject Translations
            const translations = template.translations ? template.translations : '{}';
            const translationScript = `
                <script>
                    window.TEMPLATE_TRANSLATIONS = ${translations};
                    window.CURRENT_LANGUAGE = "${templateLanguage}"; 
                </script>
            `;

            if (processedHtml.includes('</head>')) {
                processedHtml = processedHtml.replace('</head>', `${translationScript}</head>`);
            } else {
                if (processedHtml.includes('<body>')) {
                    processedHtml = processedHtml.replace('<body>', `<body>${translationScript}`);
                } else {
                    processedHtml = translationScript + processedHtml;
                }
            }

            // Inject JS before </body>
            if (jsCode) {
                if (processedHtml.includes('</body>')) {
                    processedHtml = processedHtml.replace('</body>', `<script>${jsCode}</script></body>`);
                } else {
                    processedHtml = processedHtml.replace('</html>', `<script>${jsCode}</script></html>`);
                }
            }

            return processedHtml;
        }

        // Inject Translations
        const translations = template.translations ? template.translations : '{}';
        const translationScript = `
            <script>
                window.TEMPLATE_TRANSLATIONS = ${translations};
                window.CURRENT_LANGUAGE = "${templateLanguage}"; 
            </script>
        `;

        // Legacy/Fragment Mode: Wrap content in default structure
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${template.name || 'Template'}</title>
    <style>${cssCode}</style>
</head>
<body>
    ${htmlCode}
    ${translationScript}
    <script>${jsCode}</script>
</body>
</html>
        `.trim();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <PublishDialog
                isOpen={isPublishDialogOpen}
                onClose={() => setIsPublishDialogOpen(false)}
                onPublish={handlePublish}
                defaultSlug={template.slug || ""}
                templateName={template.name || "Your Template"}
            />
            {/* Header - Only show in edit mode */}
            {isEditMode && (
                <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{template.name}</h1>
                                <p className="text-sm text-gray-500">Edit mode - Make changes to your template</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button
                                    onClick={() => setShowPreview(!showPreview)}
                                    variant="outline"
                                    className="flex items-center gap-2"
                                >
                                    <Eye className="w-4 h-4" />
                                    {showPreview ? "Hide" : "Show"} Preview
                                </Button>
                                <Button
                                    onClick={() => setIsPublishDialogOpen(true)}
                                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white"
                                >
                                    <Globe className="w-4 h-4" />
                                    Publish
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    disabled={updateMutation.isPending}
                                    className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600"
                                >
                                    <Save className="w-4 h-4" />
                                    {updateMutation.isPending ? "Saving..." : "Save Changes"}
                                </Button>
// ... (rest of the file)
                                <Button
                                    onClick={() => {
                                        setIsEditMode(false);
                                        // Reset to original values
                                        setHtmlCode(template.htmlCode || "");
                                        setCssCode(template.cssCode || "");
                                        setJsCode(template.jsCode || "");
                                    }}
                                    variant="outline"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                </header>
            )}

            {/* Content */}
            <div className={isEditMode ? "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" : ""}>
                {isEditMode ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left: Code Editors */}
                        <div className="space-y-6">
                            {/* HTML Editor */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
                                <h2 className="text-lg font-semibold text-gray-900">HTML Code</h2>
                                <textarea
                                    value={htmlCode}
                                    onChange={(e) => setHtmlCode(e.target.value)}
                                    className="w-full h-64 px-3 py-2 font-mono text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    placeholder="Enter HTML code"
                                    spellCheck={false}
                                />
                            </div>

                            {/* CSS Editor */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
                                <h2 className="text-lg font-semibold text-gray-900">CSS Code</h2>
                                <textarea
                                    value={cssCode}
                                    onChange={(e) => setCssCode(e.target.value)}
                                    className="w-full h-64 px-3 py-2 font-mono text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    placeholder="Enter CSS code"
                                    spellCheck={false}
                                />
                            </div>

                            {/* JavaScript Editor */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
                                <h2 className="text-lg font-semibold text-gray-900">JavaScript Code (Optional)</h2>
                                <textarea
                                    value={jsCode}
                                    onChange={(e) => setJsCode(e.target.value)}
                                    className="w-full h-64 px-3 py-2 font-mono text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    placeholder="Enter JavaScript code"
                                    spellCheck={false}
                                />
                            </div>
                        </div>

                        {/* Right: Live Preview */}
                        {showPreview && (
                            <div className="lg:sticky lg:top-24 h-fit">
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h2>
                                    <div className="border-2 border-gray-300 rounded-lg overflow-hidden" style={{ height: "600px" }}>
                                        <iframe
                                            srcDoc={getPreviewHtml()}
                                            className="w-full h-full"
                                            sandbox="allow-scripts allow-same-origin allow-forms"
                                            title="Template Preview"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    // Full preview mode - no header, fullscreen
                    <div className="relative w-full h-screen bg-gray-50">
                        <iframe
                            srcDoc={getPreviewHtml()}
                            className="w-full h-full border-0"
                            title={template.name || "Template"}
                            sandbox="allow-scripts allow-same-origin allow-forms"
                        />

                        {/* Floating Action Menu */}
                        <FloatingToolbar
                            onPreview={() => {
                                // Toggle Edit Mode or Open New Tab?
                                // For now, let's switch to Edit Mode as "Preview" implies viewing the "behind scenes" or code for a dev?
                                // Or more likely, "Preview" means "View purely", so maybe this button hides the toolbar?
                                // Let's interpret "Preview" as "Show Code" for the developer context, or standard "Preview"
                                // Given the screenshot has "Preview" enabled, let's assume it opens a clean new tab.
                                const blob = new Blob([getPreviewHtml()], { type: 'text/html' });
                                const url = URL.createObjectURL(blob);
                                window.open(url, '_blank');
                            }}
                            onSave={handleSave}
                            onPublish={() => setIsPublishDialogOpen(true)}
                            onEditCode={() => setIsEditMode(true)}
                        />
                    </div >
                )}
            </div >
        </div >
    );
}

function FloatingToolbar({
    onPreview,
    onSave,
    onPublish,
    onEditCode
}: {
    onPreview: () => void;
    onSave: () => void;
    onPublish: () => void;
    onEditCode: () => void;
}) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3 z-50 font-sans">
            {/* Hint Tooltip */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-black/80 backdrop-blur-md text-white text-xs px-4 py-2 rounded-lg shadow-lg border border-white/10 flex items-center gap-2 mb-2"
            >
                <Sparkles className="w-3 h-3 text-yellow-400" />
                Click on any text or image to edit
            </motion.div>

            {/* Main Toolbar Container */}
            <div
                className="bg-black/90 backdrop-blur-xl p-3 rounded-2xl border border-white/10 shadow-2xl flex flex-col gap-2 min-w-[200px]"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Preview Button */}
                <button
                    onClick={onPreview}
                    className="group flex items-center gap-3 w-full p-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                    <div className="bg-white/20 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
                        <Eye className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-sm">Preview</span>
                </button>

                {/* Save & Export */}
                <button
                    onClick={onSave}
                    className="group flex items-center gap-3 w-full p-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white shadow-lg shadow-purple-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                    <div className="bg-white/20 p-1.5 rounded-lg group-hover:-translate-y-0.5 transition-transform">
                        <ArrowDownToLine className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col items-start leading-none gap-0.5">
                        <span className="font-semibold text-sm">Save & Export</span>
                        <span className="text-[10px] opacity-70">Download HTML</span>
                    </div>
                </button>

                {/* Publish */}
                <button
                    onClick={onPublish}
                    className="group flex items-center gap-3 w-full p-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white shadow-lg shadow-pink-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                    <div className="bg-white/20 p-1.5 rounded-lg group-hover:scale-110 transition-transform">
                        <Rocket className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-sm">Publish</span>
                </button>

                {/* Code Editor Toggle (Subtle) */}
                <button
                    onClick={onEditCode}
                    className="mt-1 w-full py-2 text-xs text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-1.5 border-t border-white/10 pt-3"
                >
                    <Edit3 className="w-3 h-3" />
                    Open Code Editor
                </button>
            </div>
        </div>
    );
}
