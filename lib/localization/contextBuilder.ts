/**
 * Cultural Context Builder
 * Builds AI prompt context based on user's language and country
 */

import { LANGUAGE_MONUMENTS, getLanguageInfo } from './languages';
import { getCountryInfo, getCountryContext } from './countries';

/**
 * Get user's cultural context from localStorage
 */
export function getUserCulturalContext(): string {
    if (typeof window === 'undefined') return ''; // Server-side

    const country = localStorage.getItem('userCountry') || null;
    const language = localStorage.getItem('userLanguage') || null;

    if (!country || !language) {
        return ''; // No specific context
    }

    return buildCulturalContext(language, country);
}

/**
 * Build cultural context string for AI prompt
 */
export function buildCulturalContext(language: string, country: string): string {
    let context = '\n\n# USER CULTURAL CONTEXT\n\n';

    // Language context
    const langInfo = getLanguageInfo(language);
    if (langInfo) {
        context += `**User's Preferred Language:** ${langInfo.nativeName} (${langInfo.name})\n`;
        context += `**Primary Region:** ${langInfo.primaryRegion}\n`;
        context += `**Monument:** ${langInfo.icon} ${langInfo.monument}\n`;
        context += `**CRITICAL:** Respond ONLY in ${langInfo.name}. Match user's language exactly.\n\n`;
    }

    // Country context
    const countryInfo = getCountryInfo(country);
    const countryContext = getCountryContext(country);

    if (countryInfo) {
        context += `**User's Country:** ${countryInfo.name} ${countryInfo.flag}\n`;
        context += `**Region:** ${countryInfo.region}\n\n`;

        if (countryContext) {
            context += `**Cultural Context:** ${countryContext.culturalNotes}\n`;
            context += `**Response Style:** ${countryContext.responseStyle}\n`;

            if (countryContext.specialConsiderations) {
                context += `\n**Special Considerations:**\n`;
                countryContext.specialConsiderations.forEach(consideration => {
                    context += `- ${consideration}\n`;
                });
            }
            context += `\n`;
        }
    }

    // Smart combinations
    context += buildSmartContext(language, country);

    return context;
}

/**
 * Build smart context based on language + country combinations
 */
function buildSmartContext(language: string, country: string): string {
    let smartContext = '**Smart Context:**\n';

    // Bengali + India = Indian Bengali (West Bengal)
    if (language === 'bn' && country === 'IN') {
        smartContext += '- User speaks Bengali and is from India (likely West Bengal)\n';
        smartContext += '- Use Indian Bengali context, NOT Bangladeshi\n';
        smartContext += '- Reference Indian culture, festivals (Durga Puja, Diwali), and context\n';
        smartContext += '- Use Indian currency (₹ Rupees), measurements, and examples\n';
    }

    // Bengali + Bangladesh = Bangladeshi Bengali
    else if (language === 'bn' && country === 'BD') {
        smartContext += '- User speaks Bengali and is from Bangladesh\n';
        smartContext += '- Use Bangladeshi context and cultural references\n';
        smartContext += '- Reference Bangladeshi festivals (Pohela Boishakh, Eid)\n';
        smartContext += '- Use Bangladeshi currency (৳ Taka) and context\n';
    }

    // Hindi + India
    else if (language === 'hi' && country === 'IN') {
        smartContext += '- User speaks Hindi and is from India\n';
        smartContext += '- Use Indian cultural context and references\n';
        smartContext += '- Reference Indian festivals, traditions, and examples\n';
    }

    // Hinglish + India
    else if (language === 'hi-en' && country === 'IN') {
        smartContext += '- User prefers Hinglish (Hindi-English mix)\n';
        smartContext += '- Code-switch naturally between Hindi and English\n';
        smartContext += '- Use Indian context, slang, and expressions\n';
        smartContext += '- Example: "Yaar, ye bahut cool hai!"\n';
    }

    // English + India
    else if (language === 'en' && country === 'IN') {
        smartContext += '- User speaks English and is from India\n';
        smartContext += '- Use Indian English context and examples\n';
        smartContext += '- Reference Indian culture while using English\n';
    }

    // Default
    else {
        smartContext += `- User speaks ${language} and is from ${country}\n`;
        smartContext += '- Use appropriate cultural context for this combination\n';
    }

    // India-specific thoughtfulness
    if (country === 'IN') {
        smartContext += '\n**India-Specific Guidelines:**\n';
        smartContext += '- Be extra thoughtful and culturally sensitive\n';
        smartContext += '- Avoid controversial topics unless directly asked\n';
        smartContext += '- Respect religious and cultural diversity\n';
        smartContext += '- Use appropriate examples from Indian context\n';
        smartContext += '- Consider regional differences (North vs South, etc.)\n';
    }

    return smartContext;
}

/**
 * Get user's language preference
 */
export function getUserLanguage(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('userLanguage');
}

/**
 * Get user's country preference
 */
export function getUserCountry(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('userCountry');
}

/**
 * Save user preferences
 */
export function saveUserPreferences(language: string, country: string): void {
    if (typeof window === 'undefined') return;

    localStorage.setItem('userLanguage', language);
    localStorage.setItem('userCountry', country);
    localStorage.setItem('userPreferencesSet', 'true');
}

/**
 * Check if user has set preferences
 */
export function hasUserPreferences(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('userPreferencesSet') === 'true';
}
