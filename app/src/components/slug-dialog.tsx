"use client";

import { useState } from "react";
import { X, AlertCircle, CheckCircle2 } from "lucide-react";

interface SlugDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (slug: string) => void;
    defaultSlug: string;
    error?: string;
    isSubmitting?: boolean;
}

export function SlugDialog({
    isOpen,
    onClose,
    onSubmit,
    defaultSlug,
    error,
    isSubmitting = false
}: SlugDialogProps) {
    const [slug, setSlug] = useState(defaultSlug);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (slug.trim()) {
            onSubmit(slug.trim());
        }
    };

    const formatSlug = (value: string) => {
        return value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSlug(formatSlug(e.target.value));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black">Publish Your Site</h2>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-white/20 rounded-full transition-colors"
                            disabled={isSubmitting}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <p className="text-white/90 text-sm mt-2">
                        Choose a unique URL for your published website
                    </p>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6">
                    {/* Error Alert */}
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-bold text-red-900 text-sm">Slug Already Taken</p>
                                <p className="text-red-700 text-sm mt-1">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">
                            Your URL Slug
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={slug}
                                onChange={handleChange}
                                placeholder="my-awesome-site"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-mono text-sm focus:border-purple-400 focus:outline-none focus:ring-4 focus:ring-purple-50 transition-all"
                                disabled={isSubmitting}
                                autoFocus
                            />
                        </div>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Your site will be available at: <span className="font-mono font-bold">/p/{slug || 'your-slug'}</span>
                        </p>
                    </div>

                    {/* Tips */}
                    <div className="mt-4 p-3 bg-blue-50 rounded-xl">
                        <p className="text-xs font-bold text-blue-900 mb-1">💡 Tips:</p>
                        <ul className="text-xs text-blue-700 space-y-1">
                            <li>• Use lowercase letters, numbers, and hyphens</li>
                            <li>• Keep it short and memorable</li>
                            <li>• Example: birthday-2024, our-anniversary</li>
                        </ul>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSubmitting || !slug.trim()}
                        >
                            {isSubmitting ? "Publishing..." : "Publish Now"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
