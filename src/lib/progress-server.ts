import type { ActivityKind, ProgressState, SavedPhrase } from "@/lib/progress";
import { defaultProgress } from "@/lib/progress";
import { applyXpAndDailyGoal, DEFAULT_DAILY_GOAL } from "@/lib/gamification";
import { applyBadgeUnlocks } from "@/data/badges";
import { LessonDirection, SUPPORTED_DIRECTIONS } from "@/data/lessons";

function todayKey() {
    return new Date().toISOString().slice(0, 10);
}

function yesterdayKey() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().slice(0, 10);
}

export function isLessonDirection(v: unknown): v is Exclude<LessonDirection, null> {
    return (
        typeof v === "string" &&
        (SUPPORTED_DIRECTIONS as string[]).includes(v)
    );
}

export function bumpStreak(state: ProgressState): ProgressState {
    const today = todayKey();
    if (state.lastActiveDate === today) return state;
    if (state.lastActiveDate === yesterdayKey()) {
        return { ...state, streak: state.streak + 1, lastActiveDate: today };
    }
    return { ...state, streak: 1, lastActiveDate: today };
}

function mergeStringLists(a: string[] = [], b: string[] = []): string[] {
    return Array.from(new Set([...a, ...b]));
}

function mergeWeeklyActivity(
    a: Record<string, number> = {},
    b: Record<string, number> = {},
): Record<string, number> {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    const out: Record<string, number> = {};
    for (const k of keys) {
        out[k] = Math.max(a[k] ?? 0, b[k] ?? 0);
    }
    return out;
}

export async function applyActivity(
    prev: ProgressState,
    kind: ActivityKind,
    extra?: {
        topic?: string;
        lessonId?: string;
        stepIndex?: number;
        lessonCompleted?: boolean;
        direction?: string;
        xpEarned?: number;
        minutes?: number;
    },
): Promise<ProgressState> {
    let next = bumpStreak({ ...defaultProgress(), ...prev });

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
        const direction: Exclude<LessonDirection, null> = isLessonDirection(
            extra.direction,
        )
            ? extra.direction
            : isLessonDirection(next.lessonDirection)
              ? next.lessonDirection
              : "en-fr";

        const lessonProgress = new Map(next.lessonProgress || []);
        const directionProgress = new Map(lessonProgress.get(direction) || []);
        directionProgress.set(lessonId, { currentStep: stepIndex, completed });
        lessonProgress.set(direction, directionProgress);

        const lessonsCompleted = new Map(next.lessonsCompleted || []);
        const list = [...(lessonsCompleted.get(direction) ?? [])];
        if (completed && !list.includes(lessonId)) {
            list.push(lessonId);
            lessonsCompleted.set(direction, list);
        }

        next = {
            ...next,
            lessonProgress,
            lessonsCompleted,
            lessonDirection: direction,
            lessonsCompletedCount: Array.from(lessonsCompleted.values()).reduce(
                (sum, arr) => sum + arr.length,
                0,
            ),
            lastLessonId: lessonId,
            cairnStonesCount:
                (next.cairnStonesCount || 0) + (completed ? 1 : 0),
        };
    }

    if (extra?.topic) next = { ...next, lastTopic: extra.topic };

    if (typeof extra?.minutes === "number" && extra.minutes > 0) {
        const today = todayKey();
        const weekly = { ...(next.weeklyActivity || {}) };
        weekly[today] = (weekly[today] || 0) + extra.minutes;
        next = {
            ...next,
            todayMinutesPracticed:
                (next.todayDate === today ? next.todayMinutesPracticed : 0) +
                extra.minutes,
            lastPracticedDate: today,
            weeklyActivity: weekly,
        };
    }

    next = applyXpAndDailyGoal(next, kind, {
        lessonCompleted: extra?.lessonCompleted,
        xpEarned: extra?.xpEarned,
    });

    const { progress } = await applyBadgeUnlocks(next);
    return progress;
}

function mergeNestedLessonProgress(
    a: ProgressState["lessonProgress"],
    b: ProgressState["lessonProgress"],
): ProgressState["lessonProgress"] {
    const out = new Map<
        string,
        Map<string, { currentStep: number; completed: boolean }>
    >();
    const directions = new Set([...(a?.keys() ?? []), ...(b?.keys() ?? [])]);

    for (const dir of directions) {
        const left = a?.get?.(dir);
        const right = b?.get?.(dir);
        const merged = new Map(left || []);

        if (right) {
            for (const [lessonId, entry] of right) {
                const existing = merged.get(lessonId);
                if (!existing) {
                    merged.set(lessonId, entry);
                } else {
                    merged.set(lessonId, {
                        completed: existing.completed || entry.completed,
                        currentStep: Math.max(
                            existing.currentStep,
                            entry.currentStep,
                        ),
                    });
                }
            }
        }
        out.set(dir, merged);
    }
    return out;
}

function mergeLessonsCompleted(
    a: ProgressState["lessonsCompleted"],
    b: ProgressState["lessonsCompleted"],
): ProgressState["lessonsCompleted"] {
    const out = new Map<string, string[]>();
    const directions = new Set([...(a?.keys() ?? []), ...(b?.keys() ?? [])]);

    for (const dir of directions) {
        const ids = Array.from(
            new Set([...(a?.get?.(dir) ?? []), ...(b?.get?.(dir) ?? [])]),
        );
        out.set(dir, ids);
    }
    return out;
}

