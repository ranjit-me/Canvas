"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const images = [
    {
        url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1920&q=80&auto=format&fit=crop",
        alt: "Birthday Celebration with Cake and Balloons",
        title: "Birthday Celebrations",
    },
    {
        url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1920&q=80&auto=format&fit=crop",
        alt: "Beautiful Wedding Ceremony",
        title: "Wedding Moments",
    },
    {
        url: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1920&q=80&auto=format&fit=crop",
        alt: "Anniversary Flowers and Romance",
        title: "Anniversary Love",
    },
    {
        url: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=1920&q=80&auto=format&fit=crop",
        alt: "Colorful Party Balloons",
        title: "Special Occasions",
    },
    {
        url: "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=1920&q=80&auto=format&fit=crop",
        alt: "Romantic Dinner Setting",
        title: "Romantic Moments",
    },
];

export function ImageCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    // Auto-advance carousel every 5 seconds (unless hovered)
    useEffect(() => {
        if (isHovered) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isHovered]);

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    return (
        <div
            className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden shadow-2xl group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                    className="absolute inset-0"
                >
                    <img
                        src={images[currentIndex].url}
                        alt={images[currentIndex].alt}
                        className="w-full h-full object-cover"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </motion.div>
            </AnimatePresence>

            {/* Title Overlay */}
            <div className="absolute bottom-20 left-0 right-0 px-8 md:px-12">
                <AnimatePresence mode="wait">
                    <motion.h3
                        key={currentIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="text-3xl md:text-5xl font-black text-white drop-shadow-2xl"
                    >
                        {images[currentIndex].title}
                    </motion.h3>
                </AnimatePresence>
            </div>

            {/* Navigation Arrows - Hidden on mobile, shown on hover on desktop */}
            <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center transition-all opacity-0 md:group-hover:opacity-100"
                aria-label="Previous image"
            >
                <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center transition-all opacity-0 md:group-hover:opacity-100"
                aria-label="Next image"
            >
                <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Navigation Dots */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`transition-all duration-300 rounded-full ${index === currentIndex
                            ? "w-8 h-3 bg-white"
                            : "w-3 h-3 bg-white/50 hover:bg-white/75"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
