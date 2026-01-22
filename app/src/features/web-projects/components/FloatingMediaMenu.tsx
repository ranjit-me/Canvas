"use client";

import React, { useState } from "react";
import { Image as ImageIcon, Link as LinkIcon, X, Check } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface FloatingMediaMenuProps {
    position: { top: number; left: number; width: number; height: number; bottom: number; right: number };
    currentSrc: string;
    tagName: string;
    onUpdate: (src: string) => void;
    onClose: () => void;
}

export function FloatingMediaMenu({ position, currentSrc, tagName, onUpdate, onClose }: FloatingMediaMenuProps) {
    const [src, setSrc] = useState(currentSrc);
    const [isOpen, setIsOpen] = useState(true);

    const isImage = tagName === "IMG";

    // Calculate position: Centered below the element
    // We'll use fixed positioning based on the iframe's client rects which are passed normalized or absolute?
    // The parent (HtmlTemplateEditor) should handle coordinate translation. 
    // Assuming `position` is relative to the editor container.

    // Style for the floating pill
    const style: React.CSSProperties = {
        position: 'absolute',
        top: position.top + 10, // slightly offset
        left: position.left,
        zIndex: 50,
    };

    const handleSave = () => {
        onUpdate(src);
        onClose();
    };

    return (
        <div style={style} className="flex gap-2">
            <Popover open={isOpen} onOpenChange={(open) => {
                if (!open) onClose();
                setIsOpen(open);
            }}>
                <PopoverTrigger asChild>
                    <div className="bg-black/80 backdrop-blur-md text-white px-3 py-2 rounded-lg shadow-xl cursor-default flex items-center gap-3 animate-in fade-in zoom-in-95 duration-200">
                        <span className="text-xs font-semibold uppercase text-gray-300 tracking-wider flex items-center gap-1.5">
                            {isImage ? <ImageIcon className="w-3 h-3" /> : <LinkIcon className="w-3 h-3" />}
                            Edit {tagName.toLowerCase()}
                        </span>
                    </div>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0 overflow-hidden bg-white border-0 shadow-2xl" side="bottom" align="start">
                    {/* Header */}
                    <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
                        <span className="font-medium text-sm text-gray-700">Change Source</span>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="p-4">
                        {isImage ? (
                            <Tabs defaultValue="upload" className="w-full">
                                <TabsList className="grid w-full grid-cols-2 mb-4">
                                    <TabsTrigger value="upload">Upload</TabsTrigger>
                                    <TabsTrigger value="url">Link</TabsTrigger>
                                </TabsList>
                                <TabsContent value="upload">
                                    <ImageUpload
                                        value={src}
                                        onChange={(url) => {
                                            setSrc(url);
                                            // Auto-update if upload completes
                                            // onUpdate(url); 
                                        }}
                                    />
                                </TabsContent>
                                <TabsContent value="url">
                                    <Input
                                        value={src}
                                        onChange={(e) => setSrc(e.target.value)}
                                        placeholder="https://..."
                                        className="mb-2"
                                    />
                                </TabsContent>
                            </Tabs>
                        ) : (
                            <div className="space-y-3">
                                <Input
                                    value={src}
                                    onChange={(e) => setSrc(e.target.value)}
                                    placeholder="https://..."
                                />
                                <p className="text-xs text-gray-500">
                                    Paste a direct link to your media file.
                                </p>
                            </div>
                        )}

                        <Button onClick={handleSave} className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
                            Save Changes
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
