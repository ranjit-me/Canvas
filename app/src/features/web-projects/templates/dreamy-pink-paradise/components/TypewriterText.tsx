import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function TypewriterText() {
    const [displayedText, setDisplayedText] = useState('');
    const fullText = `You are my smile on sad days,
my peace in chaos,
my forever favorite person.
I'm so lucky to love you.`;

    useEffect(() => {
        let index = 0;
        const timer = setInterval(() => {
            if (index <= fullText.length) {
                setDisplayedText(fullText.slice(0, index));
                index++;
            } else {
                clearInterval(timer);
            }
        }, 50);

        return () => clearInterval(timer);
    }, []);

    return (
        <motion.div
            className="text-xl md:text-2xl text-pink-50 leading-relaxed whitespace-pre-line"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            {displayedText}
            <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block ml-1"
            >
                |
            </motion.span>
        </motion.div>
    );
}
