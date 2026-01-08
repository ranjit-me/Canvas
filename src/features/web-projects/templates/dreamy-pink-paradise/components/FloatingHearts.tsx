import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface FloatingHeartsProps {
    count?: number;
}

export function FloatingHearts({ count = 10 }: FloatingHeartsProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(count)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute"
                    initial={{
                        x: Math.random() * window.innerWidth,
                        y: window.innerHeight + 50,
                        scale: Math.random() * 0.5 + 0.5,
                        rotate: Math.random() * 360,
                    }}
                    animate={{
                        y: -100,
                        x: Math.random() * window.innerWidth,
                        rotate: Math.random() * 360 + 360,
                    }}
                    transition={{
                        duration: Math.random() * 10 + 10,
                        repeat: Infinity,
                        ease: "linear",
                        delay: Math.random() * 5,
                    }}
                >
                    <Heart
                        className={`${i % 3 === 0 ? 'text-pink-400 fill-pink-400' :
                            i % 3 === 1 ? 'text-rose-400 fill-rose-400' :
                                'text-red-400 fill-red-400'
                            }`}
                        size={Math.random() * 20 + 20}
                    />
                </motion.div>
            ))}
        </div>
    );
}
