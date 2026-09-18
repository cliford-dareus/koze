import type { LessonDirection } from "@/data/lessons";
import { isSupportedDirection } from "@/data/lessons";

export const LEARNING_PREFS_KEY = "koze-learning-prefs-v1";

export type LearningPrefs = {
    learningLanguage: string;
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
        return { ...defaultLearningPrefs(), ...parsed };
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
 * Map learning + native language → lesson pack direction.
 * Prefers en-{code} / {native}-en when those packs are registered in LESSONS_PATH_MAP.
 */
export function directionForLearningLanguage(
    learningLanguage: string,
    nativeLanguage: string = "en",
): LessonDirection {
    const learn = (learningLanguage || "fr").toLowerCase().split("-")[0];
    const native = (nativeLanguage || "en").toLowerCase().split("-")[0];

    if (learn === "en") {
        const dir = `${native}-en` as LessonDirection;
        if (isSupportedDirection(dir)) return dir;
        return "fr-en";
    }

    const dir = `en-${learn}` as LessonDirection;
    if (isSupportedDirection(dir)) return dir;
    // French is always available
    if (learn === "fr") return "en-fr";
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
