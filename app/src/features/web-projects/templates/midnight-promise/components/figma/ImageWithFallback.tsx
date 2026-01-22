import { useState } from 'react';

interface ImageWithFallbackProps {
    src: string;
    alt: string;
    className?: string;
}

export function ImageWithFallback({ src, alt, className = '' }: ImageWithFallbackProps) {
    const [error, setError] = useState(false);

    if (error) {
        return (
            <div className={`${className} bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center`}>
                <span className="text-4xl">💕</span>
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className={className}
            onError={() => setError(true)}
        />
    );
}
