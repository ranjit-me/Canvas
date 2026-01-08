"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import { client } from "@/lib/hono";
import { UniversalTemplateLoader, UniversalTemplateLoaderHandle } from "@/components/UniversalTemplateLoader";
import { EditModeProvider } from "../../features/hooks/useEditMode";
import { EditControls } from "../../features/components/EditControls";
import { Loader2, AlertCircle } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useCreateWebProject } from "@/features/web-projects/api/use-create-web-project";
import { toast } from "sonner";

export default function UniversalTemplatePage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const templateId = params.templateId as string;
    const isPreviewOnly = searchParams.get("preview") === "true";

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

    const loaderRef = useRef<UniversalTemplateLoaderHandle>(null);
    const createProject = useCreateWebProject();

    const handleSave = async () => {
        if (!loaderRef.current || !template) return;

        const dynamicData = loaderRef.current.getData();

        createProject.mutate({
            name: `My ${template.name}`,
            templateId: template.id,
            json: JSON.stringify(dynamicData),
        }, {
            onSuccess: (res) => {
                toast.success("Project saved! You can now view it in your dashboard.");
                // router.push("/dashboard"); 
            }
        });
    };

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
            <EditModeProvider forcedEditMode={!isPreviewOnly}>
                <div className="relative min-h-screen bg-white">
                    {!isPreviewOnly && <EditControls onExport={handleSave} />}
                    <UniversalTemplateLoader
                        ref={loaderRef}
                        code={template.componentCode || ""}
                    />
                </div>
            </EditModeProvider>
        );
    }

    // If it's a static template and we reached here (e.g. via deep link),
    // redirect to the hardcoded page if possible, or show a link.
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-10">
            <h1 className="text-3xl font-black mb-6">Traditional Template</h1>
            <p className="text-gray-500 mb-8">This is a hand-crafted template. Click below to view it.</p>
            <button
                onClick={() => window.location.href = `/web/birthday/girlfriend/${templateId}`}
                className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg"
            >
                Open Template
            </button>
        </div>
    );
}
