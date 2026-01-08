"use client";

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    templateUrl: string;
    templateName: string;
    relatedTemplates?: Array<{
        id: string;
        name: string;
        thumbnail: string;
    }>;
}

export function PreviewModal({ isOpen, onClose, templateUrl, templateName, relatedTemplates = [] }: PreviewModalProps) {
    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEscape);
        }
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    />

                    {/* Modal Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="relative w-full max-w-6xl max-h-[90vh] bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
                            <div className="flex items-center gap-3">
                                <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-2 rounded-xl">
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">{templateName}</h2>
                                    <p className="text-sm text-gray-500">Template Preview</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                aria-label="Close preview"
                            >
                                <X className="w-6 h-6 text-gray-600" />
                            </button>
                        </div>

                        {/* Preview Content */}
                        <div className="relative flex flex-col h-[calc(90vh-180px)]">
                            {/* Browser-like Frame */}
                            <div className="flex-1 p-6 overflow-hidden">
                                <div className="h-full bg-white rounded-2xl shadow-xl border-4 border-gray-800 overflow-hidden">
                                    <iframe
                                        src={templateUrl}
                                        className="w-full h-full"
                                        title={`Preview of ${templateName}`}
                                        sandbox="allow-scripts allow-same-origin"
                                    />
                                </div>
                            </div>

                            {/* Related Templates Carousel */}
                            {relatedTemplates.length > 0 && (
                                <div className="px-6 pb-6">
                                    <div className="flex gap-3 overflow-x-auto pb-2">
                                        {relatedTemplates.map((template) => (
                                            <div
                                                key={template.id}
                                                className="flex-shrink-0 w-32 h-24 rounded-lg overflow-hidden border-2 border-gray-300 hover:border-purple-500 transition-all cursor-pointer"
                                            >
                                                <img
                                                    src={template.thumbnail}
                                                    alt={template.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