export async function mergeProgress(
    local: ProgressState,
    cloud: ProgressState,
): Promise<ProgressState> {
    const a = { ...defaultProgress(), ...local };
    const b = { ...defaultProgress(), ...cloud };

    const lessonsCompleted = mergeLessonsCompleted(
        a.lessonsCompleted,
        b.lessonsCompleted,
    );

    const badges = mergeStringLists(a.badges, b.badges);
    const completedStoryIds = mergeStringLists(
        a.completedStoryIds,
        b.completedStoryIds,
    );
    const completedListeningIds = mergeStringLists(
        a.completedListeningIds,
        b.completedListeningIds,
    );

    const today = todayKey();
    const aToday = a.todayDate === today;
    const bToday = b.todayDate === today;

    let todayActions = 0;
    let todayXp = 0;
    let dailyGoalMet = false;
    let todayDate: string | null = null;
    let todayMinutesPracticed = 0;

    if (aToday || bToday) {
        todayDate = today;
        todayActions = Math.max(
            aToday ? a.todayActions : 0,
            bToday ? b.todayActions : 0,
        );
        todayXp = Math.max(aToday ? a.todayXp : 0, bToday ? b.todayXp : 0);
        dailyGoalMet =
            (aToday && a.dailyGoalMet) || (bToday && b.dailyGoalMet);
        todayMinutesPracticed = Math.max(
            aToday ? a.todayMinutesPracticed || 0 : 0,
            bToday ? b.todayMinutesPracticed || 0 : 0,
        );
    }

    const lessonDirection: LessonDirection = isLessonDirection(a.lessonDirection)
        ? a.lessonDirection
        : isLessonDirection(b.lessonDirection)
          ? b.lessonDirection
          : null;

    const byId = new Map<string, SavedPhrase>();
    for (const ph of [...(a.savedPhrases || []), ...(b.savedPhrases || [])]) {
        if (ph?.id && !byId.has(ph.id)) byId.set(ph.id, ph);
    }

    const lastPracticedDate =
        (a.lastPracticedDate || "") > (b.lastPracticedDate || "")
            ? a.lastPracticedDate
            : b.lastPracticedDate || a.lastPracticedDate || today;

    const merged: ProgressState = {
        ...a,
        translations: Math.max(a.translations, b.translations),
        listeningCorrect: Math.max(a.listeningCorrect, b.listeningCorrect),
        readingSessions: Math.max(a.readingSessions, b.readingSessions),
        quizCorrect: Math.max(a.quizCorrect, b.quizCorrect),
        practiceSessions: Math.max(
            a.practiceSessions || 0,
            b.practiceSessions || 0,
        ),
        savedPhrases: Array.from(byId.values()).slice(0, 50),
        lessonsCompletedCount: Array.from(lessonsCompleted.values()).reduce(
            (sum, arr) => sum + arr.length,
            0,
        ),
        streak: Math.max(a.streak, b.streak),
        currentWord: a.currentWord || b.currentWord,
        currentWordDate: a.currentWordDate || b.currentWordDate,
        lastActiveDate:
            (a.lastActiveDate || "") > (b.lastActiveDate || "")
                ? a.lastActiveDate
                : b.lastActiveDate,
        lastTopic: a.lastTopic || b.lastTopic,
        lastLessonId: a.lastLessonId || b.lastLessonId,
        lessonProgress: mergeNestedLessonProgress(
            a.lessonProgress,
            b.lessonProgress,
        ),
        lessonsCompleted,
        completedStoryIds,
        completedListeningIds,
        lessonDirection,
        nativeLanguage: a.nativeLanguage || b.nativeLanguage,
        learningLanguage: a.learningLanguage || b.learningLanguage,
        xp: Math.max(a.xp ?? 0, b.xp ?? 0),
        dailyGoal: Math.max(
            a.dailyGoal ?? DEFAULT_DAILY_GOAL,
            b.dailyGoal ?? DEFAULT_DAILY_GOAL,
        ),
        todayActions,
        todayXp,
        todayDate,
        dailyGoalMet,
        lastPracticedDate,
        todayMinutesPracticed,
        dailyGoalMinutes: Math.max(
            a.dailyGoalMinutes || 0,
            b.dailyGoalMinutes || 0,
            DEFAULT_DAILY_GOAL,
        ),
        weeklyActivity: mergeWeeklyActivity(a.weeklyActivity, b.weeklyActivity),
        badges,
        cairnStonesCount: Math.max(
            a.cairnStonesCount || 0,
            b.cairnStonesCount || 0,
        ),
        // Prefer local preference flags when set
        soundEnabled:
            typeof a.soundEnabled === "boolean"
                ? a.soundEnabled
                : b.soundEnabled !== false,
        ambientSoundEnabled:
            typeof a.ambientSoundEnabled === "boolean"
                ? a.ambientSoundEnabled
                : Boolean(b.ambientSoundEnabled),
    };

    return (await applyBadgeUnlocks(merged)).progress;
}
