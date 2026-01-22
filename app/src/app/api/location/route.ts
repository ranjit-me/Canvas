import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        // Get the client IP from headers
        const forwarded = request.headers.get('x-forwarded-for');
        const ip = forwarded ? forwarded.split(',')[0] : 'unknown';

        // If running on localhost, provide a default location
        if (ip === 'unknown' || ip.includes('::1') || ip.includes('127.0.0.1')) {
            return NextResponse.json({
                city: 'Mumbai',
                region: 'MH',
                country: 'India',
                location: 'Mumbai, MH',
                isDevelopment: true,
            });
        }

        // Use ipapi.co API to get location based on IP
        const response = await fetch('https://ipapi.co/json/', {
            headers: {
                'User-Agent': 'Giftora-App/1.0',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch location');
        }

        const data = await response.json();

        // Extract relevant location information
        const city = data.city || '';
        const region = data.region_code || data.region || '';
        const country = data.country_name || '';

        let locationString = 'Location unavailable';

        if (city && region) {
            locationString = `${city}, ${region}`;
        } else if (city) {
            locationString = city;
        } else if (country) {
            locationString = country;
        }

        return NextResponse.json({
            city,
            region,
            country,
            location: locationString,
            isDevelopment: false,
        });
    } catch (error) {
        console.error('[LOCATION_API_ERROR]', error);
        // Return a friendly fallback instead of error
        return NextResponse.json(
            {
                city: 'Mumbai',
                region: 'MH',
                country: 'India',
                location: 'Mumbai, MH',
                error: true
            },
            { status: 200 }
        );
    }
}
