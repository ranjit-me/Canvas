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
        <div className="min-h-screen font-sans overflow-hidden flex flex-col">
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
            <header className="border-b-2 border-black py-3 px-6 sticky top-0 z-50 bg-white">
                <div className="flex items-center justify-between max-w-[1800px] mx-auto">
                    {/* Left: Main Tabs */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setActiveMainTab('info')}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border-2 ${activeMainTab === 'info' ? 'bg-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black' : 'hover:bg-white/40 text-gray-700 border-transparent'}`}
                        >
                            Template Information
                        </button>
                        <button
                            onClick={() => setActiveMainTab('translation')}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border-2 ${activeMainTab === 'translation' ? 'bg-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black' : 'hover:bg-white/40 text-gray-700 border-transparent'}`}
                        >
                            Translation
                        </button>
                    </div>

                    {/* Middle: File Management */}
                    <div className="flex items-center gap-2 rounded-2xl p-1 border-2 border-black bg-white">
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
                                        className={`px-4 py-2 rounded-lg font-mono text-xs font-bold flex items-center gap-2 transition-all border-2 cursor-pointer ${activeFileId === file.id && activeMainTab === 'editor' ? 'bg-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black' : 'hover:bg-white/30 text-gray-600 border-transparent'}`}
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
                                            className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                onClick={() => addFile('html')}
                                className="p-2 rounded-lg hover:bg-white/40 text-black transition-all border-2 border-transparent hover:border-black/5"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Right Components */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-gray-700 uppercase tracking-tighter">Preview Language</span>
                            <div className="scale-90">
                                <LanguageSelector
                                    value={templatePreviewLanguage}
                                    onChange={setTemplatePreviewLanguage}
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 border-l-2 border-black/10 pl-4">
                            <Button
                                onClick={handleSave}
                                disabled={createMutation.isPending}
                                className="bg-white hover:bg-gray-50 text-black border-2 border-black font-bold h-10 px-6 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all text-xs"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {createMutation.isPending ? "Saving..." : "Save"}
                            </Button>
                            <Button
                                onClick={handlePublish}
                                disabled={!savedTemplateId || publishMutation.isPending}
                                className="bg-black hover:bg-gray-800 text-white border-2 border-white/10 font-bold h-10 px-6 rounded-xl shadow-[3px_3px_0px_0px_rgba(255,255,255,0.05)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all text-xs"
                            >
                                <Rocket className="w-4 h-4 mr-2" />
                                {publishMutation.isPending ? "Publishing..." : "Publish"}
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 p-4 flex gap-4 overflow-hidden relative">
                {isFetchingTemplate && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
                            <p className="text-sm font-bold text-gray-900 tracking-tight">Fetching template data...</p>
                        </div>
                    </div>
                )}
                {/* Left Side: Editor/Tabs */}
                <div className={`flex-1 flex flex-col gap-4 overflow-hidden ${activeMainTab === 'editor' ? 'max-w-[50%]' : 'max-w-full'}`}>
                    <div className="bg-white rounded-[2rem] border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] flex-1 flex flex-col overflow-hidden">
                        {activeMainTab === 'info' && (
                            <div className="p-8 space-y-6 overflow-y-auto">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2.5 bg-purple-100 rounded-xl border-2 border-black">
                                        <Settings className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <h2 className="text-2xl font-black text-gray-900 tracking-tighter">Template Information</h2>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-bold text-gray-700 ml-1">Template Name</Label>
                                        <Input
                                            value={templateName}
                                            onChange={(e) => setTemplateName(e.target.value)}
                                            className="h-12 border-2 border-black focus:ring-0 focus:border-purple-500 rounded-xl text-sm font-bold px-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)]"
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
                                                className="w-full h-12 border-2 border-black rounded-xl px-4 font-bold text-sm bg-white appearance-none"
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
                                                className="w-full h-12 border-2 border-black rounded-xl px-4 font-bold text-sm bg-white disabled:bg-gray-50 disabled:opacity-50 appearance-none"
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
                                            className="w-full min-h-[120px] border-2 border-black rounded-xl p-4 font-bold text-sm focus:outline-none focus:border-purple-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)]"
                                            placeholder="What makes this template special?"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-3 p-6 bg-blue-50 rounded-[1.5rem] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)]">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    onClick={() => setIsFree(!isFree)}
                                                    className={`w-8 h-8 rounded-lg border-2 border-black flex items-center justify-center cursor-pointer transition-all ${isFree ? 'bg-black text-white' : 'bg-white'}`}
                                                >
                                                    {isFree && <div className="w-3 h-3 bg-white rounded-full" />}
                                                </div>
                                                <div>
                                                    <span className="text-lg font-black text-gray-900 block">Free Template</span>
                                                    <span className="text-[10px] font-bold text-gray-500">Allow users to use this template for free</span>
                                                </div>
                                            </div>

                                            {!isFree && (
                                                <button
                                                    onClick={() => setIsPricingOpen(true)}
                                                    className="px-6 py-2 bg-white border-2 border-black rounded-lg font-black text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
                                                >
                                                    {price > 0 ? `$${price} USD` : "Set Price"}
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-bold text-gray-700 ml-1">Template Thumbnail</Label>
                                        <div className="border-2 border-black border-dashed rounded-[1.5rem] p-3 bg-gray-50">
                                            <ImageUpload value={thumbnail} onChange={setThumbnail} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeMainTab === 'translation' && (
                            <div className="p-8 space-y-6 overflow-y-auto h-full flex flex-col">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2.5 bg-blue-100 rounded-xl border-2 border-black">
                                        <Languages className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-gray-900 tracking-tighter">Translations (JSON)</h2>
                                        <p className="text-xs font-bold text-gray-500">Manage multiple languages for your template content</p>
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
                                        className="flex-1 w-full bg-[#1e1e1e] text-[#D4D4D4] p-6 rounded-[1.5rem] border-2 border-black font-mono text-sm leading-relaxed shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] focus:outline-none"
                                        spellCheck={false}
                                    />
                                    <div className="mt-4 p-4 bg-yellow-50 rounded-xl border-2 border-yellow-200 flex items-start gap-3">
                                        <Sparkles className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                                        <p className="text-[10px] font-bold text-yellow-800">
                                            Supported: en, hi, es, fr, de, ar, zh, pt, bn, ru, ur, id, te.
                                            The preview will automatically update when you switch languages in the header.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeMainTab === 'editor' && activeFile && (
                            <div className="flex-1 flex flex-col overflow-hidden">
                                <div className="flex items-center justify-between px-6 py-4 border-b-2 border-black bg-[#FAFAFA]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] border border-black" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] border border-black" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F] border border-black" />
                                        <span className="ml-4 font-mono text-[10px] font-bold text-black uppercase tracking-widest">
                                            {activeFile.name}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-gray-500 hover:text-black font-bold text-[10px] h-8 px-4 border border-transparent hover:border-black rounded-lg transition-all"
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
                                <div className="flex-1 relative overflow-hidden bg-[#1E1E1E]">
                                    <div className="absolute top-0 left-0 w-12 h-full bg-black/30 border-r border-white/5 flex flex-col items-center py-6 text-[10px] font-mono text-white/20 select-none">
                                        {Array.from({ length: 50 }).map((_, i) => (
                                            <div key={i} className="h-[20px]">{i + 1}</div>
                                        ))}
                                    </div>
                                    <textarea
                                        value={activeFile.content}
                                        onChange={(e) => updateFileContent(e.target.value)}
                                        className="absolute inset-y-0 left-12 right-0 p-6 font-mono text-[13px] leading-[20px] bg-transparent text-[#D4D4D4] focus:outline-none resize-none selection:bg-white/10"
                                        spellCheck={false}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Live Preview */}
                <div className={`flex-1 flex flex-col gap-4 overflow-hidden ${activeMainTab !== 'editor' ? 'hidden' : ''}`}>
                    <div className="bg-white rounded-[2rem] border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col flex-1">
                        <div className="bg-gray-50 px-6 py-4 border-b-2 border-black flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse border border-black" />
                                <span className="font-bold text-[10px] text-gray-900 uppercase tracking-widest">
                                    Live Preview
                                </span>
                            </div>
                            <div className="flex items-center gap-2 bg-white border border-black rounded-lg p-0.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                                <button
                                    onClick={() => setViewMode('desktop')}
                                    className={`p-1.5 rounded-[4px] transition-all ${viewMode === 'desktop' ? 'bg-black text-white' : 'hover:bg-gray-100 text-gray-500'}`}
                                >
                                    <Monitor className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('mobile')}
                                    className={`p-1.5 rounded-[4px] transition-all ${viewMode === 'mobile' ? 'bg-black text-white' : 'hover:bg-gray-100 text-gray-500'}`}
                                >
                                    <Smartphone className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className={`flex-1 relative overflow-hidden flex items-center justify-center p-6 bg-[#F8F9FA]`}>
                            <div className={`bg-white border-2 border-black transition-all duration-500 overflow-hidden relative shadow-[10px_10px_0px_0px_rgba(0,0,0,0.05)] ${viewMode === 'mobile'
                                ? 'w-[325px] h-[580px] rounded-[2rem] border-4'
                                : 'w-full h-full rounded-[1.5rem]'
                                }`}>
                                <iframe
                                    srcDoc={getPreviewHtml()}
                                    className="w-full h-full border-none"
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
