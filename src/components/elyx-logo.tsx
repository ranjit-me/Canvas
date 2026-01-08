"use client";

import Image from "next/image";

export default function ElyxLogo({ className = "h-8 w-8" }: { className?: string }) {
    return (
        <Image
            src="/logo.png"
            alt="ELYX Logo"
            width={32}
            height={32}
            className={className}
        />
    );
}
