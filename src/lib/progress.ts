import {
    applyXpAndDailyGoal,
    DEFAULT_DAILY_GOAL,
    levelFromXp,
} from "@/lib/gamification";
import { applyBadgeUnlocks } from "@/data/badges";
import { LessonDirection } from "@/data/lessons";

export type LessonProgressEntry = {
    currentStep: number;
    completed: boolean;
};

function isLessonDirection(v: unknown): v is LessonDirection {
    return v === "en-fr" || v === "fr-en";
}

export type SavedPhrase = {
    id: string;
    text: string;
    hint?: string;
    scenarioId?: string;
    savedAt: string;
};

export type ProgressState = {
    translations: number;
    listeningCorrect: number;
    readingSessions: number;
    quizCorrect: number;
    /** Completed conversation-tutor sessions */
    practiceSessions: number;
    /** Phrases pinned from tutor sessions for later review */
    savedPhrases: SavedPhrase[];
    lessonsCompletedCount: number;
    streak: number;
    currentWord: string | null;
    currentWordDate: string | null;
    lastActiveDate: string | null;
    lastTopic: string | null;
    lastLessonId: string | null;
    lessonProgress: Map<string, Map<string, LessonProgressEntry>>;
    lessonsCompleted: Map<string, string[]>;
    completedStoryIds: string[];
    completedListeningIds: string[];
    lessonDirection: LessonDirection;
    nativeLanguage: string | null;
    learningLanguage: string | null;
    xp: number;
    dailyGoal: number;
    todayActions: number;
    todayXp: number;
    todayDate: string | null;
    dailyGoalMet: boolean;
    lastPracticedDate: string;
    todayMinutesPracticed: number;
    dailyGoalMinutes: number;
    weeklyActivity: Record<string, number>;
    /** Earned badge ids */
    badges: string[];
    cairnStonesCount: number;
    soundEnabled: boolean;
    ambientSoundEnabled: boolean;
};

export const PROGRESS_KEY = "koze-progress-v1";

export const defaultProgress = (): ProgressState => ({
    translations: 0,
    listeningCorrect: 0,
    readingSessions: 0,
    quizCorrect: 0,
    practiceSessions: 0,
    savedPhrases: [],
    lessonsCompletedCount: 0,
    streak: 0,
    currentWord: null,
    currentWordDate: null,
    lastActiveDate: null,
    lastTopic: null,
    lastLessonId: null,
    lessonProgress: new Map(),
    lessonsCompleted: new Map(),
    completedStoryIds: [],
    completedListeningIds: [],
    lessonDirection: null,
    nativeLanguage: null,
    learningLanguage: null,
    xp: 0,
    dailyGoal: DEFAULT_DAILY_GOAL,
    todayActions: 0,
    todayXp: 0,
    todayDate: null,
    dailyGoalMet: false,
    lastPracticedDate: todayKey(),
    todayMinutesPracticed: 0,
    dailyGoalMinutes: DEFAULT_DAILY_GOAL,
    weeklyActivity: {},
    badges: [],
    cairnStonesCount: 0,
    soundEnabled: true,
    ambientSoundEnabled: false,
});

function dateKey(d: Date) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function todayKey() {
    return dateKey(new Date());
}

function yesterdayKey() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return dateKey(d);
}

function mapToObject(
    map: Map<string, Map<string, LessonProgressEntry>>,
): Record<string, Record<string, LessonProgressEntry>> {
    const obj: Record<string, Record<string, LessonProgressEntry>> = {};
    for (const [k, innerMap] of map) {
        obj[k] = Object.fromEntries(innerMap);
    }
    return obj;
}

