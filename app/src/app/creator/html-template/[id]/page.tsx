"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { client } from "@/lib/hono";
import { useState, useEffect } from "react";
import { Loader2, Save, Eye, Globe, ArrowLeft, Code2 } from "lucide-react";
import { toast } from "sonner";

export default function HtmlTemplateEditorPage() {
    const params = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const templateId = params.id as string;

    const [htmlCode, setHtmlCode] = useState("");
    const [cssCode, setCssCode] = useState("");
    const [jsCode, setJsCode] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [showPreview, setShowPreview] = useState(true);

    // Fetch template data
    const { data: template, isLoading } = useQuery({
        queryKey: ["html-template", templateId],
        queryFn: async () => {
            const response = await client.api["html-templates"][":id"].$get({
                param: { id: templateId },
            });
            if (!response.ok) throw new Error("Template not found");
            const res = await response.json();
            return res.template;
        },
    });

    // Initialize form data when template loads
    useEffect(() => {
        if (template) {
            setHtmlCode(template.htmlCode || "");
            setCssCode(template.cssCode || "");
            setJsCode(template.jsCode || "");
            setName(template.name || "");
            setDescription(template.description || "");
        }
    }, [template]);

    // Save mutation
    const saveMutation = useMutation({
        mutationFn: async () => {
            const response = await client.api["html-templates"][":id"].$patch({
                param: { id: templateId },
                json: {
                    htmlCode,
                    cssCode,
                    jsCode,
                    name,
                    description,
                },
            });
            if (!response.ok) throw new Error("Failed to save");
            return await response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["html-template", templateId] });
            toast.success("Template saved successfully!");
        },
        onError: () => {
            toast.error("Failed to save template");
        },
    });

    // Publish mutation
    const publishMutation = useMutation({
        mutationFn: async () => {
            const response = await client.api["html-templates"][":id"]["publish"].$post({
                param: { id: templateId },
            });
            if (!response.ok) throw new Error("Failed to publish");
            return await response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["html-template", templateId] });
            toast.success("Template submitted for review!");
        },
        onError: () => {
            toast.error("Failed to publish template");
        },
    });

    // Generate live preview HTML
    const previewHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name || 'Preview'}</title>
    <style>
        body {
            margin: 0;
            padding: 0;
        }
        ${cssCode}
    </style>
</head>
<body>
    ${htmlCode}
    <script>
        ${jsCode}
    </script>
</body>
</html>
    `.trim();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-[1800px] mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.push("/creator/templates")}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">{name || "Untitled Template"}</h1>
                                <p className="text-sm text-gray-500">HTML Template Editor</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowPreview(!showPreview)}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                <Eye className="w-4 h-4" />
                                {showPreview ? "Hide" : "Show"} Preview
                            </button>
                            <button
                                onClick={() => saveMutation.mutate()}
                                disabled={saveMutation.isPending}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {saveMutation.isPending ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                Save
                            </button>
                            <button
                                onClick={() => publishMutation.mutate()}
                                disabled={publishMutation.isPending}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                                {publishMutation.isPending ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Globe className="w-4 h-4" />
                                )}
                                Publish
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-[1800px] mx-auto p-6">
                <div className={`grid ${showPreview ? 'grid-cols-2' : 'grid-cols-1'} gap-6 h-[calc(100vh-140px)]`}>
                    {/* Code Editor Section */}
                    <div className="space-y-4 overflow-auto">
                        {/* Template Info */}
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <h3 className="font-semibold text-gray-900 mb-3">Template Information</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Template name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Template description"
                                        rows={2}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* HTML Code */}
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center gap-2">
                                <Code2 className="w-4 h-4 text-orange-600" />
                                <h3 className="font-semibold text-gray-900">HTML</h3>
                            </div>
                            <textarea
                                value={htmlCode}
                                onChange={(e) => setHtmlCode(e.target.value)}
                                className="w-full p-4 font-mono text-sm resize-none focus:outline-none"
                                style={{ height: "300px" }}
                                placeholder="<div>Your HTML here</div>"
                            />
                        </div>

                        {/* CSS Code */}
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center gap-2">
                                <Code2 className="w-4 h-4 text-blue-600" />
                                <h3 className="font-semibold text-gray-900">CSS</h3>
                            </div>
                            <textarea
                                value={cssCode}
                                onChange={(e) => setCssCode(e.target.value)}
                                className="w-full p-4 font-mono text-sm resize-none focus:outline-none"
                                style={{ height: "300px" }}
                                placeholder="/* Your CSS here */"
                            />
                        </div>

                        {/* JS Code */}
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center gap-2">
                                <Code2 className="w-4 h-4 text-yellow-600" />
                                <h3 className="font-semibold text-gray-900">JavaScript</h3>
                            </div>
                            <textarea
                                value={jsCode}
                                onChange={(e) => setJsCode(e.target.value)}
                                className="w-full p-4 font-mono text-sm resize-none focus:outline-none"
                                style={{ height: "200px" }}
                                placeholder="// Your JavaScript here"
                            />
                        </div>
                    </div>

                    {/* Live Preview Section */}
                    {showPreview && (
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden sticky top-24">
                            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                                <h3 className="font-semibold text-gray-900">Live Preview</h3>
                            </div>
                            <div className="h-[calc(100vh-200px)] overflow-auto">
                                <iframe
                                    srcDoc={previewHtml}
                                    className="w-full h-full border-0"
                                    title="Template Preview"
                                    sandbox="allow-scripts"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
