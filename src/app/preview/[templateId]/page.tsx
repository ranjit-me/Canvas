"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { client } from "@/lib/hono";
import { PortalTemplateLoader } from "@/components/PortalTemplateLoader";
import { Loader2, AlertCircle } from "lucide-react";
import { EditModeProvider } from "@/app/(dashboard)/web/features/hooks/useEditMode";

export default function PreviewPage() {
    const params = useParams();
    const templateId = params.templateId as string;

    const { data: template, isLoading, error } = useQuery({
        queryKey: ["web-template", templateId],
        queryFn: async () => {
            const response = await client.api["web-templates"][":id"].$get({
                param: { id: templateId },
            });
            if (!response.ok) throw new Error("Template not found");
            const res = await response.json();
            return res.data;
        },
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (error || !template) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
                <div className="bg-white border border-red-100 p-10 rounded-[2.5rem] shadow-xl text-center max-w-md">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
                    <h1 className="text-2xl font-black text-gray-900 mb-4">Template Not Found</h1>
                    <p className="text-gray-500 font-medium mb-8">The template you are looking for might have been removed or renamed.</p>
                    <button onClick={() => window.history.back()} className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black">
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    // If it's a dynamic template, render with UniversalTemplateLoader
    if (template.isDynamic) {
        return (
            <EditModeProvider forcedEditMode={false} allowToggle={false}>
                <div className="relative min-h-screen bg-white">
                    <PortalTemplateLoader
                        code={template.componentCode || ""}
                    />
                </div>
            </EditModeProvider>
        );
    }

    // If it's a static template
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-10">
            <h1 className="text-3xl font-black mb-6">Traditional Template</h1>
            <p className="text-gray-500 mb-8">This is a hand-crafted template. Click below to view it.</p>
            <button
                onClick={() => {
                    // Convert category format "birthday-girlfriend" to path "birthday/girlfriend"
                    const categoryPath = template.category?.replace('-', '/') || 'birthday/girlfriend';
                    window.location.href = `/web/${categoryPath}/${templateId}`;
                }}
                className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg hover:bg-blue-700 transition-colors"
            >
                Open Template
            </button>
        </div>
    );
}
