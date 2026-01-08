"use client";

import React, { useState } from "react";
import { Eye, ArrowDownToLine, Rocket, Edit3, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface FloatingToolbarProps {
    onPreview: () => void;
    onSave: () => void;
    onPublish: () => void;
    onEditCode?: () => void; // Optional now
}

export function FloatingToolbar({
    onPreview,
    onSave,
    onPublish,
    onEditCode
}: FloatingToolbarProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3 z-50 font-sans">
            {/* Hint Tooltip */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-black/80 backdrop-blur-md text-white text-xs px-4 py-2 rounded-lg shadow-lg border border-white/10 flex items-center gap-2 mb-2"
            >
                <Sparkles className="w-3 h-3 text-yellow-400" />
                Click on any text or image to edit
            </motion.div>

            {/* Main Toolbar Container */}
            <div
                className="bg-black/90 backdrop-blur-xl p-3 rounded-2xl border border-white/10 shadow-2xl flex flex-col gap-2 min-w-[200px]"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Preview Button */}
                <button
                    onClick={onPreview}
                    className="group flex items-center gap-3 w-full p-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                    <div className="bg-white/20 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
                        <Eye className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-sm">Preview</span>
                </button>

                {/* Save & Export */}
                <button
                    onClick={onSave}
                    className="group flex items-center gap-3 w-full p-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white shadow-lg shadow-purple-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                    <div className="bg-white/20 p-1.5 rounded-lg group-hover:-translate-y-0.5 transition-transform">
                        <ArrowDownToLine className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col items-start leading-none gap-0.5">
                        <span className="font-semibold text-sm">Save & Export</span>
                        <span className="text-[10px] opacity-70">Download HTML</span>
                    </div>
                </button>

                {/* Publish */}
                <button
                    onClick={onPublish}
                    className="group flex items-center gap-3 w-full p-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white shadow-lg shadow-pink-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                    <div className="bg-white/20 p-1.5 rounded-lg group-hover:scale-110 transition-transform">
                        <Rocket className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-sm">Publish</span>
                </button>

                {/* Code Editor Toggle (Subtle) */}
                {onEditCode && (
                    <button
                        onClick={onEditCode}
                        className="mt-1 w-full py-2 text-xs text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-1.5 border-t border-white/10 pt-3"
                    >
                        <Edit3 className="w-3 h-3" />
                        Open Code Editor
                    </button>
                )}
            </div>
        </div>
    );
}
