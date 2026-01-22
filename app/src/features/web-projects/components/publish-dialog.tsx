"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe, Sparkles } from 'lucide-react';

interface PublishDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onPublish: (slug: string) => void;
    defaultSlug?: string;
    templateName?: string;
}

export function PublishDialog({
    isOpen,
    onClose,
    onPublish,
    defaultSlug = '',
    templateName = 'Your Template'
}: PublishDialogProps) {
    const [slug, setSlug] = useState(defaultSlug);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate slug
        if (!slug.trim()) {
            setError('Please enter a URL slug');
            return;
        }

        // Check if slug is valid (alphanumeric and hyphens only)
        const slugRegex = /^[a-z0-9-]+$/;
        if (!slugRegex.test(slug)) {
            setError('URL slug can only contain lowercase letters, numbers, and hyphens');
            return;
        }

        onPublish(slug);
        onClose();
    };

    const handleClose = () => {
        setSlug(defaultSlug);
        setError('');
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />

                    {/* Dialog */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 text-white relative">
                                <button
                                    onClick={handleClose}
                                    className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                                        <Globe className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold">Publish Your Site</h2>
                                        <p className="text-white/80 text-sm">{templateName}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Custom URL Slug
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500 text-sm">
                                            {typeof window !== 'undefined' ? window.location.origin : 'yoursite.com'}/p/
                                        </span>
                                        <input
                                            type="text"
                                            value={slug}
                                            onChange={(e) => {
                                                setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''));
                                                setError('');
                                            }}
                                            placeholder="my-awesome-site"
                                            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none transition-colors"
                                            autoFocus
                                        />
                                    </div>
                                    {error && (
                                        <p className="text-red-500 text-sm">{error}</p>
                                    )}
                                    <p className="text-gray-500 text-xs">
                                        Choose a unique URL for your published site. Only lowercase letters, numbers, and hyphens allowed.
                                    </p>
                                </div>

                                <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-4 border border-pink-200">
                                    <div className="flex items-start gap-3">
                                        <Sparkles className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" />
                                        <div className="text-sm text-gray-700">
                                            <p className="font-semibold mb-1">Your site will be live at:</p>
                                            <p className="font-mono text-pink-600 break-all">
                                                {typeof window !== 'undefined' ? window.location.origin : 'yoursite.com'}/p/{slug || 'your-slug'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                                    >
                                        Publish Now 🚀
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
