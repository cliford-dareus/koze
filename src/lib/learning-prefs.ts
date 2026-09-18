import type { LessonDirection } from "@/data/lessons";
import { isSupportedDirection } from "@/data/lessons";

export const LEARNING_PREFS_KEY = "koze-learning-prefs-v1";

export type LearningPrefs = {
    /** Language the user wants to learn (e.g. en, fr, es) */
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
 * Map “I am learning X” (+ native language) → lesson pack direction.
 * - Learning English → `{native}-en` (e.g. fr-en, es-en)
 * - Learning another language from English → `en-{code}` (e.g. en-fr, en-es)
 * - Falls back to en-fr / fr-en when a pack is missing
 */
export function directionForLearningLanguage(
    learningLanguage: string,
    nativeLanguage: string = "en",
): LessonDirection {
    const learn = (learningLanguage || "fr").toLowerCase().split("-")[0];
    const native = (nativeLanguage || "en").toLowerCase().split("-")[0];

    if (learn === "en") {
        const dir = `${native}-en`;
        if (isSupportedDirection(dir)) return dir;
        return "fr-en";
    }

    const dir = `en-${learn}`;
    if (isSupportedDirection(dir)) return dir;
    return "en-fr";
}

export function learningTrackLabel(direction: LessonDirection): string {
    if (!direction) return "";
    if (direction.endsWith("-en") && !direction.startsWith("en-")) {
        const src = direction.split("-")[0].toUpperCase();
        return `Learning English (${src} → EN)`;
    }
    if (direction.startsWith("en-")) {
        const tgt = direction.split("-")[1].toUpperCase();
        return `Learning ${tgt} (EN → ${tgt})`;
    }
    return direction.toUpperCase();
}
