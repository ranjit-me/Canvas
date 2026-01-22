"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import { client } from "@/lib/hono";
import { Loader2, AlertCircle } from "lucide-react";
import dynamic from "next/dynamic";

const HtmlEditRenderer = dynamic(
    () => import("@/features/html-templates/components/HtmlEditRenderer"),
    { ssr: false }
);

export default function HtmlEditPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const templateId = params.id as string;
    const projectId = searchParams.get("projectId"); // Optional project ID

    // Try to fetch HTML template first
    const { data: template, isLoading, error } = useQuery({
        queryKey: ["html-template", templateId, projectId],
        queryFn: async () => {
            // First try to get by template ID
            try {
                const response = await client.api["html-templates"][":id"].$get({
                    param: { id: templateId },
                });
                if (response.ok) {
                    const res = await response.json();
                    return res.template;
                }
            } catch (err) {
                console.log("Template not found by ID, checking if it's a project...");
            }

            // If that fails and we have a projectId, try to get the project and extract template
            if (projectId) {
                try {
                    const projectResponse = await client.api["web-projects"][":id"].$get({
                        param: { id: projectId },
                    });
                    if (projectResponse.ok) {
                        const projectData = await projectResponse.json();
                        // Get the HTML template from the project
                        if (projectData.data?.templateId) {
                            const templateResponse = await client.api["html-templates"][":id"].$get({
                                param: { id: projectData.data.templateId },
                            });
                            if (templateResponse.ok) {
                                const res = await templateResponse.json();
                                return res.template;
                            }
                        }
                    }
                } catch (err) {
                    console.error("Failed to fetch project:", err);
                }
            }

            throw new Error("Template not found");
        },
        retry: false,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-4" />
                    <p className="text-sm text-gray-500">Loading template...</p>
                </div>
            </div>
        );
    }

    if (error || !template) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
                <div className="bg-white border border-red-100 p-10 rounded-3xl shadow-xl text-center max-w-md">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
                    <h1 className="text-2xl font-black text-gray-900 mb-4">Template Not Found</h1>
                    <p className="text-gray-500 font-medium mb-4">
                        The template you are looking for might have been removed or renamed.
                    </p>
                    <p className="text-xs text-gray-400 mb-8">
                        Template ID: {templateId}
                        {projectId && ` | Project ID: ${projectId}`}
                    </ p>
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

    return <HtmlEditRenderer template={template} />;
}
