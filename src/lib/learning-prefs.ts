import type { LessonDirection } from "@/data/lessons";

export const LEARNING_PREFS_KEY = "koze-learning-prefs-v1";

export type LearningPrefs = {
  /** Language the user wants to learn (e.g. en, fr) */
  learningLanguage: string;
  /** Language they already speak */
  nativeLanguage: string;
};

export const defaultLearningPrefs = (): LearningPrefs => ({
  learningLanguage: "fr",
  nativeLanguage: "en",
});

export function loadLearningPrefs(): LearningPrefs {
  if (typeof window === "undefined") return defaultLearningPrefs();
  try {
    const raw = localStorage.getItem(LEARNING_PREFS_KEY);
    if (!raw) return defaultLearningPrefs();
    const parsed = JSON.parse(raw) as Partial<LearningPrefs>;
    return {
      ...defaultLearningPrefs(),
      ...parsed,
    };
  } catch {
    return defaultLearningPrefs();
  }
}

export function saveLearningPrefs(prefs: LearningPrefs) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LEARNING_PREFS_KEY, JSON.stringify(prefs));
    window.dispatchEvent(new CustomEvent("koze-learning-prefs"));
  } catch {
    // ignore
  }
}

/**
 * Map “I am learning X” → which lesson direction to prioritize.
 * - Learning English → French → English content (fr-en)
 * - Learning French → English → French content (en-fr)
 * - Other targets currently fall back to en-fr until more tracks exist
 */
export function directionForLearningLanguage(
  learningLanguage: string,
): LessonDirection {
  const code = (learningLanguage || "fr").toLowerCase();
  if (code === "en" || code.startsWith("en-")) return "fr-en";
  if (code === "fr" || code.startsWith("fr-")) return "en-fr";
  return "en-fr";
}

export function learningTrackLabel(direction: LessonDirection): string {
  return direction === "fr-en"
    ? "Learning English (French → English)"
    : "Learning French (English → French)";
}
