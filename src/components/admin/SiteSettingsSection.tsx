"use client";

import { useState, useEffect } from "react";
import { Loader2, Save, Globe, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
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
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Site Settings</h2>
                    <p className="text-gray-500">Manage your site information and branding</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={updateMutation.isPending}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 font-medium"
                >
                    {updateMutation.isPending ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            Save Changes
                        </>
                    )}
                </button>
            </div>

            {/* Site Branding */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
                <div className="flex items-center gap-2 border-b border-gray-200 pb-4">
                    <Globe className="w-5 h-5 text-gray-700" />
                    <h3 className="text-lg font-bold text-gray-900">Site Branding</h3>
                </div>

                <div className="grid gap-6">
                    {/* Site Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                        <input
                            type="text"
                            value={formData.siteName}
                            onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                            placeholder="Giftora"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        />
                    </div>

                    {/* Site Logo */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Site Logo</label>
                        <ImageUpload
                            value={formData.siteLogo}
                            onChange={(url: string) => setFormData({ ...formData, siteLogo: url })}
                            disabled={updateMutation.isPending}
                        />
                        <p className="text-xs text-gray-500 mt-1">Recommended size: 200x60px (PNG with transparent background)</p>
                    </div>
                </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
                <div className="flex items-center gap-2 border-b border-gray-200 pb-4">
                    <Mail className="w-5 h-5 text-gray-700" />
                    <h3 className="text-lg font-bold text-gray-900">Contact Information</h3>
                </div>

                <div className="grid gap-6">
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="email"
                                value={formData.contactEmail}
                                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                                placeholder="contact@giftora.com"
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="tel"
                                value={formData.contactPhone}
                                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                                placeholder="+1 234 567 8900"
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Contact Address</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <textarea
                                value={formData.contactAddress}
                                onChange={(e) => setFormData({ ...formData, contactAddress: e.target.value })}
                                placeholder="123 Creator Lane, Web City, 12345"
                                rows={3}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* About Us Content */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
                <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-bold text-gray-900">About Us Content</h3>
                    <p className="text-sm text-gray-500">This will be displayed on the public About Us page</p>
                </div>

                <div>
                    <textarea
                        value={formData.aboutUsContent}
                        onChange={(e) => setFormData({ ...formData, aboutUsContent: e.target.value })}
                        placeholder="Tell visitors about your company..."
                        rows={8}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">Write a compelling description of your company, mission, and values</p>
                </div>
            </div>

            {/* Social Media Links */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
                <div className="flex items-center gap-2 border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-bold text-gray-900">Social Media Links</h3>
                </div>

                <div className="grid gap-4">
                    {/* Facebook */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                        <div className="relative">
                            <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="url"
                                value={formData.socialLinks.facebook}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        socialLinks: { ...formData.socialLinks, facebook: e.target.value },
                                    })
                                }
                                placeholder="https://facebook.com/yourpage"
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Twitter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                        <div className="relative">
                            <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="url"
                                value={formData.socialLinks.twitter}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        socialLinks: { ...formData.socialLinks, twitter: e.target.value },
                                    })
                                }
                                placeholder="https://twitter.com/yourhandle"
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Instagram */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                        <div className="relative">
                            <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="url"
                                value={formData.socialLinks.instagram}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        socialLinks: { ...formData.socialLinks, instagram: e.target.value },
                                    })
                                }
                                placeholder="https://instagram.com/yourprofile"
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* LinkedIn */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                        <div className="relative">
                            <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="url"
                                value={formData.socialLinks.linkedin}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        socialLinks: { ...formData.socialLinks, linkedin: e.target.value },
                                    })
                                }
                                placeholder="https://linkedin.com/company/yourcompany"
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Button (Bottom) */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
                <button
                    onClick={handleSave}
                    disabled={updateMutation.isPending}
                    className="flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 font-medium text-lg"
                >
                    {updateMutation.isPending ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-5 h-5" />
                            Save All Changes
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
