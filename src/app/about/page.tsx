"use client";

import React from "react";
import { useGetSiteSettings } from "@/features/site-settings/api/use-get-site-settings";
import { Loader2, Heart, Sparkles } from "lucide-react";
import { HorizontalNav } from "@/app/(dashboard)/horizontal-nav";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/theme-context";

export default function AboutPage() {
    const { data: settings, isLoading } = useGetSiteSettings();

    if (isLoading) {
        return (
            <ThemeProvider>
                <LanguageProvider>
                    <HorizontalNav />
                    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
                        <div className="text-center">
                            <Loader2 className="w-12 h-12 animate-spin text-pink-500 mx-auto mb-4" />
                            <p className="text-gray-600">Loading...</p>
                        </div>
                    </div>
                </LanguageProvider>
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider>
            <LanguageProvider>
                <HorizontalNav />
                <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
                    {/* Hero Section */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-700 text-white py-20">
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="absolute inset-0">
                            <div className="absolute top-10 left-10 w-72 h-72 bg-pink-400/30 rounded-full blur-3xl animate-pulse"></div>
                            <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400/30 rounded-full blur-3xl animate-pulse delay-700"></div>
                        </div>
                        <div className="relative max-w-4xl mx-auto px-6 text-center">
                            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                                <Sparkles className="w-4 h-4" />
                                <span className="text-sm font-medium">About Us</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                                Welcome to{" "}
                                <span className="bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
                                    {settings?.siteName || "Giftora"}
                                </span>
                            </h1>
                            <p className="text-xl text-pink-100 max-w-2xl mx-auto">
                                Creating unforgettable moments through personalized digital experiences
                            </p>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="max-w-4xl mx-auto px-6 py-16">
                        {/* Logo Section */}
                        {settings?.siteLogo && (
                            <div className="flex justify-center mb-12">
                                <div className="p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
                                    <img
                                        src={settings.siteLogo}
                                        alt={settings.siteName}
                                        className="h-20 w-auto object-contain"
                                    />
                                </div>
                            </div>
                        )}

                        {/* About Content */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12 mb-12">
                            <div className="flex items-center gap-3 mb-6">
                                <Heart className="w-8 h-8 text-pink-500 fill-pink-500" />
                                <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
                            </div>

                            {settings?.aboutUsContent ? (
                                <div className="prose prose-lg max-w-none">
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
                                        {settings.aboutUsContent}
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-pink-50 rounded-xl border border-pink-200">
                                        <Sparkles className="w-5 h-5 text-pink-500" />
                                        <p className="text-pink-700 font-medium">
                                            Our story is being written... Check back soon!
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Mission & Values */}
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                                    <Heart className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Our Mission</h3>
                                <p className="text-pink-100 text-sm">
                                    To help people create meaningful connections through personalized digital gifts
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                                    <Sparkles className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Innovation</h3>
                                <p className="text-purple-100 text-sm">
                                    Pushing the boundaries of what's possible in digital gifting experiences
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                                    <Heart className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Quality</h3>
                                <p className="text-indigo-100 text-sm">
                                    Every template is crafted with attention to detail and love
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-1/2 left-0 w-64 h-64 bg-pink-200/20 rounded-full blur-3xl -z-10"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl -z-10"></div>
                </div>
            </LanguageProvider>
        </ThemeProvider>
    );
}
