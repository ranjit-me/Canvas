import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function FallingPetals() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const petals = [...Array(30)].map((_, i) => ({
        id: i,
        delay: Math.random() * 5,
        duration: Math.random() * 10 + 10,
        x: Math.random() * 100,
        rotation: Math.random() * 360,
    }));

    if (!isMounted) return null;

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {petals.map((petal) => (
                <motion.div
                    key={petal.id}
                    className="absolute w-3 h-3 rounded-full bg-gradient-to-br from-pink-300 to-rose-400 opacity-60 blur-[1px]"
                    style={{
                        left: `${petal.x}%`,
                        top: '-20px',
                    }}
                    animate={{
                        y: window.innerHeight + 50,
                        x: [0, Math.random() * 100 - 50, 0],
                        rotate: [petal.rotation, petal.rotation + 360],
                        opacity: [0, 0.6, 0],
                    }}
                    transition={{
                        duration: petal.duration,
                        repeat: Infinity,
                        delay: petal.delay,
                        ease: "linear",
                    }}
                />
            ))}
        </div>
    );
}
