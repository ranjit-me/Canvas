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

const DEMO_BIRTHDAY_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Happy Birthday!</title>
</head>
<body>
    <div class="container">
        <div class="balloon balloon-1">🎈</div>
        <div class="balloon balloon-2">🎈</div>
        <div class="balloon balloon-3">🎈</div>
        
        <div class="cake">🎂</div>
        
        <h1 class="title">Happy Birthday!</h1>
        <p class="name" id="birthdayName">Dear Friend</p>
        <p class="message" id="wishMessage">
            Wishing you a day filled with love, laughter, and wonderful memories!
            May all your dreams come true! 🎉
        </p>
        
        <div class="confetti">
            <div class="confetti-piece"></div>
            <div class="confetti-piece"></div>
            <div class="confetti-piece"></div>
            <div class="confetti-piece"></div>
            <div class="confetti-piece"></div>
        </div>
    </div>
</body>
</html>`;

const DEMO_BIRTHDAY_CSS = `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.container {
    text-align: center;
    padding: 2rem;
    position: relative;
    z-index: 1;
}

.balloon {
    font-size: 4rem;
    position: absolute;
    animation: float 3s ease-in-out infinite;
}

.balloon-1 {
    left: 10%;
    top: 20%;
    animation-delay: 0s;
}

.balloon-2 {
    right: 15%;
    top: 30%;
    animation-delay: 1s;
}

.balloon-3 {
    left: 20%;
    bottom: 20%;
    animation-delay: 2s;
}

@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
}

.cake {
    font-size: 8rem;
    margin-bottom: 2rem;
    animation: bounce 1s ease infinite;
}

@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

.title {
    font-size: 4rem;
    color: white;
    text-shadow: 3px 3px 6px rgba(0,0,0,0.3);
    margin-bottom: 1rem;
    animation: glow 2s ease-in-out infinite;
}

