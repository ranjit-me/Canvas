"use client";

import React, { useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { Edit3, Sparkles } from "lucide-react";

import { useGetWebProjectBySlug } from "@/features/web-projects/api/use-get-web-project-by-slug";
import { useGetHtmlTemplate } from "@/features/html-templates/api/use-get-html-template-by-id";
import { AnniversaryWebsite } from "@/features/web-projects/templates/romantic-anniversary/romantic-anniversary";
import { BirthdayWebsite as RoseBirthday } from "@/features/web-projects/templates/rose-birthday/rose-birthday";
import { DreamyPinkParadise } from "@/features/web-projects/templates/dreamy-pink-paradise/dreamy-pink-paradise";
import { MidnightPromiseTemplate } from "@/features/web-projects/templates/midnight-promise/midnight-promise";
import { EditModeProvider } from "@/app/(dashboard)/web/features/hooks/useEditMode";
import { Button } from "@/components/ui/button";
import { HtmlTemplateEditor } from "@/features/web-projects/components/HtmlTemplateEditor";
import { useLanguage } from "@/contexts/LanguageContext";

export default function PublicProjectPage() {
    const params = useParams();
    const slug = params.slug as string;
    const searchParams = useSearchParams();
    const router = useRouter();
    const { data: session, status } = useSession();

    const mode = searchParams.get("mode") || "preview";
    const isEditRequested = mode === "edit";
    const { setLanguage } = useLanguage();

    const { data: response, isLoading, error } = useGetWebProjectBySlug(slug);

    // Update language based on owner's preference
    useEffect(() => {
        if (response && response.templateLanguage) {
            setLanguage(response.templateLanguage as any);
        }
    }, [response, setLanguage]);

    // Determine template ID for HTML template fetching
    const htmlTemplateId = React.useMemo(() => {
        if (!response) return null;

        // Check if it's a pure HTML template
        if (response.type === "html") {
            return response.data.id;
        }
        // Check if it's a webProject with an HTML template
        if (response.type === "react" && (response.data as any).templateId?.startsWith("html-")) {
            return (response.data as any).templateId;
        }

        return null;
    }, [response]);

    // Fetch HTML template using React Query (with automatic caching!)
    const {
        data: htmlTemplate,
        isLoading: isLoadingHtmlTemplate
    } = useGetHtmlTemplate(htmlTemplateId);

    // Handle authentication for edit mode
    useEffect(() => {
        if (isEditRequested && status === "unauthenticated") {
            signIn();
        }
    }, [isEditRequested, status]);

    if (isLoading || isLoadingHtmlTemplate || (isEditRequested && status === "loading")) {
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
        const selectedLanguage = (response as any).templateLanguage || "en";
        const translations = htmlTemplate.translations || '{}';

        const translationDataScript = `
<script>
    window.TEMPLATE_TRANSLATIONS = ${translations};
    window.CURRENT_LANGUAGE = "${selectedLanguage}";
</script>
        `;

        const translationHandlerScript = `
<script>
(function() {
    function applyTranslations() {
        const translations = window.TEMPLATE_TRANSLATIONS || {};
        const lang = window.CURRENT_LANGUAGE || 'en';
        const langTranslations = translations[lang] || translations['en'];
        
        if (!langTranslations) return;

        Object.entries(langTranslations).forEach(([key, value]) => {
            const elements = document.querySelectorAll('[id="' + key + '"], [data-editable-text="' + key + '"], [data-editable="' + key + '"]');
            elements.forEach(el => {
                const currentText = el.textContent.trim();
                if (currentText === key || currentText === 'hero.' + key || (currentText.includes('.') && currentText.toLowerCase() === key.toLowerCase())) {
                    el.textContent = value;
                }
            });
        });
    }
    if (document.readyState === 'complete') { applyTranslations(); } else { window.addEventListener('load', applyTranslations); }
    applyTranslations();
})();
</script>
        `;

        const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${htmlTemplate.name || 'Template'}</title>
    ${translationDataScript}
    <style>
        ${htmlTemplate.cssCode || ''}
    </style>
</head>
<body>
    ${htmlTemplate.htmlCode || ''}
    <script id="giftora-injected-js">
        ${htmlTemplate.jsCode || ''}
    </script>
    ${translationHandlerScript}
</body>
</html>
        `.trim();

        // If in edit mode and authenticated, show editor
        if (isEditRequested && status === "authenticated") {
            return (
                <div className="w-full h-screen bg-white">
                    <HtmlTemplateEditor
                        templateId={htmlTemplate.id}
                        htmlCode={fullHtml}
                        isEditMode={true}
                    />
                </div>
            );
        }

        // Otherwise, show clean preview without any editing capabilities
        return (
            <div className="w-full h-screen bg-white">
                <iframe
                    srcDoc={fullHtml}
                    className="w-full h-full border-0"
                    title={htmlTemplate.name || "Template"}
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
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
