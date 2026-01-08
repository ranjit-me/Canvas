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
import { PromotionalCarousel } from '@/features/dashboard/components/promotional-carousel';

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
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-24">
                {/* Decorative Background */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-20 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                            <Sparkles className="w-5 h-5 text-yellow-300" />
                            <span className="text-white font-semibold">Create Beautiful Celebration Websites</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
                            Celebrate Every
                            <span className="block bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
                                Special Moment
                            </span>
                        </h1>

                        <p className="text-xl text-purple-100 mb-10 max-w-2xl mx-auto">
                            Choose from our stunning collection of templates for birthdays, weddings, anniversaries, and more.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="#trending">
                                <button className="px-8 py-4 bg-white text-purple-600 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all hover:scale-105 shadow-xl">
                                    Browse Templates
                                </button>
                            </Link>
                            {webProjects && webProjects.length > 0 && (
                                <Link href="/dashboard/projects">
                                    <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-2xl font-bold text-lg hover:bg-white/20 transition-all border-2 border-white/30">
                                        My Projects
                                    </button>
                                </Link>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Promotional Carousel */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-16 relative z-10">
                <PromotionalCarousel />
            </div>

            {/* Trending Templates Section */}
            {trendingTemplates && trendingTemplates.length > 0 && (
                <section id="trending" className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
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
                                {trendingTemplates.map((template: any, index: number) => (
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
            {latestTemplates && latestTemplates.length > 0 && (
                <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
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
                            {latestTemplates.map((template: any, index: number) => (
                                <WebTemplateCard key={template.id} template={template} index={index} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Category Sections */}
            {categories.map((category, categoryIndex) => (
                <CategorySection
                    key={category.id}
                    category={category}
                    index={categoryIndex}
                />
            ))}

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                            Why Choose ELYX?
                        </h2>
                        <p className="text-xl text-gray-600">
                            Everything you need to create stunning celebration websites
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Zap,
                                title: 'Quick Setup',
                                description: 'Get your website live in minutes with our easy-to-use templates'
                            },
                            {
                                icon: Star,
                                title: 'Premium Quality',
                                description: 'Professional designs that will wow your guests'
                            },
                            {
                                icon: Heart,
                                title: 'Fully Customizable',
                                description: 'Personalize every detail to match your vision'
                            }
                        ].map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
                                >
                                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                                        <Icon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.description}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
                <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                            Ready to Create Something Amazing?
                        </h2>
                        <p className="text-xl text-purple-100 mb-8">
                            Start building your perfect celebration website today
                        </p>
                        <Link href="#trending">
                            <button className="px-10 py-5 bg-white text-purple-600 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all hover:scale-105 shadow-2xl">
                                Get Started Now
                            </button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
                    <p className="text-gray-400">
                        © 2024 ELYX. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}

// Category Section Component
function CategorySection({ category, index }: { category: any; index: number }) {
    const { data: templates, isLoading } = useGetTemplatesByCategory(category.id);
    const Icon = category.icon;

    if (isLoading || !templates || templates.length === 0) {
        return null;
    }

    return (
        <section className={`py-20 ${index % 2 === 0 ? 'bg-white' : 'bg-gradient-to-br from-gray-50 to-purple-50/30'}`}>
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
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
                        {templates.slice(0, 6).map((template: any, templateIndex: number) => (
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
