/**
 * Country-based pricing configuration
 * Maps language/country to ISO country codes and currency information
 */

export const PRICING_COUNTRIES = {
    IN: { name: 'India', language: 'Hindi', currency: 'INR', symbol: '₹' },
    ES: { name: 'Spain', language: 'Spanish', currency: 'EUR', symbol: '€' },
    FR: { name: 'France', language: 'French', currency: 'EUR', symbol: '€' },
    SA: { name: 'Saudi Arabia', language: 'Arabic', currency: 'SAR', symbol: 'SR' },
    CN: { name: 'China', language: 'Mandarin Chinese', currency: 'CNY', symbol: '¥' },
    PT: { name: 'Portugal', language: 'Portuguese', currency: 'EUR', symbol: '€' },
    BD: { name: 'Bangladesh', language: 'Bengali', currency: 'BDT', symbol: '৳' },
    RU: { name: 'Russia', language: 'Russian', currency: 'RUB', symbol: '₽' },
    PK: { name: 'Pakistan', language: 'Urdu', currency: 'PKR', symbol: 'Rs' },
    ID: { name: 'Indonesia', language: 'Indonesian', currency: 'IDR', symbol: 'Rp' },
    DE: { name: 'Germany', language: 'German', currency: 'EUR', symbol: '€' },
    US: { name: 'United States', language: 'English', currency: 'USD', symbol: '$' },
    GB: { name: 'United Kingdom', language: 'English', currency: 'GBP', symbol: '£' },
    OTHER: { name: 'Other Countries', language: 'English', currency: 'USD', symbol: '$' },
} as const;

export type CountryCode = keyof typeof PRICING_COUNTRIES;

/**
 * Get currency information for a country code
 */
export function getCurrencyInfo(countryCode: string) {
    const code = (countryCode.toUpperCase() in PRICING_COUNTRIES
        ? countryCode.toUpperCase()
        : 'OTHER') as CountryCode;

    return PRICING_COUNTRIES[code];
}

/**
 * Format price with currency symbol
 */
export function formatPrice(price: number, countryCode: string): string {
    const currency = getCurrencyInfo(countryCode);

    // Format based on currency
    if (currency.currency === 'INR' || currency.currency === 'BDT' || currency.currency === 'PKR') {
        // Indian numbering system (lakhs, crores)
        return `${currency.symbol}${price.toLocaleString('en-IN')}`;
    } else if (currency.currency === 'IDR') {
        // Indonesian Rupiah (no decimals)
        return `${currency.symbol}${price.toLocaleString('id-ID')}`;
    } else if (currency.currency === 'CNY') {
        // Japanese Yen / Chinese Yuan (no decimals)
        return `${currency.symbol}${price.toLocaleString()}`;
    } else {
        // Western currencies (USD, EUR, GBP)
        return `${currency.symbol}${price.toLocaleString()}`;
    }
}

/**
 * Get price for a specific country from pricing JSON
 */
export function getPriceForCountry(
    pricingByCountry: string | null,
    countryCode: string,
    defaultPrice: number
): number {
    if (!pricingByCountry) return defaultPrice;

    try {
        const pricing = JSON.parse(pricingByCountry);
        const code = countryCode.toUpperCase();

        // Try exact match first
        if (pricing[code]) return pricing[code];

        // Try US/GB for English-speaking countries
        if (code === 'US' || code === 'GB' || code === 'CA' || code === 'AU') {
            return pricing['US'] || pricing['GB'] || pricing['OTHER'] || defaultPrice;
        }

        // Fall back to OTHER or default
        return pricing['OTHER'] || defaultPrice;
    } catch {
        return defaultPrice;
    }
}

/**
 * Default pricing template for new templates
 */
export const DEFAULT_PRICING_BY_COUNTRY = {
    IN: 299,      // ₹299
    ES: 5,        // €5
    FR: 5,        // €5
    SA: 20,       // SR20
    CN: 35,       // ¥35
    PT: 5,        // €5
    BD: 299,      // ৳299
    RU: 399,      // ₽399
    PK: 599,      // Rs599
    ID: 75000,    // Rp75,000
    DE: 5,        // €5
    US: 5,        // $5
    GB: 4,        // £4
    OTHER: 5,     // $5
};
