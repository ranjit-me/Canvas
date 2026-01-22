"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { EditableText } from '@/app/(dashboard)/web/features/components/EditableText';
import { EditableImage } from '@/app/(dashboard)/web/features/components/EditableImage';
import { useEditMode, EditModeProvider } from '@/app/(dashboard)/web/features/hooks/useEditMode';
import { EditControls } from '@/app/(dashboard)/web/features/components/EditControls';
import { useGetWebProject } from '@/features/web-projects/api/use-get-web-project';
import { useCreateWebProject } from '@/features/web-projects/api/use-create-web-project';
import { useUpdateWebProject } from '@/features/web-projects/api/use-update-web-project';
import { usePaymentFlow } from '@/features/payments/hooks/use-payment-flow';
import { useSearchParams, useRouter } from 'next/navigation';
import { PublishDialog } from '../../components/publish-dialog';
import { T } from '@/components/translated-text';

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7;

interface UnlockedCard {
    id: number;
    unlocked: boolean;
}

export function MidnightPromiseTemplate({
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
    const { selectElement, isSelected, setEditMode, isEditMode } = useEditMode();

    const projectId = searchParams.get('id');
    const { data: projectData, isLoading: projectLoading } = useGetWebProject(projectId || "");
    const activeProjectData = initialData || projectData;

    const createProject = useCreateWebProject();
    const updateProject = useUpdateWebProject(projectId || "");

    const [currentStep, setCurrentStep] = useState<Step>(1);
    const [messageText, setMessageText] = useState('');
    const [showNextButton, setShowNextButton] = useState(false);
    const [countdown, setCountdown] = useState<number | null>(null);
    const [unlockedCards, setUnlockedCards] = useState<UnlockedCard[]>([
        { id: 1, unlocked: false },
        { id: 2, unlocked: false },
        { id: 3, unlocked: false },
    ]);
    const [allCardsUnlocked, setAllCardsUnlocked] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showPublishDialog, setShowPublishDialog] = useState(false);

    // Content state for editing
    const [content, setContent] = useState({
        step2Title: "Hey love… today is not an ordinary day ❤️",
        step2MessageTitle: "You Have a Message",
        step2Message: "Someone special was born today…\nand that someone changed my life forever 💫",
        step3Title: "Do You Remember This?",
        step3Image: "https://images.unsplash.com/photo-1658851866325-49fb8b7fbcb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMGNvdXBsZSUyMHN1bnNldHxlbnwxfHx8fDE3NjY3MTMzMjl8MA&ixlib=rb-4.1.0&q=80&w=1080",
        step3Caption: "This moment… my favorite one 💕",
        step6Title: "HAPPY BIRTHDAY\nMY LOVE ❤️",
        step6Message: "May all your dreams come true…\nand may I always be by your side.",
        step7Message: "This is just one birthday…\nI'm excited for all the birthdays\nwe'll celebrate together.",
        step7Signature: "[Your Name]"
    });

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

    // Load content from project data
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

    const handleSave = async () => {
        const json = JSON.stringify(content);
        if (projectId) {
            updateProject.mutate({ json });
        } else {
            createProject.mutate({
                name: `Midnight Promise Birthday`,
                templateId: 'midnight-promise',
                json,
            }, {
                onSuccess: (data: any) => {
                    const id = data.data.id;
                    const price = projectData?.templatePrice || 399;
                    processPayment({
                        amount: price,
                        projectId: id,
                        onSuccess: () => {
                            router.push(`/web/templates/midnight-promise-girlfriend?id=${id}`);
                        }
                    });
                }
            });
        }
    };

    const handlePublish = async (slug: string) => {
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
                name: `Midnight Promise Birthday`,
                templateId: 'midnight-promise',
                json,
                slug,
                country,
                isPublished: true,
            }, {
                onSuccess: (data: any) => {
                    const id = data.data.id;
                    const price = projectData?.templatePrice || 399;
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

    const handleExport = () => {
        const dataStr = JSON.stringify(content, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'midnight-promise-content.json';
        link.click();
        URL.revokeObjectURL(url);
        alert('✅ Content exported successfully!');
    };

    // Full message text for step 2
    const fullMessage = content.step2Message;

    // Typing effect for step 2
    useEffect(() => {
        if (currentStep === 2) {
            let index = 0;
            setMessageText('');
            setShowNextButton(false);

            const interval = setInterval(() => {
                if (index < fullMessage.length) {
                    setMessageText(fullMessage.slice(0, index + 1));
                    index++;
                } else {
                    clearInterval(interval);
                    setShowNextButton(true);
                }
            }, 50);

            return () => clearInterval(interval);
        }
    }, [currentStep]);

    // Countdown for step 5
    useEffect(() => {
        if (currentStep === 5 && countdown === null) {
            setCountdown(3);
        }

        if (countdown !== null && countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown, currentStep]);

    // Check if all cards are unlocked
    useEffect(() => {
        const allUnlocked = unlockedCards.every(card => card.unlocked);
        setAllCardsUnlocked(allUnlocked);
    }, [unlockedCards]);

    // Trigger confetti on step 6
    useEffect(() => {
        if (currentStep === 6 && !showConfetti) {
            setShowConfetti(true);
            const duration = 3000;
            const end = Date.now() + duration;

            const frame = () => {
                confetti({
                    particleCount: 5,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#ff0000', '#ff69b4', '#ff1493', '#ffc0cb']
                });
                confetti({
                    particleCount: 5,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#ff0000', '#ff69b4', '#ff1493', '#ffc0cb']
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            };
            frame();
        }
    }, [currentStep, showConfetti]);

    const handleTurnOnLights = () => {
        setCurrentStep(2);
    };

    const handleUnlockCard = (id: number) => {
        setUnlockedCards(prev =>
            prev.map(card =>
                card.id === id ? { ...card, unlocked: true } : card
            )
        );
    };

    const cardData = [
        {
            id: 1,
            icon: '💬',
            title: 'First Talk',
            content: 'I remember our first conversation… it felt like I\'d known you forever. Every word, every laugh, it all just clicked. ✨',
            image: 'https://images.unsplash.com/photo-1619208110262-90c0438c174d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VwbGUlMjBsYXVnaGluZyUyMGhhcHB5fGVufDF8fHx8MTc2Njc0MDk2M3ww&ixlib=rb-4.1.0&q=80&w=1080'
        },
        {
            id: 2,
            icon: '💕',
            title: 'First Date',
            content: 'That night was magical. I was nervous, excited, and completely captivated by you. I knew then that you were someone special. 🌟',
            image: 'https://images.unsplash.com/photo-1615500025837-cf3a8716c83d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMGRpbm5lciUyMGRhdGV8ZW58MXx8fHwxNzY2NjQyNDU0fDA&ixlib=rb-4.1.0&q=80&w=1080'
        },
        {
            id: 3,
            icon: '📸',
            title: 'Favorite Memory',
            content: 'Every moment with you is my favorite. But if I had to choose… it\'s the way you smile when you look at me. That\'s everything. 💖',
            image: 'https://images.unsplash.com/photo-1766098585092-f35f2ab732da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VwbGUlMjBtZW1vcmllcyUyMHRvZ2V0aGVyfGVufDF8fHx8MTc2Njc0MDk2NHww&ixlib=rb-4.1.0&q=80&w=1080'
        }
    ];

    return (
        <div className="min-h-screen flex items-center justify-center overflow-hidden relative">
            <AnimatePresence mode="wait">
                {/* STEP 1: Turn on the Lights */}
                {currentStep === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black flex items-center justify-center"
                    >
                        <motion.button
                            onClick={handleTurnOnLights}
                            className="px-12 py-6 bg-white/10 border-2 border-white/30 rounded-full backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="text-white text-xl">🔘 <T>Turn on the lights</T></span>
                        </motion.button>
                    </motion.div>
                )}

                {/* STEP 2: You Have a Message */}
                {currentStep === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-gradient-to-br from-rose-100 via-pink-100 to-red-100 flex flex-col items-center justify-center p-8"
                    >
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-center space-y-8 max-w-2xl"
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                <EditableText
                                    value={content.step2Title}
                                    onChange={(val) => updateContent('step2Title', val)}
                                    elementId="step2-title"
                                    isSelected={isSelected('step2-title')}
                                    onSelect={() => selectElement('step2-title', 'text')}
                                    className="text-pink-600 text-4xl font-bold"
                                    as="h1"
                                />
                            </motion.div>

                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 1 }}
                                className="bg-white rounded-3xl shadow-xl p-12 space-y-8"
                            >
                                <div className="flex items-center justify-center gap-3">
                                    <span className="text-4xl">📩</span>
                                    <EditableText
                                        value={content.step2MessageTitle}
                                        onChange={(val) => updateContent('step2MessageTitle', val)}
                                        elementId="step2-message-title"
                                        isSelected={isSelected('step2-message-title')}
                                        onSelect={() => selectElement('step2-message-title', 'text')}
                                        className="text-gray-800 text-2xl font-bold"
                                        as="h2"
                                    />
                                </div>

                                <EditableText
                                    value={messageText}
                                    onChange={(val) => updateContent('step2Message', val)}
                                    elementId="step2-message"
                                    isSelected={isSelected('step2-message')}
                                    onSelect={() => selectElement('step2-message', 'text')}
                                    className="text-gray-700 whitespace-pre-line min-h-[4em] text-lg"
                                    as="p"
                                />

                                {showNextButton && (
                                    <motion.button
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        onClick={() => setCurrentStep(3)}
                                        className="px-8 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors font-semibold"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <T>Next</T> →
                                    </motion.button>
                                )}
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}

                {/* STEP 3: Do You Remember This? */}
                {currentStep === 3 && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 flex flex-col items-center justify-center p-8"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="max-w-2xl space-y-8 text-center"
                        >
                            <EditableText
                                value={content.step3Title}
                                onChange={(val) => updateContent('step3Title', val)}
                                elementId="step3-title"
                                isSelected={isSelected('step3-title')}
                                onSelect={() => selectElement('step3-title', 'text')}
                                className="text-pink-600 text-4xl font-bold"
                                as="h2"
                            />

                            <motion.div
                                initial={{ filter: 'blur(20px)', opacity: 0 }}
                                animate={{ filter: 'blur(0px)', opacity: 1 }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="rounded-3xl overflow-hidden shadow-2xl"
                            >
                                <EditableImage
                                    src={content.step3Image}
                                    alt="Romantic moment"
                                    onChange={(url) => updateContent('step3Image', url)}
                                    elementId="step3-image"
                                    isSelected={isSelected('step3-image')}
                                    onSelect={() => selectElement('step3-image', 'image')}
                                    className="w-full h-96 object-cover"
                                />
                            </motion.div>

                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 1.5 }}
                            >
                                <EditableText
                                    value={content.step3Caption}
                                    onChange={(val) => updateContent('step3Caption', val)}
                                    elementId="step3-caption"
                                    isSelected={isSelected('step3-caption')}
                                    onSelect={() => selectElement('step3-caption', 'text')}
                                    className="text-pink-600 italic text-2xl"
                                    as="p"
                                />
                            </motion.div>

                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 2 }}
                                onClick={() => setCurrentStep(4)}
                                className="px-10 py-4 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full hover:shadow-lg transition-all font-semibold"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Relive More Memories
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}

                {/* STEP 4: Memory Unlock */}
                {currentStep === 4 && (
                    <motion.div
                        key="step4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 flex flex-col items-center justify-center p-8 overflow-auto"
                    >
                        <div className="max-w-5xl w-full space-y-12 py-8">
                            <h2 className="text-pink-600 text-center text-4xl font-bold">Memory Unlock 🔓</h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {cardData.map((card, index) => {
                                    const isUnlocked = unlockedCards[index].unlocked;

                                    return (
                                        <motion.div
                                            key={card.id}
                                            initial={{ y: 50, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: index * 0.2 }}
                                        >
                                            <motion.button
                                                onClick={() => handleUnlockCard(card.id)}
                                                disabled={isUnlocked}
                                                className={`w-full h-full min-h-[400px] rounded-3xl p-8 transition-all ${isUnlocked
                                                    ? 'bg-white shadow-xl cursor-default'
                                                    : 'bg-white/50 backdrop-blur-sm border-2 border-dashed border-pink-300 hover:border-pink-500 cursor-pointer'
                                                    }`}
                                                whileHover={!isUnlocked ? { scale: 1.02 } : {}}
                                                whileTap={!isUnlocked ? { scale: 0.98 } : {}}
                                            >
                                                {!isUnlocked ? (
                                                    <div className="flex flex-col items-center justify-center h-full space-y-6">
                                                        <motion.span
                                                            animate={{ rotate: [0, 10, -10, 0] }}
                                                            transition={{ duration: 2, repeat: Infinity }}
                                                            className="text-6xl"
                                                        >
                                                            🔒
                                                        </motion.span>
                                                        <p className="text-gray-600 font-semibold text-lg">{card.title}</p>
                                                        <p className="text-sm text-gray-400">Click to unlock</p>
                                                    </div>
                                                ) : (
                                                    <motion.div
                                                        initial={{ scale: 0.8, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        className="space-y-4 h-full flex flex-col"
                                                    >
                                                        <motion.div
                                                            initial={{ y: -20, opacity: 0 }}
                                                            animate={{ y: 0, opacity: 1 }}
                                                            transition={{ delay: 0.2 }}
                                                        >
                                                            <span className="text-5xl">{card.icon}</span>
                                                        </motion.div>

                                                        <h3 className="text-pink-600 font-bold text-xl">{card.title}</h3>

                                                        <motion.div
                                                            initial={{ scale: 0.9, opacity: 0 }}
                                                            animate={{ scale: 1, opacity: 1 }}
                                                            transition={{ delay: 0.3 }}
                                                            className="rounded-2xl overflow-hidden flex-grow"
                                                        >
                                                            <ImageWithFallback
                                                                src={card.image}
                                                                alt={card.title}
                                                                className="w-full h-40 object-cover"
                                                            />
                                                        </motion.div>

                                                        <motion.p
                                                            initial={{ y: 20, opacity: 0 }}
                                                            animate={{ y: 0, opacity: 1 }}
                                                            transition={{ delay: 0.4 }}
                                                            className="text-gray-700 text-sm flex-grow"
                                                        >
                                                            {card.content}
                                                        </motion.p>

                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: [0, 1.2, 1] }}
                                                            transition={{ delay: 0.5, duration: 0.5 }}
                                                            className="text-4xl"
                                                        >
                                                            ❤️
                                                        </motion.div>
                                                    </motion.div>
                                                )}
                                            </motion.button>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {allCardsUnlocked && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex justify-center"
                                >
                                    <button
                                        onClick={() => setCurrentStep(5)}
                                        className="px-12 py-4 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full hover:shadow-lg transition-all font-semibold"
                                    >
                                        Continue →
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* STEP 5: Close Your Eyes */}
                {currentStep === 5 && (
                    <motion.div
                        key="step5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 flex items-center justify-center"
                    >
                        <div className="text-center space-y-12">
                            {countdown !== null && countdown > 0 ? (
                                <>
                                    <motion.h2
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="text-white text-3xl font-bold"
                                    >
                                        Close your eyes… and feel this moment ✨
                                    </motion.h2>

                                    <motion.div
                                        key={countdown}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: [0, 1.2, 1], opacity: 1 }}
                                        className="text-white text-9xl font-black"
                                    >
                                        {countdown}
                                    </motion.div>
                                </>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 1 }}
                                    className="space-y-8"
                                >
                                    <motion.p
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 1 }}
                                        className="text-white text-3xl max-w-2xl mx-auto px-8"
                                    >
                                        "You are the best thing that ever happened to me."
                                    </motion.p>

                                    <motion.button
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 2 }}
                                        onClick={() => setCurrentStep(6)}
                                        className="px-12 py-4 bg-white text-pink-600 rounded-full hover:bg-pink-50 transition-all font-semibold"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Open Your Eyes
                                    </motion.button>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* STEP 6: The Big Wish */}
                {currentStep === 6 && (
                    <motion.div
                        key="step6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-gradient-to-br from-pink-100 via-red-100 to-rose-100 flex items-center justify-center"
                    >
                        <div className="text-center space-y-12 px-8">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', duration: 1 }}
                            >
                                <span className="text-9xl">🎁</span>
                            </motion.div>

                            <motion.div
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="space-y-6"
                            >
                                <motion.div
                                    animate={{
                                        scale: [1, 1.05, 1],
                                        color: ['#ec4899', '#ef4444', '#ec4899']
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <EditableText
                                        value={content.step6Title}
                                        onChange={(val) => updateContent('step6Title', val)}
                                        elementId="step6-title"
                                        isSelected={isSelected('step6-title')}
                                        onSelect={() => selectElement('step6-title', 'text')}
                                        className="text-6xl md:text-8xl font-black whitespace-pre-line"
                                        as="h1"
                                    />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1 }}
                                >
                                    <EditableText
                                        value={content.step6Message}
                                        onChange={(val) => updateContent('step6Message', val)}
                                        elementId="step6-message"
                                        isSelected={isSelected('step6-message')}
                                        onSelect={() => selectElement('step6-message', 'text')}
                                        className="text-2xl text-pink-600 max-w-2xl mx-auto whitespace-pre-line"
                                        as="p"
                                    />
                                </motion.div>
                            </motion.div>

                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 2 }}
                                onClick={() => setCurrentStep(7)}
                                className="px-12 py-4 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full hover:shadow-lg transition-all font-semibold"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                One More Thing...
                            </motion.button>
                        </div>
                    </motion.div>
                )}

                {/* STEP 7: Final Promise */}
                {currentStep === 7 && (
                    <motion.div
                        key="step7"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 flex items-center justify-center p-8"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1 }}
                            className="max-w-3xl text-center space-y-12"
                        >
                            <motion.div
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <span className="text-8xl">💍</span>
                            </motion.div>

                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="space-y-8"
                            >
                                <EditableText
                                    value={content.step7Message}
                                    onChange={(val) => updateContent('step7Message', val)}
                                    elementId="step7-message"
                                    isSelected={isSelected('step7-message')}
                                    onSelect={() => selectElement('step7-message', 'text')}
                                    className="text-3xl text-gray-700 leading-relaxed whitespace-pre-line"
                                    as="p"
                                />

                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 1, type: 'spring' }}
                                    className="space-y-4 pt-8"
                                >
                                    <p className="text-xl text-pink-600 italic">Forever yours,</p>
                                    <EditableText
                                        value={content.step7Signature}
                                        onChange={(val) => updateContent('step7Signature', val)}
                                        elementId="step7-signature"
                                        isSelected={isSelected('step7-signature')}
                                        onSelect={() => selectElement('step7-signature', 'text')}
                                        className="text-2xl text-pink-700 font-bold"
                                        as="p"
                                    />
                                </motion.div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 2 }}
                                className="pt-8"
                            >
                                <button
                                    onClick={() => {
                                        setCurrentStep(1);
                                        setShowConfetti(false);
                                        setCountdown(null);
                                        setUnlockedCards([
                                            { id: 1, unlocked: false },
                                            { id: 2, unlocked: false },
                                            { id: 3, unlocked: false },
                                        ]);
                                    }}
                                    className="px-8 py-3 bg-pink-100 text-pink-600 rounded-full hover:bg-pink-200 transition-colors font-semibold"
                                >
                                    ← Start Over
                                </button>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Edit Controls */}
            {isEditMode && (
                <EditControls
                    onExport={handleSave}
                    onPublish={() => setShowPublishDialog(true)}
                />
            )}

            {/* Publish Dialog */}
            <PublishDialog
                isOpen={showPublishDialog}
                onClose={() => setShowPublishDialog(false)}
                onPublish={handlePublish}
                defaultSlug={`midnight-promise-${Date.now()}`}
                templateName="Midnight Promise"
            />
        </div>
    );
}

// Main export with providers
export default function MidnightPromisePage() {
    return (
        <EditModeProvider>
            <MidnightPromiseContent />
        </EditModeProvider>
    );
}

function MidnightPromiseContent() {
    const searchParams = useSearchParams();
    const projectId = searchParams.get('id');
    const updateProject = useUpdateWebProject(projectId || "");
    const createProject = useCreateWebProject();
    const { processPayment, isPreparing, isVerifying } = usePaymentFlow();

    const isLoading = updateProject.isPending || createProject.isPending || isPreparing || isVerifying;

    return (
        <MidnightPromiseTemplate
            processPayment={processPayment}
            isLoading={isLoading}
        />
    );
}
