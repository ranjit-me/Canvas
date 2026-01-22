'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { FloatingHearts } from './components/FloatingHearts';
import { FallingPetals } from './components/FallingPetals';
import { PhotoGallery } from './components/PhotoGallery';
import { EditableText } from '@/app/(dashboard)/web/features/components/EditableText';
import { EditableImage } from '@/app/(dashboard)/web/features/components/EditableImage';
import { useEditMode, EditModeProvider } from '@/app/(dashboard)/web/features/hooks/useEditMode';
import { EditControls } from '@/app/(dashboard)/web/features/components/EditControls';
import { useGetWebProject } from '@/features/web-projects/api/use-get-web-project';
import { useCreateWebProject } from '@/features/web-projects/api/use-create-web-project';
import { useUpdateWebProject } from '@/features/web-projects/api/use-update-web-project';
import { useRouter } from 'next/navigation';
import { usePaymentFlow } from '@/features/payments/hooks/use-payment-flow';
import { T } from '@/components/translated-text';
import { useTranslate } from '@/hooks/use-translate';

export function DreamyPinkParadise({
    initialData,
    processPayment,
    isLoading
}: {
    initialData?: any;
    processPayment: any;
    isLoading: boolean;
}) {
    const searchParams = useSearchParams();
    const { setEditMode, isEditMode } = useEditMode();
    const router = useRouter();
    const projectId = searchParams.get('id');
    const { data: projectData, isLoading: projectLoading } = useGetWebProject(projectId || "");

    // Use initialData if provided (for public view), otherwise use projectData (for editor)
    const activeProjectData = initialData || projectData;

    const createProject = useCreateWebProject();
    const updateProject = useUpdateWebProject(projectId || "");
    const [showLoveTest, setShowLoveTest] = useState(true);
    const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
    const [showHeartBurst, setShowHeartBurst] = useState(false);
    const [showKissBurst, setShowKissBurst] = useState(false);
    const [selectedElement, setSelectedElement] = useState<string | null>(null);

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

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

    // Content state
    const [content, setContent] = useState({
        loveTestTitle: "Hey Love… 💕",
        loveQuestion: "Do you love me?",
        birthdayTitle: "Happy Birthday My Love 🎉💖",
        birthdaySubtitle1: "Today isn't just your birthday…",
        birthdaySubtitle2: "It's the day the world became more beautiful.",
        memoriesTitle: "Our Beautiful Memories 📸",
        letterTitle: "💌 A Letter to You",
        message: `You are my smile on sad days,
my peace in chaos,
my forever favorite person.
I'm so lucky to love you.`,
        foreverTitle: "This love is forever ♾️",
        foreverSubtitle: "Just like us 💑",
        kissButtonText: "Tap for a Kiss 💋",
        photos: [
            'https://images.unsplash.com/photo-1514846528774-8de9d4a07023?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMGNvdXBsZSUyMGxvdmV8ZW58MXx8fHwxNzY1NzYyNDk3fDA&ixlib=rb-4.1.0&q=80&w=1080',
            'https://images.unsplash.com/photo-1658851866325-49fb8b7fbcb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMHN1bnNldCUyMGNvdXBsZXxlbnwxfHx8fDE3NjU3MDEwMjB8MA&ixlib=rb-4.1.0&q=80&w=1080',
            'https://images.unsplash.com/photo-1673266968729-48a2c829105f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGNvdXBsZSUyMHNtaWxpbmd8ZW58MXx8fHwxNzY1ODA0ODM5fDA&ixlib=rb-4.1.0&q=80&w=1080',
            'https://images.unsplash.com/photo-1696613755401-dac200797436?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaW5rJTIwcm9zZXMlMjBmbG93ZXJzfGVufDF8fHx8MTc2NTgwNDgzOHww&ixlib=rb-4.1.0&q=80&w=1080',
            'https://images.unsplash.com/photo-1694503522904-50163a3e7141?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb3ZlJTIwaGVhcnQlMjBib2tlaHxlbnwxfHx8fDE3NjU2OTA5Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
            'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ0aGRheSUyMGNlbGVicmF0aW9ufGVufDF8fHx8MTc2NTc3Mzk0M3ww&ixlib=rb-4.1.0&q=80&w=1080',
        ]
    });

    // Populate content from database if available
    useEffect(() => {
        if (activeProjectData && activeProjectData.json) {
            try {
                const parsedContent = JSON.parse(activeProjectData.json);
                setContent(prev => ({ ...prev, ...parsedContent }));
                // If it's a loaded project, skip the love test
                setShowLoveTest(false);
            } catch (e) {
                console.error("Failed to parse project content", e);
            }
        }
    }, [activeProjectData]);

    const moveNoButton = () => {
        const randomX = Math.random() * 60 - 30;
        const randomY = Math.random() * 60 - 30;
        setNoButtonPosition({ x: randomX, y: randomY });
    };

    const handleYesClick = () => {
        setShowHeartBurst(true);
        setTimeout(() => {
            setShowLoveTest(false);
        }, 1000);
    };

    const handleKissClick = () => {
        setShowKissBurst(true);
        setTimeout(() => setShowKissBurst(false), 2000);
    };

    const updateContent = (key: string, value: string) => {
        setContent(prev => ({ ...prev, [key]: value }));
    };

    const updatePhoto = (index: number, url: string) => {
        setContent(prev => ({
            ...prev,
            photos: prev.photos.map((p, i) => i === index ? url : p)
        }));
    };

    const handleExport = () => {
        const dataStr = JSON.stringify(content, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'dreamy-pink-paradise-content.json';
        link.click();
        URL.revokeObjectURL(url);
        alert('✅ Content exported successfully!');
    };

    const handlePublish = async () => {
        const name = content.birthdayTitle.replace(/[🎉💖]/g, '').trim() || 'My Love';
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
                templateId: 'dreamy-pink-paradise',
                json,
                slug,
                country,
                isPublished: true,
            }, {
                onSuccess: (data: any) => {
                    const id = data.data.id;
                    const price = projectData?.templatePrice || 69;
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
                name: `Birthday for ${content.birthdayTitle.replace(/[🎉💖]/g, '').trim() || 'My Love'}`,
                templateId: 'dreamy-pink-paradise',
                json,
            }, {
                onSuccess: (data: any) => {
                    const id = data.data.id;
                    const price = projectData?.templatePrice || 69;
                    processPayment({
                        amount: price,
                        projectId: id,
                        onSuccess: () => {
                            router.push(`/web/birthday/girlfriend/dreamy-pink-paradise?id=${id}`);
                        }
                    });
                }
            });
        }
    };



    return (
        <div className="relative min-h-screen overflow-hidden" onClick={() => setSelectedElement(null)}>
            <AnimatePresence mode="wait">
                {showLoveTest ? (
                    <motion.div
                        key="love-test"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.8 }}
                        className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-pink-300 via-purple-300 to-pink-400"
                    >
                        <FloatingHearts count={15} />

                        {/* Sparkle effects */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            {isMounted && [...Array(20)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute"
                                    initial={{
                                        opacity: 0,
                                        scale: 0,
                                        x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : 0,
                                        y: typeof window !== 'undefined' ? Math.random() * window.innerHeight : 0
                                    }}
                                    animate={{
                                        opacity: [0, 1, 0],
                                        scale: [0, 1, 0],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: Math.random() * 2,
                                    }}
                                >
                                    <Sparkles className="text-yellow-200" size={16} />
                                </motion.div>
                            ))}
                        </div>

                        <div className="text-center z-10 px-4">
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.3, type: "spring", bounce: 0.5 }}
                            >
                                <EditableText
                                    value={content.loveTestTitle}
                                    onChange={(val) => updateContent('loveTestTitle', val)}
                                    elementId="love-test-title"
                                    isSelected={selectedElement === 'love-test-title'}
                                    onSelect={() => setSelectedElement('love-test-title')}
                                    className="text-5xl md:text-7xl mb-8 text-white"
                                    as="h1"
                                />
                                <EditableText
                                    value={content.loveQuestion}
                                    onChange={(val) => updateContent('loveQuestion', val)}
                                    elementId="love-question"
                                    isSelected={selectedElement === 'love-question'}
                                    onSelect={() => setSelectedElement('love-question')}
                                    className="text-3xl md:text-4xl mb-12 text-white"
                                    as="p"
                                />
                            </motion.div>

                            <motion.div
                                className="flex flex-col sm:flex-row gap-6 items-center justify-center"
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                <motion.button
                                    onClick={handleYesClick}
                                    className="px-12 py-4 bg-pink-500 hover:bg-pink-600 text-white rounded-full shadow-lg text-2xl transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <T>Yes</T> 💖
                                </motion.button>

                                <motion.button
                                    onMouseEnter={moveNoButton}
                                    className="px-12 py-4 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-full shadow-lg text-2xl relative"
                                    animate={{
                                        x: `${noButtonPosition.x}vw`,
                                        y: `${noButtonPosition.y}vh`,
                                    }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                    style={{ cursor: 'pointer' }}
                                    title="Oops… you can't say no 😆"
                                >
                                    <T>No</T> 😜
                                </motion.button>
                            </motion.div>
                        </div>

                        {/* Heart burst animation */}
                        <AnimatePresence>
                            {showHeartBurst && (
                                <div className="fixed inset-0 pointer-events-none z-50">
                                    {[...Array(30)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className="absolute top-1/2 left-1/2"
                                            initial={{
                                                x: 0,
                                                y: 0,
                                                scale: 1,
                                                opacity: 1
                                            }}
                                            animate={{
                                                x: (Math.random() - 0.5) * 1000,
                                                y: (Math.random() - 0.5) * 1000,
                                                scale: 0,
                                                opacity: 0
                                            }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                        >
                                            <Heart className="text-red-500 fill-red-500" size={24} />
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </AnimatePresence>
                    </motion.div >
                ) : (
                    <motion.div
                        key="birthday-page"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                        className="min-h-screen bg-gradient-to-br from-rose-900 via-purple-900 to-pink-900"
                    >
                        {isMounted && (
                            <>
                                <FallingPetals />
                                <FloatingHearts count={20} />
                            </>
                        )}

                        {/* Birthday Reveal Section */}
                        <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20 relative">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                className="text-center mb-12"
                            >
                                <EditableText
                                    value={content.birthdayTitle}
                                    onChange={(val) => updateContent('birthdayTitle', val)}
                                    elementId="birthday-title"
                                    isSelected={selectedElement === 'birthday-title'}
                                    onSelect={() => setSelectedElement('birthday-title')}
                                    className="text-5xl md:text-7xl lg:text-8xl mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-300 to-purple-300"
                                    as="h1"
                                />

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1.2 }}
                                    className="text-xl md:text-2xl text-pink-100 max-w-2xl mx-auto leading-relaxed"
                                >
                                    <EditableText
                                        value={content.birthdaySubtitle1}
                                        onChange={(val) => updateContent('birthdaySubtitle1', val)}
                                        elementId="birthday-subtitle-1"
                                        isSelected={selectedElement === 'birthday-subtitle-1'}
                                        onSelect={() => setSelectedElement('birthday-subtitle-1')}
                                        className="mb-2"
                                        as="p"
                                    />
                                    <EditableText
                                        value={content.birthdaySubtitle2}
                                        onChange={(val) => updateContent('birthdaySubtitle2', val)}
                                        elementId="birthday-subtitle-2"
                                        isSelected={selectedElement === 'birthday-subtitle-2'}
                                        onSelect={() => setSelectedElement('birthday-subtitle-2')}
                                        className=""
                                        as="p"
                                    />
                                </motion.div>
                            </motion.div>

                            {/* Decorative lights */}
                            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                {isMounted && [...Array(15)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute w-3 h-3 rounded-full bg-yellow-300"
                                        style={{
                                            left: `${(i * 7) % 100}%`,
                                            top: `${(i * 13) % 100}%`,
                                        }}
                                        animate={{
                                            opacity: [0.3, 1, 0.3],
                                            scale: [1, 1.5, 1],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            delay: i * 0.2,
                                        }}
                                    />
                                ))}
                            </div>
                        </section>

                        {/* Memories Section - with editable photos */}
                        <section className="py-20 px-4 relative">
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                            >
                                <div style={{ fontFamily: 'Brush Script MT, cursive' }}>
                                    <EditableText
                                        value={content.memoriesTitle}
                                        onChange={(val) => updateContent('memoriesTitle', val)}
                                        elementId="memories-title"
                                        isSelected={selectedElement === 'memories-title'}
                                        onSelect={() => setSelectedElement('memories-title')}
                                        className="text-4xl md:text-5xl text-center mb-16 text-pink-200"
                                        as="h2"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                                    {content.photos?.map((photo, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, scale: 0.8, y: 50 }}
                                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{
                                                delay: index * 0.15,
                                                duration: 0.6,
                                                type: "spring"
                                            }}
                                            whileHover={{ scale: 1.05, rotate: Math.random() * 4 - 2 }}
                                            className="relative group"
                                        >
                                            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                                                <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-rose-400 to-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10" />

                                                <div className="relative p-2 bg-gradient-to-br from-pink-300 via-rose-300 to-purple-300 rounded-2xl">
                                                    <div className="relative overflow-hidden rounded-xl aspect-square">
                                                        <EditableImage
                                                            src={photo}
                                                            alt={`Memory ${index + 1}`}
                                                            onChange={(url) => updatePhoto(index, url)}
                                                            elementId={`photo-${index}`}
                                                            isSelected={selectedElement === `photo-${index}`}
                                                            onSelect={() => setSelectedElement(`photo-${index}`)}
                                                            className="w-full h-full object-cover"
                                                        />

                                                        <div className="absolute inset-0 bg-gradient-to-t from-pink-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                    </div>
                                                </div>

                                                <div className="absolute top-4 right-4 text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    💖
                                                </div>
                                                <div className="absolute bottom-4 left-4 text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    💕
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </section>

                        {/* Romantic Message Section */}
                        <section className="py-20 px-4 relative min-h-screen flex items-center justify-center">
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1 }}
                                className="max-w-3xl mx-auto text-center relative"
                            >
                                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl border border-pink-300/30">
                                    <div style={{ fontFamily: 'Brush Script MT, cursive' }}>
                                        <EditableText
                                            value={content.letterTitle}
                                            onChange={(val) => updateContent('letterTitle', val)}
                                            elementId="letter-title"
                                            isSelected={selectedElement === 'letter-title'}
                                            onSelect={() => setSelectedElement('letter-title')}
                                            className="text-3xl md:text-4xl mb-8 text-pink-200"
                                            as="h2"
                                        />
                                    </div>

                                    <EditableText
                                        value={content.message}
                                        onChange={(val) => updateContent('message', val)}
                                        elementId="romantic-message"
                                        isSelected={selectedElement === 'romantic-message'}
                                        onSelect={() => setSelectedElement('romantic-message')}
                                        className="text-xl md:text-2xl text-pink-50 leading-relaxed whitespace-pre-line"
                                        as="div"
                                    />

                                    {/* Floating heart emojis */}
                                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                        {['❤️', '💕', '💖', '💗', '💝'].map((emoji, i) => (
                                            <motion.div
                                                key={i}
                                                className="absolute text-3xl"
                                                style={{
                                                    left: `${20 + i * 15}%`,
                                                    top: `${30 + (i % 2) * 40}%`,
                                                }}
                                                animate={{
                                                    y: [-20, 20, -20],
                                                    scale: [1, 1.2, 1],
                                                    opacity: [0.5, 1, 0.5],
                                                }}
                                                transition={{
                                                    duration: 3,
                                                    repeat: Infinity,
                                                    delay: i * 0.5,
                                                }}
                                            >
                                                {emoji}
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </section>

                        {/* Final Surprise Section */}
                        <section className="py-20 px-4 pb-32 relative">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="text-center"
                            >
                                <motion.div
                                    animate={{
                                        scale: [1, 1.05, 1],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                    }}
                                    style={{ fontFamily: 'Brush Script MT, cursive' }}
                                >
                                    <EditableText
                                        value={content.foreverTitle}
                                        onChange={(val) => updateContent('foreverTitle', val)}
                                        elementId="forever-title"
                                        isSelected={selectedElement === 'forever-title'}
                                        onSelect={() => setSelectedElement('forever-title')}
                                        className="text-4xl md:text-6xl mb-6 text-pink-200"
                                        as="h2"
                                    />
                                </motion.div>
                                <EditableText
                                    value={content.foreverSubtitle}
                                    onChange={(val) => updateContent('foreverSubtitle', val)}
                                    elementId="forever-subtitle"
                                    isSelected={selectedElement === 'forever-subtitle'}
                                    onSelect={() => setSelectedElement('forever-subtitle')}
                                    className="text-2xl md:text-3xl text-pink-100 mb-12"
                                    as="p"
                                />

                                <div>
                                    <EditableText
                                        value={content.kissButtonText}
                                        onChange={(val) => updateContent('kissButtonText', val)}
                                        elementId="kiss-button-text"
                                        isSelected={selectedElement === 'kiss-button-text'}
                                        onSelect={() => setSelectedElement('kiss-button-text')}
                                        className=""
                                        as="div"
                                    />
                                    <motion.button
                                        onClick={handleKissClick}
                                        className="relative px-16 py-6 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full text-2xl md:text-3xl shadow-2xl overflow-hidden mt-4"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        animate={{
                                            boxShadow: [
                                                '0 0 20px rgba(236, 72, 153, 0.5)',
                                                '0 0 40px rgba(236, 72, 153, 0.8)',
                                                '0 0 20px rgba(236, 72, 153, 0.5)',
                                            ],
                                        }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        <T>{content.kissButtonText}</T>
                                    </motion.button>
                                </div>

                                {/* Kiss burst animation */}
                                <AnimatePresence>
                                    {showKissBurst && (
                                        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
                                            {[...Array(40)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    className="absolute text-4xl"
                                                    initial={{
                                                        x: 0,
                                                        y: 0,
                                                        scale: 1,
                                                        opacity: 1,
                                                        rotate: 0
                                                    }}
                                                    animate={{
                                                        x: (Math.random() - 0.5) * 1200,
                                                        y: (Math.random() - 0.5) * 1200,
                                                        scale: 0,
                                                        opacity: 0,
                                                        rotate: Math.random() * 360
                                                    }}
                                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                                >
                                                    {['💋', '💕', '❤️', '💖'][i % 4]}
                                                </motion.div>
                                            ))}

                                            {/* Center text */}
                                            <motion.div
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1.5, opacity: 1 }}
                                                exit={{ scale: 0, opacity: 0 }}
                                                className="text-6xl md:text-8xl"
                                            >
                                                😘
                                            </motion.div>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </section>
                    </motion.div>
                )
                }
            </AnimatePresence >

            {/* Edit Controls */}
            {isEditMode && (
                <EditControls onExport={handleSave} onPublish={handlePublish} />
            )}

        </div >
    );
}

// Main App component
export default function DreamyPinkParadisePage() {
    return (
        <EditModeProvider>
            <BirthdayWebsiteContent />
        </EditModeProvider>
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
        <DreamyPinkParadise
            processPayment={processPayment}
            isLoading={isLoading}
        />
    );
}
