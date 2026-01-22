/**
 * Extract YouTube video ID from various URL formats
 */
export function getYouTubeVideoId(url: string): string | null {
    if (!url) return null;

    // Handle different YouTube URL formats
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
        /youtube\.com\/embed\/([^&\n?#]+)/,
        /youtube\.com\/v\/([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }

    return null;
}

/**
 * Get YouTube embed URL from video ID
 */
export function getYouTubeEmbedUrl(videoId: string, autoplay: boolean = false): string {
    const params = new URLSearchParams({
        controls: '1',
        modestbranding: '1',
        rel: '0',
        showinfo: '0',
        mute: autoplay ? '1' : '0',
        autoplay: autoplay ? '1' : '0',
        enablejsapi: '1',
    });

    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

/**
 * Get YouTube thumbnail URL
 */
export function getYouTubeThumbnail(videoId: string, quality: 'default' | 'hq' | 'mq' | 'sd' | 'maxres' = 'hq'): string {
    const qualityMap = {
        default: 'default',
        mq: 'mqdefault',
        hq: 'hqdefault',
        sd: 'sddefault',
        maxres: 'maxresdefault',
    };

    return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
}
