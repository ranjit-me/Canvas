import { useState } from 'react';
import Image from 'next/image';

interface ImageWithFallbackProps {
    src: string;
    alt: string;
    className?: string;
}

export function ImageWithFallback({ src, alt, className = '' }: ImageWithFallbackProps) {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    if (error) {
        return (
            <div className={`flex items-center justify-center bg-gradient-to-br from-pink-200 to-rose-200 ${className}`}>
                <span className="text-pink-800 text-sm">❤️</span>
            </div>
        );
    }

    return (
        <>
            {loading && (
                <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-pink-100 to-rose-100 ${className}`}>
                    <div className="animate-pulse text-pink-400">Loading...</div>
                </div>
            )}
            <Image
                src={src}
                alt={alt}
                fill
                className={className}
                onError={() => setError(true)}
                onLoad={() => setLoading(false)}
            />
        </>
    );
}
