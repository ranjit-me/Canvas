"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

import { useGetBanners } from "@/features/banners/api/use-get-banners";
import { Button } from "@/components/ui/button";

export const PromotionalCarousel = () => {
    const router = useRouter();
    const { data: banners, isLoading } = useGetBanners();
    const [currentIndex, setCurrentIndex] = useState(0);

    // Filter active banners and sort by display order
    const activeBanners = banners?.filter((b: any) => b.isActive) || [];

    // Auto-slide every 5 seconds
    useEffect(() => {
        if (activeBanners.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [activeBanners.length]);

    const handlePrevious = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? activeBanners.length - 1 : prev - 1
        );
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    };

    const handleBannerClick = (linkUrl: string) => {
        router.push(linkUrl);
    };

    if (isLoading || activeBanners.length === 0) {
        return null;
    }

    const currentBanner = activeBanners[currentIndex];

    return (
        <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-xl mb-8">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 cursor-pointer"
                    onClick={() => handleBannerClick(currentBanner.linkUrl)}
                    style={{ backgroundColor: currentBanner.backgroundColor }}
                >
                    <div className="relative w-full h-full flex items-center justify-between px-8 md:px-16">
                        {/* Content Section */}
                        <div className="flex-1 text-white z-10">
                            {currentBanner.title && (
                                <h2 className="text-3xl md:text-5xl font-bold mb-2">
                                    {currentBanner.title}
                                </h2>
                            )}
                            {currentBanner.price && (
                                <p className="text-2xl md:text-3xl font-semibold mb-2">
                                    {currentBanner.price}
                                </p>
                            )}
                            {currentBanner.subtitle && (
                                <p className="text-lg md:text-xl opacity-90">
                                    {currentBanner.subtitle}
                                </p>
                            )}
                        </div>

                        {/* Image Section */}
                        {currentBanner.imageUrl && (
                            <div className="relative w-48 h-48 md:w-64 md:h-64 flex-shrink-0">
                                <Image
                                    src={currentBanner.imageUrl}
                                    alt={currentBanner.title || "Banner"}
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        )}
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-4 left-4 w-16 h-16 bg-white/10 rounded-full blur-2xl" />
                    <div className="absolute bottom-8 right-8 w-24 h-24 bg-white/10 rounded-full blur-3xl" />
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            {activeBanners.length > 1 && (
                <>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full z-20"
                        onClick={(e) => {
                            e.stopPropagation();
                            handlePrevious();
                        }}
                    >
                        <ChevronLeft className="size-6" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full z-20"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleNext();
                        }}
                    >
                        <ChevronRight className="size-6" />
                    </Button>
                </>
            )}

            {/* Pagination Dots */}
            {activeBanners.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {activeBanners.map((_: any, index: number) => (
                        <button
                            key={index}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                    ? "bg-white w-6"
                                    : "bg-white/50 hover:bg-white/75"
                                }`}
                            onClick={(e) => {
                                e.stopPropagation();
                                setCurrentIndex(index);
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
