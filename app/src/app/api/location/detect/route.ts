import { NextRequest, NextResponse } from 'next/server';

/**
 * Detect user's country from IP address
 * Uses ipapi.co free tier (1000 requests/day)
 */
export async function GET(req: NextRequest) {
    try {
        // Get IP from request headers
        const forwarded = req.headers.get('x-forwarded-for');
        const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') || '8.8.8.8';

        // For localhost/development, use a default
        if (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168')) {
            return NextResponse.json({
                countryCode: 'IN', // Default to India for development
                country: 'India',
                ip: ip,
                isDevelopment: true,
            });
        }

        // Call ipapi.co API
        const response = await fetch(`https://ipapi.co/${ip}/json/`, {
            headers: {
                'User-Agent': 'giftora-app',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch location data');
        }

        const data = await response.json();

        return NextResponse.json({
            countryCode: data.country_code || 'OTHER',
            country: data.country_name || 'Unknown',
            city: data.city,
            region: data.region,
            ip: ip,
            isDevelopment: false,
        });
    } catch (error) {
        console.error('Error detecting country:', error);

        // Fallback to OTHER
        return NextResponse.json({
            countryCode: 'OTHER',
            country: 'Unknown',
            ip: 'unknown',
            error: true,
        });
    }
}
