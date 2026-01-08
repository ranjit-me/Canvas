"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Pencil } from 'lucide-react';
import { useEditMode } from '../hooks/useEditMode';
import { useTranslate } from '@/hooks/use-translate';

interface EditableTextProps {
    value: string;
    onChange: (value: string) => void;
    elementId: string;
    isSelected: boolean;
    onSelect: () => void;
    className?: string;
    as?: 'h1' | 'h2' | 'h3' | 'p' | 'div';
    placeholder?: string;
}

export function EditableText({
    value,
    onChange,
    elementId,
    isSelected,
    onSelect,
    className = '',
    as: Component = 'div',
    placeholder = 'Click to edit...',
}: EditableTextProps) {
    const { isEditMode } = useEditMode();
    const [isEditing, setIsEditing] = useState(false);
    const [localValue, setLocalValue] = useState(value);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const translatedValue = useTranslate(value || placeholder);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    // If not in edit mode, render as translated text
    if (!isEditMode) {
        return <Component className={className}>{translatedValue}</Component>;
    }

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect();
        setIsEditing(true);
    };

    const handleBlur = () => {
        setIsEditing(false);
        onChange(localValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleBlur();
        }
        if (e.key === 'Escape') {
            setLocalValue(value);
            setIsEditing(false);
        }
    };

    if (isEditing) {
        return (
            <div className="relative">
                <textarea
                    ref={inputRef}
                    value={localValue}
                    onChange={(e) => setLocalValue(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    className={`${className} w-full bg-white/50 border-2 border-pink-500 rounded-lg p-2 resize-none overflow-hidden`}
                    style={{ minHeight: '2em' }}
                    rows={1}
                />
            </div>
        );
    }

    return (
        <div
            onClick={handleClick}
            className={`group relative cursor-pointer transition-all ${isSelected ? 'ring-2 ring-pink-500 ring-offset-2' : ''
                }`}
        >
            <Component className={className}>
                {value || placeholder}
            </Component>
            <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-pink-500 text-white rounded-full p-2 shadow-lg">
                    <Pencil className="w-4 h-4" />
                </div>
            </div>
        </div>
    );
}
