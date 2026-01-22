"use client";

import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import {
    LayoutTemplate,
    MoreVertical,
    Eye,
    Edit2,
    Trash2,
    Plus,
    Code,
    Clock,
    DollarSign,
    Zap
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function CreatorTemplatesPage() {
    const router = useRouter();

    const { data: templates, isLoading } = useQuery({
        queryKey: ["web-templates-admin"], // Reusing the admin key
        queryFn: async () => {
            const response = await client.api["web-templates"]["admin"].$get();
            if (!response.ok) throw new Error("Failed to fetch");
            const res = await response.json() as any;
            // Show all templates for the creator (removed isDynamic filter)
            return res.data;
        },
    });

    return (
        <div className="max-w-6xl mx-auto">
            {/* Headers... */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">My Creative Workshop</h1>
                    <p className="text-gray-500 font-medium tracking-tight">Manage and monitor all your gift experiences</p>
                </div>
                <button
                    onClick={() => router.push("/creator/upload")}
                    className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-blue-100 hover:shadow-xl hover:shadow-blue-200 transition-all hover:scale-[1.02]"
                >
                    <Plus className="w-5 h-5" />
                    New Template
                </button>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-[2.5rem] h-64 animate-pulse border border-gray-100" />
                    ))}
                </div>
            ) : templates?.length === 0 ? (
                <div className="bg-white rounded-[3rem] p-20 text-center border border-gray-100 shadow-sm">
                    <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Code className="w-10 h-10 text-blue-500" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2">No Templates Found</h3>
                    <p className="text-gray-500 font-medium mb-8">Start your journey by uploading your first raw code template.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
                    {templates?.map((template: any, i: number) => (
                        <motion.div
                            key={template.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500 group"
                        >
                            {/* Template Preview/Thumbnail Area */}
                            <div className="aspect-video bg-gray-50 relative group-hover:scale-105 transition-transform duration-700">
                                {template.thumbnail ? (
                                    <img src={template.thumbnail} alt={template.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                                        <Code className="w-12 h-12 text-blue-200" />
                                    </div>
                                )}
                                <div className={cn(
                                    "absolute top-4 right-4 h-8 px-3 rounded-full flex items-center gap-1.5 shadow-sm backdrop-blur-md border",
                                    template.isDynamic
                                        ? "bg-blue-500/10 border-blue-500/20 text-blue-600"
                                        : "bg-purple-500/10 border-purple-500/20 text-purple-600"
                                )}>
                                    {template.isDynamic ? <Zap className="w-3.5 h-3.5" /> : <LayoutTemplate className="w-3.5 h-3.5" />}
                                    <span className="text-[10px] font-black uppercase tracking-wider">
                                        {template.isDynamic ? "Smart" : "Native"}
                                    </span>
                                </div>
                            </div>

                            {/* Info Area */}
                            <div className="p-8 space-y-6">
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 mb-1 line-clamp-1">{template.name}</h3>
                                    <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">{template.category}</p>
                                </div>

                                <div className="flex items-center justify-between py-4 border-y border-gray-50">
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-green-500" />
                                        <span className="font-black text-gray-900">${(template.price / 100).toFixed(2)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <Clock className="w-4 h-4" />
                                        <span className="font-bold text-xs">
                                            {template.createdAt ? format(new Date(template.createdAt), "MMM d, yyyy") : "Draft"}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => {
                                            // Detect if it's an HTML template (has htmlCode field)
                                            const isHtmlTemplate = (template as any).htmlCode !== undefined;

                                            if (isHtmlTemplate) {
                                                // Route to HTML editor
                                                router.push(`/creator/html-template/${template.id}`);
                                            } else if (template.isDynamic) {
                                                // Smart templates use the universal loader
                                                window.open(`/web/templates/${template.id}?preview=true`, "_blank");
                                            } else {
                                                // Native templates have hardcoded routes
                                                window.open(`/web/templates/${template.id}`, "_blank");
                                            }
                                        }}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-600 rounded-xl font-black text-sm hover:bg-blue-100 transition-colors"
                                    >
                                        <Eye className="w-4 h-4" />
                                        {(template as any).htmlCode ? "Edit" : "Preview"}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}

function Settings({ className }: { className?: string }) {
    return <Edit2 className={className} />;
}
