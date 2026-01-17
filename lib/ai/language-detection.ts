// Language Detection and Preference Management
// Detects user's language and stores it in Qdrant for personalized responses

/**
 * Detect language from user message
 * Returns language code: 'bn' (Bengali), 'hi' (Hindi), 'ta' (Tamil), 'te' (Telugu), 'en' (English), etc.
 */
export function detectLanguage(text: string): string {
    // Bengali detection
    if (/[\u0980-\u09FF]/.test(text)) {
        return 'bn'; // Bengali
    }

    // Hindi detection
    if (/[\u0900-\u097F]/.test(text)) {
        return 'hi'; // Hindi
    }

    // Tamil detection
    if (/[\u0B80-\u0BFF]/.test(text)) {
        return 'ta'; // Tamil
    }

    // Telugu detection
    if (/[\u0C00-\u0C7F]/.test(text)) {
        return 'te'; // Telugu
    }

    // Marathi detection
    if (/[\u0900-\u097F]/.test(text)) {
        return 'mr'; // Marathi (shares script with Hindi)
    }

    // Gujarati detection
    if (/[\u0A80-\u0AFF]/.test(text)) {
        return 'gu'; // Gujarati
    }

    // Kannada detection
    if (/[\u0C80-\u0CFF]/.test(text)) {
        return 'kn'; // Kannada
    }

    // Malayalam detection
    if (/[\u0D00-\u0D7F]/.test(text)) {
        return 'ml'; // Malayalam
    }

    // Punjabi detection
    if (/[\u0A00-\u0A7F]/.test(text)) {
        return 'pa'; // Punjabi
    }

    // Default to English
    return 'en';
}

/**
 * Get language name from code
 */
export function getLanguageName(code: string): string {
    const languageNames: Record<string, string> = {
        'bn': 'Bengali',
        'hi': 'Hindi',
        'ta': 'Tamil',
        'te': 'Telugu',
        'mr': 'Marathi',
        'gu': 'Gujarati',
        'kn': 'Kannada',
        'ml': 'Malayalam',
        'pa': 'Punjabi',
        'en': 'English'
    };

    return languageNames[code] || 'English';
}

/**
 * Get language instruction for AI prompt
 */
export function getLanguageInstruction(languageCode: string): string {
    const languageName = getLanguageName(languageCode);

    if (languageCode === 'en') {
        return 'Respond in English.';
    }

    return `IMPORTANT: User prefers ${languageName}. Respond primarily in ${languageName} with controlled English mixing for technical terms (80% ${languageName}, 20% English).`;
}
