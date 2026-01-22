"use client";

import React from "react";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Heart } from "lucide-react";
import { useGetSiteSettings } from "@/features/site-settings/api/use-get-site-settings";

export function Footer() {
    const { data: settings, isLoading } = useGetSiteSettings();

    if (isLoading) {
        return (
            <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="text-center text-gray-400">Loading...</div>
                </div>
            </footer>
        );
    }

    const socialLinks = settings?.socialLinks || {};
    const socialIcons = [
        { name: "facebook", icon: Facebook, url: socialLinks.facebook },
        { name: "twitter", icon: Twitter, url: socialLinks.twitter },
        { name: "instagram", icon: Instagram, url: socialLinks.instagram },
        { name: "linkedin", icon: Linkedin, url: socialLinks.linkedin },
    ].filter((social) => social.url);

    return (
        <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white border-t border-gray-700/50">
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    {/* About Section */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                            {settings?.siteName || "Giftora"}
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Create beautiful, personalized gift experiences that make every moment special.
                        </p>
                        {settings?.siteLogo && (
                            <img
                                src={settings.siteLogo}
                                alt={settings.siteName}
                                className="h-12 w-auto object-contain brightness-110"
                            />
                        )}
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/dashboard"
                                    className="text-gray-400 hover:text-pink-400 transition-colors duration-200 text-sm flex items-center gap-2 group"
                                >
                                    <span className="w-1 h-1 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/about"
                                    className="text-gray-400 hover:text-pink-400 transition-colors duration-200 text-sm flex items-center gap-2 group"
                                >
                                    <span className="w-1 h-1 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/contact"
                                    className="text-gray-400 hover:text-pink-400 transition-colors duration-200 text-sm flex items-center gap-2 group"
                                >
                                    <span className="w-1 h-1 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    {(settings?.contactEmail || settings?.contactPhone || settings?.contactAddress) && (
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-white">Contact Info</h4>
                            <ul className="space-y-3">
                                {settings.contactEmail && (
                                    <li className="flex items-start gap-3 text-sm text-gray-400 group">
                                        <Mail className="w-4 h-4 mt-0.5 text-pink-400 group-hover:scale-110 transition-transform" />
                                        <a
                                            href={`mailto:${settings.contactEmail}`}
                                            className="hover:text-pink-400 transition-colors"
                                        >
                                            {settings.contactEmail}
                                        </a>
                                    </li>
                                )}
                                {settings.contactPhone && (
                                    <li className="flex items-start gap-3 text-sm text-gray-400 group">
                                        <Phone className="w-4 h-4 mt-0.5 text-pink-400 group-hover:scale-110 transition-transform" />
                                        <a
                                            href={`tel:${settings.contactPhone}`}
                                            className="hover:text-pink-400 transition-colors"
                                        >
                                            {settings.contactPhone}
                                        </a>
                                    </li>
                                )}
                                {settings.contactAddress && (
                                    <li className="flex items-start gap-3 text-sm text-gray-400 group">
                                        <MapPin className="w-4 h-4 mt-0.5 text-pink-400 group-hover:scale-110 transition-transform" />
                                        <span>{settings.contactAddress}</span>
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}

                    {/* Social Media */}
                    {socialIcons.length > 0 && (
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-white">Follow Us</h4>
                            <div className="flex gap-3">
                                {socialIcons.map((social) => {
                                    const Icon = social.icon;
                                    return (
                                        <a
                                            key={social.name}
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-10 h-10 rounded-full bg-gray-800/50 hover:bg-gradient-to-br hover:from-pink-500 hover:to-purple-600 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-pink-500/50 group border border-gray-700/50 hover:border-pink-500/50"
                                            aria-label={social.name}
                                        >
                                            <Icon className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                                        </a>
                                    );
                                })}
                            </div>
                            <p className="text-xs text-gray-500 mt-4">
                                Stay connected with us on social media for updates and inspiration!
                            </p>
                        </div>
                    )}
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-700/50">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex flex-col items-center md:items-start gap-1">
                            <p className="text-sm text-gray-400 flex items-center gap-1">
                                © {new Date().getFullYear()} {settings?.siteName || "Giftora"}. Made with
                                <Heart className="w-4 h-4 text-pink-500 fill-pink-500 animate-pulse" />
                                for creating special moments.
                            </p>
                            <p className="text-xs text-gray-500">
                                Created by{" "}
                                <span className="text-pink-400 font-medium">Ranjit Bichukale</span>
                                {" "}- Founder & Developer
                            </p>
                        </div>
                        <div className="flex gap-6 text-sm">
                            <Link
                                href="/privacy"
                                className="text-gray-400 hover:text-pink-400 transition-colors"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                href="/terms"
                                className="text-gray-400 hover:text-pink-400 transition-colors"
                            >
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative Top Border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"></div>
        </footer>
    );
}
