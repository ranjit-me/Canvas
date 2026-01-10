'use client';

import Link from 'next/link';
import { Sparkles, Cake, Heart, Globe, Crown, PartyPopper, CalendarHeart, ArrowRight, Zap, Star, TrendingUp, Clock } from 'lucide-react';
import React, { useRef } from 'react';
import { motion } from 'framer-motion';

import { useGetWebProjects } from '@/features/web-projects/api/use-get-web-projects';
import { useGetTrendingTemplates } from '@/features/web-projects/api/use-get-trending-templates';
import { useGetLatestTemplates } from '@/features/web-projects/api/use-get-latest-templates';
import { useGetTemplatesByCategory } from '@/features/web-projects/api/use-get-templates-by-category';
import { WebTemplateCard } from '@/features/web-projects/components/web-template-card';
import { useGetLead } from '@/features/leads/api/use-get-lead';
import { useLeadCaptureModal } from '@/features/leads/store/use-lead-capture-modal';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { T } from '@/components/translated-text';
import { useTranslate } from '@/hooks/use-translate';
import { ImageCarousel } from '@/components/ImageCarousel';

export default function DashboardContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session } = useSession();

    const { data: webProjects, isLoading: isLoadingProjects } = useGetWebProjects();
    const { data: trendingTemplates, isLoading: isLoadingTrending } = useGetTrendingTemplates();
    const { data: latestTemplates, isLoading: isLoadingLatest } = useGetLatestTemplates();
    const { data: leadData, isLoading: isLoadingLead } = useGetLead();
    const { onOpen: openLeadModal } = useLeadCaptureModal();

    const categories = [
        {
            id: 'birthday-girlfriend',
            title: 'Birthday Templates',
            description: 'Celebrate special moments',
            icon: PartyPopper,
            href: '/web/birthday',
            gradient: 'from-pink-500 to-orange-500',
        },
        {
            id: 'anniversary-girlfriend',
            title: 'Anniversary Templates',
            description: 'Honor your love story',
            icon: CalendarHeart,
            href: '/web/anniversary',
            gradient: 'from-rose-500 to-pink-500',
        },
        {
            id: 'wedding-bride',
            title: 'Wedding Templates',
            description: 'Your perfect day awaits',
            icon: Sparkles,
            href: '/web/wedding',
            gradient: 'from-purple-500 to-pink-500',
        },
        {
            id: 'valentine-girlfriend',
            title: 'Valentine Week',
            description: 'Express your love',
            icon: Heart,
            href: '/web/valentine-week',
            gradient: 'from-red-500 to-rose-500',
        },
        {
            id: 'special-graduation',
            title: 'Special Days',
            description: 'Milestone celebrations',
            icon: Crown,
            href: '/web/special-days',
            gradient: 'from-indigo-500 to-purple-500',
        },
        {
            id: 'religious-diwali',
            title: 'Religious & Cultural',
            description: 'Festival celebrations',
            icon: Globe,
            href: '/web/religious-cultural',
            gradient: 'from-orange-500 to-amber-500',
        },
    ];

    React.useEffect(() => {
        if (!isLoadingLead && !leadData) {
            const hasPrompted = sessionStorage.getItem('lead_prompted');
            if (!hasPrompted) {
                openLeadModal();
                sessionStorage.setItem('lead_prompted', 'true');
            }
        }
    }, [leadData, isLoadingLead, openLeadModal]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-pink-50/30">
            {/* Image Carousel - Hero */}
            <div className="w-full px-4 sm:px-6 mb-8">
                <ImageCarousel />
            </div>

            {/* Sliding Categories Marquee */}
            <CategoryMarquee categories={categories} />

            {/* Trending Templates Section */}
            {(trendingTemplates as any[]) && (trendingTemplates as any[]).length > 0 && (
                <section id="trending" className="py-20 bg-white">
                    <div className="w-full px-4 sm:px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mb-12"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-4xl md:text-5xl font-black text-gray-900">
                                        Trending Templates
                                    </h2>
                                    <p className="text-lg text-gray-600 mt-1">Most ordered by our customers</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Horizontal Scroll */}
                        <div className="relative">
                            <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide">
                                {(trendingTemplates as any[]).map((template: any, index: number) => (
                                    <div key={template.id} className="flex-none w-[350px] snap-start">
                                        <WebTemplateCard template={template} index={index} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Latest Templates Section */}
            {(latestTemplates as any[]) && (latestTemplates as any[]).length > 0 && (
                <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
                    <div className="w-full px-4 sm:px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mb-12"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                                    <Clock className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-4xl md:text-5xl font-black text-gray-900">
                                        New Templates
                                    </h2>
                                    <p className="text-lg text-gray-600 mt-1">Freshly added to our collection</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Grid Layout */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {(latestTemplates as any[]).map((template: any, index: number) => (
                                <WebTemplateCard key={template.id} template={template} index={index} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

        </div>
    );
}

// Category Section Component
function CategorySection({ category, index }: { category: any; index: number }) {
    const { data: templates, isLoading } = useGetTemplatesByCategory(category.id);
    const Icon = category.icon;

    if (isLoading || !(templates as any[]) || (templates as any[]).length === 0) {
        return null;
    }

    return (
        <section className={`py-20 ${index % 2 === 0 ? 'bg-white' : 'bg-gradient-to-br from-gray-50 to-purple-50/30'}`}>
            <div className="w-full px-4 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 bg-gradient-to-br ${category.gradient} rounded-xl flex items-center justify-center`}>
                                <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-4xl md:text-5xl font-black text-gray-900">
                                    {category.title}
                                </h2>
                                <p className="text-lg text-gray-600 mt-1">{category.description}</p>
                            </div>
                        </div>
                        <Link href={category.href}>
                            <button className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors">
                                View All
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </Link>
                    </div>
                </motion.div>

                {/* Horizontal Scroll */}
                <div className="relative">
                    <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide">
                        {(templates as any[]).slice(0, 6).map((template: any, templateIndex: number) => (
                            <div key={template.id} className="flex-none w-[350px] snap-start">
                                <WebTemplateCard template={template} index={templateIndex} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

// Sliding Categories Marquee Component
function CategoryMarquee({ categories }: { categories: any[] }) {
    // Duplicate categories for seamless infinite loop
    const doubledCategories = [...categories, ...categories, ...categories];

    return (
        <div className="w-full overflow-hidden bg-white/50 backdrop-blur-sm py-8 border-y border-gray-100 mb-8">
            <motion.div
                className="flex gap-6 whitespace-nowrap"
                animate={{
                    x: [0, -100 * categories.length],
                }}
                transition={{
                    x: {
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 30,
                        ease: "linear",
                    },
                }}
            >
                {doubledCategories.map((category, index) => {
                    const Icon = category.icon;
                    return (
                        <Link
                            key={`${category.id}-${index}`}
                            href={category.href}
                            className="flex-none"
                        >
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="flex items-center gap-4 px-6 py-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all group"
                            >
                                <div className={`w-12 h-12 bg-gradient-to-br ${category.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-lg font-bold text-gray-900 leading-tight">
                                        {category.title}
                                    </span>
                                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                                        Explore More
                                    </span>
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-purple-500 transition-colors ml-2" />
                            </motion.div>
                        </Link>
                    );
                })}
            </motion.div>
        </div>
    );
}
