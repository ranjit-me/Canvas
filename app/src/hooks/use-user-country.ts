"use client";

import { useEffect, useState } from "react";

interface CountryData {
    countryCode: string;
    country: string;
    city?: string;
    region?: string;
    ip: string;
    isDevelopment?: boolean;
    error?: boolean;
}

export function useUserCountry() {
    const [countryData, setCountryData] = useState<CountryData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function detectCountry() {
            try {
                const response = await fetch('/api/location/detect');
                if (!response.ok) {
                    throw new Error('Failed to detect country');
                }
                const data = await response.json();
                setCountryData(data);
            } catch (error) {
                console.error('Error detecting country:', error);
                // Fallback to OTHER
                setCountryData({
                    countryCode: 'OTHER',
                    country: 'Unknown',
                    ip: 'unknown',
                    error: true,
                });
            } finally {
                setIsLoading(false);
            }
        }

        detectCountry();
    }, []);

    return { countryData, isLoading };
}
