"use client";

import React from "react";
import { useGetSiteSettings } from "@/features/site-settings/api/use-get-site-settings";
import { Loader2, FileText, Scale, AlertCircle, ShieldCheck, Ban, Coins, UserX } from "lucide-react";
import { HorizontalNav } from "@/app/(dashboard)/horizontal-nav";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/theme-context";
import { Footer } from "@/components/Footer";

export default function TermsOfServicePage() {
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
                    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-700 text-white py-20">
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="absolute inset-0">
                            <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-400/30 rounded-full blur-3xl animate-pulse"></div>
                            <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-400/30 rounded-full blur-3xl animate-pulse delay-700"></div>
                        </div>
                        <div className="relative max-w-4xl mx-auto px-6 text-center">
                            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                                <FileText className="w-4 h-4" />
                                <span className="text-sm font-medium">Legal</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                                Terms of{" "}
                                <span className="bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
                                    Service
                                </span>
                            </h1>
                            <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
                                Please read these terms carefully before using our services.
                            </p>
                            <p className="text-sm text-indigo-200 mt-4">
                                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="max-w-4xl mx-auto px-6 py-16">
                        {/* Agreement to Terms */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12 mb-8">
                            <div className="flex items-center gap-3 mb-6">
                                <FileText className="w-8 h-8 text-indigo-500" />
                                <h2 className="text-3xl font-bold text-gray-900">Agreement to Terms</h2>
                            </div>
                            <p className="text-gray-700 leading-relaxed text-lg mb-4">
                                By accessing or using {siteName}, you agree to be bound by these Terms of Service and all
                                applicable laws and regulations. If you do not agree with any of these terms, you are prohibited
                                from using or accessing this site.
                            </p>
                            <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-lg">
                                <p className="text-indigo-900 font-medium flex items-start gap-2">
                                    <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                    By continuing to use our services, you acknowledge that you have read, understood,
                                    and agree to be bound by these terms.
                                </p>
                            </div>
                        </div>

                        {/* Use License */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12 mb-8">
                            <div className="flex items-center gap-3 mb-6">
                                <ShieldCheck className="w-8 h-8 text-green-500" />
                                <h2 className="text-3xl font-bold text-gray-900">Use License</h2>
                            </div>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Permission is granted to temporarily download one copy of the materials (templates, designs, etc.)
                                on {siteName} for personal, non-commercial transitory viewing only.
                            </p>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">This license grants you the right to:</h3>
                                    <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                        <li>Use purchased templates for personal or commercial projects</li>
                                        <li>Modify templates to fit your specific needs</li>
                                        <li>Create unlimited final products using the templates</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">This license does NOT permit you to:</h3>
                                    <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                        <li>Resell, redistribute, or sublicense the templates</li>
                                        <li>Claim the templates as your own original work</li>
                                        <li>Share your account credentials with others</li>
                                        <li>Use the templates in template marketplaces or competing services</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* User Accounts */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12 mb-8">
                            <div className="flex items-center gap-3 mb-6">
                                <UserX className="w-8 h-8 text-purple-500" />
                                <h2 className="text-3xl font-bold text-gray-900">User Accounts</h2>
                            </div>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                When you create an account with us, you must provide accurate, complete, and current information.
                                Failure to do so constitutes a breach of the Terms.
                            </p>
                            <div className="space-y-3">
                                <p className="text-gray-700 leading-relaxed">
                                    <strong>Account Security:</strong> You are responsible for safeguarding your account password
                                    and for any activities or actions under your account.
                                </p>
                                <p className="text-gray-700 leading-relaxed">
                                    <strong>Account Termination:</strong> We reserve the right to terminate or suspend your account
                                    immediately, without prior notice, for any breach of these Terms.
                                </p>
                            </div>
                        </div>

                        {/* Purchases and Payments */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12 mb-8">
                            <div className="flex items-center gap-3 mb-6">
                                <Coins className="w-8 h-8 text-yellow-500" />
                                <h2 className="text-3xl font-bold text-gray-900">Purchases and Payments</h2>
                            </div>
                            <div className="space-y-4">
                                <p className="text-gray-700 leading-relaxed">
                                    If you wish to purchase any product or service made available through our service, you may be
                                    asked to supply certain information relevant to your purchase.
                                </p>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Payment Terms:</h3>
                                    <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                        <li>All prices are listed in the currency specified on the website</li>
                                        <li>Payment must be received prior to delivery of templates or services</li>
                                        <li>We accept various payment methods as indicated during checkout</li>
                                        <li>All sales are final unless otherwise stated in our refund policy</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Refund Policy:</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        Due to the digital nature of our products, refunds are generally not available once a
                                        template has been downloaded. However, we will consider refund requests on a case-by-case
                                        basis for technical issues or if the product is significantly different from its description.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Prohibited Uses */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12 mb-8">
                            <div className="flex items-center gap-3 mb-6">
                                <Ban className="w-8 h-8 text-red-500" />
                                <h2 className="text-3xl font-bold text-gray-900">Prohibited Uses</h2>
                            </div>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                You may not use our service for any illegal or unauthorized purpose. You agree not to:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                <li>Violate any laws in your jurisdiction</li>
                                <li>Infringe upon or violate our intellectual property rights</li>
                                <li>Upload viruses, malware, or other malicious code</li>
                                <li>Attempt to gain unauthorized access to our systems</li>
                                <li>Engage in any automated use of the system (scraping, bots, etc.)</li>
                                <li>Harass, abuse, or harm another person</li>
                                <li>Use our service to transmit spam or unsolicited messages</li>
                                <li>Interfere with or disrupt the service or servers</li>
                            </ul>
                        </div>

                        {/* Intellectual Property */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12 mb-8">
                            <div className="flex items-center gap-3 mb-6">
                                <ShieldCheck className="w-8 h-8 text-blue-500" />
                                <h2 className="text-3xl font-bold text-gray-900">Intellectual Property</h2>
                            </div>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                The service and its original content, features, and functionality are and will remain the exclusive
                                property of {siteName} and its licensors. Our trademarks and trade dress may not be used in
                                connection with any product or service without our prior written consent.
                            </p>
                            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                                <p className="text-blue-900 font-medium">
                                    All templates, designs, code, and other materials available on our platform are protected by
                                    copyright and other intellectual property laws.
                                </p>
                            </div>
                        </div>

                        {/* Disclaimer */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12 mb-8">
                            <div className="flex items-center gap-3 mb-6">
                                <AlertCircle className="w-8 h-8 text-orange-500" />
                                <h2 className="text-3xl font-bold text-gray-900">Disclaimer</h2>
                            </div>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Your use of the service is at your sole risk. The service is provided on an "AS IS" and
                                "AS AVAILABLE" basis without any warranties of any kind.
                            </p>
                            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
                                <p className="text-orange-900 font-medium">
                                    We do not warrant that the service will be uninterrupted, timely, secure, or error-free.
                                    We make no warranty regarding the quality, accuracy, timeliness, or completeness of the service.
                                </p>
                            </div>
                        </div>

                        {/* Limitation of Liability */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12 mb-8">
                            <div className="flex items-center gap-3 mb-6">
                                <Scale className="w-8 h-8 text-teal-500" />
                                <h2 className="text-3xl font-bold text-gray-900">Limitation of Liability</h2>
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                                In no event shall {siteName}, its directors, employees, partners, agents, suppliers, or affiliates
                                be liable for any indirect, incidental, special, consequential, or punitive damages, including
                                without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-4">
                                <li>Your access to or use of (or inability to access or use) the service</li>
                                <li>Any conduct or content of any third party on the service</li>
                                <li>Any content obtained from the service</li>
                                <li>Unauthorized access, use, or alteration of your transmissions or content</li>
                            </ul>
                        </div>

                        {/* Governing Law */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12 mb-8">
                            <div className="flex items-center gap-3 mb-6">
                                <Scale className="w-8 h-8 text-indigo-500" />
                                <h2 className="text-3xl font-bold text-gray-900">Governing Law</h2>
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                                These Terms shall be governed and construed in accordance with the laws of your jurisdiction,
                                without regard to its conflict of law provisions. Our failure to enforce any right or provision
                                of these Terms will not be considered a waiver of those rights.
                            </p>
                        </div>

                        {/* Changes to Terms */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12 mb-8">
                            <div className="flex items-center gap-3 mb-6">
                                <FileText className="w-8 h-8 text-purple-500" />
                                <h2 className="text-3xl font-bold text-gray-900">Changes to Terms</h2>
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                                We reserve the right to modify or replace these Terms at any time at our sole discretion.
                                If a revision is material, we will provide at least 30 days' notice prior to any new terms
                                taking effect. What constitutes a material change will be determined at our sole discretion.
                            </p>
                            <p className="text-gray-700 leading-relaxed mt-4">
                                By continuing to access or use our service after those revisions become effective, you agree
                                to be bound by the revised terms.
                            </p>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-8 md:p-12 text-white">
                            <div className="flex items-center gap-3 mb-6">
                                <FileText className="w-8 h-8" />
                                <h2 className="text-3xl font-bold">Contact Us</h2>
                            </div>
                            <p className="text-indigo-100 leading-relaxed mb-4">
                                If you have any questions about these Terms of Service, please contact us:
                            </p>
                            <div className="space-y-2">
                                <p className="text-white font-medium">
                                    Email:{" "}
                                    <a href={`mailto:${contactEmail}`} className="hover:text-indigo-200 transition-colors">
                                        {contactEmail}
                                    </a>
                                </p>
                                {settings?.contactPhone && (
                                    <p className="text-white font-medium">
                                        Phone:{" "}
                                        <a href={`tel:${settings.contactPhone}`} className="hover:text-indigo-200 transition-colors">
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
                    <div className="absolute top-1/2 left-0 w-64 h-64 bg-indigo-200/20 rounded-full blur-3xl -z-10"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl -z-10"></div>
                </div>
                <Footer />
            </LanguageProvider>
        </ThemeProvider>
    );
}
