import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'canvas-confetti';
import { Lock, Heart, Sparkles, Star, Gift } from 'lucide-react';

export default function App() {
    const [section, setSection] = useState(0);
    const [birthdayName, setBirthdayName] = useState('Sarah');
    const [isEditingName, setIsEditingName] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [candleLit, setCandleLit] = useState(true);
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const memories = [
        {
            title: 'The day we laughed for hours...',
            description: 'Remember when we couldn\'t stop laughing at the coffee shop? Those moments are priceless.',
            gradient: 'from-pink-400 to-purple-500'
        },
        {
            title: 'Still my favorite memory',
            description: 'That sunset at the beach, the ice cream, and endless conversations about life.',
            gradient: 'from-purple-400 to-blue-500'
        },
        {
            title: 'You\'ve always been there',
            description: 'Through every challenge and celebration, you\'ve made life brighter.',
            gradient: 'from-blue-400 to-teal-500'
        }
    ];

    const wishWords = ['Love', 'Happiness', 'Success', 'Dreams', 'Joy', 'Peace'];

    const handleStart = () => {
        setSection(1);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
    };

    const renderStars = () => {
        return Array.from({ length: 50 }).map((_, i) => (
            <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                }}
                animate={{
                    opacity: [0.2, 1, 0.2],
                    scale: [0.5, 1, 0.5],
                }}
                transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                }}
            />
        ));
    };

    return (
        <div className="min-h-screen overflow-hidden" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {showConfetti && (
                <Confetti
                    width={windowSize.width}
                    height={windowSize.height}
                    recycle={false}
                    numberOfPieces={500}
                />
            )}

            <AnimatePresence mode="wait">
                {/* Section 0: Landing Screen */}
                {section === 0 && (
                    <motion.div
                        key="landing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden"
                    >
                        {renderStars()}

                        <div className="relative z-10 text-center px-6">
                            <motion.div
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <h1
                                    className="text-4xl md:text-6xl mb-8 text-white"
                                    style={{ fontFamily: 'Playfair Display, serif' }}
                                >
                                    Tonight isn't just another night...
                                </h1>
                                <motion.button
                                    onClick={handleStart}
                                    className="px-12 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full text-xl shadow-lg hover:shadow-2xl transition-all duration-300"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    animate={{
                                        boxShadow: [
                                            '0 0 20px rgba(236, 72, 153, 0.5)',
                                            '0 0 40px rgba(168, 85, 247, 0.8)',
                                            '0 0 20px rgba(236, 72, 153, 0.5)',
                                        ],
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    Turn on the Surprise ✨
                                </motion.button>
                            </motion.div>
                        </div>
                    </motion.div>
                )}

                {/* Section 1: Birthday Celebration */}
                {section === 1 && (
                    <motion.div
                        key="celebration"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="min-h-screen bg-gradient-to-br from-amber-100 via-pink-100 to-purple-100 flex flex-col items-center justify-center relative"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', duration: 1 }}
                            className="text-center px-6 max-w-4xl"
                        >
                            <motion.h1
                                className="text-5xl md:text-7xl mb-6 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent"
                                style={{ fontFamily: 'Playfair Display, serif' }}
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                Happy Birthday, {birthdayName}! 🎉
                            </motion.h1>

                            {!isEditingName ? (
                                <button
                                    onClick={() => setIsEditingName(true)}
                                    className="text-sm text-purple-600 hover:text-purple-700 mb-8 underline"
                                >
                                    Edit name
                                </button>
                            ) : (
                                <div className="mb-8 flex items-center justify-center gap-2">
                                    <input
                                        type="text"
                                        value={birthdayName}
                                        onChange={(e) => setBirthdayName(e.target.value)}
                                        className="px-4 py-2 border-2 border-purple-400 rounded-lg focus:outline-none focus:border-purple-600"
                                    />
                                    <button
                                        onClick={() => setIsEditingName(false)}
                                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                                    >
                                        Save
                                    </button>
                                </div>
                            )}

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                                {[Gift, Heart, Sparkles, Star].map((Icon, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ y: -50, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 * i }}
                                    >
                                        <Icon className="w-16 h-16 mx-auto text-purple-600" />
                                    </motion.div>
                                ))}
                            </div>

                            <motion.button
                                onClick={() => setSection(2)}
                                className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-lg shadow-lg hover:shadow-2xl transition-all"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Continue the Journey
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}

                {/* Section 2: Memory Lane */}
                {section === 2 && (
                    <motion.div
                        key="memories"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-20 px-6"
                    >
                        <div className="max-w-4xl mx-auto">
                            <motion.h2
                                initial={{ y: -30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="text-5xl md:text-6xl text-center mb-16 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                                style={{ fontFamily: 'Playfair Display, serif' }}
                            >
                                Memory Lane 📸
                            </motion.h2>

                            <div className="space-y-8 mb-12">
                                {memories.map((memory, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ x: i % 2 === 0 ? -100 : 100, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: i * 0.3 }}
                                        className="relative"
                                    >
                                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform rotate-1 hover:rotate-0 transition-transform">
                                            <div className={`h-48 bg-gradient-to-br ${memory.gradient} flex items-center justify-center`}>
                                                <div className="w-32 h-32 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                                                    <Heart className="w-16 h-16 text-white" />
                                                </div>
                                            </div>
                                            <div className="p-6 bg-gradient-to-br from-white to-pink-50">
                                                <h3 className="text-2xl mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                                                    {memory.title}
                                                </h3>
                                                <p className="text-gray-700">{memory.description}</p>
                                            </div>
                                        </div>
                                        {/* Polaroid-style bottom */}
                                        <div className="absolute -bottom-4 left-4 right-4 h-8 bg-white rounded-b-2xl shadow-lg -z-10" />
                                    </motion.div>
                                ))}
                            </div>

                            <div className="text-center">
                                <motion.button
                                    onClick={() => setSection(3)}
                                    className="px-10 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-full text-lg shadow-lg"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Next
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Section 3: Secret Message Lock */}
                {section === 3 && (
                    <motion.div
                        key="lock"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-6"
                    >
                        <div className="text-center max-w-2xl">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring' }}
                            >
                                <Lock className="w-32 h-32 mx-auto mb-8 text-yellow-400" />
                            </motion.div>

                            <h2
                                className="text-4xl md:text-5xl mb-6 text-white"
                                style={{ fontFamily: 'Playfair Display, serif' }}
                            >
                                Only special people deserve this message
                            </h2>

                            <motion.button
                                onClick={() => setSection(4)}
                                className="px-12 py-5 bg-gradient-to-r from-yellow-400 to-pink-500 text-white rounded-full text-xl shadow-lg"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                animate={{
                                    boxShadow: [
                                        '0 0 20px rgba(251, 191, 36, 0.5)',
                                        '0 0 40px rgba(251, 191, 36, 0.8)',
                                        '0 0 20px rgba(251, 191, 36, 0.5)',
                                    ],
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                Unlock My Message
                            </motion.button>
                        </div>
                    </motion.div>
                )}

                {/* Section 4: Secret Message Revealed */}
                {section === 4 && (
                    <motion.div
                        key="message"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-amber-100 flex items-center justify-center px-6"
                    >
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', duration: 1 }}
                            className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-3xl"
                        >
                            <div className="text-center">
                                <Heart className="w-20 h-20 mx-auto mb-6 text-pink-500" />
                                <h2
                                    className="text-4xl md:text-5xl mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent"
                                    style={{ fontFamily: 'Playfair Display, serif' }}
                                >
                                    A Special Message For You
                                </h2>
                                <div className="space-y-4 text-lg text-gray-700 mb-8">
                                    <p>
                                        On this special day, I want you to know how much you mean to me.
                                        Your kindness, your laughter, and your amazing spirit light up every room you enter.
                                    </p>
                                    <p>
                                        May this year bring you everything your heart desires. May your dreams soar higher
                                        than ever before, and may happiness follow you wherever you go.
                                    </p>
                                    <p className="text-2xl text-pink-600" style={{ fontFamily: 'Playfair Display, serif' }}>
                                        You deserve all the magic in the world! ✨
                                    </p>
                                </div>

                                <motion.button
                                    onClick={() => {
                                        setSection(5);
                                        setShowConfetti(true);
                                        setTimeout(() => setShowConfetti(false), 8000);
                                    }}
                                    className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-lg shadow-lg"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Continue to Finale
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* Section 5: Wish Explosion Finale */}
                {section === 5 && (
                    <motion.div
                        key="finale"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex flex-col items-center justify-center px-6 relative overflow-hidden"
                    >
                        {/* Fireworks effect */}
                        {Array.from({ length: 20 }).map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-yellow-400 to-pink-500"
                                style={{
                                    left: `${20 + Math.random() * 60}%`,
                                    top: `${20 + Math.random() * 60}%`,
                                }}
                                animate={{
                                    scale: [0, 2, 0],
                                    opacity: [0, 1, 0],
                                    x: [0, (Math.random() - 0.5) * 200],
                                    y: [0, (Math.random() - 0.5) * 200],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                    repeatDelay: 1,
                                }}
                            />
                        ))}

                        <div className="relative z-10 text-center max-w-4xl">
                            <motion.h1
                                initial={{ y: -50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="text-5xl md:text-7xl mb-12 text-white"
                                style={{ fontFamily: 'Playfair Display, serif' }}
                            >
                                This year is going to be YOUR year! 🌟
                            </motion.h1>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-16">
                                {wishWords.map((word, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ delay: i * 0.2, type: 'spring' }}
                                        className="bg-gradient-to-br from-pink-400 to-purple-500 rounded-full px-6 py-8 shadow-xl"
                                    >
                                        <motion.div
                                            animate={{ y: [-10, 10, -10] }}
                                            transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
                                        >
                                            <p className="text-2xl md:text-3xl text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                                                {word}
                                            </p>
                                        </motion.div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-8">
                                <h3 className="text-2xl md:text-3xl mb-6 text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                                    Make a Birthday Wish
                                </h3>

                                <div className="flex justify-center items-center mb-4">
                                    <AnimatePresence>
                                        {candleLit && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                exit={{ scale: 0, opacity: 0 }}
                                                className="relative"
                                            >
                                                <div className="w-4 h-24 bg-gradient-to-b from-amber-200 to-amber-400 rounded-t-full" />
                                                <motion.div
                                                    animate={{
                                                        scale: [1, 1.2, 1],
                                                        opacity: [0.8, 1, 0.8],
                                                    }}
                                                    transition={{ duration: 0.5, repeat: Infinity }}
                                                    className="absolute -top-8 left-1/2 transform -translate-x-1/2"
                                                >
                                                    <div className="w-8 h-12 bg-gradient-to-t from-orange-500 via-yellow-400 to-yellow-200 rounded-full blur-sm" />
                                                </motion.div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {!candleLit && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="text-4xl"
                                        >
                                            💨
                                        </motion.div>
                                    )}
                                </div>

                                <motion.button
                                    onClick={() => {
                                        setCandleLit(false);
                                        setTimeout(() => setCandleLit(true), 3000);
                                    }}
                                    className="px-10 py-4 bg-gradient-to-r from-yellow-400 to-pink-500 text-white rounded-full text-lg shadow-lg"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {candleLit ? 'Blow the Candle 🕯️' : 'Wish Made! ✨'}
                                </motion.button>
                            </div>

                            <motion.button
                                onClick={() => setSection(0)}
                                className="text-white/60 hover:text-white underline transition-colors"
                            >
                                Start Over
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
