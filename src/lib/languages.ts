export type LanguageOption = {
    id: string;
    name: string;
    value: string;
    voice: string;
    nativeName?: string;
    flag?: string;
    themeColor?: string;
    greeting?: string;
    description?: string;
};

/** Languages offered in the translate UI (codes match common APIs). */
export const LANGUAGES: LanguageOption[] = [
    {
        id: "english", name: "English", value: "en", voice: "en-US",
        nativeName: 'English',
        flag: '🇬🇧',
        themeColor: '#4A6FA5', // Steel Blue
        greeting: 'Good Morning! Welcome Back',
        description: 'Embrace warm connections, heartfelt conversations, and relaxed daily rhythms.',
    },
    {
        id: "french", name: "French", value: "fr", voice: "fr-FR",
        nativeName: 'Français',
        flag: '🇫🇷',
        themeColor: '#3B5998', // Classic Blue
        greeting: 'Bonjour! Bon retour',
        description: 'Savor refined elegance, poetic expression, and the art of everyday conversation.',
    },
    {
        id: "spanish", name: "Spanish", value: "es", voice: "es-ES",
        nativeName: 'Español',
        flag: '🇪🇸',
        themeColor: '#B86F50', // Warm Terracotta
        greeting: '¡Hola! Buenos días',
        description: 'Embrace warm connections, heartfelt conversations, and relaxed daily rhythms.',
    },
    {
        id: "haitian-creole", name: "Haitian Creole", value: "ht", voice: "ht-HT",
        nativeName: 'Kreyòl Ayisyen',
        flag: '🇭🇹',
        themeColor: '#1E88A8', // Caribbean Teal
        greeting: 'Bonjou! Byenveni ankò',
        description: 'Celebrate vibrant culture, resilient spirit, and close-knit community bonds.',
    },
    {
        id: "portuguese", name: "Portuguese", value: "pt", voice: "pt-PT",
        nativeName: 'Português',
        flag: '🇵🇹',
        themeColor: '#2E7D5B', // Coastal Green
        greeting: 'Olá! Bom dia',
        description: 'Discover coastal charm, lively storytelling, and unhurried, sociable days.',
    },
    {
        id: "german", name: "German", value: "de", voice: "de-DE",
        nativeName: 'Deutsch',
        flag: '🇩🇪',
        themeColor: '#4B4B4B', // Slate Grey
        greeting: 'Guten Morgen! Willkommen zurück',
        description: 'Value precision, honest dialogue, and dependable structure in daily life.',
    },
    {
        id: "italian", name: "Italian", value: "it", voice: "it-IT",
        nativeName: 'Italiano',
        flag: '🇮🇹',
        themeColor: '#C0443A', // Tuscan Red
        greeting: 'Buongiorno! Bentornato',
        description: 'Indulge in expressive gestures, good food, and passionate conversation.',
    },
    {
        id: "chinese", name: "Chinese", value: "zh", voice: "zh-CN",
        nativeName: '中文',
        flag: '🇨🇳',
        themeColor: '#C0392B', // Lucky Red
        greeting: '早上好！欢迎回来',
        description: 'Honor deep tradition, family harmony, and thoughtful, layered communication.',
    },
    {
        id: "japanese", name: "Japanese", value: "jp", voice: "jp-JP",
        nativeName: '日本語',
        flag: '🇯🇵',
        themeColor: '#D65A5A', // Soft Vermillion
        greeting: 'おはようございます！おかえりなさい',
        description: 'Appreciate quiet respect, subtle nuance, and mindful daily rituals.',
    },
    {
        id: "korean", name: "Korean", value: "ko", voice: "ko-KR",
        nativeName: '한국어',
        flag: '🇰🇷',
        themeColor: '#5B7FBA', // Cool Sky Blue
        greeting: '안녕하세요! 다시 오신 것을 환영합니다',
        description: 'Blend modern energy with deep respect, warmth, and close community ties.',
    },
    {
        id: "arabic", name: "Arabic", value: "ar", voice: "ar-SA",
        nativeName: 'العربية',
        flag: '🇸🇦',
        themeColor: '#1F7A5C', // Deep Emerald
        greeting: 'صباح الخير! أهلاً بعودتك',
        description: 'Cherish generous hospitality, rich storytelling, and strong family ties.',
    },
    {
        id: "hindi", name: "Hindi", value: "hi", voice: "hi-IN",
        nativeName: 'हिन्दी',
        flag: '🇮🇳',
        themeColor: '#D97B2E', // Saffron Orange
        greeting: 'सुप्रभात! वापसी पर स्वागत है',
        description: 'Celebrate vibrant festivities, spiritual depth, and warm extended-family life.',
    },
];

export type LangCode = (typeof LANGUAGES)[number]["value"];

export const languageLabel = (code: string) =>
    LANGUAGES.find((l) => l.value === code)?.name ?? code.toUpperCase();

export function voiceFor(code: LangCode) {
    return LANGUAGES.find((l) => l.value === code)?.voice ?? "en-US";
}
