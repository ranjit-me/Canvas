"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Heart, Play, Pause, Sparkles } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { EditableText } from '@/app/(dashboard)/web/features/components/EditableText';
import { EditableImage } from '@/app/(dashboard)/web/features/components/EditableImage';
import { DatePicker } from '@/app/(dashboard)/web/features/components/DatePicker';
import { TimelineEditor } from '@/app/(dashboard)/web/features/components/TimelineEditor';
import { useEditMode, EditModeProvider } from '@/app/(dashboard)/web/features/hooks/useEditMode';
import { EditControls } from '@/app/(dashboard)/web/features/components/EditControls';
import { EditableMusic } from '@/app/(dashboard)/web/features/components/EditableMusic';
import { ContentData } from './types';
import { useGetWebProject } from '@/features/web-projects/api/use-get-web-project';
import { useCreateWebProject } from '@/features/web-projects/api/use-create-web-project';
import { useUpdateWebProject } from '@/features/web-projects/api/use-update-web-project';
import { usePaymentFlow } from '@/features/payments/hooks/use-payment-flow';
import { SlugDialog } from '@/components/slug-dialog';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import { LanguageSelector } from '@/components/LanguageSelector';

// The actual birthday website content
export function BirthdayWebsite({
    initialData,
    processPayment,
    isLoading
}: {
    initialData?: any;
    processPayment: any;
    isLoading: boolean;
}) {
    const searchParams = useSearchParams();
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const { selectElement, deselectElement, isSelected, setEditMode, isEditMode } = useEditMode();
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [editingTimeline, setEditingTimeline] = useState<number | null>(null);
    const router = useRouter();
    const { t } = useLanguage();

    const projectId = searchParams.get('id');
    const { data: projectData, isLoading: projectLoading } = useGetWebProject(projectId || "");

    // Use initialData if provided (for public view), otherwise use projectData (for editor)
    const activeProjectData = initialData || projectData;

    const [isMuted, setIsMuted] = useState(false);
    const createProject = useCreateWebProject();
    const updateProject = useUpdateWebProject(projectId || "");
    const [slugDialogOpen, setSlugDialogOpen] = useState(false);
    const [slugError, setSlugError] = useState<string>();
    const [isPublishing, setIsPublishing] = useState(false);

    // Set edit mode based on URL parameter (only in editor mode, not public pages)
    useEffect(() => {
        if (!initialData) {
            const mode = searchParams.get('mode');
            if (mode === 'preview') {
                setEditMode(false);
            } else {
                setEditMode(true);
            }
        }
    }, [searchParams, setEditMode, initialData]);

    // Content state - all editable content
    const [content, setContent] = useState<ContentData>({
        heroTitle: "Happy Birthday",
        heroSubtitle: "My Love ❤️",
        heroDescription: "To the most beautiful soul who makes every day brighter, every moment sweeter, and every dream more magical. Today we celebrate YOU! 🎂✨",
        surpriseDate: '2025-12-25T00:00:00',
        countdownTitle: "Special Surprise Countdown ✨",
        memoriesTitle: "Our Beautiful Memories 🌸",
        memoriesSubtitle: "Every photo tells a story, every moment is a treasure",
        timelineTitle: "My Love Letters 💌",
        timelineSubtitle: "Every word comes straight from my heart",
        memories: [
            {
                type: 'image',
                url: 'https://images.unsplash.com/photo-1717912991903-673ea91783a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMGNvdXBsZSUyMGxvdmV8ZW58MXx8fHwxNzY1MzQ0NDgzfDA&ixlib=rb-4.1.0&q=80&w=1080',
                caption: 'Our Love Story'
            },
            {
                type: 'image',
                url: 'https://images.unsplash.com/photo-1575388104683-e076ee9ccaa0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxjb3VwbGUlMjBzdW5zZXR8ZW58MXx8fHwxNzY1MzE2OTA1fDA&ixlib=rb-4.1.0&q=80&w=1080',
                caption: 'Sunset Together'
            },
            {
                type: 'image',
                url: 'https://images.unsplash.com/photo-1522973717924-b10fe4e185cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxyb21hbnRpYyUyMGhhbmRzJTIwdG9nZXRoZXJ8ZW58MXx8fHwxNzY1MzYzNzI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
                caption: 'Forever Holding Hands'
            },
            {
                type: 'image',
                url: 'https://images.unsplash.com/photo-1519307212971-dd9561667ffb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxjb3VwbGUlMjBiZWFjaHxlbnwxfHx8fDE3NjUyODE1ODd8MA&ixlib=rb-4.1.0&q=80&w=1080',
                caption: 'Beach Memories'
            },
            {
                type: 'image',
                url: 'https://images.unsplash.com/photo-1620457552161-6202229a5018?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxyb21hbnRpYyUyMGRhdGUlMjBuaWdodHxlbnwxfHx8fDE3NjUzNjM3Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
                caption: 'Date Night Magic'
            },
            {
                type: 'image',
                url: 'https://images.unsplash.com/photo-1524146222100-8fd7c6ae9025?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxjb3VwbGUlMjBuYXR1cmV8ZW58MXx8fHwxNzY1MzYzNzI3fDA&ixlib=rb-4.1.0&q=80&w=1080',
                caption: 'Adventures Together'
            }
        ],
        loveMessages: [
            {
                date: 'January 2024',
                message: 'From the moment I met you, I knew my life would never be the same. You brought light into my darkest days and made every moment magical. ✨'
            },
            {
                date: 'March 2024',
                message: 'Every laugh we share, every adventure we take, every quiet moment we spend together - they all remind me why I fell so deeply in love with you. 💕'
            },
            {
                date: 'June 2024',
                message: 'You are my best friend, my soulmate, my everything. Thank you for being the most amazing person I could ever ask for. 🌸'
            },
            {
                date: 'September 2024',
                message: 'With you, I\'ve discovered what true love really means. You make me want to be a better person every single day. 💖'
            },
            {
                date: 'Today',
                message: 'Happy Birthday my love! I promise to cherish you, support you, and love you more with each passing day. Here\'s to many more beautiful memories together! 🎂❤️'
            }
        ],
        finalHeading: "I Love You More Than Words Can Say",
        finalMessage: "You are my yesterday, my today, and all of my tomorrows. Thank you for being the most incredible girlfriend anyone could ever dream of. Here's to celebrating you today and every day! 🎉💕",
        finalSignature: "Forever Yours ❤️",
        musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    });

    // Initial state population
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

    // Countdown timer effect
    useEffect(() => {
        const surpriseDate = new Date(content.surpriseDate).getTime();

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const difference = surpriseDate - now;

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((difference % (1000 * 60)) / 1000)
                });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [content.surpriseDate]);



    // Content update handlers
    const updateContent = (key: keyof ContentData, value: any) => {
        setContent(prev => ({ ...prev, [key]: value }));
    };

    const updateMemory = (index: number, url: string) => {
        setContent(prev => ({
            ...prev,
            memories: prev.memories.map((m, i) => i === index ? { ...m, url } : m)
        }));
    };
    const updateTimelineMessage = (index: number, date: string, message: string) => {
        setContent(prev => ({
            ...prev,
            loveMessages: prev.loveMessages.map((m, i) =>
                i === index ? { date, message } : m
            )
        }));
    };

    const handleExport = () => {
        const dataStr = JSON.stringify(content, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'birthday-template-content.json';
        link.click();
        URL.revokeObjectURL(url);
        alert('✅ Content exported successfully!');
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
        } catch (e) {
            console.error("Failed to detect country", e);
        }

        const json = JSON.stringify(content);

        if (projectId) {
            updateProject.mutate({
                json,
                slug,
                country,
                isPublished: true
            }, {
                onSuccess: () => {
                    const url = `${window.location.origin}/p/${slug}`;
                    router.push("/dashboard/projects");
                    alert(`✅ Published Successfully!\n\nYour site is live at:\n${url}`);
                    window.open(url, '_blank');
                }
            });
        } else {
            createProject.mutate({
                name: `Birthday for ${name}`,
                templateId: 'rose-birthday',
                json,
                slug,
                country,
                isPublished: true,
            }, {
                onSuccess: (data: any) => {
                    const id = data.data.id;
                    const price = projectData?.templatePrice || 19;
                    processPayment({
                        amount: price,
                        projectId: id,
                        onSuccess: () => {
                            const url = `${window.location.origin}/p/${slug}`;
                            router.push("/dashboard/projects");
                            alert(`✅ Payment Successful & Published!\n\nYour site is live at:\n${url}`);
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
                name: `Birthday for ${content.heroSubtitle.replace(/[❤️✨🌸]/g, '').trim() || 'My Love'}`,
                templateId: 'rose-birthday',
                json,
            }, {
                onSuccess: (data: any) => {
                    const id = data.data.id;
                    const price = projectData?.templatePrice || 19;
                    processPayment({
                        amount: price,
                        projectId: id,
                        onSuccess: () => {
                            router.push(`/web/birthday/girlfriend/rose-birthday?id=${id}`);
                        }
                    });
                }
            });
        }
    };

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);



    return (
        <div className="relative min-h-screen overflow-x-hidden">
            {/* Background with gradient */}
            <div className="fixed inset-0 bg-gradient-to-br from-pink-200 via-purple-200 to-red-200 -z-10" />

            {/* Floating hearts animation */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-5">
                {isMounted && [...Array(15)].map((_, i) => (
                    <Heart
                        key={`heart-${i}`}
                        className="absolute text-pink-400 opacity-30 animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${8 + Math.random() * 4}s`,
                            fontSize: `${20 + Math.random() * 20}px`
                        }}
                    />
                ))}
            </div>

            {/* Floating balloons animation */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-5">
                {isMounted && [...Array(10)].map((_, i) => (
                    <div
                        key={`balloon-${i}`}
                        className="absolute animate-float-balloon"
                        style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${10 + Math.random() * 5}s`
                        }}
                    >
                        <div className="relative">
                            {/* Balloon body with gradient and shine */}
                            <div
                                className="relative rounded-full shadow-2xl"
                                style={{
                                    width: `${40 + Math.random() * 30}px`,
                                    height: `${50 + Math.random() * 35}px`,
                                    background: ['linear-gradient(135deg, #ff85c1 0%, #ff1493 50%, #c71585 100%)',
                                        'linear-gradient(135deg, #ff69b4 0%, #ff1493 50%, #d946a8 100%)',
                                        'linear-gradient(135deg, #f0abfc 0%, #da70d6 50%, #a855f7 100%)',
                                        'linear-gradient(135deg, #fda4af 0%, #fb7185 50%, #f43f5e 100%)',
                                        'linear-gradient(135deg, #c084fc 0%, #a855f7 50%, #9333ea 100%)'][i % 5],
                                    borderRadius: '45% 45% 50% 50%'
                                }}
                            >
                                {/* Shine effect */}
                                <div
                                    className="absolute top-2 left-2 w-4 h-6 bg-white/40 rounded-full blur-sm"
                                    style={{ transform: 'rotate(-20deg)' }}
                                />
                            </div>
                            {/* Balloon knot */}
                            <div
                                className="absolute left-1/2 -translate-x-1/2 top-full w-3 h-2 rounded-b-full"
                                style={{
                                    background: ['#c71585', '#d946a8', '#a855f7', '#f43f5e', '#9333ea'][i % 5]
                                }}
                            />
                            {/* String */}
                            <svg
                                className="absolute left-1/2 -translate-x-1/2 top-full"
                                width="2"
                                height="100"
                                style={{ overflow: 'visible' }}
                            >
                                <path
                                    d="M 1 0 Q 5 20, 1 40 Q -3 60, 1 80 Q 5 90, 1 100"
                                    stroke="#ffc0cb"
                                    strokeWidth="1.5"
                                    fill="none"
                                />
                            </svg>
                        </div>
                    </div>
                ))}
            </div>

            {/* Sparkles */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-5">
                {isMounted && [...Array(20)].map((_, i) => (
                    <Sparkles
                        key={`sparkle-${i}`}
                        className="absolute text-yellow-300 opacity-40 animate-twinkle"
                        size={16}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${2 + Math.random() * 2}s`
                        }}
                    />
                ))}
            </div>

            {/* Music control button */}
            <div className="fixed top-6 right-20 z-50">
                <EditableMusic
                    url={content.musicUrl || ""}
                    onChange={(url) => updateContent('musicUrl', url)}
                    isSelected={isSelected('bg-music')}
                    onSelect={() => selectElement('bg-music', 'text')}
                />
            </div>

            {/* Language Selector - Top Right */}
            <div className="fixed top-6 right-6 z-50">
                <LanguageSelector />
            </div>

            {/* Main content */}
            <div className="relative z-10">
                {/* Hero Section */}
                <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
                    <div className="space-y-8 animate-fade-in">
                        <div className="relative inline-block">
                            <EditableText
                                value={content.heroTitle}
                                onChange={(val) => updateContent('heroTitle', val)}
                                elementId="hero-title"
                                isSelected={isSelected('hero-title')}
                                onSelect={() => selectElement('hero-title', 'text')}
                                className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-pink-500 via-red-500 to-purple-600 bg-clip-text text-transparent drop-shadow-2xl animate-glow"
                                as="h1"
                            />
                            <EditableText
                                value={content.heroSubtitle}
                                onChange={(val) => updateContent('heroSubtitle', val)}
                                elementId="hero-subtitle"
                                isSelected={isSelected('hero-subtitle')}
                                onSelect={() => selectElement('hero-subtitle', 'text')}
                                className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent mt-4 animate-glow-delayed"
                            />
                        </div>

                        <EditableText
                            value={content.heroDescription}
                            onChange={(val) => updateContent('heroDescription', val)}
                            elementId="hero-desc"
                            isSelected={isSelected('hero-desc')}
                            onSelect={() => selectElement('hero-desc', 'text')}
                            className="text-xl md:text-2xl text-purple-800 max-w-2xl mx-auto leading-relaxed px-4"
                            as="p"
                        />

                        {/* Countdown Timer */}
                        <div
                            onClick={() => setShowDatePicker(true)}
                            className="mt-12 bg-white/20 backdrop-blur-xl border-2 border-white/40 rounded-3xl p-8 shadow-2xl max-w-2xl mx-auto hover:shadow-pink-300/50 transition-all duration-300 cursor-pointer group"
                        >
                            <h3 className="text-2xl md:text-3xl text-pink-600 mb-6 font-semibold flex items-center justify-center gap-2">
                                {content.countdownTitle}
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-sm">✏️</span>
                            </h3>
                            <div className="grid grid-cols-4 gap-4">
                                {[
                                    { label: 'Days', value: timeLeft.days },
                                    { label: 'Hours', value: timeLeft.hours },
                                    { label: 'Minutes', value: timeLeft.minutes },
                                    { label: 'Seconds', value: timeLeft.seconds }
                                ].map((item) => (
                                    <div key={item.label} className="bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl p-4 shadow-lg">
                                        <div className="text-3xl md:text-4xl text-white">
                                            {String(item.value).padStart(2, '0')}
                                        </div>
                                        <div className="text-sm text-white/90 mt-1">{item.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Private Memories Section */}
                <section className="py-20 px-6">
                    <div className="max-w-7xl mx-auto">
                        <EditableText
                            value={content.memoriesTitle}
                            onChange={(val) => updateContent('memoriesTitle', val)}
                            elementId="memories-title"
                            isSelected={isSelected('memories-title')}
                            onSelect={() => selectElement('memories-title', 'text')}
                            className="text-5xl md:text-6xl text-center mb-6 bg-gradient-to-r from-pink-600 via-purple-600 to-red-600 bg-clip-text text-transparent"
                            as="h2"
                        />
                        <EditableText
                            value={content.memoriesSubtitle}
                            onChange={(val) => updateContent('memoriesSubtitle', val)}
                            elementId="memories-subtitle"
                            isSelected={isSelected('memories-subtitle')}
                            onSelect={() => selectElement('memories-subtitle', 'text')}
                            className="text-center text-purple-700 text-xl mb-16 max-w-2xl mx-auto"
                            as="p"
                        />

                        {/* Photo Gallery Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {content.memories?.map((memory, index) => (
                                <div
                                    key={index}
                                    className="group relative animate-fade-in-up"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="bg-white p-4 rounded-3xl shadow-xl hover:shadow-pink-400/50 transition-all duration-500 hover:scale-105 hover:-rotate-1 transform">
                                        <div className="relative overflow-hidden rounded-2xl aspect-square">
                                            <EditableImage
                                                src={memory.url}
                                                alt={memory.caption}
                                                onChange={(url) => updateMemory(index, url)}
                                                elementId={`memory-${index}`}
                                                isSelected={isSelected(`memory-${index}`)}
                                                onSelect={() => selectElement(`memory-${index}`, 'image')}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-pink-600/80 to-transparent">
                                                <p className="text-center text-white">{memory.caption}</p>
                                            </div>
                                        </div>
                                        <div className="mt-3 flex justify-center gap-1">
                                            {[...Array(3)].map((_, i) => (
                                                <Heart key={i} className="w-4 h-4 text-pink-400 fill-pink-400" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Love Messages Timeline Section */}
                <section className="py-20 px-6">
                    <div className="max-w-4xl mx-auto">
                        <EditableText
                            value={content.timelineTitle}
                            onChange={(val) => updateContent('timelineTitle', val)}
                            elementId="timeline-title"
                            isSelected={isSelected('timeline-title')}
                            onSelect={() => selectElement('timeline-title', 'text')}
                            className="text-5xl md:text-6xl text-center mb-6 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-clip-text text-transparent"
                            as="h2"
                        />
                        <EditableText
                            value={content.timelineSubtitle}
                            onChange={(val) => updateContent('timelineSubtitle', val)}
                            elementId="timeline-subtitle"
                            isSelected={isSelected('timeline-subtitle')}
                            onSelect={() => selectElement('timeline-subtitle', 'text')}
                            className="text-center text-purple-700 text-xl mb-16"
                            as="p"
                        />

                        {/* Timeline */}
                        <div className="relative">
                            {/* Timeline line */}
                            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-400 via-purple-400 to-red-400 transform md:-translate-x-1/2" />

                            {/* Timeline items */}
                            {content.loveMessages?.map((item, index) => (
                                <div
                                    key={index}
                                    className={`relative mb-12 animate-fade-in-up cursor-pointer ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}
                                    style={{ animationDelay: `${index * 0.2}s` }}
                                    onClick={() => setEditingTimeline(index)}
                                >
                                    <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:ml-auto md:pl-12' : 'md:mr-auto md:pr-12'} pl-20 md:pl-0`}>
                                        <div className="bg-white/30 backdrop-blur-xl border-2 border-white/50 rounded-3xl p-6 shadow-xl hover:shadow-pink-400/50 transition-all duration-300 hover:scale-105 group">
                                            <div className="text-sm text-pink-600 mb-2 font-semibold flex items-center gap-2">
                                                {item.date}
                                                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs">✏️</span>
                                            </div>
                                            <p className="text-purple-900 leading-relaxed" style={{ fontFamily: 'cursive' }}>
                                                {item.message}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Timeline dot */}
                                    <div className="absolute left-8 md:left-1/2 top-6 transform -translate-x-1/2 w-6 h-6 bg-pink-500 rounded-full border-4 border-white shadow-lg animate-pulse" />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final message */}
                <section className="py-20 px-6">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="bg-white/20 backdrop-blur-xl border-2 border-white/40 rounded-3xl p-12 shadow-2xl">
                            <Heart className="w-16 h-16 text-red-500 fill-red-500 mx-auto mb-6 animate-pulse" />
                            <EditableText
                                value={content.finalHeading}
                                onChange={(val) => updateContent('finalHeading', val)}
                                elementId="final-heading"
                                isSelected={isSelected('final-heading')}
                                onSelect={() => selectElement('final-heading', 'text')}
                                className="text-4xl md:text-5xl text-transparent bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text mb-6"
                                as="h3"
                            />
                            <EditableText
                                value={content.finalMessage}
                                onChange={(val) => updateContent('finalMessage', val)}
                                elementId="final-message"
                                isSelected={isSelected('final-message')}
                                onSelect={() => selectElement('final-message', 'text')}
                                className="text-xl text-purple-800 leading-relaxed"
                                as="p"
                            />
                            <EditableText
                                value={content.finalSignature}
                                onChange={(val) => updateContent('finalSignature', val)}
                                elementId="final-signature"
                                isSelected={isSelected('final-signature')}
                                onSelect={() => selectElement('final-signature', 'text')}
                                className="mt-8 text-2xl text-pink-600"
                            />
                        </div>
                    </div>
                </section>

                {/* Extra spacing at bottom */}
                <div className="h-20" />
            </div>

            {/* Modals */}
            {showDatePicker && (
                <DatePicker
                    value={content.surpriseDate}
                    onChange={(date) => {
                        updateContent('surpriseDate', date);
                        setShowDatePicker(false);
                    }}
                    onClose={() => setShowDatePicker(false)}
                    title="Set Surprise Date"
                />
            )}

            {editingTimeline !== null && (
                <TimelineEditor
                    date={content.loveMessages[editingTimeline].date}
                    message={content.loveMessages[editingTimeline].message}
                    onSave={(date, message) => {
                        updateTimelineMessage(editingTimeline, date, message);
                        setEditingTimeline(null);
                    }}
                    onClose={() => setEditingTimeline(null)}
                    index={editingTimeline}
                />
            )}

            {/* Edit Controls */}
            {isEditMode && (
                <EditControls onExport={handleSave} onPublish={handlePublish} />
            )}



            <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(100vh) rotate(0deg);
          }
          50% {
            transform: translateY(-20vh) rotate(180deg);
          }
        }

        @keyframes float-balloon {
          0% {
            transform: translateY(100vh) translateX(0) rotate(0deg);
          }
          50% {
            transform: translateY(40vh) translateX(20px) rotate(10deg);
          }
          100% {
            transform: translateY(-20vh) translateX(-20px) rotate(-10deg);
          }
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.5);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes glow {
          0%, 100% {
            filter: drop-shadow(0 0 20px rgba(236, 72, 153, 0.6));
          }
          50% {
            filter: drop-shadow(0 0 40px rgba(236, 72, 153, 0.9));
          }
        }

        .animate-float {
          animation: float linear infinite;
        }

        .animate-float-balloon {
          animation: float-balloon linear infinite;
        }

        .animate-twinkle {
          animation: twinkle ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }

        .animate-glow-delayed {
          animation: glow 2s ease-in-out infinite;
          animation-delay: 0.5s;
        }
      `}</style>
        </div>
    );
}

export default function RoseBirthdayPage() {
    return (
        <LanguageProvider>
            <EditModeProvider>
                <BirthdayWebsiteContent />
            </EditModeProvider>
        </LanguageProvider>
    );
}

function BirthdayWebsiteContent() {
    const searchParams = useSearchParams();
    const projectId = searchParams.get('id');
    const updateProject = useUpdateWebProject(projectId || "");
    const createProject = useCreateWebProject();
    const { processPayment, isPreparing, isVerifying } = usePaymentFlow();

    const isLoading = updateProject.isPending || createProject.isPending || isPreparing || isVerifying;

    return (
        <BirthdayWebsite
            processPayment={processPayment}
            isLoading={isLoading}
        />
    );
}
