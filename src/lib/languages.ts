export type LanguageOption = {
  id: number;
  name: string;
  value: string;
};

/** Languages offered in the translate UI (codes match common APIs). */
export const supportedLanguages: LanguageOption[] = [
  { id: 1, name: "English", value: "en" },
  { id: 2, name: "French", value: "fr" },
  { id: 3, name: "Spanish", value: "es" },
  { id: 4, name: "Haitian Creole", value: "ht" },
  { id: 5, name: "Portuguese", value: "pt" },
  { id: 6, name: "German", value: "de" },
  { id: 7, name: "Italian", value: "it" },
  { id: 8, name: "Chinese", value: "zh" },
  { id: 9, name: "Japanese", value: "ja" },
  { id: 10, name: "Korean", value: "ko" },
  { id: 11, name: "Arabic", value: "ar" },
  { id: 12, name: "Hindi", value: "hi" },
];

export const languageLabel = (code: string) =>
  supportedLanguages.find((l) => l.value === code)?.name ?? code.toUpperCase();
