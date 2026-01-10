"use client";

import React, { useState, useRef, useEffect } from "react";
import { Eye, Save, Globe, Rocket, Sparkles, X, Upload, Link as LinkIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUpdateHtmlTemplate } from "@/features/html-templates/api/use-update-html-template";
import { PublishDialog } from "@/features/web-projects/components/publish-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface HtmlEditRendererProps {
    template: any;
}

interface EditModalState {
    type: "text" | "image" | "video" | "audio" | null;
    content: string;
    elementId: string | null;
}

export default function HtmlEditRenderer({ template }: HtmlEditRendererProps) {
    const [htmlCode, setHtmlCode] = useState(template.htmlCode || "");
    const [cssCode, setCssCode] = useState(template.cssCode || "");
    const [jsCode, setJsCode] = useState(template.jsCode || "");
    const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
    const [editModal, setEditModal] = useState<EditModalState>({
        type: null,
        content: "",
        elementId: null,
    });

    const iframeRef = useRef<HTMLIFrameElement>(null);
    const updateMutation = useUpdateHtmlTemplate(template.id);

    const getFullHtml = () => {
        const isFullDocument =
            htmlCode.trim().toLowerCase().startsWith("<!doctype html") ||
            htmlCode.trim().toLowerCase().startsWith("<html");

        let processedHtml = htmlCode;

        if (isFullDocument) {
            // Inject CSS
            if (cssCode) {
                if (processedHtml.includes("</head>")) {
                    processedHtml = processedHtml.replace(
                        "</head>",
                        `<style>${cssCode}</style></head>`
                    );
                } else {
                    processedHtml = processedHtml.replace(
                        "<html>",
                        `<html><head><style>${cssCode}</style></head>`
                    );
                }
            }

            // Inject JS
            if (jsCode) {
                if (processedHtml.includes("</body>")) {
                    processedHtml = processedHtml.replace(
                        "</body>",
                        `<script>${jsCode}</script></body>`
                    );
                } else {
                    processedHtml = processedHtml.replace(
                        "</html>",
                        `<script>${jsCode}</script></html>`
                    );
                }
            }
        } else {
            processedHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${template.name || "Template"}</title>
    <style>${cssCode}</style>
</head>
<body>
    ${htmlCode}
    <script>${jsCode}</script>
</body>
</html>
            `.trim();
        }

        // Inject inline editing script
        const editingScript = `
<script>
(function() {
    // Add data-editable-id to elements
    let elementId = 0;
    
    // Make text elements editable (EXCLUDING buttons and links)
    document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, li').forEach(el => {
        // Skip if element is a button, link, or inside a button/link
        if (el.tagName === 'BUTTON' || el.tagName === 'A') return;
        if (el.closest('button, a')) return;
        
        // Only make editable if it has direct text content (not nested elements)
        if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
            el.setAttribute('data-editable-text', elementId++);
            el.style.cursor = 'text';
            el.style.outline = '2px solid transparent';
            el.style.transition = 'outline 0.2s';
            
            el.addEventListener('mouseenter', () => {
                el.style.outline = '2px dashed rgba(168, 85, 247, 0.5)';
            });
            el.addEventListener('mouseleave', () => {
                el.style.outline = '2px solid transparent';
            });
            el.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const id = el.getAttribute('data-editable-text');
                const text = el.textContent;
                parent.postMessage({ 
                    type: 'EDIT_TEXT', 
                    id: id,
                    content: text,
                    html: el.outerHTML
                }, '*');
            });
        }
    });
    
    // Make images editable
    document.querySelectorAll('img').forEach(el => {
        el.setAttribute('data-editable-image', elementId++);
        el.style.cursor = 'pointer';
        el.style.outline = '2px solid transparent';
        el.style.transition = 'outline 0.2s';
        
        el.addEventListener('mouseenter', () => {
            el.style.outline = '2px dashed rgba(236, 72, 153, 0.5)';
        });
        el.addEventListener('mouseleave', () => {
            el.style.outline = '2px solid transparent';
        });
        el.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const id = el.getAttribute('data-editable-image');
            parent.postMessage({ 
                type: 'EDIT_IMAGE', 
                id: id,
                content: el.src,
                html: el.outerHTML
            }, '*');
        });
    });
    
    // Make videos editable
    document.querySelectorAll('video, source').forEach(el => {
        const videoEl = el.tagName === 'VIDEO' ? el : el.parentElement;
        if (videoEl && videoEl.tagName === 'VIDEO') {
            videoEl.setAttribute('data-editable-video', elementId++);
            videoEl.style.cursor = 'pointer';
            videoEl.style.outline = '2px solid transparent';
            videoEl.style.transition = 'outline 0.2s';
            
            videoEl.addEventListener('mouseenter', () => {
                videoEl.style.outline = '2px dashed rgba(59, 130, 246, 0.5)';
            });
            videoEl.addEventListener('mouseleave', () => {
                videoEl.style.outline = '2px solid transparent';
            });
            videoEl.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const id = videoEl.getAttribute('data-editable-video');
                const src = videoEl.querySelector('source')?.src || videoEl.src;
                parent.postMessage({ 
                    type: 'EDIT_VIDEO', 
                    id: id,
                    content: src,
                    html: videoEl.outerHTML
                }, '*');
            });
        }
    });
    
    // Make audio editable
    document.querySelectorAll('audio, audio source').forEach(el => {
        const audioEl = el.tagName === 'AUDIO' ? el : el.parentElement;
        if (audioEl && audioEl.tagName === 'AUDIO') {
            audioEl.setAttribute('data-editable-audio', elementId++);
            audioEl.style.cursor = 'pointer';
            audioEl.style.outline = '2px solid transparent';
            audioEl.style.transition = 'outline 0.2s';
            
            audioEl.addEventListener('mouseenter', () => {
                audioEl.style.outline = '2px dashed rgba(34, 197, 94, 0.5)';
            });
            audioEl.addEventListener('mouseleave', () => {
                audioEl.style.outline = '2px solid transparent';
            });
            audioEl.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const id = audioEl.getAttribute('data-editable-audio');
                const src = audioEl.querySelector('source')?.src || audioEl.src;
                parent.postMessage({ 
                    type: 'EDIT_AUDIO', 
                    id: id,
                    content: src,
                    html: audioEl.outerHTML
                }, '*');
            });
        }
    });
})();
</script>
        `;

        if (processedHtml.includes("</body>")) {
            processedHtml = processedHtml.replace("</body>", `${editingScript}</body>`);
        } else {
            processedHtml = processedHtml.replace("</html>", `${editingScript}</html>`);
        }

        return processedHtml;
    };

    // Listen for messages from iframe
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data.type === "EDIT_TEXT") {
                setEditModal({
                    type: "text",
                    content: event.data.content,
                    elementId: event.data.id,
                });
            } else if (event.data.type === "EDIT_IMAGE") {
                setEditModal({
                    type: "image",
                    content: event.data.content,
                    elementId: event.data.id,
                });
            } else if (event.data.type === "EDIT_VIDEO") {
                setEditModal({
                    type: "video",
                    content: event.data.content,
                    elementId: event.data.id,
                });
            } else if (event.data.type === "EDIT_AUDIO") {
                setEditModal({
                    type: "audio",
                    content: event.data.content,
                    elementId: event.data.id,
                });
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, []);

    const handleSaveEdit = () => {
        if (!editModal.elementId) return;

        const iframe = iframeRef.current;
        if (!iframe?.contentDocument) return;

        const { type, content, elementId } = editModal;
        let element: HTMLElement | null = null;

        if (type === "text") {
            element = iframe.contentDocument.querySelector(
                `[data-editable-text="${elementId}"]`
            );
            if (element) {
                element.textContent = content;
                // Update HTML code
                const newHtml = iframe.contentDocument.body.innerHTML;
                setHtmlCode(newHtml);
            }
        } else if (type === "image") {
            element = iframe.contentDocument.querySelector(
                `[data-editable-image="${elementId}"]`
            ) as HTMLImageElement;
            if (element) {
                (element as HTMLImageElement).src = content;
                const newHtml = iframe.contentDocument.body.innerHTML;
                setHtmlCode(newHtml);
            }
        } else if (type === "video") {
            element = iframe.contentDocument.querySelector(
                `[data-editable-video="${elementId}"]`
            ) as HTMLVideoElement;
            if (element) {
                const source = element.querySelector("source");
                if (source) {
                    source.src = content;
                } else if (element) {
                    (element as HTMLVideoElement).src = content;
                }
                (element as HTMLVideoElement).load();
                const newHtml = iframe.contentDocument.body.innerHTML;
                setHtmlCode(newHtml);
            }
        } else if (type === "audio") {
            element = iframe.contentDocument.querySelector(
                `[data-editable-audio="${elementId}"]`
            ) as HTMLAudioElement;
            if (element) {
                const source = element.querySelector("source");
                if (source) {
                    source.src = content;
                } else if (element) {
                    (element as HTMLAudioElement).src = content;
                }
                (element as HTMLAudioElement).load();
                const newHtml = iframe.contentDocument.body.innerHTML;
                setHtmlCode(newHtml);
            }
        }

        setEditModal({ type: null, content: "", elementId: null });
        toast.success("Element updated!");
    };

    const handleSave = async () => {
        try {
            await updateMutation.mutateAsync({
                htmlCode,
                cssCode,
                jsCode,
            });
            toast.success("Template saved successfully!");
        } catch (error) {
            toast.error("Failed to save template");
        }
    };

    const handlePublish = async (slug: string) => {
        try {
            await updateMutation.mutateAsync({
                slug,
                isPublished: true,
                htmlCode,
                cssCode,
                jsCode,
            });
            toast.success("Template published successfully!");
        } catch (error) {
            toast.error("Failed to publish template");
        }
    };

    const handlePreview = () => {
        const blob = new Blob([getFullHtml()], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
    };

    return (
        <>
            <PublishDialog
                isOpen={isPublishDialogOpen}
                onClose={() => setIsPublishDialogOpen(false)}
                onPublish={handlePublish}
                defaultSlug={template.slug || ""}
                templateName={template.name || "Your Template"}
            />

            <div className="relative w-full h-screen bg-gray-50">
                <iframe
                    ref={iframeRef}
                    srcDoc={getFullHtml()}
                    className="w-full h-full border-0"
                    title={template.name || "Template"}
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                />

                {/* Floating Toolbar */}
                <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3 z-50">
                    {/* Hint */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-black/80 backdrop-blur-md text-white text-xs px-4 py-2 rounded-lg shadow-lg border border-white/10 flex items-center gap-2"
                    >
                        <Sparkles className="w-3 h-3 text-yellow-400" />
                        Click on content (text, images, videos, audio) to edit. Buttons work normally!
                    </motion.div>

                    {/* Action Buttons */}
                    <div className="bg-black/90 backdrop-blur-xl p-3 rounded-2xl border border-white/10 shadow-2xl flex flex-col gap-2 min-w-[200px]">
                        <button
                            onClick={handlePreview}
                            className="group flex items-center gap-3 w-full p-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg transition-all hover:scale-[1.02]"
                        >
                            <div className="bg-white/20 p-1.5 rounded-lg">
                                <Eye className="w-4 h-4" />
                            </div>
                            <span className="font-semibold text-sm">Preview</span>
                        </button>

                        <button
                            onClick={handleSave}
                            disabled={updateMutation.isPending}
                            className="group flex items-center gap-3 w-full p-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white shadow-lg transition-all hover:scale-[1.02]"
                        >
                            <div className="bg-white/20 p-1.5 rounded-lg">
                                <Save className="w-4 h-4" />
                            </div>
                            <span className="font-semibold text-sm">
                                {updateMutation.isPending ? "Saving..." : "Save"}
                            </span>
                        </button>

                        <button
                            onClick={() => setIsPublishDialogOpen(true)}
                            className="group flex items-center gap-3 w-full p-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white shadow-lg transition-all hover:scale-[1.02]"
                        >
                            <div className="bg-white/20 p-1.5 rounded-lg">
                                <Rocket className="w-4 h-4" />
                            </div>
                            <span className="font-semibold text-sm">Publish</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {editModal.type && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full p-6"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Edit {editModal.type}
                                </h3>
                                <button
                                    onClick={() =>
                                        setEditModal({ type: null, content: "", elementId: null })
                                    }
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {editModal.type === "text" ? (
                                    <textarea
                                        value={editModal.content}
                                        onChange={(e) =>
                                            setEditModal({ ...editModal, content: e.target.value })
                                        }
                                        className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white resize-none"
                                        placeholder="Enter your text..."
                                    />
                                ) : (
                                    <div className="space-y-3">
                                        <input
                                            type="url"
                                            value={editModal.content}
                                            onChange={(e) =>
                                                setEditModal({ ...editModal, content: e.target.value })
                                            }
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white"
                                            placeholder={`Enter ${editModal.type} URL...`}
                                        />
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <LinkIcon className="w-4 h-4" />
                                            <span>Or upload a file (coming soon)</span>
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-3 pt-4">
                                    <Button
                                        onClick={() =>
                                            setEditModal({ type: null, content: "", elementId: null })
                                        }
                                        variant="outline"
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleSaveEdit}
                                        className="flex-1 bg-purple-600 hover:bg-purple-700"
                                    >
                                        Save Changes
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
