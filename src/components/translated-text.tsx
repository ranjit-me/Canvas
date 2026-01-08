"use client";

import { useTranslate } from "@/hooks/use-translate";

interface TranslatedTextProps {
    children: string;
    className?: string;
    as?: "p" | "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div";
}

export function T({ children, className, as: Component = "span" }: TranslatedTextProps) {
    const translatedText = useTranslate(children);

    return <Component className={className}>{translatedText}</Component>;
}
