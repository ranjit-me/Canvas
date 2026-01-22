"use client";

import React, { useState } from "react";
import { useGetSiteSettings } from "@/features/site-settings/api/use-get-site-settings";
import { Loader2, Mail, Phone, MapPin, Send, MessageCircle, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { HorizontalNav } from "@/app/(dashboard)/horizontal-nav";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/theme-context";

export default function ContactPage() {
    const { data: settings, isLoading } = useGetSiteSettings();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setSubmitStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });

        setTimeout(() => setSubmitStatus("idle"), 3000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

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

    const socialLinks = settings?.socialLinks || {};
    const socialIcons = [
        { name: "Facebook", icon: Facebook, url: socialLinks.facebook, color: "hover:bg-blue-600" },
        { name: "Twitter", icon: Twitter, url: socialLinks.twitter, color: "hover:bg-sky-500" },
        { name: "Instagram", icon: Instagram, url: socialLinks.instagram, color: "hover:bg-pink-600" },
        { name: "LinkedIn", icon: Linkedin, url: socialLinks.linkedin, color: "hover:bg-blue-700" },
    ].filter((social) => social.url);

    return (
        <ThemeProvider>
            <LanguageProvider>
                <HorizontalNav />
                <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-16 px-6">
                    <div className="max-w-6xl mx-auto">
                        {/* Header */}
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white rounded-full shadow-md border border-pink-200">
                                <MessageCircle className="w-4 h-4 text-pink-500" />
                                <span className="text-sm font-medium text-gray-700">Get In Touch</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                Contact Us
                            </h1>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Have a question or want to work together? We'd love to hear from you!
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Contact Information Cards */}
                            <div className="space-y-6">
                                {/* Email Card */}
                                {settings?.contactEmail && (
                                    <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
                                        <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <Mail className="w-7 h-7 text-white" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">Email Us</h3>
                                        <a
                                            href={`mailto:${settings.contactEmail}`}
                                            className="text-gray-600 hover:text-pink-600 transition-colors text-sm break-all"
                                        >
                                            {settings.contactEmail}
                                        </a>
                                    </div>
                                )}

                                {/* Phone Card */}
                                {settings?.contactPhone && (
                                    <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
                                        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <Phone className="w-7 h-7 text-white" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">Call Us</h3>
                                        <a
                                            href={`tel:${settings.contactPhone}`}
                                            className="text-gray-600 hover:text-purple-600 transition-colors text-sm"
                                        >
                                            {settings.contactPhone}
                                        </a>
                                    </div>
                                )}

                                {/* Address Card */}
                                {settings?.contactAddress && (
                                    <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
                                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <MapPin className="w-7 h-7 text-white" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">Visit Us</h3>
                                        <p className="text-gray-600 text-sm">{settings.contactAddress}</p>
                                    </div>
                                )}

                                {/* Social Media */}
                                {socialIcons.length > 0 && (
                                    <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4">Follow Us</h3>
                                        <div className="flex gap-3">
                                            {socialIcons.map((social) => {
                                                const Icon = social.icon;
                                                return (
                                                    <a
                                                        key={social.name}
                                                        href={social.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={`w-12 h-12 rounded-xl bg-gray-100 ${social.color} flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg group`}
                                                        aria-label={social.name}
                                                    >
                                                        <Icon className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors" />
                                                    </a>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Contact Form */}
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-2xl p-8 md:p-10 shadow-xl border border-gray-100">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>

                                    {submitStatus === "success" && (
                                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                                            <p className="text-green-700 font-medium">
                                                ✓ Message sent successfully! We'll get back to you soon.
                                            </p>
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Your Name*
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Your Email*
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                                                    placeholder="john@example.com"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Subject*
                                            </label>
                                            <input
                                                type="text"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                                                placeholder="How can we help?"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Message*
                                            </label>
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                                rows={6}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-none"
                                                placeholder="Tell us more about your inquiry..."
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full py-4 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-5 h-5" />
                                                    Send Message
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </LanguageProvider>
        </ThemeProvider>
    );
}
