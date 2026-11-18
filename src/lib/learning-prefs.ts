import type { LessonDirection } from "@/data/lessons";
import { SUPPORTED_DIRECTIONS } from "@/data/lessons";
import { languageLabel } from "@/lib/languages";

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
        // Keep progress.lessonDirection in sync for easy reads from progress storage
        const direction = directionForLearningLanguage(prefs.learningLanguage, prefs.nativeLanguage);
        window.dispatchEvent(new CustomEvent("koze-learning-prefs"));
    } catch {
        // ignore
    }
}

/**
 * Map native + learning language to a supported lesson direction.
 * Returns null when no pack exists for that pair (so callers can fall back).
 */
export function directionForLearningLanguage(
    learningLanguage: string,
    nativeLanguage: string
): LessonDirection {
    const native = (nativeLanguage || "en").toLowerCase();
    const learning = (learningLanguage || "fr").toLowerCase();
    const code = `${native}-${learning}`;
    if ((SUPPORTED_DIRECTIONS as string[]).includes(code)) {
        return code as LessonDirection;
    }
    // Prefer any supported pack that targets the learning language
    const byTarget = SUPPORTED_DIRECTIONS.find((d) => d.endsWith(`-${learning}`));
    if (byTarget) return byTarget;
    return null;
}

export function learningTrackLabel(direction: LessonDirection): string {
    if (!direction) return "No track selected";
    const [src = "", tgt = ""] = direction.split("-");
    return `Learning ${languageLabel(tgt)} (${languageLabel(src)} → ${languageLabel(tgt)})`;
}
