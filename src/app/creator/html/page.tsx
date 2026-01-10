"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload, Eye, Save, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateHtmlTemplate } from "@/features/html-templates/api/use-create-html-template";
import { usePublishHtmlTemplate } from "@/features/html-templates/api/use-publish-html-template";
import { useGetHtmlTemplates } from "@/features/html-templates/api/use-get-html-templates";
import { useSession } from "next-auth/react";
import ImageUpload from "@/components/admin/ImageUpload";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { Plus, X, Pencil } from "lucide-react";

// File type definition
interface CodeFile {
    id: string;
    name: string;
    type: 'html' | 'css' | 'js';
    content: string;
}

export default function CreatorHtmlPage() {
    const router = useRouter();
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
    const [showPreview, setShowPreview] = useState(false);
    const [savedTemplateId, setSavedTemplateId] = useState<string | null>(null);

    // File management state
    const [files, setFiles] = useState<CodeFile[]>([
        { id: '1', name: 'index.html', type: 'html', content: '' },
        { id: '2', name: 'styles.css', type: 'css', content: '' },
        { id: '3', name: 'script.js', type: 'js', content: '' }
    ]);
    const [activeFileId, setActiveFileId] = useState('1');
    const [renamingFileId, setRenamingFileId] = useState<string | null>(null);
    const [renameValue, setRenameValue] = useState('');
    const [showAddFileMenu, setShowAddFileMenu] = useState(false);

    const createMutation = useCreateHtmlTemplate();
    const publishMutation = usePublishHtmlTemplate();
    const { data: categories } = useGetCategories();
    const { data: myTemplates } = useGetHtmlTemplates({
        creatorId: session?.user?.id,
    });

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

    const closeFile = (fileId: string) => {
        const fileIndex = files.findIndex(f => f.id === fileId);
        const newFiles = files.filter(f => f.id !== fileId);

        if (newFiles.length === 0) {
            return; // Don't close the last file
        }

        setFiles(newFiles);

        // If closing active file, switch to adjacent file
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
        setShowAddFileMenu(false);
    };

    const startRename = (fileId: string, currentName: string) => {
        setRenamingFileId(fileId);
        setRenameValue(currentName);
    };

    const finishRename = () => {
        if (renamingFileId && renameValue.trim()) {
            setFiles(files.map(f =>
                f.id === renamingFileId ? { ...f, name: renameValue.trim() } : f
            ));
        }
        setRenamingFileId(null);
        setRenameValue('');
    };

    const cancelRename = () => {
        setRenamingFileId(null);
        setRenameValue('');
    };

    // Translation state
    const [activeTab, setActiveTab] = useState<'info' | 'code' | 'translation'>('info');
    const [translations, setTranslations] = useState<Record<string, Record<string, string>>>({
        en: {}, hi: {}, es: {}, fr: {}, de: {}, ar: {}, zh: {}, pt: {}, bn: {}, ru: {}, ur: {}, id: {}, te: {},
    });

    // Save & Publish handlers
    const handleSave = async () => {
        if (!session?.user?.id) {
            alert("Please sign in to create templates");
            return;
        }

        const templateId = `html-${Date.now()}`;
        setSavedTemplateId(templateId);

        // Extract code from files by type
        const htmlFile = files.find(f => f.type === 'html');
        const cssFile = files.find(f => f.type === 'css');
        const jsFile = files.find(f => f.type === 'js');

        await createMutation.mutateAsync({
            id: templateId,
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
            translations: JSON.stringify(translations),
        });
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

        // If it's NOT a full document, wrap it
        if (!preview.includes('<!DOCTYPE html>') && !preview.includes('<html')) {
            preview = `
                <!DOCTYPE html>
                <html>
                    <head></head>
                    <body>
                        ${preview}
                    </body>
                </html>
            `;
        }

        // Inject CSS if present
        if (cssFile?.content?.trim()) {
            if (preview.includes('</head>')) {
                preview = preview.replace('</head>', `<style>${cssFile.content}</style></head>`);
            } else {
                preview = `<style>${cssFile.content}</style>` + preview;
            }
        }

        // Inject JS if present
        if (jsFile?.content?.trim()) {
            if (preview.includes('</body>')) {
                preview = preview.replace('</body>', `<script>${jsFile.content}</script></body>`);
            } else {
                preview = preview + `<script>${jsFile.content}</script>`;
            }
        }

        return preview;
    };

    return (
        <div className="h-screen bg-gray-100 p-8 flex flex-col overflow-hidden font-sans">
            {/* Outer Container with Siri-like hover animation */}
            <div className="flex-1 bg-white rounded-[3rem] shadow-2xl overflow-hidden flex relative transition-all duration-500 ease-out hover:shadow-[0_0_60px_rgba(59,130,246,0.5)] hover:scale-[1.02]">

                {/* Left Pane: Tabs & Editor */}
                <div className="w-[45%] flex flex-col border-r-4 border-gray-900">
                    {/* Tab Navigation - File Tabs Style */}
                    <div className="flex items-center px-4 pt-4 pb-2 gap-2 overflow-x-auto bg-gray-50 border-b-2 border-gray-200">
                        {/* Static Tabs (Template Info, Translation) */}
                        <button
                            onClick={() => setActiveTab('info')}
                            className={`px-4 py-2 rounded-t-lg font-semibold text-sm transition-all whitespace-nowrap ${activeTab === 'info'
                                ? 'bg-white text-gray-900 border-b-2 border-blue-500'
                                : 'bg-transparent text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            Template Information
                        </button>

                        <button
                            onClick={() => setActiveTab('translation')}
                            className={`px-4 py-2 rounded-t-lg font-semibold text-sm transition-all whitespace-nowrap ${activeTab === 'translation'
                                ? 'bg-white text-gray-900 border-b-2 border-blue-500'
                                : 'bg-transparent text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            Translation
                        </button>

                        <div className="w-px h-6 bg-gray-300 mx-2"></div>

                        {/* File Tabs */}
                        {files.map((file) => (
                            <div
                                key={file.id}
                                onClick={() => {
                                    setActiveTab('code');
                                    setActiveFileId(file.id);
                                }}
                                className={`group flex items-center gap-2 px-3 py-2 rounded-t-lg text-sm cursor-pointer transition-all ${activeTab === 'code' && activeFileId === file.id
                                    ? 'bg-white text-blue-600 font-semibold border-b-2 border-blue-500'
                                    : 'bg-transparent text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {/* File name or rename input */}
                                {renamingFileId === file.id ? (
                                    <input
                                        type="text"
                                        value={renameValue}
                                        onChange={(e) => setRenameValue(e.target.value)}
                                        onBlur={finishRename}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') finishRename();
                                            if (e.key === 'Escape') cancelRename();
                                        }}
                                        className="bg-white border border-blue-500 rounded px-1 text-xs outline-none"
                                        autoFocus
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                ) : (
                                    <>
                                        <span className="text-xs">{file.name}</span>

                                        {/* Rename button */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                startRename(file.id, file.name);
                                            }}
                                            className="opacity-0 group-hover:opacity-100 hover:bg-gray-200 rounded p-0.5"
                                        >
                                            <Pencil className="w-3 h-3" />
                                        </button>

                                        {/* Close button */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                closeFile(file.id);
                                            }}
                                            className="opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 rounded p-0.5"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </>
                                )}
                            </div>
                        ))}

                        {/* Add File Button with Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowAddFileMenu(!showAddFileMenu)}
                                className="p-2 hover:bg-gray-200 rounded transition-all text-gray-600"
                                title="Add new file"
                            >
                                <Plus className="w-4 h-4" />
                            </button>

                            {showAddFileMenu && (
                                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[150px]">
                                    <button
                                        onClick={() => addFile('html')}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700 first:rounded-t-lg"
                                    >
                                        New HTML file
                                    </button>
                                    <button
                                        onClick={() => addFile('css')}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                                    >
                                        New CSS file
                                    </button>
                                    <button
                                        onClick={() => addFile('js')}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700 last:rounded-b-lg"
                                    >
                                        New JS file
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-6">

                        {/* INFO TAB */}
                        {activeTab === 'info' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                                <h2 className="text-2xl font-black text-gray-900">Template Details</h2>

                                <div className="space-y-4">
                                    <div>
                                        <Label>Template Name</Label>
                                        <Input
                                            value={templateName}
                                            onChange={(e) => setTemplateName(e.target.value)}
                                            className="border-2 border-gray-200 focus:border-gray-900 rounded-xl py-6"
                                            placeholder="My Awesome Template"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label>Category</Label>
                                            <select
                                                value={categoryId}
                                                onChange={(e) => {
                                                    setCategoryId(e.target.value);
                                                    setSubcategoryId("");
                                                }}
                                                className="w-full mt-1 px-3 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 bg-white"
                                            >
                                                <option value="">Select Category</option>
                                                {categories?.map((cat: any) => (
                                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <Label>Subcategory</Label>
                                            <select
                                                value={subcategoryId}
                                                onChange={(e) => setSubcategoryId(e.target.value)}
                                                disabled={!categoryId}
                                                className="w-full mt-1 px-3 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 bg-white disabled:bg-gray-50"
                                            >
                                                <option value="">Select Subcategory</option>
                                                {availableSubcategories.map((subcat: any) => (
                                                    <option key={subcat.id} value={subcat.id}>{subcat.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <Label>Description</Label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="w-full mt-1 px-3 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 min-h-[100px]"
                                            placeholder="Tell us about this template..."
                                        />
                                    </div>

                                    <div className="flex items-center gap-4 p-4 border-2 border-dashed border-gray-200 rounded-xl">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center ${isFree ? 'bg-gray-900 border-gray-900' : 'border-gray-300'}`}>
                                                {isFree && <div className="w-2 h-2 bg-white rounded-full" />}
                                                <input
                                                    type="checkbox"
                                                    checked={isFree}
                                                    onChange={(e) => setIsFree(e.target.checked)}
                                                    className="hidden"
                                                />
                                            </div>
                                            <span className="font-bold text-gray-700">Free Template</span>
                                        </label>

                                        {!isFree && (
                                            <div className="flex-1">
                                                <Input
                                                    type="number"
                                                    value={price}
                                                    onChange={(e) => setPrice(Number(e.target.value))}
                                                    placeholder="Price (₹)"
                                                    className="border-gray-200 rounded-lg"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Thumbnail</Label>
                                        <div className="border-2 border-gray-100 rounded-xl overflow-hidden">
                                            <ImageUpload value={thumbnail} onChange={setThumbnail} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* CODE EDITOR TAB (for all files) */}
                        {activeTab === 'code' && activeFile && (
                            <div className="h-full flex flex-col p-1 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <Label className="mb-2 font-mono text-xs text-gray-500 uppercase tracking-widest">{activeFile.name}</Label>
                                <textarea
                                    value={activeFile.content}
                                    onChange={(e) => updateFileContent(e.target.value)}
                                    className="flex-1 w-full bg-[#1e1e1e] text-gray-300 p-6 rounded-2xl font-mono text-sm leading-relaxed resize-none focus:outline-none focus:ring-4 focus:ring-gray-900/20"
                                    placeholder={`// Write your ${activeFile.type.toUpperCase()} code here`}
                                    spellCheck={false}
                                />
                            </div>
                        )}

                        {/* TRANSLATION TAB */}
                        {activeTab === 'translation' && (
                            <div className="h-full flex flex-col p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <div className="mb-4">
                                    <h2 className="text-xl font-black text-gray-900 mb-2">Template Translations</h2>
                                    <p className="text-sm text-gray-500 mb-4">
                                        Add translations as a JSON object. Supported languages: en, hi, es, fr, de, ar, zh, pt, bn, ru, ur, id, te
                                    </p>
                                </div>

                                <div className="flex-1 flex flex-col">
                                    <Label className="mb-2 font-mono text-xs text-gray-500 uppercase tracking-widest">
                                        Translations (JSON)
                                    </Label>
                                    <textarea
                                        value={JSON.stringify(translations, null, 2)}
                                        onChange={(e) => {
                                            try {
                                                const parsed = JSON.parse(e.target.value);
                                                setTranslations(parsed);
                                            } catch (err) {
                                                // Invalid JSON, just update the text (will show error on blur)
                                            }
                                        }}
                                        className="flex-1 w-full bg-[#1e1e1e] text-green-300 p-6 rounded-2xl font-mono text-sm leading-relaxed resize-none focus:outline-none focus:ring-4 focus:ring-gray-900/20"
                                        placeholder={`{\n  "en": { "key": "value" },\n  "hi": { "key": "मान" }\n}`}
                                        spellCheck={false}
                                    />
                                    <p className="mt-2 text-xs text-gray-500">
                                        Supported languages: en, hi, es, fr, de, ar, zh, pt, bn, ru, ur, id, te
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Pane: Preview & Actions */}
                <div className="w-[55%] bg-gray-50 flex flex-col relative">
                    {/* Floating Header Actions */}
                    <div className="absolute top-6 right-6 z-30 flex gap-3">
                        <Button
                            onClick={handleSave}
                            disabled={createMutation.isPending}
                            className="bg-white text-gray-900 border-2 border-gray-900 hover:bg-gray-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all rounded-xl font-bold px-6"
                        >
                            {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Save"}
                        </Button>
                        <Button
                            onClick={handlePublish}
                            disabled={!savedTemplateId || publishMutation.isPending}
                            className="bg-gray-900 text-white border-2 border-gray-900 hover:bg-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] transition-all rounded-xl font-bold px-6"
                        >
                            {publishMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Publish"}
                        </Button>
                    </div>

                    <div className="absolute top-6 left-6 z-30">
                        <div className="bg-white/80 backdrop-blur px-4 py-2 rounded-full border border-gray-200 text-xs font-mono text-gray-400 uppercase tracking-widest">
                            Live Preview
                        </div>
                    </div>

                    {/* View Options Toggle */}
                    <div className="absolute bottom-6 right-6 z-30">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="bg-gray-900 text-white border-2 border-gray-900 hover:bg-gray-800 rounded-xl font-bold px-4 gap-2">
                                    {viewMode === 'desktop' ? 'Desktop View' : 'Mobile View'}
                                    <div className="w-px h-4 bg-gray-700 mx-1" />
                                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 bg-white border-2 border-gray-900 rounded-xl p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                <DropdownMenuItem onClick={() => setViewMode('desktop')} className="rounded-lg hover:bg-gray-100 cursor-pointer p-2 font-bold text-gray-700">
                                    Desktop View
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setViewMode('mobile')} className="rounded-lg hover:bg-gray-100 cursor-pointer p-2 font-bold text-gray-700">
                                    Mobile View
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className={`flex-1 p-4 pt-20 transition-all duration-300 flex items-center justify-center ${viewMode === 'mobile' ? 'bg-gray-200/50' : ''}`}>
                        {/* Dynamic Preview Container */}
                        <div className={`bg-white transition-all duration-500 overflow-hidden relative shadow-lg ${viewMode === 'mobile'
                            ? 'w-[375px] h-[667px] rounded-[3rem] border-8 border-gray-800'
                            : 'w-full h-full rounded-[2rem] border-4 border-gray-200'
                            }`}>
                            {viewMode === 'mobile' && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-xl z-10" />
                            )}
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
        </div>
    );
}