function hydrateProgress(raw: unknown): ProgressState {
    const base = defaultProgress();
    if (!raw || typeof raw !== "object") return base;

    const parsed = raw as Record<string, any>;

    const lessonProgress = new Map<string, Map<string, LessonProgressEntry>>();
    if (parsed.lessonProgress && typeof parsed.lessonProgress === "object") {
        const entries =
            parsed.lessonProgress instanceof Map
                ? parsed.lessonProgress.entries()
                : Object.entries(parsed.lessonProgress);
        for (const [direction, lessons] of entries) {
            const lessonsObj =
                lessons instanceof Map ? Object.fromEntries(lessons) : lessons;
            lessonProgress.set(
                direction,
                new Map(
                    Object.entries(
                        lessonsObj as Record<string, LessonProgressEntry>,
                    ),
                ),
            );
        }
    }

    let lessonsCompleted = new Map<string, string[]>();
    if (parsed.lessonsCompleted) {
        if (parsed.lessonsCompleted instanceof Map) {
            lessonsCompleted = new Map(parsed.lessonsCompleted);
        } else if (Array.isArray(parsed.lessonsCompleted)) {
            lessonsCompleted = new Map(parsed.lessonsCompleted);
        } else if (typeof parsed.lessonsCompleted === "object") {
            lessonsCompleted = new Map(Object.entries(parsed.lessonsCompleted));
        }
    }

    return {
        ...base,
        ...parsed,
        lessonProgress,
        lessonsCompleted,
        xp: parsed.xp ?? 0,
        dailyGoal: parsed.dailyGoal ?? DEFAULT_DAILY_GOAL,
        todayActions: parsed.todayActions ?? 0,
        todayXp: parsed.todayXp ?? 0,
        todayDate: parsed.todayDate ?? null,
        dailyGoalMet: parsed.dailyGoalMet ?? false,
        practiceSessions:
            typeof parsed.practiceSessions === "number"
                ? parsed.practiceSessions
                : 0,
        savedPhrases: Array.isArray(parsed.savedPhrases)
            ? (parsed.savedPhrases as SavedPhrase[])
            : [],
        badges: parsed.badges ?? [],
    };
}

export function loadProgress(): ProgressState {
    if (typeof window === "undefined") return defaultProgress();
    try {
        const raw = localStorage.getItem(PROGRESS_KEY);
        if (!raw) {
            localStorage.setItem(
                PROGRESS_KEY,
                JSON.stringify(defaultProgress()),
            );
            return defaultProgress();
        }
        const parsed = JSON.parse(raw);
        return hydrateProgress(parsed);
    } catch (err) {
        if (process.env.NODE_ENV !== "production") {
            console.error(
                "loadProgress failed, falling back to defaults:",
                err,
            );
        }
        return defaultProgress();
    }
}

export function saveProgress(state: ProgressState) {
    if (typeof window === "undefined") return;
    try {
        const serializableState = {
            ...state,
            lessonProgress: mapToObject(state.lessonProgress),
            lessonsCompleted: Object.fromEntries(state.lessonsCompleted),
        };
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(serializableState));
        window.dispatchEvent(new CustomEvent("koze-progress"));
    } catch (err) {
        if (process.env.NODE_ENV !== "production") {
            console.error("saveProgress failed:", err);
        }
    }
}

function bumpStreak(state: ProgressState): ProgressState {
    const today = todayKey();
    if (state.lastActiveDate === today) return state;
    if (state.lastActiveDate === yesterdayKey()) {
        return { ...state, streak: state.streak + 1, lastActiveDate: today };
    }
    return { ...state, streak: 1, lastActiveDate: today };
}

export type ActivityKind =
    | "translation"
    | "listening"
    | "reading"
    | "quiz"
    | "practice"
    | "lesson";

