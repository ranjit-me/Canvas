"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { client } from "@/lib/hono";
import { PortalTemplateLoader } from "@/components/PortalTemplateLoader";
import { Loader2, AlertCircle } from "lucide-react";
import { EditModeProvider } from "@/app/(dashboard)/web/features/hooks/useEditMode";

export default function JsxEditPage() {
    const params = useParams();
    const templateId = params.id as string;

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
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    if (error || !template) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
                <div className="bg-white border border-red-100 p-10 rounded-3xl shadow-xl text-center max-w-md">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
                    <h1 className="text-2xl font-black text-gray-900 mb-4">Template Not Found</h1>
                    <p className="text-gray-500 font-medium mb-8">
                        The template you are looking for might have been removed or renamed.
                    </p>
                    <button
                        onClick={() => window.history.back()}
                        className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-gray-800 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    // Edit mode - enable all editing features
    return (
        <EditModeProvider forcedEditMode={true} allowToggle={true}>
            <div className="relative min-h-screen bg-white">
                <PortalTemplateLoader code={template.componentCode || ""} />
            </div>
        </EditModeProvider>
    );
}
