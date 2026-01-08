"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Play, ShoppingCart, Eye, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { client } from "@/lib/hono";
import { useCreateWebProject } from "@/features/web-projects/api/use-create-web-project";
import { usePaymentFlow } from "@/features/payments/hooks/use-payment-flow";
import { useUserCountry } from "@/hooks/use-user-country";
import { getPriceForCountry, formatPrice } from "@/lib/pricing";
import { ReviewForm } from "@/components/reviews/review-form";
import { ReviewsList } from "@/components/reviews/reviews-list";


export default function WebTemplateDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    const [selectedMedia, setSelectedMedia] = useState(0);
    const [reviewsRefreshTrigger, setReviewsRefreshTrigger] = useState(0);
    const [editingReview, setEditingReview] = useState<any>(null);
    const createProject = useCreateWebProject();
    const { processPayment, isPreparing, isVerifying } = usePaymentFlow();
    const { countryData } = useUserCountry();

    const handleEditReview = (review: any) => {
        setEditingReview(review);
        // Scroll to review form
        const formElement = document.getElementById("review-form");
        if (formElement) {
            formElement.scrollIntoView({ behavior: "smooth" });
        }
    };

    const templateId = params.id as string;

    // Fetch template data from API
    const { data: template, isLoading, error } = useQuery({
        queryKey: ["web-template", templateId],
        queryFn: async () => {
            const response = await client.api["web-templates"][":id"].$get({
                param: { id: templateId },
            });
            if (!response.ok) throw new Error("Template not found");
            const res = await response.json();
            return res.data;
        },
    });

    // Calculate price based on user's country
    const userCountryCode = countryData?.countryCode || 'OTHER';
    const localizedPrice = template ? getPriceForCountry(
        template.pricingByCountry || null,
        userCountryCode,
        template.price || 0
    ) : 0;

    const handleBuyNow = () => {
        if (!template) return;

        if (template.isFree) {
            router.push(`/web/templates/${template.id}?mode=edit`);
            return;
        }

        if (!session?.user) {
            router.push(`/api/auth/signin?callbackUrl=${encodeURIComponent(`/web-template-details/${template.id}`)}`);
            return;
        }

        // For paid templates, create project first then pay
        createProject.mutate({
            name: `My ${template.name}`,
            templateId: template.id,
            json: JSON.stringify({}),
        }, {
            onSuccess: (data: any) => {
                const projectId = data.data.id;
                processPayment({
                    amount: localizedPrice,
                    projectId: projectId,
                    onSuccess: () => {
                        router.push(`/web/templates/${template.id}?id=${projectId}&mode=edit`);
                    }
                });
            }
        });
    };

    const handlePreview = () => {
        if (!template) return;
        router.push(`/web/templates/${template.id}?mode=preview`);
    };

    const isProcessing = createProject.isPending || isPreparing || isVerifying;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-purple-50/30">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    if (error || !template) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-purple-50/30 p-6">
                <div className="bg-white border border-red-100 p-10 rounded-3xl shadow-xl text-center max-w-md">
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-black text-gray-900 mb-4">Template Not Found</h1>
                    <p className="text-gray-500 font-medium mb-8">The template you are looking for might have been removed or doesn't exist.</p>
                    <Button onClick={() => router.back()} className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black">
                        Go Back
                    </Button>
                </div>
            </div>
        );
    }

    // Create array of media items (thumbnail + video if available)
    const mediaItems = [template.thumbnail];
    if (template.videoUrl && typeof template.videoUrl === 'string') {
        mediaItems.push(template.videoUrl);
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30">
            {/* Top Navbar */}
            <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="gap-2"
                    >
                        <ArrowLeft className="size-4" />
                        Back
                    </Button>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Template Details
                    </h1>
                    <div className="w-20" /> {/* Spacer for centering */}
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Sidebar - Template Thumbnails */}
                    <div className="lg:col-span-2">
                        <div className="sticky top-24">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">
                                Template Media
                            </h3>
                            <div className="space-y-3">
                                {mediaItems.map((media, index) => (
                                    <motion.button
                                        key={index}
                                        onClick={() => setSelectedMedia(index)}
                                        className={`w-full aspect-video rounded-lg overflow-hidden border-2 transition-all ${selectedMedia === index
                                            ? "border-purple-500 shadow-lg scale-105"
                                            : "border-gray-200 hover:border-purple-300"
                                            }`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {index === 0 ? (
                                            <img
                                                src={media || undefined}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                                                <Play className="size-8 text-white" />
                                            </div>
                                        )}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content - Preview */}
                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            {/* Preview Area */}
                            <div className="aspect-video bg-gray-100 relative">
                                {selectedMedia === 0 || !template.videoUrl ? (
                                    <img
                                        src={template.thumbnail || undefined}
                                        alt={`${template.name} preview`}
                                        className="w-full h-full object-cover"
                                    />
                                ) : template.videoUrl ? (
                                    <iframe
                                        src={template.videoUrl}
                                        className="w-full h-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                ) : (
                                    <img
                                        src={template.thumbnail || undefined}
                                        alt={`${template.name} preview`}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>

                            {/* Template Name */}
                            <div className="p-6 border-b border-gray-100">
                                <h2 className="text-3xl font-black text-gray-900 mb-2">
                                    {template.name}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    {template.category?.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Template
                                </p>
                            </div>

                            {/* Description */}
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-3">
                                    Description
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {template.description || "A beautiful template perfect for your special occasion."}
                                </p>
                            </div>
                        </div>

                        {/* Customer Reviews Section */}
                        <div className="mt-6">
                            <ReviewsList
                                templateId={templateId}
                                refreshTrigger={reviewsRefreshTrigger}
                                currentUserId={(session?.user as any)?.id}
                                onEdit={handleEditReview}
                                onDelete={() => setReviewsRefreshTrigger(prev => prev + 1)}
                            />
                        </div>

                        {/* Review Form */}
                        {session?.user && (
                            <div className="mt-6" id="review-form">
                                <ReviewForm
                                    key={editingReview ? editingReview.id : "new-review"}
                                    templateId={templateId}
                                    existingReview={editingReview}
                                    onSuccess={() => {
                                        setReviewsRefreshTrigger(prev => prev + 1);
                                        setEditingReview(null);
                                    }}
                                    onCancel={() => setEditingReview(null)}
                                />
                            </div>
                        )}
                    </div>

                    {/* Right Sidebar - Actions */}
                    <div className="lg:col-span-3">
                        <div className="sticky top-24">
                            <div className="bg-white rounded-2xl shadow-xl p-6">
                                <div className="mb-6">
                                    <p className="text-sm text-gray-600 mb-2">Price</p>
                                    {template.isFree ? (
                                        <span className="text-4xl font-black text-emerald-600">FREE</span>
                                    ) : (
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-4xl font-black text-gray-900">
                                                {formatPrice(localizedPrice, userCountryCode)}
                                            </span>
                                            <span className="text-gray-500 line-through">
                                                {formatPrice(Math.round(localizedPrice * 1.5), userCountryCode)}
                                            </span>
                                        </div>
                                    )}
                                    {!template.isFree && (
                                        <p className="text-sm text-green-600 font-semibold mt-1">
                                            Save 33%
                                        </p>
                                    )}
                                </div>

                                {/* Preview Button */}
                                <Button
                                    onClick={handlePreview}
                                    className="w-full bg-white border-2 border-gray-800 text-gray-800 hover:bg-gray-50 h-12 text-lg font-bold gap-2 mb-3"
                                    size="lg"
                                >
                                    <Eye className="size-5" />
                                    Preview
                                </Button>

                                {/* Buy Now Button */}
                                <Button
                                    onClick={handleBuyNow}
                                    disabled={isProcessing}
                                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-12 text-lg font-bold gap-2"
                                    size="lg"
                                >
                                    {isProcessing ? (
                                        <Loader2 className="size-5 animate-spin" />
                                    ) : (
                                        <>
                                            <ShoppingCart className="size-5" />
                                            {template.isFree ? "Use Free" : "Buy Now"}
                                        </>
                                    )}
                                </Button>

                                <div className="mt-6 space-y-3 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                                            <svg
                                                className="w-3 h-3 text-green-600"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        </div>
                                        <span>Instant access after purchase</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                                            <svg
                                                className="w-3 h-3 text-green-600"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        </div>
                                        <span>Fully customizable</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                                            <svg
                                                className="w-3 h-3 text-green-600"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        </div>
                                        <span>Mobile responsive</span>
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-gray-100">
                                    <p className="text-xs text-gray-500 text-center">
                                        Secure payment powered by Razorpay
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