export function recordActivity(
    kind: ActivityKind,
    extra?: {
        topic?: string;
        lessonId?: string;
        stepIndex?: number;
        lessonCompleted?: boolean;
        direction?: LessonDirection;
        xpEarned?: number;
    },
) {
    const prev = loadProgress();
    let next = bumpStreak(prev);

    if (kind === "translation")
        next = { ...next, translations: next.translations + 1 };
    if (kind === "listening")
        next = { ...next, listeningCorrect: next.listeningCorrect + 1 };
    if (kind === "reading")
        next = { ...next, readingSessions: next.readingSessions + 1 };
    if (kind === "quiz") next = { ...next, quizCorrect: next.quizCorrect + 1 };
    if (kind === "practice")
        next = { ...next, practiceSessions: (next.practiceSessions || 0) + 1 };

    if (kind === "lesson" && extra?.lessonId) {
        const lessonId = extra.lessonId;
        const stepIndex = extra.stepIndex ?? 0;
        const completed = Boolean(extra.lessonCompleted);
        const direction: LessonDirection = isLessonDirection(extra.direction)
            ? extra.direction
            : next.lessonDirection;

        const entry: LessonProgressEntry = {
            currentStep: stepIndex,
            completed,
        };

        const lessonProgress = new Map(next.lessonProgress);
        const existingDirectionMap = lessonProgress.get(direction!);
        const directionProgress = new Map(existingDirectionMap || []);
        directionProgress.set(lessonId, entry);
        lessonProgress.set(direction!, directionProgress);

        const lessonsCompleted = new Map(next.lessonsCompleted);
        let completedLessons = [...(lessonsCompleted.get(direction!) ?? [])];

        if (completed && !completedLessons.includes(lessonId)) {
            completedLessons.push(lessonId);
            lessonsCompleted.set(direction!, completedLessons);
        }

        next = {
            ...next,
            lessonProgress,
            lessonsCompleted,
            cairnStonesCount: next.cairnStonesCount + (completed ? 1 : 0),
            lessonsCompletedCount: Array.from(lessonsCompleted.values()).reduce(
                (sum, arr) => sum + arr.length,
                0,
            ),
            lastLessonId: lessonId,
        };
    }

    if (extra?.topic) next = { ...next, lastTopic: extra.topic };

    next = applyXpAndDailyGoal(next, kind, {
        lessonCompleted: extra?.lessonCompleted,
        xpEarned: extra?.xpEarned,
    });

    saveProgress(next);

    applyBadgeUnlocks(next).then(({ progress: withBadges, unlocked }) => {
        saveProgress(withBadges);
        if (unlocked.length && typeof window !== "undefined") {
            window.dispatchEvent(
                new CustomEvent("koze-badges", { detail: { unlocked } }),
            );
        }
    }).catch(() => { /* ignore badge evaluation errors */ });

    if (typeof window !== "undefined") {
        void fetch("/api/progress", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                kind,
                topic: extra?.topic,
                lessonId: extra?.lessonId,
                stepIndex: extra?.stepIndex,
                lessonCompleted: extra?.lessonCompleted,
            }),
        })
            .then(async (res) => {
                if (!res.ok) return;
                const data = await res.json();
                if (data?.success && data.progress) {
                    saveProgress(hydrateProgress(data.progress));
                }
            })
            .catch((err) => {
                if (process.env.NODE_ENV !== "production") {
                    console.error("Failed to sync activity to server:", err);
                }
            });
    }

    return next;
}

/** Pin a phrase from a tutor session into the review list. */
export function savePhrase(input: {
    text: string;
    hint?: string;
    scenarioId?: string;
}): SavedPhrase | null {
    const text = input.text.trim();
    if (!text) return null;
    const prev = loadProgress();
    const existing = prev.savedPhrases || [];
    const found = existing.find((ph) => ph.text === text);
    if (found) return found;

    const phrase: SavedPhrase = {
        id: `${Date.now()}-${text.slice(0, 24).replace(/\s+/g, "-")}`,
        text,
        hint: input.hint?.trim() || undefined,
        scenarioId: input.scenarioId,
        savedAt: new Date().toISOString(),
    };
    const next: ProgressState = {
        ...prev,
        savedPhrases: [phrase, ...existing].slice(0, 50),
    };
    saveProgress(next);

    if (typeof window !== "undefined") {
        void fetch("/api/progress", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ action: "savePhrase", phrase }),
        }).catch(() => { });
    }
    return phrase;
}

export function removeSavedPhrase(id: string) {
    const prev = loadProgress();
    saveProgress({
        ...prev,
        savedPhrases: (prev.savedPhrases || []).filter((ph) => ph.id !== id),
    });
}

export function totalActivities(p: ProgressState) {
    return (
        p.translations +
        p.listeningCorrect +
        p.readingSessions +
        p.quizCorrect +
        (p.practiceSessions || 0) +
        (p.lessonsCompletedCount || 0)
    );
}

export function getLevel(p: ProgressState) {
    return levelFromXp(p.xp ?? 0);
}

export async function syncProgressFromCloud() {
    if (typeof window === "undefined") return loadProgress();
    const local = loadProgress();
    try {
        const mergeRes = await fetch("/api/progress", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ local }),
        });

        if (mergeRes.ok) {
            const data = await mergeRes.json();
            if (data?.success && data.progress) {
                const hydrated = hydrateProgress(data.progress);
                saveProgress(hydrated);
                return hydrated;
            }
        }

        const getRes = await fetch("/api/progress");
        if (getRes.ok) {
            const data = await getRes.json();
            if (data?.success && data.progress) {
                const hydrated = hydrateProgress(data.progress);
                saveProgress(hydrated);
                return hydrated;
            }
        }
    } catch (err) {
        if (process.env.NODE_ENV !== "production") {
            console.error(
                "syncProgressFromCloud failed, using local copy:",
                err,
            );
        }
    }

    return local;
}
