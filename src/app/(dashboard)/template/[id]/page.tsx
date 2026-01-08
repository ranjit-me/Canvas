"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, Play, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

// Mock template data - replace with actual API call
const getTemplateById = (id: string) => {
    return {
        id,
        name: "Dreamy Pink Paradise",
        description: "A beautiful birthday celebration template with elegant design and smooth animations. Perfect for creating memorable birthday wishes with stunning visuals and interactive elements.",
        price: 299,
        images: [
            "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800",
            "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800",
            "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=800",
        ],
        videoUrl: null,
        category: "Birthday",
        features: [
            "Fully customizable text and images",
            "Responsive design for all devices",
            "Beautiful animations",
            "Easy to use",
        ],
    };
};

export default function TemplateDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    const [selectedMedia, setSelectedMedia] = useState(0);

    const templateId = params.id as string;
    const template = getTemplateById(templateId);

    const handleBuyNow = () => {
        // Redirect to template editor or checkout
        router.push(`/web/birthday/girlfriend/${templateId}`);
    };

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
                        Template Preview
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
                                {template.images.map((image, index) => (
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
                                        <Image
                                            src={image}
                                            alt={`Preview ${index + 1}`}
                                            width={200}
                                            height={150}
                                            className="w-full h-full object-cover"
                                        />
                                    </motion.button>
                                ))}
                                {template.videoUrl && (
                                    <motion.button
                                        onClick={() => setSelectedMedia(template.images.length)}
                                        className={`w-full aspect-video rounded-lg overflow-hidden border-2 transition-all relative ${selectedMedia === template.images.length
                                                ? "border-purple-500 shadow-lg scale-105"
                                                : "border-gray-200 hover:border-purple-300"
                                            }`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                                            <Play className="size-8 text-white" />
                                        </div>
                                    </motion.button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Main Content - Preview */}
                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            {/* Preview Area */}
                            <div className="aspect-video bg-gray-100 relative">
                                <Image
                                    src={template.images[selectedMedia]}
                                    alt={`${template.name} preview`}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>

                            {/* Template Name */}
                            <div className="p-6 border-b border-gray-100">
                                <h2 className="text-3xl font-black text-gray-900 mb-2">
                                    {template.name}
                                </h2>
                                <p className="text-sm text-gray-500">{template.category} Template</p>
                            </div>

                            {/* Description */}
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-3">
                                    Description
                                </h3>
                                <p className="text-gray-600 leading-relaxed mb-6">
                                    {template.description}
                                </p>

                                <h3 className="text-lg font-bold text-gray-900 mb-3">
                                    Features
                                </h3>
                                <ul className="space-y-2">
                                    {template.features.map((feature, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                            <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                                                <div className="w-2 h-2 rounded-full bg-purple-600" />
                                            </div>
                                            <span className="text-gray-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar - Buy Now */}
                    <div className="lg:col-span-3">
                        <div className="sticky top-24">
                            <div className="bg-white rounded-2xl shadow-xl p-6">
                                <div className="mb-6">
                                    <p className="text-sm text-gray-600 mb-2">Price</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-black text-gray-900">
                                            ₹{template.price}
                                        </span>
                                        <span className="text-gray-500 line-through">₹599</span>
                                    </div>
                                    <p className="text-sm text-green-600 font-semibold mt-1">
                                        Save 50%
                                    </p>
                                </div>

                                <Button
                                    onClick={handleBuyNow}
                                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-12 text-lg font-bold gap-2"
                                    size="lg"
                                >
                                    <ShoppingCart className="size-5" />
                                    Buy Now
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
                                        <span>Lifetime updates included</span>
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
                                        <span>Full customization support</span>
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
