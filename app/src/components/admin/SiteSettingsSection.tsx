"use client";

import { useState, useEffect } from "react";
import { Loader2, Save, Globe, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Sparkles, Shield, Palette, Lock } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import { useGetSiteSettings } from "@/features/site-settings/api/use-get-site-settings";
import { useUpdateSiteSettings } from "@/features/site-settings/api/use-update-site-settings";

export function SiteSettingsSection() {
    const { data: settings, isLoading } = useGetSiteSettings();
    const updateMutation = useUpdateSiteSettings();

    const [formData, setFormData] = useState({
        siteName: "",
        siteLogo: "",
        contactEmail: "",
        contactPhone: "",
        contactAddress: "",
        aboutUsContent: "",
        socialLinks: {
            facebook: "",
            twitter: "",
            instagram: "",
            linkedin: "",
        },
    });

    useEffect(() => {
        if (settings) {
            setFormData({
                siteName: settings.siteName || "",
                siteLogo: settings.siteLogo || "",
                contactEmail: settings.contactEmail || "",
                contactPhone: settings.contactPhone || "",
                contactAddress: settings.contactAddress || "",
                aboutUsContent: settings.aboutUsContent || "",
                socialLinks: settings.socialLinks || {
                    facebook: "",
                    twitter: "",
                    instagram: "",
                    linkedin: "",
                },
            });
        }
    }, [settings]);

    const handleSave = () => {
        updateMutation.mutate(formData);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-24">
                <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-blue-500 animate-spin" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 75%, 0 100%)' }}></div>
                    <div className="absolute inset-2 bg-gray-50 rounded-full"></div>
                </div>
                <p className="mt-6 text-lg font-semibold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-pulse">
                    Loading Settings...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Animated Background Gradients */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-purple-400/30 via-pink-300/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-blue-400/20 via-purple-300/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-pink-300/10 to-purple-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="max-w-6xl mx-auto px-8 py-12 space-y-8">
                {/* Premium Header */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition duration-500"></div>
                    <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-8 border border-white/40 shadow-2xl">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur-md opacity-50"></div>
                                    <div className="relative bg-gradient-to-tr from-purple-600 via-pink-600 to-blue-600 p-4 rounded-2xl">
                                        <Sparkles className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                                <div>
                                    <h1 className="text-4xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-2">
                                        Site Settings
                                    </h1>
                                    <p className="text-lg text-gray-600 font-medium">Configure your platform's identity and presence</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Site Branding Section */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition duration-500"></div>
                    <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-purple-100/50 shadow-xl hover:shadow-2xl transition-all duration-300">
                        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gradient-to-r from-purple-200 to-pink-200">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-xl blur-md opacity-40"></div>
                                <div className="relative bg-gradient-to-tr from-purple-500 to-pink-500 p-3 rounded-xl">
                                    <Palette className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    Brand Identity
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">Shape your platform's visual presence</p>
                            </div>
                        </div>

                        <div className="grid gap-8">
                            {/* Site Name */}
                            <div className="group/input">
                                <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-purple-600" />
                                    Site Name
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={formData.siteName}
                                        onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                                        placeholder="Giftora"
                                        className="w-full px-5 py-4 bg-white/60 backdrop-blur-sm border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-800 font-medium text-lg hover:border-purple-300 group-hover/input:shadow-lg group-hover/input:shadow-purple-200/50"
                                    />
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/0 to-pink-500/0 group-hover/input:from-purple-500/5 group-hover/input:to-pink-500/5 transition-all duration-300 pointer-events-none"></div>
                                </div>
                            </div>

                            {/* Site Logo */}
                            <div className="group/upload">
                                <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-pink-600" />
                                    Site Logo
                                </label>
                                <div className="relative p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-dashed border-purple-300 hover:border-purple-500 transition-all duration-300 group-hover/upload:shadow-xl group-hover/upload:shadow-purple-200/50">
                                    <ImageUpload
                                        value={formData.siteLogo}
                                        onChange={(url: string) => setFormData({ ...formData, siteLogo: url })}
                                        disabled={updateMutation.isPending}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-3 flex items-center gap-2">
                                    <Sparkles className="w-3 h-3" />
                                    Recommended: 200x60px PNG with transparent background for best quality
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Information Section */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition duration-500"></div>
                    <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-blue-100/50 shadow-xl hover:shadow-2xl transition-all duration-300">
                        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gradient-to-r from-blue-200 to-purple-200">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-xl blur-md opacity-40"></div>
                                <div className="relative bg-gradient-to-tr from-blue-500 to-purple-500 p-3 rounded-xl">
                                    <Mail className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Contact Details
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">How users can reach you</p>
                            </div>
                        </div>

                        <div className="grid gap-6">
                            {/* Email */}
                            <div className="group/input">
                                <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-blue-600" />
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
                                        <Mail className="w-4 h-4 text-white" />
                                    </div>
                                    <input
                                        type="email"
                                        value={formData.contactEmail}
                                        onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                                        placeholder="contact@giftora.com"
                                        className="w-full pl-16 pr-5 py-4 bg-white/60 backdrop-blur-sm border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-800 font-medium hover:border-blue-300 group-hover/input:shadow-lg group-hover/input:shadow-blue-200/50"
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="group/input">
                                <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-purple-600" />
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                                        <Phone className="w-4 h-4 text-white" />
                                    </div>
                                    <input
                                        type="tel"
                                        value={formData.contactPhone}
                                        onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                                        placeholder="+1 234 567 8900"
                                        className="w-full pl-16 pr-5 py-4 bg-white/60 backdrop-blur-sm border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-800 font-medium hover:border-purple-300 group-hover/input:shadow-lg group-hover/input:shadow-purple-200/50"
                                    />
                                </div>
                            </div>

                            {/* Address */}
                            <div className="group/input">
                                <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-pink-600" />
                                    Physical Address
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-4 p-2 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg">
                                        <MapPin className="w-4 h-4 text-white" />
                                    </div>
                                    <textarea
                                        value={formData.contactAddress}
                                        onChange={(e) => setFormData({ ...formData, contactAddress: e.target.value })}
                                        placeholder="123 Creator Lane, Web City, 12345"
                                        rows={3}
                                        className="w-full pl-16 pr-5 py-4 bg-white/60 backdrop-blur-sm border-2 border-pink-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-300 text-gray-800 font-medium resize-none hover:border-pink-300 group-hover/input:shadow-lg group-hover/input:shadow-pink-200/50"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* About Us Section */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition duration-500"></div>
                    <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-pink-100/50 shadow-xl hover:shadow-2xl transition-all duration-300">
                        <div className="mb-8 pb-6 border-b border-gradient-to-r from-pink-200 to-purple-200">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-xl blur-md opacity-40"></div>
                                    <div className="relative bg-gradient-to-tr from-pink-500 to-purple-500 p-3 rounded-xl">
                                        <Globe className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                                        About Your Platform
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">Tell your story to the world</p>
                                </div>
                            </div>
                        </div>

                        <div className="group/input">
                            <label className="block text-sm font-bold text-gray-800 mb-3">Company Description</label>
                            <div className="relative">
                                <textarea
                                    value={formData.aboutUsContent}
                                    onChange={(e) => setFormData({ ...formData, aboutUsContent: e.target.value })}
                                    placeholder="Tell visitors about your company, mission, values, and what makes you unique..."
                                    rows={10}
                                    className="w-full px-6 py-5 bg-white/60 backdrop-blur-sm border-2 border-pink-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-300 text-gray-800 font-medium resize-none hover:border-pink-300 leading-relaxed group-hover/input:shadow-lg group-hover/input:shadow-pink-200/50"
                                />
                                <div className="absolute bottom-4 right-4 text-xs text-gray-400 font-semibold bg-white/80 px-3 py-1 rounded-full">
                                    {formData.aboutUsContent.length} characters
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-3 flex items-center gap-2">
                                <Sparkles className="w-3 h-3" />
                                Craft a compelling narrative that resonates with your audience
                            </p>
                        </div>
                    </div>
                </div>

                {/* Social Media Section */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition duration-500"></div>
                    <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-purple-100/50 shadow-xl hover:shadow-2xl transition-all duration-300">
                        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gradient-to-r from-purple-200 via-pink-200 to-blue-200">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 via-pink-500 to-blue-500 rounded-xl blur-md opacity-40"></div>
                                <div className="relative bg-gradient-to-tr from-purple-500 via-pink-500 to-blue-500 p-3 rounded-xl">
                                    <Sparkles className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                                    Social Presence
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">Connect across platforms</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Facebook */}
                            <div className="group/input">
                                <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <Facebook className="w-4 h-4 text-blue-600" />
                                    Facebook
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-blue-600 rounded-lg">
                                        <Facebook className="w-4 h-4 text-white" />
                                    </div>
                                    <input
                                        type="url"
                                        value={formData.socialLinks.facebook}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                socialLinks: { ...formData.socialLinks, facebook: e.target.value },
                                            })
                                        }
                                        placeholder="facebook.com/yourpage"
                                        className="w-full pl-16 pr-5 py-4 bg-white/60 backdrop-blur-sm border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-800 font-medium hover:border-blue-300 group-hover/input:shadow-lg group-hover/input:shadow-blue-200/50"
                                    />
                                </div>
                            </div>

                            {/* Twitter */}
                            <div className="group/input">
                                <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <Twitter className="w-4 h-4 text-sky-500" />
                                    Twitter
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-sky-500 rounded-lg">
                                        <Twitter className="w-4 h-4 text-white" />
                                    </div>
                                    <input
                                        type="url"
                                        value={formData.socialLinks.twitter}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                socialLinks: { ...formData.socialLinks, twitter: e.target.value },
                                            })
                                        }
                                        placeholder="twitter.com/yourhandle"
                                        className="w-full pl-16 pr-5 py-4 bg-white/60 backdrop-blur-sm border-2 border-sky-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 transition-all duration-300 text-gray-800 font-medium hover:border-sky-300 group-hover/input:shadow-lg group-hover/input:shadow-sky-200/50"
                                    />
                                </div>
                            </div>

                            {/* Instagram */}
                            <div className="group/input">
                                <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <Instagram className="w-4 h-4 text-pink-600" />
                                    Instagram
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-lg">
                                        <Instagram className="w-4 h-4 text-white" />
                                    </div>
                                    <input
                                        type="url"
                                        value={formData.socialLinks.instagram}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                socialLinks: { ...formData.socialLinks, instagram: e.target.value },
                                            })
                                        }
                                        placeholder="instagram.com/yourprofile"
                                        className="w-full pl-16 pr-5 py-4 bg-white/60 backdrop-blur-sm border-2 border-pink-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-300 text-gray-800 font-medium hover:border-pink-300 group-hover/input:shadow-lg group-hover/input:shadow-pink-200/50"
                                    />
                                </div>
                            </div>

                            {/* LinkedIn */}
                            <div className="group/input">
                                <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <Linkedin className="w-4 h-4 text-blue-700" />
                                    LinkedIn
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-blue-700 rounded-lg">
                                        <Linkedin className="w-4 h-4 text-white" />
                                    </div>
                                    <input
                                        type="url"
                                        value={formData.socialLinks.linkedin}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                socialLinks: { ...formData.socialLinks, linkedin: e.target.value },
                                            })
                                        }
                                        placeholder="linkedin.com/company/yours"
                                        className="w-full pl-16 pr-5 py-4 bg-white/60 backdrop-blur-sm border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-700/20 focus:border-blue-700 transition-all duration-300 text-gray-800 font-medium hover:border-blue-300 group-hover/input:shadow-lg group-hover/input:shadow-blue-200/50"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating Save Button */}
                <div className="sticky bottom-8 z-50 flex justify-center">
                    <div className="relative group/save">
                        <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur-xl opacity-60 group-hover/save:opacity-100 transition duration-300 animate-pulse"></div>
                        <button
                            onClick={handleSave}
                            disabled={updateMutation.isPending}
                            className="relative flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white rounded-2xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 font-bold text-lg transform hover:scale-105 active:scale-95 shadow-xl"
                        >
                            {updateMutation.isPending ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    <span>Saving Changes...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-6 h-6" />
                                    <span>Save All Settings</span>
                                    <Sparkles className="w-5 h-5 animate-pulse" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
