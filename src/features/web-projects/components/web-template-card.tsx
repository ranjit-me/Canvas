"use client";

import { Eye, Loader2, Crown, Star, Play, Pause } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCreateWebProject } from "@/features/web-projects/api/use-create-web-project";
import { usePaymentFlow } from "@/features/payments/hooks/use-payment-flow";
import { PreviewModal } from "./preview-modal";
import { useState, useRef, useEffect } from "react";
import { useUserCountry } from "@/hooks/use-user-country";
import { getPriceForCountry, formatPrice } from "@/lib/pricing";
import { getYouTubeVideoId, getYouTubeEmbedUrl } from "@/lib/youtube";
import { T } from "@/components/translated-text";
import { useTranslate } from "@/hooks/use-translate";

interface TemplateCardProps {
    template: {
        id: string;
        name: string;
        title?: string;
        description: string;
        thumbnail: string;
        price: number;
        pricingByCountry?: string | null;
        videoUrl?: string | null;
        isFree: boolean;
        isPro?: boolean;
        href?: string;
        rating?: number;
        reviewsCount?: number;
        category?: string;
        orderCount?: number;
    };
    index: number;
}

export function WebTemplateCard({ template, index }: TemplateCardProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const createProject = useCreateWebProject();
    const { processPayment, isPreparing, isVerifying } = usePaymentFlow();
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const { countryData } = useUserCountry();

    // Video preview state
    const [showVideo, setShowVideo] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const videoRef = useRef<HTMLIFrameElement>(null);
    const hoverTimeoutRef = useRef<NodeJS.Timeout>();

    // Calculate price based on user's country
    const userCountryCode = countryData?.countryCode || 'OTHER';
    const localizedPrice = getPriceForCountry(
        template.pricingByCountry || null,
        userCountryCode,
        template.price
    );

    // Extract YouTube video ID
    const videoId = template.videoUrl ? getYouTubeVideoId(template.videoUrl) : null;

    // Handle hover to show video
    const handleMouseEnter = () => {
        setIsHovering(true);
        if (videoId) {
            // Delay showing video slightly to avoid accidental triggers
            hoverTimeoutRef.current = setTimeout(() => {
                setShowVideo(true);
                setIsPlaying(true);
            }, 500);
        }
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }
        setShowVideo(false);
        setIsPlaying(false);
    };

    // Toggle play/pause
    const togglePlayPause = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsPlaying(!isPlaying);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
            }
        };
    }, []);

    const handleCardClick = () => {
        router.push(`/web-template-details/${template.id}`);
    };

    const handleBuyNow = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (template.isFree) {
            router.push(`/web/templates/${template.id}?mode=edit`);
            return;
        }

        if (!session?.user) {
            router.push(`/api/auth/signin?callbackUrl=${encodeURIComponent(`/dashboard?buy=${template.id}`)}`);
            return;
        }

        // For paid templates, create project first then pay
        createProject.mutate({
            name: `My ${template.name || template.title}`,
            templateId: template.id,
            json: JSON.stringify({}),
            thumbnailUrl: template.thumbnail,
        }, {
            onSuccess: (data: any) => {
                const projectId = data.data.id;
                processPayment({
                    amount: localizedPrice, // Use localized price
                    projectId: projectId,
                    onSuccess: () => {
                        router.push(`/web/templates/${template.id}?id=${projectId}&mode=edit`);
                    }
                });
            }
        });
    };

    const isLoading = createProject.isPending || isPreparing || isVerifying;
    const rating = template.rating ?? 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="group"
        >
            {/* Card Container */}
            <div
                onClick={handleCardClick}
                className="bg-white rounded-3xl overflow-hidden border-2 border-gray-200 shadow-lg hover:shadow-2xl hover:shadow-purple-200/50 hover:border-purple-400 transition-all duration-500 hover:-translate-y-3 hover:scale-[1.02] cursor-pointer"
            >

                {/* Image Area with Overlays */}
                <div
                    className="relative aspect-[4/3] overflow-hidden bg-gray-100"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {/* Thumbnail Image */}
                    <img
                        src={template.thumbnail}
                        alt={template.name || template.title}
                        className={cn(
                            "w-full h-full object-cover transition-all duration-700 ease-out",
                            showVideo ? "opacity-0" : "opacity-100 group-hover:scale-110 group-hover:rotate-1"
                        )}
                    />

                    {/* YouTube Video Preview */}
                    {videoId && showVideo && (
                        <div className="absolute inset-0 z-10">
                            <iframe
                                ref={videoRef}
                                src={getYouTubeEmbedUrl(videoId, isPlaying)}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    )}

                    {/* Play/Pause Button Overlay */}
                    {videoId && isHovering && (
                        <button
                            onClick={togglePlayPause}
                            className="absolute bottom-4 left-4 z-20 p-3 bg-black/70 hover:bg-black/90 rounded-full transition-all backdrop-blur-sm"
                        >
                            {isPlaying ? (
                                <Pause className="w-5 h-5 text-white" />
                            ) : (
                                <Play className="w-5 h-5 text-white ml-0.5" />
                            )}
                        </button>
                    )}

                    {/* Gradient Overlay */}
                    <div className={cn(
                        "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 transition-all duration-500",
                        showVideo ? "opacity-0" : "opacity-100 group-hover:from-black/75 group-hover:via-black/10"
                    )} />

                    {/* Template Name & Category - Top Left */}
                    <div className="absolute top-4 left-4 right-4 z-10">
                        <h3 className="text-white font-bold text-lg drop-shadow-lg">
                            {template.name || template.title}
                        </h3>
                        {template.category && (
                            <span className="inline-block mt-2 px-2.5 py-1 rounded-md bg-white/20 backdrop-blur-sm text-white text-xs font-semibold border border-white/30">
                                {template.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </span>
                        )}
                    </div>

                    {/* Discount/Badge - Top Right */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 items-end z-10">
                        {template.orderCount !== undefined && template.orderCount > 0 && (
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold shadow-lg">
                                🔥 {template.orderCount} orders
                            </span>
                        )}
                        {template.isPro ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold shadow-lg">
                                <Crown className="w-3.5 h-3.5" />
                                PRO
                            </span>
                        ) : template.isFree ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-bold shadow-lg">
                                FREE
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500 text-white text-xs font-bold shadow-lg">
                                <Star className="w-3.5 h-3.5 fill-white" />
                                {rating}
                            </span>
                        )}
                    </div>
                </div>

                {/* Price Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.4 }}
                    className="px-6 py-4 text-center border-b-2 border-gray-200"
                >
                    {/* Rating Section */}
                    {!template.isFree && template.price > 0 && (
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={cn(
                                            "w-4 h-4",
                                            star <= Math.round(rating)
                                                ? "fill-orange-500 text-orange-500"
                                                : "fill-transparent text-gray-300"
                                        )}
                                    />
                                ))}
                            </div>
                            <span className="text-sm font-medium text-gray-500">
                                {template.reviewsCount?.toLocaleString() ?? 0}
                            </span>
                        </div>
                    )}

                    {template.isFree ? (
                        <span className="text-2xl font-bold text-emerald-600">
                            <T>FREE</T>
                        </span>
                    ) : (
                        <div className="space-y-1">
                            {/* Current Price with Currency */}
                            <div className="text-3xl font-black text-gray-800">
                                {formatPrice(localizedPrice, userCountryCode)}
                            </div>
                            {/* Original Price & Discount */}
                            <div className="flex items-center justify-center gap-2 text-sm">
                                <span className="text-gray-400 line-through font-medium">
                                    M.R.P: {formatPrice(Math.round(localizedPrice * 1.5), userCountryCode)}
                                </span>
                                <span className="text-emerald-600 font-bold">
                                    <T>(33% off)</T>
                                </span>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Buttons Section */}
                <div className="p-4 flex items-center justify-between gap-3">
                    {/* Preview Button */}
                    <motion.button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsPreviewOpen(true);
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-gray-800 text-gray-800 rounded-2xl font-bold text-base hover:bg-gray-50 transition-colors"
                    >
                        <Eye className="w-5 h-5" />
                        <T>Preview</T>
                    </motion.button>

                    {/* Buy Now Button */}
                    <motion.button
                        onClick={handleBuyNow}
                        disabled={isLoading}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold text-base transition-colors",
                            "bg-gray-800 text-white hover:bg-gray-900",
                            "disabled:opacity-50 disabled:cursor-not-allowed"
                        )}
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                {template.isFree ? <T>Use Free</T> : <T>Buy Now</T>}
                            </>
                        )}
                    </motion.button>
                </div>
            </div>

            {/* Preview Modal */}
            <PreviewModal
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                templateUrl={
                    // Check if it's an HTML template (has htmlCode field) or a React template (has isDynamic/componentCode)
                    (template as any).htmlCode
                        ? `/html-preview/${template.id}`
                        : template.href || `/preview/${template.id}`
                }
                templateName={template.name || template.title || "Template"}
            />
        </motion.div>
    );
}
