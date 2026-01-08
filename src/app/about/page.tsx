"use client";

import { useEffect } from "react";
import { useGetSiteSettings } from "@/features/site-settings/api/use-get-site-settings";
import { Loader2, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
    const { data: settings, isLoading } = useGetSiteSettings();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
            {/* Navigation */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center gap-3">
                        {settings?.siteLogo ? (
                            <img src={settings.siteLogo} alt={settings.siteName} className="h-10" />
                        ) : (
                            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                {settings?.siteName || "Giftora"}
                            </span>
                        )}
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
                            About {settings?.siteName || "Us"}
                        </h1>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto rounded-full"></div>
                    </div>

                    {/* About Content */}
                    <div className="max-w-4xl mx-auto">
                        {settings?.aboutUsContent ? (
                            <div className="bg-white rounded-2xl shadow-xl p-12 mb-16">
                                <div className="prose prose-lg max-w-none">
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {settings.aboutUsContent}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl shadow-xl p-12 mb-16 text-center">
                                <p className="text-gray-500 text-lg">
                                    Welcome to {settings?.siteName || "our platform"}. We're dedicated to making your special moments unforgettable.
                                </p>
                            </div>
                        )}

                        {/* Contact Information */}
                        {(settings?.contactEmail || settings?.contactPhone || settings?.contactAddress) && (
                            <div className="grid md:grid-cols-3 gap-6 mb-16">
                                {settings.contactEmail && (
                                    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-purple-100 rounded-lg">
                                                <Mail className="w-6 h-6 text-purple-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium uppercase">Email</p>
                                                <a
                                                    href={`mailto:${settings.contactEmail}`}
                                                    className="text-gray-900 font-semibold hover:text-purple-600 transition-colors"
                                                >
                                                    {settings.contactEmail}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {settings.contactPhone && (
                                    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-pink-100 rounded-lg">
                                                <Phone className="w-6 h-6 text-pink-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium uppercase">Phone</p>
                                                <a
                                                    href={`tel:${settings.contactPhone}`}
                                                    className="text-gray-900 font-semibold hover:text-pink-600 transition-colors"
                                                >
                                                    {settings.contactPhone}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {settings.contactAddress && (
                                    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-blue-100 rounded-lg">
                                                <MapPin className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium uppercase">Address</p>
                                                <p className="text-gray-900 font-semibold text-sm">{settings.contactAddress}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Social Media Links */}
                        {settings?.socialLinks && (
                            <div className="bg-white rounded-2xl shadow-xl p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Connect With Us</h2>
                                <div className="flex justify-center gap-4">
                                    {settings.socialLinks.facebook && (
                                        <a
                                            href={settings.socialLinks.facebook}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors hover:scale-110 transform"
                                        >
                                            <Facebook className="w-6 h-6" />
                                        </a>
                                    )}
                                    {settings.socialLinks.twitter && (
                                        <a
                                            href={settings.socialLinks.twitter}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-4 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors hover:scale-110 transform"
                                        >
                                            <Twitter className="w-6 h-6" />
                                        </a>
                                    )}
                                    {settings.socialLinks.instagram && (
                                        <a
                                            href={settings.socialLinks.instagram}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-4 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 text-white rounded-full hover:opacity-90 transition-opacity hover:scale-110 transform"
                                        >
                                            <Instagram className="w-6 h-6" />
                                        </a>
                                    )}
                                    {settings.socialLinks.linkedin && (
                                        <a
                                            href={settings.socialLinks.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-4 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors hover:scale-110 transform"
                                        >
                                            <Linkedin className="w-6 h-6" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* CTA */}
                    <div className="text-center mt-16">
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold text-lg hover:shadow-lg transition-all hover:scale-105 transform"
                        >
                            Get Started
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
