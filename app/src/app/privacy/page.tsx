"use client";

import React from "react";
import { useGetSiteSettings } from "@/features/site-settings/api/use-get-site-settings";
import { Loader2, Shield, Lock, Eye, UserCheck, Database, Cookie, Globe } from "lucide-react";
import { HorizontalNav } from "@/app/(dashboard)/horizontal-nav";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/theme-context";
import { Footer } from "@/components/Footer";

export default function PrivacyPolicyPage() {
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

    const siteName = settings?.siteName || "Giftora";
    const contactEmail = settings?.contactEmail || "support@giftora.com";

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
                                <Shield className="w-4 h-4" />
                                <span className="text-sm font-medium">Legal</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                                Privacy{" "}
                                <span className="bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
                                    Policy
                                </span>
                            </h1>
                            <p className="text-xl text-pink-100 max-w-2xl mx-auto">
                                Your privacy is important to us. Learn how we collect, use, and protect your information.
                            </p>
                            <p className="text-sm text-pink-200 mt-4">
                                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="max-w-4xl mx-auto px-6 py-16">
                        {/* Introduction */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12 mb-8">
                            <div className="flex items-center gap-3 mb-6">
                                <Shield className="w-8 h-8 text-pink-500" />
                                <h2 className="text-3xl font-bold text-gray-900">Introduction</h2>
                            </div>
                            <p className="text-gray-700 leading-relaxed text-lg mb-4">
                                Welcome to {siteName}. We respect your privacy and are committed to protecting your personal data.
                                This privacy policy will inform you about how we look after your personal data when you visit our
                                website and tell you about your privacy rights and how the law protects you.
                            </p>
                        </div>

                        {/* Information We Collect */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12 mb-8">
                            <div className="flex items-center gap-3 mb-6">
                                <Database className="w-8 h-8 text-purple-500" />
                                <h2 className="text-3xl font-bold text-gray-900">Information We Collect</h2>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <UserCheck className="w-5 h-5 text-pink-500" />
                                        Personal Information
                                    </h3>
                                    <p className="text-gray-700 leading-relaxed mb-2">
                                        We may collect personal information that you provide to us, including:
                                    </p>
                                    <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                        <li>Name and contact information (email address, phone number)</li>
                                        <li>Account credentials (username and password)</li>
                                        <li>Payment information (processed securely through third-party payment providers)</li>
                                        <li>Profile information and preferences</li>
                                        <li>Communication history with our support team</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <Eye className="w-5 h-5 text-purple-500" />
                                        Automatically Collected Information
                                    </h3>
                                    <p className="text-gray-700 leading-relaxed mb-2">
                                        When you use our services, we automatically collect certain information:
                                    </p>
                                    <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                        <li>Device information (IP address, browser type, operating system)</li>
                                        <li>Usage data (pages visited, features used, time spent)</li>
                                        <li>Cookies and similar tracking technologies</li>
                                        <li>Log data and analytics information</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* How We Use Your Information */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12 mb-8">
                            <div className="flex items-center gap-3 mb-6">
                                <Globe className="w-8 h-8 text-indigo-500" />
                                <h2 className="text-3xl font-bold text-gray-900">How We Use Your Information</h2>
                            </div>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                We use your personal information for the following purposes:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                <li>To provide and maintain our services</li>
                                <li>To process your transactions and manage your orders</li>
                                <li>To send you updates, newsletters, and marketing communications (with your consent)</li>
                                <li>To respond to your inquiries and provide customer support</li>
                                <li>To improve our website and services</li>
                                <li>To detect, prevent, and address technical issues or fraudulent activity</li>
                                <li>To comply with legal obligations</li>
                            </ul>
                        </div>

                        {/* Data Security */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12 mb-8">
                            <div className="flex items-center gap-3 mb-6">
                                <Lock className="w-8 h-8 text-green-500" />
                                <h2 className="text-3xl font-bold text-gray-900">Data Security</h2>
                            </div>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                We implement appropriate technical and organizational security measures to protect your personal
                                data against unauthorized access, alteration, disclosure, or destruction. These measures include:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                <li>Encryption of data in transit and at rest</li>
                                <li>Regular security assessments and updates</li>
                                <li>Access controls and authentication mechanisms</li>
                                <li>Employee training on data protection</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed mt-4">
                                However, no method of transmission over the Internet or electronic storage is 100% secure.
                                While we strive to protect your personal data, we cannot guarantee its absolute security.
                            </p>
                        </div>

                        {/* Cookies */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12 mb-8">
                            <div className="flex items-center gap-3 mb-6">
                                <Cookie className="w-8 h-8 text-orange-500" />
                                <h2 className="text-3xl font-bold text-gray-900">Cookies and Tracking Technologies</h2>
                            </div>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                We use cookies and similar tracking technologies to track activity on our service and store
                                certain information. Cookies are files with a small amount of data that are sent to your browser
                                from a website and stored on your device.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                                However, if you do not accept cookies, you may not be able to use some portions of our service.
                            </p>
                        </div>

                        {/* Your Rights */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12 mb-8">
                            <div className="flex items-center gap-3 mb-6">
                                <UserCheck className="w-8 h-8 text-blue-500" />
                                <h2 className="text-3xl font-bold text-gray-900">Your Privacy Rights</h2>
                            </div>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Depending on your location, you may have the following rights regarding your personal data:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                <li><strong>Access:</strong> Request access to your personal data</li>
                                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
                                <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                                <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                                <li><strong>Objection:</strong> Object to processing of your personal data</li>
                                <li><strong>Restriction:</strong> Request restriction of processing</li>
                                <li><strong>Withdrawal:</strong> Withdraw consent at any time</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed mt-4">
                                To exercise these rights, please contact us at{" "}
                                <a href={`mailto:${contactEmail}`} className="text-pink-600 hover:text-pink-700 font-medium">
                                    {contactEmail}
                                </a>
                            </p>
                        </div>

                        {/* Third-Party Services */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12 mb-8">
                            <div className="flex items-center gap-3 mb-6">
                                <Globe className="w-8 h-8 text-teal-500" />
                                <h2 className="text-3xl font-bold text-gray-900">Third-Party Services</h2>
                            </div>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Our service may contain links to third-party websites or services that are not operated by us.
                                We have no control over and assume no responsibility for the content, privacy policies, or
                                practices of any third-party sites or services.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                We strongly advise you to review the privacy policy of every site you visit.
                            </p>
                        </div>

                        {/* Children's Privacy */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12 mb-8">
                            <div className="flex items-center gap-3 mb-6">
                                <Shield className="w-8 h-8 text-red-500" />
                                <h2 className="text-3xl font-bold text-gray-900">Children's Privacy</h2>
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                                Our service is not directed to individuals under the age of 13. We do not knowingly collect
                                personal information from children under 13. If you are a parent or guardian and you are aware
                                that your child has provided us with personal data, please contact us so we can take necessary action.
                            </p>
                        </div>

                        {/* Changes to Privacy Policy */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12 mb-8">
                            <div className="flex items-center gap-3 mb-6">
                                <Shield className="w-8 h-8 text-purple-500" />
                                <h2 className="text-3xl font-bold text-gray-900">Changes to This Privacy Policy</h2>
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                                We may update our Privacy Policy from time to time. We will notify you of any changes by posting
                                the new Privacy Policy on this page and updating the "Last updated" date at the top of this page.
                                You are advised to review this Privacy Policy periodically for any changes.
                            </p>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl shadow-xl p-8 md:p-12 text-white">
                            <div className="flex items-center gap-3 mb-6">
                                <Lock className="w-8 h-8" />
                                <h2 className="text-3xl font-bold">Contact Us</h2>
                            </div>
                            <p className="text-pink-100 leading-relaxed mb-4">
                                If you have any questions about this Privacy Policy or our privacy practices, please contact us:
                            </p>
                            <div className="space-y-2">
                                <p className="text-white font-medium">
                                    Email:{" "}
                                    <a href={`mailto:${contactEmail}`} className="hover:text-pink-200 transition-colors">
                                        {contactEmail}
                                    </a>
                                </p>
                                {settings?.contactPhone && (
                                    <p className="text-white font-medium">
                                        Phone:{" "}
                                        <a href={`tel:${settings.contactPhone}`} className="hover:text-pink-200 transition-colors">
                                            {settings.contactPhone}
                                        </a>
                                    </p>
                                )}
                                {settings?.contactAddress && (
                                    <p className="text-white font-medium">
                                        Address: {settings.contactAddress}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-1/2 left-0 w-64 h-64 bg-pink-200/20 rounded-full blur-3xl -z-10"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl -z-10"></div>
                </div>
                <Footer />
            </LanguageProvider>
        </ThemeProvider>
    );
}
