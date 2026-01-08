"use client";

import React, { useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { Edit3, Sparkles } from "lucide-react";

import { useGetWebProjectBySlug } from "@/features/web-projects/api/use-get-web-project-by-slug";
import { AnniversaryWebsite } from "@/features/web-projects/templates/romantic-anniversary/romantic-anniversary";
import { BirthdayWebsite as RoseBirthday } from "@/features/web-projects/templates/rose-birthday/rose-birthday";
import { DreamyPinkParadise } from "@/features/web-projects/templates/dreamy-pink-paradise/dreamy-pink-paradise";
import { MidnightPromiseTemplate } from "@/features/web-projects/templates/midnight-promise/midnight-promise";
import { EditModeProvider } from "@/app/(dashboard)/web/features/hooks/useEditMode";
import { Button } from "@/components/ui/button";
import { HtmlTemplateEditor } from "@/features/web-projects/components/HtmlTemplateEditor";

export default function PublicProjectPage() {
    const params = useParams();
    const slug = params.slug as string;
    const searchParams = useSearchParams();
    const router = useRouter();
    const { data: session, status } = useSession();

    const mode = searchParams.get("mode") || "preview";
    const isEditRequested = mode === "edit";

    const { data: response, isLoading, error } = useGetWebProjectBySlug(slug);

    // State for HTML template data
    const [htmlTemplate, setHtmlTemplate] = React.useState<any>(null);
    const [loadingHtmlTemplate, setLoadingHtmlTemplate] = React.useState(false);

    // Handle authentication for edit mode
    useEffect(() => {
        if (isEditRequested && status === "unauthenticated") {
            signIn();
        }
    }, [isEditRequested, status]);

    // Fetch HTML template if needed (for both pure HTML templates and webProjects with HTML templates)
    useEffect(() => {
        const fetchHtmlTemplate = async () => {
            if (!response) return;

            let templateId: string | null = null;

            // Check if it's a pure HTML template
            if (response.type === "html") {
                templateId = response.data.id;
            }
            // Check if it's a webProject with an HTML template
            else if (response.type === "react" && (response.data as any).templateId?.startsWith("html-")) {
                templateId = (response.data as any).templateId;
            }

            if (templateId) {
                setLoadingHtmlTemplate(true);
                try {
                    const res = await fetch(`/api/html-templates/${templateId}`);
                    if (res.ok) {
                        const data = await res.json();
                        setHtmlTemplate(data.template);
                    }
                } catch (err) {
                    console.error("Failed to fetch HTML template:", err);
                } finally {
                    setLoadingHtmlTemplate(false);
                }
            }
        };

        fetchHtmlTemplate();
    }, [response]);

    if (isLoading || loadingHtmlTemplate || (isEditRequested && status === "loading")) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
            </div>
        );
    }

    if (error || !response || !response.data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">404</h1>
                    <p className="text-gray-400">Template not found or not published.</p>
                </div>
            </div>
        );
    }

    // If we have an HTML template to render, show it
    if (htmlTemplate) {
        const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${htmlTemplate.name || 'Template'}</title>
    <style>
        ${htmlTemplate.cssCode || ''}
    </style>
</head>
<body>
    ${htmlTemplate.htmlCode || ''}
    <script id="giftora-injected-js">
        ${htmlTemplate.jsCode || ''}
    </script>
</body>
</html>
        `.trim();

        return (
            <div className="w-full h-screen bg-white">
                <HtmlTemplateEditor
                    templateId={htmlTemplate.id} // htmlTemplate is the state variable holding the data
                    htmlCode={fullHtml}
                    isEditMode={!!isEditRequested}
                />
            </div>
        );
    }

    // Otherwise, it's a React template - use existing logic
    const project = response.data;

    // TypeScript type guard - at this point we know it's a webProject
    if (!("templateId" in project)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Error</h1>
                    <p className="text-gray-400">Invalid template data.</p>
                </div>
            </div>
        );
    }

    const isEditMode = isEditRequested && status === "authenticated";

    // Determine which template to render based on templateId
    const renderTemplate = () => {
        const content = (() => {
            switch (project.templateId) {
                case 'rose-birthday':
                    return <RoseBirthday initialData={project} processPayment={() => { }} isLoading={false} />;
                case 'dreamy-pink-paradise':
                    return <DreamyPinkParadise initialData={project} processPayment={() => { }} isLoading={false} />;
                case 'romantic-anniversary':
                    return <AnniversaryWebsite initialData={project} processPayment={() => { }} isLoading={false} />;
                case 'midnight-promise-girlfriend':
                case 'midnight-promise-boyfriend':
                    return <MidnightPromiseTemplate initialData={project} processPayment={() => { }} isLoading={false} />;
                default:
                    return <div className="text-white p-10">Unknown Template: {project.templateId}</div>;
            }
        })();

        return (
            <EditModeProvider
                forcedEditMode={isEditMode}
                allowToggle={isEditMode}
            >
                {content}
            </EditModeProvider>
        );
    };

    return (
        <div className="min-h-screen">
            {renderTemplate()}
        </div>
    );
}
