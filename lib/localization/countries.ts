/**
 * Countries Data
 * Country information with flags and regions
 */

export interface CountryInfo {
    code: string;
    name: string;
    flag: string;
    region: string;
}

export const COUNTRIES: CountryInfo[] = [
    { code: 'IN', name: 'India', flag: '🇮🇳', region: 'South Asia' },
    { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', region: 'South Asia' },
    { code: 'US', name: 'United States', flag: '🇺🇸', region: 'North America' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', region: 'Europe' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦', region: 'North America' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺', region: 'Oceania' },
    { code: 'PK', name: 'Pakistan', flag: '🇵🇰', region: 'South Asia' },
    { code: 'NP', name: 'Nepal', flag: '🇳🇵', region: 'South Asia' },
    { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰', region: 'South Asia' },
    { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', region: 'Middle East' },
    { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', region: 'Middle East' },
    { code: 'SG', name: 'Singapore', flag: '🇸🇬', region: 'Southeast Asia' },
    { code: 'MY', name: 'Malaysia', flag: '🇲🇾', region: 'Southeast Asia' },
    { code: 'ES', name: 'Spain', flag: '🇪🇸', region: 'Europe' },
    { code: 'FR', name: 'France', flag: '🇫🇷', region: 'Europe' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪', region: 'Europe' },
    { code: 'IT', name: 'Italy', flag: '🇮🇹', region: 'Europe' },
    { code: 'BR', name: 'Brazil', flag: '🇧🇷', region: 'South America' },
    { code: 'MX', name: 'Mexico', flag: '🇲🇽', region: 'North America' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵', region: 'East Asia' },
    { code: 'CN', name: 'China', flag: '🇨🇳', region: 'East Asia' },
    { code: 'KR', name: 'South Korea', flag: '🇰🇷', region: 'East Asia' },
    { code: 'RU', name: 'Russia', flag: '🇷🇺', region: 'Europe/Asia' },
    { code: 'ZA', name: 'South Africa', flag: '🇿🇦', region: 'Africa' },
    { code: 'NG', name: 'Nigeria', flag: '🇳🇬', region: 'Africa' },
    { code: 'EG', name: 'Egypt', flag: '🇪🇬', region: 'Africa/Middle East' }
];

export interface CountryContext {
    culturalNotes: string;
    responseStyle: string;
    specialConsiderations?: string[];
}

export const COUNTRY_CONTEXTS: Record<string, CountryContext> = {
    IN: {
        culturalNotes: 'Indian context with diverse cultures, multiple languages, and rich traditions',
        responseStyle: 'thoughtful, culturally sensitive, and respectful of diversity',
        specialConsiderations: [
            'Religious diversity (Hindu, Muslim, Sikh, Christian, etc.)',
            'Regional differences across states',
            'Social sensitivities and cultural nuances',
            'Festivals and traditions vary by region'
        ]
    },
    BD: {
        culturalNotes: 'Bangladeshi context with Bengali culture and Islamic traditions',
        responseStyle: 'respectful and culturally aware'
    },
    PK: {
        culturalNotes: 'Pakistani context with Islamic culture and Urdu language',
        responseStyle: 'respectful of Islamic values and traditions'
    },
    US: {
        culturalNotes: 'American context with diverse multicultural society',
        responseStyle: 'direct, informal, and practical'
    },
    GB: {
        culturalNotes: 'British context with formal communication style',
        responseStyle: 'polite, formal, and reserved'
    },
    AE: {
        culturalNotes: 'UAE context with Islamic culture and modern cosmopolitan lifestyle',
        responseStyle: 'respectful of Islamic values while being modern'
    }
};

export function getCountryInfo(code: string): CountryInfo | null {
    return COUNTRIES.find(c => c.code === code) || null;
}

export function getCountryContext(code: string): CountryContext | null {
    return COUNTRY_CONTEXTS[code] || null;
}

export function getAllCountries(): CountryInfo[] {
    return COUNTRIES;
}
