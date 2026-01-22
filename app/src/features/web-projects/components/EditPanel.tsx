"use client";

import React, { useState, useEffect } from "react";
import { X, Check, Upload, Type, Image as ImageIcon, Video, Music } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface EditPanelProps {
    element: {
        tagName: string;
        id?: string;
        content?: string; // innerHTML or textContent
        src?: string;     // for img, video, audio
        style?: Record<string, string>;
    } | null;
    onUpdate: (data: { content?: string; src?: string; style?: Record<string, string> }) => void;
    onClose: () => void;
}

export function EditPanel({ element, onUpdate, onClose }: EditPanelProps) {
    const [content, setContent] = useState(element?.content || "");
    const [src, setSrc] = useState(element?.src || "");
    // Future support for style editing can be added here

    useEffect(() => {
        if (element) {
            setContent(element.content || "");
            setSrc(element.src || "");
        }
    }, [element]);

    if (!element) return null;

    const handleSave = () => {
        onUpdate({
            content: element.tagName !== "IMG" ? content : undefined,
            src: (element.tagName === "IMG" || element.tagName === "VIDEO" || element.tagName === "AUDIO") ? src : undefined,
        });
    };

    const isImage = element.tagName === "IMG";
    const isVideo = element.tagName === "VIDEO";
    const isAudio = element.tagName === "AUDIO";
    const isText = !isImage && !isVideo && !isAudio;

    return (
        <div className="fixed bottom-4 right-4 z-50 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 duration-300">
            {/* Header */}
            <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {isText && <Type className="w-4 h-4 text-purple-600" />}
                    {isImage && <ImageIcon className="w-4 h-4 text-purple-600" />}
                    {isVideo && <Video className="w-4 h-4 text-purple-600" />}
                    {isAudio && <Music className="w-4 h-4 text-purple-600" />}
                    <span className="font-semibold text-sm text-gray-700">
                        Edit {element.tagName.toLowerCase()}
                    </span>
                </div>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Content */}
            <div className="p-4 flex-1 overflow-y-auto max-h-[60vh]">
                {isText && (
                    <div className="space-y-3">
                        <Label>Text Content</Label>
                        <Textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="min-h-[100px] resize-none"
                            placeholder="Enter text..."
                        />
                    </div>
                )}

                {isImage && (
                    <div className="space-y-3">
                        <Label>Image Source</Label>
                        <Tabs defaultValue="upload" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="upload">Upload</TabsTrigger>
                                <TabsTrigger value="url">URL</TabsTrigger>
                            </TabsList>
                            <TabsContent value="upload" className="mt-4">
                                <ImageUpload
                                    value={src}
                                    onChange={setSrc}
                                />
                            </TabsContent>
                            <TabsContent value="url" className="mt-4">
                                <Input
                                    value={src}
                                    onChange={(e) => setSrc(e.target.value)}
                                    placeholder="https://example.com/image.jpg"
                                />
                            </TabsContent>
                        </Tabs>
                    </div>
                )}

                {(isVideo || isAudio) && (
                    <div className="space-y-3">
                        <Label>Media URL</Label>
                        <Input
                            value={src}
                            onChange={(e) => setSrc(e.target.value)}
                            placeholder={`https://example.com/media.${isVideo ? 'mp4' : 'mp3'}`}
                        />
                        <p className="text-xs text-gray-500">
                            Direct upload for video/audio coming soon. Please use a direct link.
                        </p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-gray-50 flex gap-2">
                <Button
                    onClick={handleSave}
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                    <Check className="w-4 h-4 mr-2" />
                    Apply Changes
                </Button>
            </div>
        </div>
    );
}
