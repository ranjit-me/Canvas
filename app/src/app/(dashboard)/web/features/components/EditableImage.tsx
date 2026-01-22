"use client";

import React, { useState, useRef } from 'react';
import { Upload, Link as LinkIcon, X } from 'lucide-react';
import { useEditMode } from '../hooks/useEditMode';

interface EditableImageProps {
    src: string;
    alt: string;
    onChange: (url: string) => void;
    elementId: string;
    isSelected: boolean;
    onSelect: () => void;
    className?: string;
}

export function EditableImage({
    src,
    alt,
    onChange,
    elementId,
    isSelected,
    onSelect,
    className = '',
}: EditableImageProps) {
    const { isEditMode } = useEditMode();
    const [showToolbar, setShowToolbar] = useState(false);
    const [showUrlInput, setShowUrlInput] = useState(false);
    const [urlValue, setUrlValue] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // If not in edit mode, render as plain image (AFTER all hooks)
    if (!isEditMode) {
        return <img src={src} alt={alt} className={className} />;
    }

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect();
        setShowToolbar(true);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onChange(reader.result as string);
                setShowToolbar(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUrlSubmit = () => {
        if (urlValue.trim()) {
            onChange(urlValue.trim());
            setUrlValue('');
            setShowUrlInput(false);
            setShowToolbar(false);
        }
    };

    const handleClose = () => {
        setShowToolbar(false);
        setShowUrlInput(false);
        setUrlValue('');
    };

    return (
        <div className="group relative">
            <img
                src={src}
                alt={alt}
                onClick={handleClick}
                className={`${className} cursor-pointer transition-all ${isSelected ? 'ring-4 ring-pink-500 ring-offset-2' : ''
                    } group-hover:brightness-75`}
            />

            {/* Edit indicator on hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-pink-500 text-white rounded-full p-3 shadow-lg">
                    <Upload className="w-6 h-6" />
                </div>
            </div>

            {/* Edit Toolbar */}
            {showToolbar && (
                <div className="absolute top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-2 border-pink-500 rounded-lg shadow-xl p-4 z-50">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-800">Edit Image</h4>
                        <button
                            onClick={handleClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {!showUrlInput ? (
                        <div className="space-y-2">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                            >
                                <Upload className="w-4 h-4" />
                                Upload Image
                            </button>
                            <button
                                onClick={() => setShowUrlInput(true)}
                                className="w-full flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                            >
                                <LinkIcon className="w-4 h-4" />
                                Add from URL
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <input
                                type="text"
                                value={urlValue}
                                onChange={(e) => setUrlValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                                placeholder="Paste image URL..."
                                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none"
                                autoFocus
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={handleUrlSubmit}
                                    className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                                >
                                    Apply
                                </button>
                                <button
                                    onClick={() => setShowUrlInput(false)}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                                >
                                    Back
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
