"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Heart, Star, Sparkles, Calendar, Music, MapPin, Camera, Play, Pause } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { EditableText } from '@/app/(dashboard)/web/features/components/EditableText';
import { EditableImage } from '@/app/(dashboard)/web/features/components/EditableImage';
import { DatePicker } from '@/app/(dashboard)/web/features/components/DatePicker';
import { useEditMode, EditModeProvider } from '@/app/(dashboard)/web/features/hooks/useEditMode';
import { EditControls } from '@/app/(dashboard)/web/features/components/EditControls';
import { useGetWebProject } from '@/features/web-projects/api/use-get-web-project';
import { useCreateWebProject } from '@/features/web-projects/api/use-create-web-project';
import { useUpdateWebProject } from '@/features/web-projects/api/use-update-web-project';
import { motion, AnimatePresence } from 'framer-motion';
import { usePaymentFlow } from '@/features/payments/hooks/use-payment-flow';

export function AnniversaryWebsite({
    initialData,
    processPayment,
    isLoading
}: {
    initialData?: any;
    processPayment: any;
    isLoading: boolean;
}) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { selectElement, deselectElement, isSelected, setEditMode, isEditMode } = useEditMode();

    const projectId = searchParams.get('id');
    const { data: projectData, isLoading: projectLoading } = useGetWebProject(projectId || "");
    const activeProjectData = initialData || projectData;

    const createProject = useCreateWebProject();
    const updateProject = useUpdateWebProject(projectId || "");

    const [content, setContent] = useState({
        heroTitle: "Happy Anniversary",
        heroSubtitle: "To My Forever Love ❤️",
        heroDescription: "Years have passed, but my love for you only grows stronger. Every day with you is a gift, and every year is a beautiful chapter in our story.",
        anniversaryDate: '2020-01-01T00:00:00',
        yearsTogether: "4",
        daysTogether: "1,461",
        memoriesTitle: "Our Journey Through Time ✨",
        memoriesSubtitle: "From the first day until forever",
        photos: [
            'https://images.unsplash.com/photo-1755810505055-18704ae9d0e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
            'https://images.unsplash.com/photo-1611594167606-6ba5cb6510f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
            'https://images.unsplash.com/photo-1707035091770-4c548c02e5c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ],
        finalMessage: "I love you more than words can express. Here's to many more beautiful years together!",
        finalSignature: "Yours Forever ❤️"
    });

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (activeProjectData && activeProjectData.json) {
            try {
                const parsedContent = JSON.parse(activeProjectData.json);
                setContent(prev => ({ ...prev, ...parsedContent }));
            } catch (e) {
                console.error("Failed to parse project content", e);
            }
        }
    }, [activeProjectData]);

    const updateContent = (key: string, value: any) => {
        setContent(prev => ({ ...prev, [key]: value }));
    };

    const handlePublish = async () => {
        const name = content.heroSubtitle.replace(/[❤️✨🌸]/g, '').trim() || 'My Love';
        const defaultSlug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const slug = window.prompt("Enter a unique URL slug for your published site:", defaultSlug);
        if (!slug) return;

        let country = "Unknown";
        try {
            const res = await fetch('https://ipapi.co/json/');
            const data = await res.json();
            country = data.country_name || "Unknown";
        } catch (e) { console.error(e); }

        const json = JSON.stringify(content);

        if (projectId) {
            updateProject.mutate({ json, slug, country, isPublished: true }, {
                onSuccess: () => {
                    const url = `${window.location.origin}/p/${slug}`;
                    router.push("/dashboard/projects");
                    alert(`✅ Published Successfully!\n\nView at: ${url}`);
                    window.open(url, '_blank');
                }
            });
        } else {
            createProject.mutate({
                name: `Anniversary for ${name}`,
                templateId: 'romantic-anniversary',
                json, slug, country, isPublished: true,
            }, {
                onSuccess: (data: any) => {
                    const id = data.data.id;
                    const price = projectData?.templatePrice || 39;
                    processPayment({
                        amount: price,
                        projectId: id,
                        onSuccess: () => {
                            const url = `${window.location.origin}/p/${slug}`;
                            router.push("/dashboard/projects");
                            alert(`✅ Payment Successful & Published!\n\nView at: ${url}`);
                            window.open(url, '_blank');
                        }
                    });
                }
            });
        }
    };

    const handleSave = async () => {
        const json = JSON.stringify(content);
        if (projectId) {
            updateProject.mutate({ json });
        } else {
            createProject.mutate({
                name: `Anniversary for ${content.heroSubtitle.replace(/[❤️✨🌸]/g, '').trim() || 'My Love'}`,
                templateId: 'romantic-anniversary',
                json,
            }, {
                onSuccess: (data: any) => {
                    const id = data.data.id;
                    const price = projectData?.templatePrice || 39;
                    processPayment({
                        amount: price,
                        projectId: id,
                        onSuccess: () => {
                            router.push(`/web/anniversary/romantic/romantic-anniversary?id=${id}`);
                        }
                    });
                }
            });
        }
    };



    return (
        <div className="relative min-h-screen bg-[#0F0A1E] text-white overflow-x-hidden selection:bg-rose-500/30">
            {/* Animated Starry Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0F0A1E] via-[#1A1135] to-[#0F0A1E]" />
                {isMounted && [...Array(50)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-white rounded-full"
                        style={{
                            width: Math.random() * 3 + 'px',
                            height: Math.random() * 3 + 'px',
                            left: Math.random() * 100 + '%',
                            top: Math.random() * 100 + '%',
                        }}
                        animate={{
                            opacity: [0.2, 0.8, 0.2],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: 2 + Math.random() * 3,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>

            <main className="relative z-10">
                {/* Hero Section */}
                <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        className="space-y-8"
                    >
                        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-bold backdrop-blur-md mb-4">
                            <Heart className="w-4 h-4 fill-rose-400" />
                            <span>Happy Anniversary</span>
                        </div>

                        <EditableText
                            value={content.heroTitle}
                            onChange={(val) => updateContent('heroTitle', val)}
                            elementId="hero-title"
                            isSelected={isSelected('hero-title')}
                            onSelect={() => selectElement('hero-title', 'text')}
                            className="text-6xl md:text-8xl font-black tracking-tighter bg-gradient-to-b from-white via-white to-gray-500 bg-clip-text text-transparent"
                            as="h1"
                        />

                        <EditableText
                            value={content.heroSubtitle}
                            onChange={(val) => updateContent('heroSubtitle', val)}
                            elementId="hero-subtitle"
                            isSelected={isSelected('hero-subtitle')}
                            onSelect={() => selectElement('hero-subtitle', 'text')}
                            className="text-4xl md:text-6xl font-bold text-rose-500 mt-4 leading-tight italic"
                        />

                        <EditableText
                            value={content.heroDescription}
                            onChange={(val) => updateContent('heroDescription', val)}
                            elementId="hero-desc"
                            isSelected={isSelected('hero-desc')}
                            onSelect={() => selectElement('hero-desc', 'text')}
                            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mt-8"
                            as="p"
                        />
                    </motion.div>
                </section>

                {/* Milestone Section */}
                <section className="py-32 px-6">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                                Celebrating Every <br />
                                <span className="text-rose-500">Second Spent Together</span>
                            </h2>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl">
                                    <div className="text-4xl font-black text-rose-500 mb-2">{content.yearsTogether}</div>
                                    <div className="text-gray-400 font-medium">Years of Love</div>
                                </div>
                                <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl">
                                    <div className="text-4xl font-black text-rose-500 mb-2">{content.daysTogether}</div>
                                    <div className="text-gray-400 font-medium">Days of Magic</div>
                                </div>
                            </div>
                        </motion.div>

                        <div className="relative aspect-square">
                            <div className="absolute inset-0 bg-rose-500/20 blur-[100px] rounded-full animate-pulse" />
                            <EditableImage
                                src={content.photos[0]}
                                alt="Main memory"
                                onChange={(url) => {
                                    const newPhotos = [...content.photos];
                                    newPhotos[0] = url;
                                    updateContent('photos', newPhotos);
                                }}
                                elementId="photo-main"
                                isSelected={isSelected('photo-main')}
                                onSelect={() => selectElement('photo-main', 'image')}
                                className="w-full h-full object-cover rounded-[3rem] border border-white/10 shadow-2xl relative z-10"
                            />
                        </div>
                    </div>
                </section>

                {/* Final Section */}
                <section className="py-40 px-6 text-center">
                    <div className="max-w-3xl mx-auto space-y-12">
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Heart className="w-20 h-20 text-rose-600 fill-rose-600 mx-auto" />
                        </motion.div>
                        <EditableText
                            value={content.finalMessage}
                            onChange={(val) => updateContent('finalMessage', val)}
                            elementId="final-message"
                            isSelected={isSelected('final-message')}
                            onSelect={() => selectElement('final-message', 'text')}
                            className="text-3xl md:text-5xl font-bold text-white leading-tight"
                            as="h2"
                        />
                        <EditableText
                            value={content.finalSignature}
                            onChange={(val) => updateContent('finalSignature', val)}
                            elementId="final-sig"
                            isSelected={isSelected('final-sig')}
                            onSelect={() => selectElement('final-sig', 'text')}
                            className="text-2xl text-rose-400 font-medium tracking-widest uppercase italic"
                        />
                    </div>
                </section>
            </main>

            {/* Edit Controls */}
            {isEditMode && (
                <EditControls onExport={handleSave} onPublish={handlePublish} />
            )}

            <style jsx global>{`
                body { background-color: #0F0A1E; }
            `}</style>
        </div>
    );
}

export default function AnniversaryPage() {
    return (
        <EditModeProvider>
            <AnniversaryWebsiteContent />
        </EditModeProvider>
    );
}

function AnniversaryWebsiteContent() {
    const searchParams = useSearchParams();
    const projectId = searchParams.get('id');
    const updateProject = useUpdateWebProject(projectId || "");
    const createProject = useCreateWebProject();
    const { processPayment, isPreparing, isVerifying } = usePaymentFlow();

    const isLoading = updateProject.isPending || createProject.isPending || isPreparing || isVerifying;

    return (
        <AnniversaryWebsite
            processPayment={processPayment}
            isLoading={isLoading}
        />
    );
}
