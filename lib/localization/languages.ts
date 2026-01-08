/**
 * Language Monuments
 * Languages represented by iconic monuments from their primary regions
 */

export interface LanguageInfo {
    code: string;
    name: string;
    nativeName: string;
    icon: string;
    monument: string;
    primaryRegion: string;
}

export const LANGUAGE_MONUMENTS: Record<string, LanguageInfo> = {
    'en': {
        code: 'en',
        name: 'English',
        nativeName: 'English',
        icon: '🗽',
        monument: 'Statue of Liberty',
        primaryRegion: 'Global'
    },
    'bn': {
        code: 'bn',
        name: 'Bengali',
        nativeName: 'বাংলা',
        icon: '🌉',
        monument: 'Howrah Bridge',
        primaryRegion: 'West Bengal, Bangladesh'
    },
    'hi': {
        code: 'hi',
        name: 'Hindi',
        nativeName: 'हिंदी',
        icon: '🕌',
        monument: 'Taj Mahal',
        primaryRegion: 'North India'
    },
    'hi-en': {
        code: 'hi-en',
        name: 'Hinglish',
        nativeName: 'Hinglish',
        icon: '🏛️',
        monument: 'India Gate',
        primaryRegion: 'Urban India'
    },
    'es': {
        code: 'es',
        name: 'Spanish',
        nativeName: 'Español',
        icon: '🏰',
        monument: 'Sagrada Familia',
        primaryRegion: 'Spain, Latin America'
    },
    'fr': {
        code: 'fr',
        name: 'French',
        nativeName: 'Français',
        icon: '🗼',
        monument: 'Eiffel Tower',
        primaryRegion: 'France'
    },
    'ar': {
        code: 'ar',
        name: 'Arabic',
        nativeName: 'العربية',
        icon: '🕌',
        monument: 'Burj Khalifa',
        primaryRegion: 'Middle East'
    },
    'de': {
        code: 'de',
        name: 'German',
        nativeName: 'Deutsch',
        icon: '🏰',
        monument: 'Brandenburg Gate',
        primaryRegion: 'Germany'
    },
    'ja': {
        code: 'ja',
        name: 'Japanese',
        nativeName: '日本語',
        icon: '🗾',
        monument: 'Mount Fuji',
        primaryRegion: 'Japan'
    },
    'zh': {
        code: 'zh',
        name: 'Chinese',
        nativeName: '中文',
        icon: '🏯',
        monument: 'Great Wall',
        primaryRegion: 'China'
    },
    'pt': {
        code: 'pt',
        name: 'Portuguese',
        nativeName: 'Português',
        icon: '🗿',
        monument: 'Christ the Redeemer',
        primaryRegion: 'Brazil, Portugal'
    },
    'ru': {
        code: 'ru',
        name: 'Russian',
        nativeName: 'Русский',
        icon: '🏛️',
        monument: 'Red Square',
        primaryRegion: 'Russia'
    }
};

export function getLanguageInfo(code: string): LanguageInfo | null {
    return LANGUAGE_MONUMENTS[code] || null;
}

export function getAllLanguages(): LanguageInfo[] {
    return Object.values(LANGUAGE_MONUMENTS);
}
