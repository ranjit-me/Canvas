"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Upload,
    FileCode,
    DollarSign,
    Layout,
    CheckCircle2,
    Loader2,
    X,
    Code,
    ArrowRight,
    Eye,
    Zap,
    RefreshCw
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { client } from "@/lib/hono";
import { UniversalTemplateLoader } from "@/components/UniversalTemplateLoader";
import { transformTemplateCode } from "@/lib/template-converter";
import { EditModeProvider } from "@/app/(dashboard)/web/features/hooks/useEditMode";
import { useDebounce } from "react-use";

export default function TemplateUploadPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploaded, setIsUploaded] = useState(false);
    const [activeTab, setActiveTab] = useState<"edit" | "preview" | "sandbox">("edit");
    const [sandboxPath, setSandboxPath] = useState<string | null>(null);
    const [isSavingSandbox, setIsSavingSandbox] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        category: "birthday",
        price: "299",
        description: "",
        codeContent: "",
    });
    const [leftTab, setLeftTab] = useState<"code" | "schema">("code");
    const [configSchema, setConfigSchema] = useState<{ key: string; type: "text" | "color" | "image"; label: string }[]>([]);
    const [initialConfig, setInitialConfig] = useState<Record<string, any>>({});
    const [showFullPreview, setShowFullPreview] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const modalIframeRef = useRef<HTMLIFrameElement>(null);

    // Debounced sandbox save
    useDebounce(
        async () => {
            if (!formData.codeContent || !formData.name) return;

            setIsSavingSandbox(true);
            try {
                const slug = formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
                const response = await client.api["web-templates"]["sandbox"].$post({
                    json: { slug, codeContent: formData.codeContent }
                });

                if (response.ok) {
                    const data = await response.json();
                    setSandboxPath(data.path);
                    console.log("Sandbox updated:", data.path);
                }
            } catch (err) {
                console.error("Sandbox save failed:", err);
            } finally {
                setIsSavingSandbox(false);
            }
        },
        1500,
        [formData.codeContent, formData.name]
    );

    // Transform code for preview in real-time
    const previewCode = useMemo(() => {
        if (!formData.codeContent) return "";
        try {
            return transformTemplateCode(formData.codeContent);
        } catch (e) {
            console.error("Preview transform failed", e);
            return "Error transforming code for preview.";
        }
    }, [formData.codeContent]);

    // Sync config with sandbox iframes
    useEffect(() => {
        const sync = () => {
            const data = { type: "UPDATE_CONFIG", config: initialConfig };
            iframeRef.current?.contentWindow?.postMessage(data, "*");
            modalIframeRef.current?.contentWindow?.postMessage(data, "*");
        };
        sync();

        const handleReady = (e: MessageEvent) => {
            if (e.data.type === "SANDBOX_READY") sync();
        };
        window.addEventListener("message", handleReady);
        return () => window.removeEventListener("message", handleReady);
    }, [initialConfig]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.codeContent) {
            toast.error("Please paste your template code");
            return;
        }

        setIsLoading(true);
        try {
            setUploadProgress(40);

            const response = await client.api["web-templates"]["creator"].$post({
                json: {
                    name: formData.name,
                    category: formData.category,
                    price: parseInt(formData.price),
                    description: formData.description,
                    componentCode: formData.codeContent,
                    configSchema: JSON.stringify(configSchema),
                    initialConfig: JSON.stringify(initialConfig)
                }
            });

            if (!response.ok) {
                throw new Error("Upload failed");
            }

            setUploadProgress(100);
            setIsLoading(false);
            setIsUploaded(true);
            toast.success("Template uploaded successfully!");
        } catch (error) {
            toast.error("Failed to upload template");
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-[1400px] mx-auto px-4">
            {/* Full Screen Preview Modal */}
            <AnimatePresence>
                {showFullPreview && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-white flex flex-col"
                    >
                        <div className="h-16 px-8 border-b border-gray-100 flex items-center justify-between bg-white">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <Eye className="w-4 h-4 text-white" />
                                </div>
                                <span className="font-black text-gray-900 tracking-tight">Full-Screen Preview Mode</span>
                            </div>
                            <div className="flex bg-gray-100 p-1 rounded-xl">
                                <button
                                    onClick={() => setActiveTab("preview")}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === "preview" ? "bg-white text-blue-600 shadow-sm" : "text-gray-400"}`}
                                    title="Check how the editor 'infects' your design for editing"
                                >
                                    Editor Mode
                                </button>
                                <button
                                    onClick={() => setActiveTab("sandbox")}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === "sandbox" ? "bg-white text-blue-600 shadow-sm" : "text-gray-400"}`}
                                    title="Check interactions, logic, and animations in a real React environment"
                                >
                                    Live Runner
                                </button>
                            </div>
                            <button
                                onClick={() => setShowFullPreview(false)}
                                className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-900"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto bg-gray-50/30">
                            <div className="max-w-[1200px] mx-auto min-h-full bg-white shadow-2xl relative">
                                {activeTab === "sandbox" && sandboxPath ? (
                                    <iframe
                                        ref={modalIframeRef}
                                        src={sandboxPath}
                                        className="w-full h-[90vh] border-none"
                                    />
                                ) : (
                                    <EditModeProvider forcedEditMode={true} allowToggle={false}>
                                        <UniversalTemplateLoader code={previewCode} config={initialConfig} />
                                    </EditModeProvider>
                                )}
                            </div>
                        </div>
                        <div className="h-20 border-t border-gray-100 flex items-center justify-center bg-white/80 backdrop-blur-xl">
                            <p className="text-sm font-bold text-gray-400">Previewing auto-conversion result. Interactive elements are active.</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Creator Workshop</h1>
                    <p className="text-gray-500 font-medium tracking-tight flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                        Enter code to see it live and check for errors.
                    </p>
                </div>

                <div className="flex items-center gap-3 self-start md:self-end">
                    <div className="flex bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm">
                        <button
                            onClick={() => setActiveTab("edit")}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === "edit" ? "bg-blue-600 text-white shadow-lg" : "text-gray-400 hover:text-gray-600"
                                }`}
                        >
                            <Code className="w-4 h-4" />
                            Editor
                        </button>
                        <button
                            onClick={() => setActiveTab("preview")}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === "preview" ? "bg-blue-600 text-white shadow-lg" : "text-gray-400 hover:text-gray-600"
                                }`}
                        >
                            <Layout className="w-4 h-4" />
                            Smart View
                        </button>
                        <button
                            onClick={() => setActiveTab("sandbox")}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === "sandbox" ? "bg-blue-600 text-white shadow-lg" : "text-gray-400 hover:text-gray-600"
                                }`}
                        >
                            <Zap className="w-4 h-4" />
                            Live Sandbox
                        </button>
                    </div>

                    <button
                        onClick={() => setShowFullPreview(true)}
                        disabled={!formData.codeContent}
                        className="flex items-center gap-2 px-6 py-4 bg-gray-900 text-white rounded-2xl font-black shadow-lg shadow-gray-200 hover:shadow-xl hover:bg-black transition-all hover:scale-[1.02] disabled:opacity-50"
                    >
                        <Eye className="w-5 h-5 text-blue-400" />
                        View Full Preview
                    </button>
                </div>
            </div>

            <div className="mb-8 flex gap-4">
                <button
                    onClick={() => setLeftTab("code")}
                    className={`px-6 py-2 rounded-full font-bold transition-all ${leftTab === "code" ? "bg-blue-100 text-blue-700" : "text-gray-400 hover:bg-gray-50"}`}
                >
                    Template Code
                </button>
                <button
                    onClick={() => setLeftTab("schema")}
                    className={`px-6 py-2 rounded-full font-bold transition-all ${leftTab === "schema" ? "bg-blue-100 text-blue-700" : "text-gray-400 hover:bg-gray-50"}`}
                >
                    Editable Schema (PRO)
                </button>
            </div>

            <AnimatePresence mode="wait">
                {!isUploaded ? (
                    <motion.form
                        key="workshop-area"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[700px]"
                    >
                        {/* Left/Main Column: Editor & Metadata */}
                        <div className={`lg:col-span-7 flex flex-col gap-6 ${activeTab === "preview" ? "hidden lg:flex" : "flex"}`}>
                            {leftTab === "code" ? (
                                /* Code Editor */
                                <div className="flex-1 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col overflow-hidden">
                                    <div className="px-8 py-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Paste Code (.tsx / .html)</span>
                                        {formData.codeContent && (
                                            <div className="flex items-center gap-2 text-green-500 text-xs font-bold">
                                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                                Auto-Infection Active
                                            </div>
                                        )}
                                    </div>
                                    <textarea
                                        value={formData.codeContent}
                                        onChange={(e) => setFormData({ ...formData, codeContent: e.target.value })}
                                        className="flex-1 w-full p-8 font-mono text-sm resize-none focus:outline-none bg-white text-gray-700 leading-relaxed"
                                        placeholder="// Paste your React component or raw HTML here...&#10;// Our engine will automatically convert your text and images into editable elements!"
                                        spellCheck={false}
                                    />
                                </div>
                            ) : (
                                /* Schema Editor */
                                <div className="flex-1 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col overflow-hidden p-10">
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <h2 className="text-xl font-black text-gray-900">Configurable Properties</h2>
                                            <p className="text-sm text-gray-500 font-medium">Define which parts of your code users can edit via props.</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setConfigSchema([...configSchema, { key: "", type: "text", label: "" }])}
                                            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-100"
                                        >
                                            + Add Field
                                        </button>
                                    </div>

                                    <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2">
                                        {configSchema.map((field, index) => (
                                            <div key={index} className="flex gap-4 items-end bg-gray-50 p-4 rounded-2xl relative group">
                                                <div className="flex-1 space-y-1">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase">Prop Key</label>
                                                    <input
                                                        value={field.key}
                                                        onChange={(e) => {
                                                            const newSchema = [...configSchema];
                                                            newSchema[index].key = e.target.value;
                                                            setConfigSchema(newSchema);
                                                        }}
                                                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold"
                                                        placeholder="title"
                                                    />
                                                </div>
                                                <div className="w-32 space-y-1">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase">Type</label>
                                                    <select
                                                        value={field.type}
                                                        onChange={(e) => {
                                                            const newSchema = [...configSchema];
                                                            newSchema[index].type = e.target.value as any;
                                                            setConfigSchema(newSchema);
                                                        }}
                                                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold appearance-none"
                                                    >
                                                        <option value="text">Text</option>
                                                        <option value="color">Color</option>
                                                        <option value="image">Image</option>
                                                    </select>
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase">Label</label>
                                                    <input
                                                        value={field.label}
                                                        onChange={(e) => {
                                                            const newSchema = [...configSchema];
                                                            newSchema[index].label = e.target.value;
                                                            setConfigSchema(newSchema);
                                                        }}
                                                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold"
                                                        placeholder="Website Title"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setConfigSchema(configSchema.filter((_, i) => i !== index))}
                                                    className="p-2 bg-red-50 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    {configSchema.length > 0 && (
                                        <div className="mt-10 pt-10 border-t border-gray-50">
                                            <h3 className="text-sm font-black text-gray-900 mb-4 uppercase tracking-widest">Initial Values</h3>
                                            <div className="grid grid-cols-2 gap-6">
                                                {configSchema.map(field => field.key && (
                                                    <div key={field.key} className="space-y-1">
                                                        <label className="text-[10px] font-black text-gray-400 uppercase">{field.label || field.key}</label>
                                                        {field.type === "color" ? (
                                                            <input
                                                                type="color"
                                                                value={initialConfig[field.key] || "#000000"}
                                                                onChange={(e) => setInitialConfig({ ...initialConfig, [field.key]: e.target.value })}
                                                                className="w-full h-10 bg-white border border-gray-200 rounded-lg cursor-pointer"
                                                            />
                                                        ) : (
                                                            <input
                                                                type="text"
                                                                value={initialConfig[field.key] || ""}
                                                                onChange={(e) => setInitialConfig({ ...initialConfig, [field.key]: e.target.value })}
                                                                className="w-full px-5 py-3 bg-gray-50 border-none rounded-xl font-bold text-sm"
                                                                placeholder={field.type === "image" ? "https://..." : "Default value..."}
                                                            />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Metadata */}
                            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-5 py-3 bg-gray-50 border-none rounded-xl focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold text-sm"
                                        placeholder="Neon Birthday"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-5 py-3 bg-gray-50 border-none rounded-xl focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold text-sm appearance-none"
                                    >
                                        <option value="birthday">Birthday</option>
                                        <option value="anniversary">Anniversary</option>
                                        <option value="religious">Religious</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Base Price (cents)</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full px-5 py-3 bg-gray-50 border-none rounded-xl focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Live Preview */}
                        <div className={`lg:col-span-5 flex flex-col gap-6 ${activeTab === "edit" ? "hidden lg:flex" : "flex"}`}>
                            <div className="flex-1 bg-gray-900 rounded-[2.5rem] border-8 border-gray-800 shadow-2xl overflow-hidden relative group">
                                <div className="absolute inset-x-0 top-0 h-8 bg-gray-800 flex items-center px-4 gap-1.5 z-10">
                                    <div className="w-2 h-2 rounded-full bg-red-400" />
                                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                                    <div className="w-2 h-2 rounded-full bg-green-400" />
                                    <div className="ml-4 bg-gray-700/50 px-3 py-1 rounded-md text-[10px] text-gray-400 font-mono">
                                        localhost:3000/preview
                                    </div>
                                </div>
                                <div className="w-full h-full pt-8 bg-white overflow-auto scrollbar-hide relative">
                                    {isSavingSandbox && (
                                        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-20 flex items-center justify-center">
                                            <div className="flex items-center gap-2 px-4 py-2 bg-white shadow-xl rounded-full border border-gray-100">
                                                <RefreshCw className="w-3 h-3 text-blue-500 animate-spin" />
                                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Updating Sandbox...</span>
                                            </div>
                                        </div>
                                    )}
                                    {formData.codeContent ? (
                                        activeTab === "sandbox" && sandboxPath ? (
                                            <iframe
                                                ref={iframeRef}
                                                src={sandboxPath}
                                                className="w-full h-full border-none"
                                                title="Sandbox Preview"
                                            />
                                        ) : (
                                            <EditModeProvider forcedEditMode={true} allowToggle={false}>
                                                <UniversalTemplateLoader code={previewCode} config={initialConfig} />
                                            </EditModeProvider>
                                        )
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-4">
                                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
                                                <Eye className="w-8 h-8 text-blue-200" />
                                            </div>
                                            <p className="text-gray-300 font-medium">Waiting for your code to generate a live preview...</p>
                                        </div>
                                    )}
                                </div>

                                {/* Floating Submission Info */}
                                <div className="absolute bottom-6 left-6 right-6">
                                    <button
                                        type="submit"
                                        disabled={isLoading || !formData.codeContent}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black shadow-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                Publish Template
                                                <ArrowRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Transformation Stats */}
                            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                                        <Zap className="w-5 h-5 text-indigo-500 fill-indigo-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-tighter">Engine Status</p>
                                        <p className="text-sm font-bold text-gray-700">Healthy & Optimized</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-tighter">Infection Count</p>
                                    <p className="text-sm font-black text-blue-600">
                                        {previewCode.match(/<Editable/g)?.length || 0} smart elements
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.form>
                ) : (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-16 rounded-[4rem] text-center border border-gray-100 shadow-2xl shadow-blue-900/5 max-w-2xl mx-auto"
                    >
                        <div className="w-24 h-24 bg-green-50 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-lg shadow-green-100">
                            <CheckCircle2 className="w-12 h-12 text-green-500" />
                        </div>
                        <h2 className="text-4xl font-black text-gray-900 mb-6 tracking-tight">Template Published! 🎉</h2>
                        <p className="text-xl text-gray-500 font-medium mb-10 leading-relaxed">
                            Your code has been converted and is now live for users to discover and edit.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => router.push("/creator/templates")}
                                className="px-8 py-4 bg-gray-900 text-white rounded-[1.5rem] font-black hover:bg-gray-800 transition-all"
                            >
                                View My Templates
                            </button>
                            <button
                                onClick={() => {
                                    setIsUploaded(false);
                                    setFormData({ name: "", category: "birthday", price: "299", description: "", codeContent: "" });
                                }}
                                className="px-8 py-4 bg-gray-100 text-gray-700 rounded-[1.5rem] font-black hover:bg-gray-200 transition-all font-bold"
                            >
                                Create Another
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
