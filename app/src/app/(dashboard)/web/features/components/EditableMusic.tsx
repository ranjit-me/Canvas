"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Music, Upload, Link as LinkIcon, X, Play, Pause } from 'lucide-react';
import { useEditMode } from '../hooks/useEditMode';

interface EditableMusicProps {
    url: string;
    onChange: (url: string) => void;
    isSelected: boolean;
    onSelect: () => void;
    className?: string;
}

export function EditableMusic({
    url,
    onChange,
    isSelected,
    onSelect,
    className = '',
}: EditableMusicProps) {
    const { isEditMode } = useEditMode();
    const [showToolbar, setShowToolbar] = useState(false);
    const [showUrlInput, setShowUrlInput] = useState(false);
    const [urlValue, setUrlValue] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    // Initial load
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.src = url;
            audioRef.current.load();
        }
    }, [url]);

    // Handle play/pause
    const togglePlay = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(e => console.error("Playback failed:", e));
            }
            setIsPlaying(!isPlaying);
        }
    };

    if (!isEditMode) {
        return (
            <>
                <audio ref={audioRef} loop id="bg-music">
                    <source src={url} type="audio/mpeg" />
                </audio>
                <button
                    onClick={() => togglePlay()}
                    className={`${className} bg-white/30 backdrop-blur-md border-2 border-white/40 rounded-full p-4 shadow-lg hover:shadow-pink-300/50 hover:scale-110 transition-all duration-300 group`}
                >
                    {isPlaying ? (
                        <Pause className="w-6 h-6 text-pink-600" />
                    ) : (
                        <Play className="w-6 h-6 text-pink-600" />
                    )}
                </button>
            </>
        );
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
                const result = reader.result as string;
                onChange(result);
                setShowToolbar(false);
                setIsPlaying(false); // Stop current playback
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
            setIsPlaying(false);
        }
    };

    const handleClose = () => {
        setShowToolbar(false);
        setShowUrlInput(false);
        setUrlValue('');
    };

    return (
        <div className="group relative z-50">
            <audio ref={audioRef} loop>
                <source src={url} type="audio/mpeg" />
            </audio>

            {/* The trigger button */}
            <div
                onClick={handleClick}
                className={`${className} cursor-pointer transition-all ${isSelected ? 'ring-4 ring-pink-500 ring-offset-2' : ''
                    } relative`}
            >
                <div className="bg-white/30 backdrop-blur-md border-2 border-white/40 rounded-full p-4 shadow-lg hover:shadow-pink-300/50">
                    <Music className="w-6 h-6 text-pink-600" />
                </div>

                {/* Edit indicator */}
                <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="bg-pink-500 text-white rounded-full p-1.5 shadow-lg">
                        <Upload className="w-3 h-3" />
                    </div>
                </div>
            </div>


            {/* Edit Toolbar */}
            {showToolbar && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-white/95 backdrop-blur-sm border-2 border-pink-500 rounded-lg shadow-xl p-4 z-[100]">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-800">Change Music</h4>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleClose(); }}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {!showUrlInput ? (
                        <div className="space-y-2">
                            <div className="flex gap-2 mb-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                                >
                                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                    {isPlaying ? 'Pause' : 'Test Play'}
                                </button>
                            </div>

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors text-sm"
                            >
                                <Upload className="w-4 h-4" />
                                Upload MP3
                            </button>
                            <button
                                onClick={() => setShowUrlInput(true)}
                                className="w-full flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm"
                            >
                                <LinkIcon className="w-4 h-4" />
                                Add from URL
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="audio/*"
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
                                placeholder="Paste mp3 URL..."
                                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none text-sm"
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={handleUrlSubmit}
                                    className="flex-1 px-3 py-1.5 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors text-sm"
                                >
                                    Apply
                                </button>
                                <button
                                    onClick={() => setShowUrlInput(false)}
                                    className="px-3 py-1.5 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm"
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
