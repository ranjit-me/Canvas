"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Upload, Eye, Save, Send, Plus, X, Pencil, FileCode, Languages, Settings, Rocket, Sparkles, Monitor, Tablet, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateHtmlTemplate } from "@/features/html-templates/api/use-create-html-template";
import { usePublishHtmlTemplate } from "@/features/html-templates/api/use-publish-html-template";
import { useGetHtmlTemplates } from "@/features/html-templates/api/use-get-html-templates";
import { useGetHtmlTemplate } from "@/features/html-templates/api/use-get-html-template-by-id";
import { useUpdateHtmlTemplate } from "@/features/html-templates/api/use-update-html-template";
import { useSession } from "next-auth/react";
import ImageUpload from "@/components/admin/ImageUpload";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { PricingDialog } from "@/features/html-templates/components/PricingDialog";
import { DEFAULT_PRICING_BY_COUNTRY } from "@/lib/pricing";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

// File type definition
interface CodeFile {
    id: string;
    name: string;
    type: 'html' | 'css' | 'js';
    content: string;
}

export default function CreatorHtmlPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editingId = searchParams.get("id");
    const { data: session } = useSession();
    const [templateName, setTemplateName] = useState("");
    const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("birthday");
    const [categoryId, setCategoryId] = useState("");
    const [subcategoryId, setSubcategoryId] = useState("");
    const [thumbnail, setThumbnail] = useState("");
    const [price, setPrice] = useState(0);
    const [isFree, setIsFree] = useState(true);
    const [savedTemplateId, setSavedTemplateId] = useState<string | null>(editingId);
    const [pricingByCountry, setPricingByCountry] = useState<Record<string, number>>({ ...DEFAULT_PRICING_BY_COUNTRY });
    const [isPricingOpen, setIsPricingOpen] = useState(false);
    const { language: uiLanguage } = useLanguage();
    const [templatePreviewLanguage, setTemplatePreviewLanguage] = useState<string>(uiLanguage);

    // Sync template preview language with UI language changes by default
    useEffect(() => {
        setTemplatePreviewLanguage(uiLanguage);
    }, [uiLanguage]);

    // Redesigned states
    const [activeMainTab, setActiveMainTab] = useState<'info' | 'translation' | 'editor'>('editor');
    const [showPreview, setShowPreview] = useState(true);

    // File management state
    const [files, setFiles] = useState<CodeFile[]>([
        { id: 'html', name: 'index.html', type: 'html', content: '' },
        { id: 'css', name: 'styles.css', type: 'css', content: '' },
        { id: 'js', name: 'script.js', type: 'js', content: '' }
    ]);
    const [activeFileId, setActiveFileId] = useState('html');
    const [renamingFileId, setRenamingFileId] = useState<string | null>(null);
    const [renameValue, setRenameValue] = useState('');

    const createMutation = useCreateHtmlTemplate();
    const publishMutation = usePublishHtmlTemplate();
    const { data: categories } = useGetCategories();
    const { data: myTemplates } = useGetHtmlTemplates({
        creatorId: session?.user?.id,
    });
    const { data: existingTemplate, isLoading: isFetchingTemplate } = useGetHtmlTemplate(editingId);

    const updateAdminMutation = useUpdateHtmlTemplate();

    // Populate state when editing an existing template
    useEffect(() => {
        if (existingTemplate) {
            setTemplateName(existingTemplate.name || "");
            setDescription(existingTemplate.description || "");
            setCategoryId(existingTemplate.categoryId || "");
            setSubcategoryId(existingTemplate.subcategoryId || "");
            setThumbnail(existingTemplate.thumbnail || "");
            setPrice(existingTemplate.price || 0);
            setIsFree(existingTemplate.isFree ?? true);

            if (existingTemplate.pricingByCountry) {
                try {
                    setPricingByCountry(JSON.parse(existingTemplate.pricingByCountry));
                } catch (e) {
                    console.error("Failed to parse pricing", e);
                }
            }

            if (existingTemplate.translations) {
                try {
                    setTranslations(JSON.parse(existingTemplate.translations));
                } catch (e) {
                    console.error("Failed to parse translations", e);
                }
            }

            // Populate files
            const initialFiles: CodeFile[] = [
                { id: 'html', name: 'index.html', type: 'html', content: existingTemplate.htmlCode || '' },
                { id: 'css', name: 'styles.css', type: 'css', content: existingTemplate.cssCode || '' },
                { id: 'js', name: 'script.js', type: 'js', content: existingTemplate.jsCode || '' }
            ];
            setFiles(initialFiles);
        }
    }, [existingTemplate]);

    // Get filtered subcategories based on selected category
    const selectedCategory = categories?.find((cat: any) => cat.id === categoryId);
    const availableSubcategories = selectedCategory?.subcategories || [];

    // Get active file
    const activeFile = files.find(f => f.id === activeFileId);

    // File operations
    const updateFileContent = (content: string) => {
        setFiles(files.map(f =>
            f.id === activeFileId ? { ...f, content } : f
        ));
    };

    const removeFile = (fileId: string) => {
        const fileIndex = files.findIndex(f => f.id === fileId);
        const newFiles = files.filter(f => f.id !== fileId);

        if (newFiles.length === 0) {
            return; // Don't remove the last file
        }

        setFiles(newFiles);

        // If removing active file, switch to adjacent file
        if (fileId === activeFileId) {
            const newActiveIndex = Math.max(0, fileIndex - 1);
            setActiveFileId(newFiles[newActiveIndex].id);
        }
    };

    const addFile = (type: 'html' | 'css' | 'js') => {
        const extensions = { html: 'html', css: 'css', js: 'js' };
        const ext = extensions[type];
        let baseName = `new-file.${ext}`;
        let counter = 1;

        // Find unique name
        while (files.some(f => f.name === baseName)) {
            baseName = `new-file-${counter}.${ext}`;
            counter++;
        }

        const newFile: CodeFile = {
            id: Date.now().toString(),
            name: baseName,
            type,
            content: ''
        };

        setFiles([...files, newFile]);
        setActiveFileId(newFile.id);
    };


    const [translations, setTranslations] = useState<Record<string, Record<string, string>>>({
        en: {}, hi: {}, es: {}, fr: {}, de: {}, ar: {}, zh: {}, pt: {}, bn: {}, ru: {}, ur: {}, id: {}, te: {},
    });

    // Save & Publish handlers
    const handleSave = async () => {
        if (!session?.user?.id) {
            alert("Please sign in to create templates");
            return;
        }

        const htmlFile = files.find(f => f.type === 'html');
        const cssFile = files.find(f => f.type === 'css');
        const jsFile = files.find(f => f.type === 'js');

        const payload = {
            name: templateName,
            description,
            htmlCode: htmlFile?.content || '',
            cssCode: cssFile?.content || '',
            jsCode: jsFile?.content || '',
            category,
            categoryId: categoryId || undefined,
            subcategoryId: subcategoryId || undefined,
            thumbnail,
            price,
            isFree,
            pricingByCountry: JSON.stringify(pricingByCountry),
            translations: JSON.stringify(translations),
        };

        if (editingId || savedTemplateId) {
            await updateAdminMutation.mutateAsync({
                id: (editingId || savedTemplateId)!,
                ...payload
            });
        } else {
            const templateId = `html-${Date.now()}`;
            setSavedTemplateId(templateId);
            await createMutation.mutateAsync({
                id: templateId,
                ...payload
            });
        }
    };

    const handlePublish = async () => {
        if (!savedTemplateId) {
            alert("Please save the template first");
            return;
        }

        await publishMutation.mutateAsync({
            param: { id: savedTemplateId },
        });
    };

    const getPreviewHtml = () => {
        const htmlFile = files.find(f => f.type === 'html');
        const cssFile = files.find(f => f.type === 'css');
        const jsFile = files.find(f => f.type === 'js');

        let preview = htmlFile?.content || '';

        // Check if it's already a full HTML document
        const isFullDocument = preview.trim().toLowerCase().startsWith('<!doctype html') ||
            preview.trim().toLowerCase().startsWith('<html');

        if (isFullDocument) {
            let processedHtml = preview;

            // Inject CSS into <head>
            if (cssFile?.content) {
                if (processedHtml.includes('</head>')) {
                    processedHtml = processedHtml.replace('</head>', `<style>${cssFile.content}</style></head>`);
                } else {
                    processedHtml = processedHtml.replace('<html>', `<html><head><style>${cssFile.content}</style></head>`);
                }
            }

            // Inject Translations
            const translationsStr = JSON.stringify(translations);
            const translationScript = `
                <script>
                    window.TEMPLATE_TRANSLATIONS = ${translationsStr};
                    window.CURRENT_LANGUAGE = "${templatePreviewLanguage}"; 
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
            if (jsFile?.content) {
                if (processedHtml.includes('</body>')) {
                    processedHtml = processedHtml.replace('</body>', `<script>${jsFile.content}</script></body>`);
                } else {
                    processedHtml = processedHtml.replace('</html>', `<script>${jsFile.content}</script></html>`);
                }
            }

            return processedHtml;
        }

        // Legacy/Fragment Mode: Wrap content in default structure
        const translationStr = JSON.stringify(translations);
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${templateName || 'Template'}</title>
    <style>${cssFile?.content || ''}</style>
    <script>
        window.TEMPLATE_TRANSLATIONS = ${translationStr};
        window.CURRENT_LANGUAGE = "${templatePreviewLanguage}"; 
    </script>
</head>
<body>
    ${preview}
    <script>${jsFile?.content || ''}</script>
</body>
</html>
        `.trim();
    };

    return (
        <div className="min-h-screen font-sans overflow-hidden flex flex-col bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
            <PricingDialog
                isOpen={isPricingOpen}
                onOpenChange={setIsPricingOpen}
                pricing={pricingByCountry}
                onChange={(country, value) => {
                    setPricingByCountry(prev => ({
                        ...prev,
                        [country]: value
                    }));
                    if (country === 'US' || country === 'OTHER') {
                        setPrice(value);
                    }
                }}
            />

            {/* Main Header */}
            <header className="border-b border-white/40 backdrop-blur-xl bg-white/70 py-4 px-6 sticky top-0 z-50 shadow-lg shadow-purple-100/20">
                <div className="flex items-center justify-between max-w-[1800px] mx-auto">
                    {/* Left: Main Tabs */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setActiveMainTab('info')}
                            className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 ${activeMainTab === 'info'
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30 scale-105'
                                    : 'bg-white/60 hover:bg-white/90 text-gray-700 hover:shadow-md'
                                }`}
                        >
                            <Settings className="w-4 h-4 inline mr-2" />
                            Template Info
                        </button>
                        <button
                            onClick={() => setActiveMainTab('translation')}
                            className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 ${activeMainTab === 'translation'
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30 scale-105'
                                    : 'bg-white/60 hover:bg-white/90 text-gray-700 hover:shadow-md'
                                }`}
                        >
                            <Languages className="w-4 h-4 inline mr-2" />
                            Translation
                        </button>
                    </div>

                    {/* Middle: File Management */}
                    <div className="flex items-center gap-2 rounded-2xl p-1.5 bg-white/80 backdrop-blur-sm shadow-md border border-purple-100">
                        <div className="flex items-center gap-1.5 p-1 rounded-xl">
                            {files.map((file) => (
                                <div key={file.id} className="relative group">
                                    <div
                                        onClick={() => {
                                            setActiveMainTab('editor');
                                            setActiveFileId(file.id);
                                        }}
                                        onDoubleClick={() => {
                                            setRenamingFileId(file.id);
                                            setRenameValue(file.name);
                                        }}
                                        className={`px-4 py-2 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all duration-300 cursor-pointer ${activeFileId === file.id && activeMainTab === 'editor'
                                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                                                : 'hover:bg-purple-50 text-gray-700'
                                            }`}
                                    >
                                        <FileCode className="w-4 h-4" />
                                        {renamingFileId === file.id ? (
                                            <input
                                                autoFocus
                                                value={renameValue}
                                                onChange={(e) => setRenameValue(e.target.value)}
                                                onBlur={() => {
                                                    if (renameValue.trim()) {
                                                        setFiles(files.map(f => f.id === file.id ? { ...f, name: renameValue.trim() } : f));
                                                    }
                                                    setRenamingFileId(null);
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && renameValue.trim()) {
                                                        setFiles(files.map(f => f.id === file.id ? { ...f, name: renameValue.trim() } : f));
                                                        setRenamingFileId(null);
                                                    } else if (e.key === 'Escape') {
                                                        setRenamingFileId(null);
                                                    }
                                                }}
                                                className="bg-transparent border-none outline-none w-24 font-mono text-xs p-0"
                                            />
                                        ) : (
                                            <span>{file.name}</span>
                                        )}
                                    </div>
                                    {file.id !== 'html' && file.id !== 'css' && file.id !== 'js' && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeFile(file.id);
                                            }}
                                            className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:scale-110"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                onClick={() => addFile('html')}
                                className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 transition-all duration-300 hover:scale-110 hover:shadow-md"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Right Components */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-white/60 rounded-xl px-3 py-2">
                            <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">Preview Lang</span>
                            <div className="scale-90">
                                <LanguageSelector
                                    value={templatePreviewLanguage}
                                    onChange={setTemplatePreviewLanguage}
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                onClick={handleSave}
                                disabled={createMutation.isPending}
                                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold h-10 px-6 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {createMutation.isPending ? "Saving..." : "Save"}
                            </Button>
                            <Button
                                onClick={handlePublish}
                                disabled={!savedTemplateId || publishMutation.isPending}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold h-10 px-6 rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Rocket className="w-4 h-4 mr-2" />
                                {publishMutation.isPending ? "Publishing..." : "Publish"}
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 p-6 flex gap-6 overflow-hidden relative">
                {isFetchingTemplate && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-4 bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-purple-100">
                            <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
                            <p className="text-sm font-bold text-gray-900 tracking-tight">Fetching template data...</p>
                        </div>
                    </div>
                )}
                {/* Left Side: Editor/Tabs */}
                <div className={`flex-1 flex flex-col gap-6 overflow-hidden transition-all duration-500 ${activeMainTab === 'editor' ? 'max-w-[50%]' : 'max-w-full'}`}>
                    <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-purple-100/50 shadow-2xl shadow-purple-100/20 flex-1 flex flex-col overflow-hidden">
                        {activeMainTab === 'info' && (
                            <div className="p-8 space-y-6 overflow-y-auto">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg shadow-purple-500/30">
                                        <Settings className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Template Information</h2>
                                        <p className="text-sm text-gray-600 font-medium">Configure your template details</p>
                                    </div>
                                </div>
                                <div className="space-y-5">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-bold text-gray-700 ml-1">Template Name</Label>
                                        <Input
                                            value={templateName}
                                            onChange={(e) => setTemplateName(e.target.value)}
                                            className="h-12 border-2 border-purple-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 rounded-xl text-sm font-semibold px-4 bg-white/50 backdrop-blur-sm transition-all duration-300"
                                            placeholder="Enter template name..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-bold text-gray-700 ml-1">Category</Label>
                                            <select
                                                value={categoryId}
                                                onChange={(e) => {
                                                    setCategoryId(e.target.value);
                                                    setSubcategoryId("");
                                                }}
                                                className="w-full h-12 border-2 border-purple-200 focus:border-purple-500 rounded-xl px-4 font-semibold text-sm bg-white/50 backdrop-blur-sm transition-all duration-300"
                                            >
                                                <option value="">Select Category</option>
                                                {categories?.map((cat: any) => (
                                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-bold text-gray-700 ml-1">Subcategory</Label>
                                            <select
                                                value={subcategoryId}
                                                onChange={(e) => setSubcategoryId(e.target.value)}
                                                disabled={!categoryId}
                                                className="w-full h-12 border-2 border-purple-200 focus:border-purple-500 rounded-xl px-4 font-semibold text-sm bg-white/50 backdrop-blur-sm disabled:bg-gray-100 disabled:opacity-60 transition-all duration-300"
                                            >
                                                <option value="">Select Subcategory</option>
                                                {availableSubcategories.map((subcat: any) => (
                                                    <option key={subcat.id} value={subcat.id}>{subcat.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-bold text-gray-700 ml-1">Description</Label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="w-full min-h-[120px] border-2 border-purple-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 rounded-xl p-4 font-semibold text-sm bg-white/50 backdrop-blur-sm transition-all duration-300"
                                            placeholder="What makes this template special?"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-4 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border-2 border-purple-200 shadow-lg">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div
                                                    onClick={() => setIsFree(!isFree)}
                                                    className={`w-12 h-12 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 shadow-lg ${isFree
                                                            ? 'bg-gradient-to-br from-purple-600 to-pink-600 scale-105'
                                                            : 'bg-white hover:bg-purple-50'
                                                        }`}
                                                >
                                                    {isFree && <div className="w-4 h-4 bg-white rounded-full animate-pulse" />}
                                                </div>
                                                <div>
                                                    <span className="text-lg font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent block">Free Template</span>
                                                    <span className="text-xs font-semibold text-gray-600">Allow users to use this template for free</span>
                                                </div>
                                            </div>

                                            {!isFree && (
                                                <button
                                                    onClick={() => setIsPricingOpen(true)}
                                                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-black text-sm shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300 hover:scale-105"
                                                >
                                                    {price > 0 ? `$${price} USD` : "Set Price"}
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-bold text-gray-700 ml-1">Template Thumbnail</Label>
                                        <div className="border-2 border-purple-200 border-dashed rounded-2xl p-4 bg-gradient-to-br from-purple-50/50 to-pink-50/50 backdrop-blur-sm hover:border-purple-400 transition-all duration-300">
                                            <ImageUpload value={thumbnail} onChange={setThumbnail} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeMainTab === 'translation' && (
                            <div className="p-8 space-y-6 overflow-y-auto h-full flex flex-col">
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg shadow-blue-500/30">
                                        <Languages className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Translations (JSON)</h2>
                                        <p className="text-sm font-semibold text-gray-600">Manage multiple languages for your template content</p>
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-col min-h-[300px]">
                                    <textarea
                                        value={JSON.stringify(translations, null, 2)}
                                        onChange={(e) => {
                                            try {
                                                const parsed = JSON.parse(e.target.value);
                                                setTranslations(parsed);
                                            } catch (err) { }
                                        }}
                                        className="flex-1 w-full bg-gradient-to-br from-gray-900 to-gray-800 text-green-300 p-6 rounded-2xl border-2 border-purple-200 font-mono text-sm leading-relaxed shadow-2xl focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all duration-300"
                                        spellCheck={false}
                                    />
                                    <div className="mt-4 p-5 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl border-2 border-yellow-300 flex items-start gap-3 shadow-lg">
                                        <Sparkles className="w-5 h-5 text-yellow-600 shrink-0 mt-1 animate-pulse" />
                                        <p className="text-xs font-bold text-yellow-900">
                                            Supported: en, hi, es, fr, de, ar, zh, pt, bn, ru, ur, id, te.
                                            The preview will automatically update when you switch languages in the header.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeMainTab === 'editor' && activeFile && (
                            <div className="flex-1 flex flex-col overflow-hidden">
                                <div className="flex items-center justify-between px-6 py-4 border-b border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50 animate-pulse" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/50 animate-pulse" />
                                        <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50 animate-pulse" />
                                        <span className="ml-4 font-mono text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent uppercase tracking-widest">
                                            {activeFile.name}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-purple-600 hover:text-purple-700 hover:bg-purple-100 font-bold text-xs h-9 px-4 rounded-xl transition-all duration-300"
                                            onClick={() => {
                                                setRenamingFileId(activeFileId);
                                                setRenameValue(activeFile.name);
                                            }}
                                        >
                                            <Pencil className="w-3.5 h-3.5 mr-2" />
                                            Rename
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
                                    <div className="absolute top-0 left-0 w-14 h-full bg-black/40 backdrop-blur-sm border-r border-purple-500/20 flex flex-col items-center py-6 text-xs font-mono text-purple-300/40 select-none">
                                        {Array.from({ length: 50 }).map((_, i) => (
                                            <div key={i} className="h-[20px] hover:text-purple-300 transition-colors">{i + 1}</div>
                                        ))}
                                    </div>
                                    <textarea
                                        value={activeFile.content}
                                        onChange={(e) => updateFileContent(e.target.value)}
                                        className="absolute inset-y-0 left-14 right-0 p-6 font-mono text-sm leading-[20px] bg-transparent text-green-300 focus:outline-none resize-none selection:bg-purple-500/30 caret-purple-400"
                                        spellCheck={false}
                                        placeholder="Start coding your template here..."
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Live Preview */}
                <div className={`flex-1 flex flex-col gap-6 overflow-hidden transition-all duration-500 ${activeMainTab !== 'editor' ? 'hidden' : ''}`}>
                    <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-purple-100/50 shadow-2xl shadow-purple-100/20 overflow-hidden flex flex-col flex-1">
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-purple-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50" />
                                <span className="font-bold text-xs bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent uppercase tracking-widest">
                                    Live Preview
                                </span>
                                <Eye className="w-4 h-4 text-purple-600 animate-pulse" />
                            </div>
                            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-xl p-1 shadow-md">
                                <button
                                    onClick={() => setViewMode('desktop')}
                                    className={`p-2 rounded-lg transition-all duration-300 ${viewMode === 'desktop'
                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                                            : 'hover:bg-purple-50 text-gray-500'
                                        }`}
                                >
                                    <Monitor className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('mobile')}
                                    className={`p-2 rounded-lg transition-all duration-300 ${viewMode === 'mobile'
                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                                            : 'hover:bg-purple-50 text-gray-500'
                                        }`}
                                >
                                    <Smartphone className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className={`flex-1 relative overflow-hidden flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-purple-50`}>
                            <div className={`bg-white border-2 border-purple-200 transition-all duration-500 overflow-hidden relative shadow-2xl hover:shadow-3xl ${viewMode === 'mobile'
                                    ? 'w-[375px] h-[667px] rounded-[3rem] border-[8px] border-gray-800 shadow-purple-500/20'
                                    : 'w-full h-full rounded-2xl shadow-purple-500/10'
                                }`}>
                                <iframe
                                    srcDoc={getPreviewHtml()}
                                    className="w-full h-full border-none rounded-xl"
                                    sandbox="allow-scripts allow-modals allow-forms allow-same-origin allow-popups"
                                    title="Live Preview"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
