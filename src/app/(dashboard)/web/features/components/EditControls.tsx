"use client";

import React from 'react';
import { Download, Eye, Edit3, Rocket } from 'lucide-react';
import { useEditMode } from '../hooks/useEditMode';

interface EditControlsProps {
    onExport: () => void;
    onPublish?: () => void;
}

export function EditControls({ onExport, onPublish }: EditControlsProps) {
    const { isEditMode, toggleEditMode, allowToggle } = useEditMode();

    if (!allowToggle) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
            {isEditMode ? (
                // Edit Mode UI
                <>
                    <button
                        onClick={toggleEditMode}
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2"
                    >
                        <Eye className="w-5 h-5" />
                        Preview
                    </button>
                    <button
                        onClick={onExport}
                        className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2"
                    >
                        <Download className="w-5 h-5" />
                        Save & Export
                    </button>
                    {onPublish && (
                        <button
                            onClick={onPublish}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2"
                        >
                            <Rocket className="w-5 h-5" />
                            Publish
                        </button>
                    )}
                    <div className="bg-white/90 backdrop-blur-sm border-2 border-pink-300 rounded-lg px-4 py-2 text-sm text-gray-700 shadow-md">
                        💡 Click on any text or image to edit
                    </div>
                </>
            ) : (
                // Preview Mode UI
                <button
                    onClick={toggleEditMode}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2"
                >
                    <Edit3 className="w-5 h-5" />
                    Edit
                </button>
            )}
        </div>
    );
}
