// Type definitions for rose-birthday template editing

export interface Memory {
    type: 'image';
    url: string;
    caption: string;
}

export interface TimelineMessage {
    date: string;
    message: string;
}

export interface ContentData {
    // Hero section
    heroTitle: string;
    heroSubtitle: string;
    heroDescription: string;

    // Countdown
    surpriseDate: string; // ISO date string
    countdownTitle: string;

    // Photos
    memories: Memory[];

    // Timeline
    memoriesTitle: string;
    memoriesSubtitle: string;
    timelineTitle: string;
    timelineSubtitle: string;
    loveMessages: TimelineMessage[];

    // Final message
    finalHeading: string;
    finalMessage: string;
    finalSignature: string;

    // Config
    musicUrl?: string;
}

export interface EditState {
    isEditing: boolean;
    selectedElement: string | null;
    elementType: 'text' | 'image' | 'date' | 'timeline' | null;
}

export type EditableElementType = 'text' | 'image' | 'date' | 'timeline';
