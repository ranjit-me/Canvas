"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { FloatingMediaMenu } from "./FloatingMediaMenu";
import { FloatingToolbar } from "./FloatingToolbar";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useUpdateHtmlTemplate } from "@/features/html-templates/api/use-update-html-template";

interface HtmlTemplateEditorProps {
    templateId: string;
    htmlCode: string; // The full HTML string to render
    isEditMode: boolean; // Whether editing is enabled
}

export function HtmlTemplateEditor({ templateId, htmlCode, isEditMode }: HtmlTemplateEditorProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [isLoading, setIsLoading] = useState(true);

    // State for media editing
    const [selectedMedia, setSelectedMedia] = useState<{
        tagName: string;
        gid: string;
        src: string;
        rect: { top: number; left: number; width: number; height: number; bottom: number; right: number };
    } | null>(null);

    // Mutation for saving
    const updateMutation = useUpdateHtmlTemplate(templateId);

    // Inject styles and scripts for edit mode
    const injectEditScripts = useCallback(() => {
        const iframe = iframeRef.current;
        if (!iframe || !iframe.contentWindow || !iframe.contentDocument) return;

        const doc = iframe.contentDocument;

        if (doc.getElementById("giftora-edit-scripts")) return;

        // 1. Inject Styles
        const style = doc.createElement("style");
        style.id = "giftora-edit-styles";
        style.textContent = `
            /* Hover effect only for non-text elements or when not editing text */
            [contenteditable="true"]:focus {
                outline: 2px solid #9333ea !important;
                border-radius: 4px;
                cursor: text !important;
            }
            
            .giftora-media-hover:hover {
                 outline: 2px dashed #9333ea !important;
                 cursor: pointer !important;
            }

            body {
                padding-bottom: 50px; 
            }
        `;
        doc.head.appendChild(style);

        // 2. Inject Script for Interaction
        const script = doc.createElement("script");
        script.id = "giftora-edit-scripts";
        script.textContent = `
            (function() {
                const sendToParent = (data) => {
                    window.parent.postMessage({ source: 'giftora-editor', ...data }, '*');
                };

                // Add data-ids to everything useful
                const processNode = (node) => {
                     const validTags = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SPAN', 'A', 'IMG', 'BUTTON', 'VIDEO', 'AUDIO', 'LI', 'TD', 'TH', 'DIV'];
                     if (validTags.includes(node.tagName)) {
                         if (!node.hasAttribute('data-giftora-id')) {
                            node.setAttribute('data-giftora-id', 'gid-' + Math.random().toString(36).substr(2, 9));
                         }
                         
                         // If it is media, add hover class
                         if (['IMG', 'VIDEO', 'AUDIO'].includes(node.tagName)) {
                             node.classList.add('giftora-media-hover');
                         }
                     }
                     Array.from(node.children).forEach(processNode);
                };
                processNode(document.body);
                
                // Mutation observer to handle new elements if any (optional, keeping simpe for now)

                document.addEventListener('click', (e) => {
                    if (!e.target || e.target === document.body) return;
                    
                    const target = e.target;
                    const tagName = target.tagName;
                    
                    // Is Media?
                    if (['IMG', 'VIDEO', 'AUDIO'].includes(tagName)) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        // Send rect for positioning
                        const rect = target.getBoundingClientRect();
                        const gid = target.getAttribute('data-giftora-id');
                        
                        sendToParent({
                            type: 'SELECT_MEDIA',
                            tagName,
                            gid,
                            src: target.src,
                            rect: {
                                top: rect.top,
                                left: rect.left,
                                width: rect.width,
                                height: rect.height,
                                bottom: rect.bottom,
                                right: rect.right
                            }
                        });
                        return;
                    }
                    
                    // Is Text?
                    // Simple heuristic: If it has direct text nodes or is a typical text tag
                    const textTags = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SPAN', 'A', 'BUTTON', 'LI', 'TD', 'TH'];
                    // Or DIV with just text
                    let isText = textTags.includes(tagName);
                    
                    if (!isText && tagName === 'DIV') {
                        // Check if leaf node-ish
                        if (target.children.length === 0 && target.innerText.trim().length > 0) isText = true;
                    }

                    if (isText) {
                         // Enable editing
                         target.contentEditable = "true";
                         target.focus();
                         
                         // Trap clicks to prevent navigation for links
                         if (tagName === 'A') e.preventDefault();
                         
                         // Remove listener to save when blur
                         const onBlur = () => {
                             target.contentEditable = "false";
                             target.removeEventListener('blur', onBlur);
                             // We don't necessarily need to send update to parent for text immediately if we save the whole HTML later.
                             // But let's send it just in case we want to track state.
                             // sendToParent({ type: 'TEXT_UPDATED' });
                         };
                         target.addEventListener('blur', onBlur);
                    }
                });

                // Listen for updates from parent (Media updates)
                window.addEventListener('message', (event) => {
                    if (event.data?.source === 'giftora-parent' && event.data?.type === 'UPDATE_MEDIA') {
                         const { gid, src } = event.data;
                         const el = document.querySelector(\`[data-giftora-id="\${gid}"]\`);
                         if (el) {
                             el.src = src;
                         }
                    }
                });
            })();
        `;
        doc.body.appendChild(script);

    }, []);

    // Effect to handle messages from iframe
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.source !== "giftora-editor") return;

            if (event.data.type === "SELECT_MEDIA") {
                // Adjust rect based on iframe position? 
                // Currently iframe takes full screen, so clientRects should be relative to viewport
                // But we renders FloatingMediaMenu absolute in PARENT.
                // WE need to assume iframe is full size.
                setSelectedMedia(event.data);
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, []);


    // Handle loading iframe
    const handleLoad = () => {
        setIsLoading(false);
        if (isEditMode) {
            injectEditScripts();
        }
    };

    // Re-inject scripts if edit mode toggles
    useEffect(() => {
        if (!isLoading && isEditMode) {
            injectEditScripts();
            // Also re-run the processNode logic? 
            // The script runs once on inject.
            // If toggling off, we should probably reload iframe or remove contenteditable.
            // But usually we just reload page or iframe to reset.
        }
    }, [isEditMode, isLoading, injectEditScripts]);


    const handleMediaUpdate = (src: string) => {
        if (!selectedMedia || !iframeRef.current?.contentWindow) return;

        iframeRef.current.contentWindow.postMessage({
            source: 'giftora-parent',
            type: 'UPDATE_MEDIA',
            gid: selectedMedia.gid,
            src
        }, '*');

        // Update local state to reflect change if needed, or close menu
        setSelectedMedia(null);
    };

    // Extract CLEAN HTML from iframe
    const getCleanHtml = () => {
        if (!iframeRef.current?.contentDocument) return "";

        const doc = iframeRef.current.contentDocument;
        // Clone root
        const clone = doc.documentElement.cloneNode(true) as HTMLElement;

        // Remove our injected stuff
        const style = clone.querySelector('#giftora-edit-styles');
        if (style) style.remove();
        const script = clone.querySelector('#giftora-edit-scripts');
        if (script) script.remove();

        // Cleanup Elements
        const all = clone.querySelectorAll('*');
        all.forEach(el => {
            el.removeAttribute('contenteditable');
            el.classList.remove('giftora-media-hover');
            el.removeAttribute('data-giftora-id');
            if (el.classList.length === 0) el.removeAttribute('class');
        });

        return clone.outerHTML;
    };

    const handlePreview = () => {
        const html = getCleanHtml();
        if (!html) return;
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    };

    const handleSave = async () => {
        const html = getCleanHtml();
        if (!html) return;

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const scriptToRemove = doc.getElementById('giftora-injected-js');
        if (scriptToRemove) scriptToRemove.remove();

        const newHtmlCode = doc.body.innerHTML;

        try {
            await updateMutation.mutateAsync({
                htmlCode: newHtmlCode
            });
            toast.success("Template saved successfully!");

            // Also download HTML as "Export"
            const blob = new Blob([html], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'template.html';
            a.click();

        } catch (e) {
            toast.error("Failed to save template");
            console.error(e);
        }
    };

    const handlePublish = () => {
        toast.info("To publish, please use the dashboard or main editor view.");
    };

    return (
        <div className="relative w-full h-full bg-gray-100">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white z-10 transition-opacity duration-300">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                </div>
            )}

            <iframe
                ref={iframeRef}
                srcDoc={htmlCode}
                className="w-full h-full border-0 shadow-sm"
                title="Template Preview"
                sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
                onLoad={handleLoad}
            />

            {isEditMode && selectedMedia && (
                <FloatingMediaMenu
                    position={selectedMedia.rect}
                    currentSrc={selectedMedia.src}
                    tagName={selectedMedia.tagName}
                    onUpdate={handleMediaUpdate}
                    onClose={() => setSelectedMedia(null)}
                />
            )}

            {isEditMode && (
                <FloatingToolbar
                    onPreview={handlePreview}
                    onSave={handleSave}
                    onPublish={handlePublish}
                />
            )}
        </div>
    );
}
