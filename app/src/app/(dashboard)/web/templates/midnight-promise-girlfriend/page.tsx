"use client";

import { useSearchParams } from 'next/navigation';
import MidnightPromise from '@/features/web-projects/templates/midnight-promise/midnight-promise';

export default function MidnightPromiseGirlfriendPage() {
    const searchParams = useSearchParams();
    const mode = searchParams.get('mode');
    const isPreview = mode === 'preview';

    return <MidnightPromise />;
}