@keyframes glow {
    0%, 100% { text-shadow: 0 0 20px #fff, 0 0 30px #fff, 0 0 40px #fff; }
    50% { text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff; }
}

.name {
    font-size: 2.5rem;
    color: #ffd700;
    font-weight: bold;
    margin-bottom: 2rem;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.message {
    font-size: 1.5rem;
    color: white;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    padding: 2rem;
    border-radius: 20px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.8;
}

.confetti {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    pointer-events: none;
}

.confetti-piece {
    position: absolute;
    width: 10px;
    height: 10px;
    background: #ffd700;
    top: -10px;
    animation: fall 4s linear infinite;
}

.confetti-piece:nth-child(1) {
    left: 10%;
    animation-delay: 0s;
    background: #ff6b6b;
}

.confetti-piece:nth-child(2) {
    left: 30%;
    animation-delay: 1s;
    background: #4ecdc4;
}

.confetti-piece:nth-child(3) {
    left: 50%;
    animation-delay: 2s;
    background: #ffd700;
}

.confetti-piece:nth-child(4) {
    left: 70%;
    animation-delay: 0.5s;
    background: #ff6b6b;
}

.confetti-piece:nth-child(5) {
    left: 90%;
    animation-delay: 1.5s;
    background: #4ecdc4;
}

@keyframes fall {
    to {
        transform: translateY(100vh) rotate(360deg);
    }
}`;

const DEMO_BIRTHDAY_JS = `// Make the birthday wish interactive
document.addEventListener('DOMContentLoaded', function() {
    // You can customize the name here
    const nameElement = document.getElementById('birthdayName');
    
    // Add click event to change colors
    document.querySelector('.title').addEventListener('click', function() {
        const colors = ['#ff6b6b', '#4ecdc4', '#ffd700', '#ff8c42', '#a8e6cf'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        this.style.color = randomColor;
    });
});`;

export default function CreatorHtmlPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const [templateName, setTemplateName] = useState("Demo Birthday Template");
    const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
    const [description, setDescription] = useState("A beautiful animated birthday wish template");
    const [category, setCategory] = useState("birthday");
    const [categoryId, setCategoryId] = useState("");
    const [subcategoryId, setSubcategoryId] = useState("");
    const [htmlCode, setHtmlCode] = useState(DEMO_BIRTHDAY_HTML);
    const [cssCode, setCssCode] = useState(DEMO_BIRTHDAY_CSS);
    const [jsCode, setJsCode] = useState(DEMO_BIRTHDAY_JS);
    const [thumbnail, setThumbnail] = useState("");
    const [price, setPrice] = useState(0);
    const [isFree, setIsFree] = useState(true);
    const [showPreview, setShowPreview] = useState(false);
    const [savedTemplateId, setSavedTemplateId] = useState<string | null>(null);

    const createMutation = useCreateHtmlTemplate();
    const publishMutation = usePublishHtmlTemplate();
    const { data: categories } = useGetCategories();
    const { data: myTemplates } = useGetHtmlTemplates({
        creatorId: session?.user?.id,
    });

    // Get filtered subcategories based on selected category
    const selectedCategory = categories?.find((cat: any) => cat.id === categoryId);
    const availableSubcategories = selectedCategory?.subcategories || [];

    const handleSave = async () => {
        if (!session?.user?.id) {
            alert("Please sign in to create templates");
            return;
        }

        const templateId = `html-${Date.now()}`;
        setSavedTemplateId(templateId);

        await createMutation.mutateAsync({
            id: templateId,
            name: templateName,
            description,
            htmlCode,
            cssCode,
            jsCode,
            category,
            categoryId: categoryId || undefined,
            subcategoryId: subcategoryId || undefined,
            thumbnail,
            price,
            isFree,
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

    const [activeTab, setActiveTab] = useState<'info' | 'html' | 'css' | 'js'>('info');

    const getPreviewHtml = () => {
        let preview = htmlCode;

        // If it's NOT a full document, wrap it
        if (!htmlCode.includes('<!DOCTYPE html>') && !htmlCode.includes('<html')) {
            preview = `
                <!DOCTYPE html>
                <html>
                    <head></head>
                    <body>
                        ${htmlCode}
                    </body>
                </html>
            `;
        }

        // Inject CSS if present
        if (cssCode.trim()) {
            if (preview.includes('</head>')) {
                preview = preview.replace('</head>', `<style>${cssCode}</style></head>`);
            } else {
                preview = `<style>${cssCode}</style>` + preview;
            }
        }

        // Inject JS if present
        if (jsCode.trim()) {
            if (preview.includes('</body>')) {
                preview = preview.replace('</body>', `<script>${jsCode}</script></body>`);
            } else {
                preview = preview + `<script>${jsCode}</script>`;
            }
        }

        return preview;
    };

    return (
        <div className="h-screen bg-gray-100 p-8 flex flex-col overflow-hidden font-sans">
            {/* Outer Container with heavy rounded corners */}
            <div className="flex-1 bg-white rounded-[3rem] shadow-2xl overflow-hidden border-8 border-gray-900 flex relative">

                {/* Left Pane: Tabs & Editor */}
                <div className="w-[45%] flex flex-col border-r-4 border-gray-900">
                    {/* Tab Navigation */}
                    <div className="flex items-center px-6 pt-6 pb-2 gap-4 overflow-x-auto">
                        {['info', 'html', 'css', 'js'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`px-4 py-2 rounded-full font-bold text-sm transition-all border-2 ${activeTab === tab
                                    ? 'bg-gray-900 text-white border-gray-900'
                                    : 'bg-transparent text-gray-500 border-transparent hover:bg-gray-100'
                                    }`}
                            >
                                {tab === 'info' ? 'Template Information' :
                                    tab === 'html' ? 'HTML' :
                                        tab === 'css' ? 'CSS' : 'Javascript'}
                            </button>
                        ))}
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

                        {/* HTML TAB */}
                        {activeTab === 'html' && (
                            <div className="h-full flex flex-col p-1 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <Label className="mb-2 font-mono text-xs text-gray-500 uppercase tracking-widest">Index.html</Label>
                                <textarea
                                    value={htmlCode}
                                    onChange={(e) => setHtmlCode(e.target.value)}
                                    className="flex-1 w-full bg-[#1e1e1e] text-gray-300 p-6 rounded-2xl font-mono text-sm leading-relaxed resize-none focus:outline-none focus:ring-4 focus:ring-gray-900/20"
                                    placeholder="<!-- Write your HTML here -->"
                                    spellCheck={false}
                                />
                            </div>
                        )}

                        {/* CSS TAB */}
                        {activeTab === 'css' && (
                            <div className="h-full flex flex-col p-1 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <Label className="mb-2 font-mono text-xs text-gray-500 uppercase tracking-widest">Styles.css</Label>
                                <textarea
                                    value={cssCode}
                                    onChange={(e) => setCssCode(e.target.value)}
                                    className="flex-1 w-full bg-[#1e1e1e] text-blue-300 p-6 rounded-2xl font-mono text-sm leading-relaxed resize-none focus:outline-none focus:ring-4 focus:ring-gray-900/20"
                                    placeholder="/* Write your CSS here */"
                                    spellCheck={false}
                                />
                            </div>
                        )}

                        {/* JS TAB */}
                        {activeTab === 'js' && (
                            <div className="h-full flex flex-col p-1 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <Label className="mb-2 font-mono text-xs text-gray-500 uppercase tracking-widest">Script.js</Label>
                                <textarea
                                    value={jsCode}
                                    onChange={(e) => setJsCode(e.target.value)}
                                    className="flex-1 w-full bg-[#1e1e1e] text-yellow-300 p-6 rounded-2xl font-mono text-sm leading-relaxed resize-none focus:outline-none focus:ring-4 focus:ring-gray-900/20"
                                    placeholder="// Write your JavaScript here"
                                    spellCheck={false}
                                />
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
