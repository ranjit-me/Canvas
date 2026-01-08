import React, { useState, useEffect, useRef } from 'react';
import { Heart, Play, Pause, Sparkles } from 'lucide-react';

export default function App() {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    // Countdown timer - set your special surprise date here
    useEffect(() => {
        const surpriseDate = new Date('2025-12-25T00:00:00').getTime();

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
    }, []);

    const toggleMusic = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play().catch(() => {
                    // Handle play error silently
                    setIsPlaying(false);
                });
                setIsPlaying(true);
            }
        }
    };

    // Photo gallery data
    const memories = [
        {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1717912991903-673ea91783a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMGNvdXBsZSUyMGxvdmV8ZW58MXx8fHwxNzY1MzQ0NDgzfDA&ixlib=rb-4.1.0&q=80&w=1080',
            caption: 'Our Love Story'
        },
        {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1575388104683-e076ee9ccaa0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VwbGUlMjBzdW5zZXR8ZW58MXx8fHwxNzY1MzE2OTA1fDA&ixlib=rb-4.1.0&q=80&w=1080',
            caption: 'Sunset Together'
        },
        {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1522973717924-b10fe4e185cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMGhhbmRzJTIwdG9nZXRoZXJ8ZW58MXx8fHwxNzY1MzYzNzI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
            caption: 'Forever Holding Hands'
        },
        {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1519307212971-dd9561667ffb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VwbGUlMjBiZWFjaHxlbnwxfHx8fDE3NjUyODE1ODd8MA&ixlib=rb-4.1.0&q=80&w=1080',
            caption: 'Beach Memories'
        },
        {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1620457552161-6202229a5018?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMGRhdGUlMjBuaWdodHxlbnwxfHx8fDE3NjUzNjM3Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
            caption: 'Date Night Magic'
        },
        {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1524146222100-8fd7c6ae9025?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VwbGUlMjBuYXR1cmV8ZW58MXx8fHwxNzY1MzYzNzI3fDA&ixlib=rb-4.1.0&q=80&w=1080',
            caption: 'Adventures Together'
        }
    ];

    // Love messages
    const loveMessages = [
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
    ];

    return (
        <div className="relative min-h-screen overflow-x-hidden">
            {/* Background with gradient */}
            <div className="fixed inset-0 bg-gradient-to-br from-pink-200 via-purple-200 to-red-200 -z-10" />

            {/* Floating hearts animation */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-5">
                {[...Array(15)].map((_, i) => (
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
                {[...Array(10)].map((_, i) => (
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
                {[...Array(20)].map((_, i) => (
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
            <button
                onClick={toggleMusic}
                className="fixed top-6 right-6 z-50 bg-white/30 backdrop-blur-md border-2 border-white/40 rounded-full p-4 shadow-lg hover:shadow-pink-300/50 hover:scale-110 transition-all duration-300 group"
            >
                {isPlaying ? (
                    <Pause className="w-6 h-6 text-pink-600" />
                ) : (
                    <Play className="w-6 h-6 text-pink-600" />
                )}
            </button>

            {/* Audio element - You can add your music URL here */}
            <audio ref={audioRef} loop>
                <source src="your-music-url.mp3" type="audio/mpeg" />
            </audio>

            {/* Main content */}
            <div className="relative z-10">
                {/* Hero Section */}
                <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
                    <div className="space-y-8 animate-fade-in">
                        <div className="relative inline-block">
                            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-pink-500 via-red-500 to-purple-600 bg-clip-text text-transparent drop-shadow-2xl animate-glow">
                                Happy Birthday
                            </h1>
                            <div className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent mt-4 animate-glow-delayed">
                                My Love ❤️
                            </div>
                        </div>

                        <p className="text-xl md:text-2xl text-purple-800 max-w-2xl mx-auto leading-relaxed px-4">
                            To the most beautiful soul who makes every day brighter, every moment sweeter,
                            and every dream more magical. Today we celebrate YOU! 🎂✨
                        </p>

                        {/* Countdown Timer */}
                        <div className="mt-12 bg-white/20 backdrop-blur-xl border-2 border-white/40 rounded-3xl p-8 shadow-2xl max-w-2xl mx-auto hover:shadow-pink-300/50 transition-all duration-300">
                            <h3 className="text-2xl md:text-3xl text-pink-600 mb-6 font-semibold">
                                Special Surprise Countdown ✨
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
                        <h2 className="text-5xl md:text-6xl text-center mb-6 bg-gradient-to-r from-pink-600 via-purple-600 to-red-600 bg-clip-text text-transparent">
                            Our Beautiful Memories 🌸
                        </h2>
                        <p className="text-center text-purple-700 text-xl mb-16 max-w-2xl mx-auto">
                            Every photo tells a story, every moment is a treasure
                        </p>

                        {/* Photo Gallery Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {memories.map((memory, index) => (
                                <div
                                    key={index}
                                    className="group relative animate-fade-in-up"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="bg-white p-4 rounded-3xl shadow-xl hover:shadow-pink-400/50 transition-all duration-500 hover:scale-105 hover:-rotate-1 transform">
                                        <div className="relative overflow-hidden rounded-2xl aspect-square">
                                            <img
                                                src={memory.url}
                                                alt={memory.caption}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-pink-600/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                                <p className="text-center">{memory.caption}</p>
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
                        <h2 className="text-5xl md:text-6xl text-center mb-6 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                            My Love Letters 💌
                        </h2>
                        <p className="text-center text-purple-700 text-xl mb-16">
                            Every word comes straight from my heart
                        </p>

                        {/* Timeline */}
                        <div className="relative">
                            {/* Timeline line */}
                            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-400 via-purple-400 to-red-400 transform md:-translate-x-1/2" />

                            {/* Timeline items */}
                            {loveMessages.map((item, index) => (
                                <div
                                    key={index}
                                    className={`relative mb-12 animate-fade-in-up ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'
                                        }`}
                                    style={{ animationDelay: `${index * 0.2}s` }}
                                >
                                    <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:ml-auto md:pl-12' : 'md:mr-auto md:pr-12'} pl-20 md:pl-0`}>
                                        <div className="bg-white/30 backdrop-blur-xl border-2 border-white/50 rounded-3xl p-6 shadow-xl hover:shadow-pink-400/50 transition-all duration-300 hover:scale-105">
                                            <div className="text-sm text-pink-600 mb-2 font-semibold">{item.date}</div>
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
                            <h3 className="text-4xl md:text-5xl text-transparent bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text mb-6">
                                I Love You More Than Words Can Say
                            </h3>
                            <p className="text-xl text-purple-800 leading-relaxed">
                                You are my yesterday, my today, and all of my tomorrows.
                                Thank you for being the most incredible girlfriend anyone could ever dream of.
                                Here's to celebrating you today and every day! 🎉💕
                            </p>
                            <div className="mt-8 text-2xl text-pink-600">
                                Forever Yours ❤️
                            </div>
                        </div>
                    </div>
                </section>

                {/* Extra spacing at bottom */}
                <div className="h-20" />
            </div>

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

        .-z-5 {
          z-index: -5;
        }
      `}</style>
        </div>
    );
}
