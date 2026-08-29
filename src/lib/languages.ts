export type LanguageOption = {
    id: number;
    name: string;
    value: string;
    voice: string;
};

/** Languages offered in the translate UI (codes match common APIs). */
export const LANGUAGES: LanguageOption[] = [
    { id: 1, name: "English", value: "en", voice: "en-US" },
    { id: 2, name: "French", value: "fr", voice: "fr-FR" },
    { id: 3, name: "Spanish", value: "es", voice: "es-ES" },
    { id: 4, name: "Haitian Creole", value: "ht", voice: "ht-HT" },
    { id: 5, name: "Portuguese", value: "pt", voice: "pt-PT" },
    { id: 6, name: "German", value: "de", voice: "de-DE" },
    { id: 7, name: "Italian", value: "it", voice: "it-IT" },
    { id: 8, name: "Chinese", value: "zh", voice: "zh-CN" },
    { id: 9, name: "Japanese", value: "ja", voice: "ja-JP" },
    { id: 10, name: "Korean", value: "ko", voice: "ko-KR" },
    { id: 11, name: "Arabic", value: "ar", voice: "ar-SA" },
    { id: 12, name: "Hindi", value: "hi", voice: "hi-IN" },
];

export type LangCode = (typeof LANGUAGES)[number]["value"];

export const languageLabel = (code: string) =>
    LANGUAGES.find((l) => l.value === code)?.name ?? code.toUpperCase();

export function voiceFor(code: LangCode) {
  return LANGUAGES.find((l) => l.value === code)?.voice ?? "en-US";
}