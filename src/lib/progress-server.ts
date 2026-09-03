import type {
    ActivityKind,
    LessonDirection,
    ProgressState,
} from "@/lib/progress";
import { defaultProgress } from "@/lib/progress";
import { applyXpAndDailyGoal, DEFAULT_DAILY_GOAL } from "@/lib/gamification";
import { applyBadgeUnlocks } from "@/data/badges";

function todayKey() {
    return new Date().toISOString().slice(0, 10);
}

function yesterdayKey() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().slice(0, 10);
}

function isLessonDirection(v: unknown): v is LessonDirection {
    return v === "en-fr" || v === "fr-en";
}

export function bumpStreak(state: ProgressState): ProgressState {
    const today = todayKey();
    if (state.lastActiveDate === today) return state;
    if (state.lastActiveDate === yesterdayKey()) {
        return { ...state, streak: state.streak + 1, lastActiveDate: today };
    }
    return { ...state, streak: 1, lastActiveDate: today };
}

export function applyActivity(
    prev: ProgressState,
    kind: ActivityKind,
    extra?: {
        topic?: string;
        lessonId?: string;
        stepIndex?: number;
        lessonCompleted?: boolean;
        direction?: string;
    },
): ProgressState {
    let next = bumpStreak({ ...defaultProgress(), ...prev });

    if (kind === "translation")
        next = { ...next, translations: next.translations + 1 };
    if (kind === "listening")
        next = { ...next, listeningCorrect: next.listeningCorrect + 1 };
    if (kind === "reading")
        next = { ...next, readingSessions: next.readingSessions + 1 };
    if (kind === "quiz") next = { ...next, quizCorrect: next.quizCorrect + 1 };

    if (kind === "lesson" && extra?.lessonId) {
        const lessonId = extra.lessonId;
        const stepIndex = extra.stepIndex ?? 0;
        const completed = Boolean(extra.lessonCompleted);
        const direction: LessonDirection = isLessonDirection(extra.direction)
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
        };
    }

    if (extra?.topic) next = { ...next, lastTopic: extra.topic };

    next = applyXpAndDailyGoal(next, kind, {
        lessonCompleted: extra?.lessonCompleted,
    });

    const { progress } = applyBadgeUnlocks(next);
    return progress;
}

function mergeNestedLessonProgress(
    a: ProgressState["lessonProgress"],
    b: ProgressState["lessonProgress"],
): ProgressState["lessonProgress"] {
    const out = new Map<string, Map<string, { currentStep: number; completed: boolean }>>();
    const directions = new Set<string>([
        ...Array.from(a?.keys?.() ?? []),
        ...Array.from(b?.keys?.() ?? []),
    ]);

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
    const directions = new Set<string>([
        ...Array.from(a?.keys?.() ?? []),
        ...Array.from(b?.keys?.() ?? []),
    ]);
    for (const dir of directions) {
        const ids = Array.from(
            new Set([...(a?.get?.(dir) ?? []), ...(b?.get?.(dir) ?? [])]),
        );
        out.set(dir, ids);
    }
    return out;
}

export function mergeProgress(
    local: ProgressState,
    cloud: ProgressState,
): ProgressState {
    const a = { ...defaultProgress(), ...local };
    const b = { ...defaultProgress(), ...cloud };

    const lessonsCompleted = mergeLessonsCompleted(
        a.lessonsCompleted,
        b.lessonsCompleted,
    );

    const badges = Array.from(
        new Set([...(a.badges || []), ...(b.badges || [])]),
    );

    const today = todayKey();
    const aToday = a.todayDate === today;
    const bToday = b.todayDate === today;

    let todayActions = 0;
    let todayXp = 0;
    let dailyGoalMet = false;
    let todayDate: string | null = null;

    if (aToday || bToday) {
        todayDate = today;
        todayActions = Math.max(
            aToday ? a.todayActions : 0,
            bToday ? b.todayActions : 0,
        );
        todayXp = Math.max(aToday ? a.todayXp : 0, bToday ? b.todayXp : 0);
        dailyGoalMet =
            (aToday && a.dailyGoalMet) || (bToday && b.dailyGoalMet);
    }

    // Prefer local lessonDirection when set; otherwise cloud; default en-fr
    const lessonDirection: LessonDirection = isLessonDirection(a.lessonDirection)
        ? a.lessonDirection
        : isLessonDirection(b.lessonDirection)
          ? b.lessonDirection
          : "en-fr";

    const merged: ProgressState = {
        translations: Math.max(a.translations, b.translations),
        listeningCorrect: Math.max(a.listeningCorrect, b.listeningCorrect),
        readingSessions: Math.max(a.readingSessions, b.readingSessions),
        quizCorrect: Math.max(a.quizCorrect, b.quizCorrect),
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
        lessonDirection,
        xp: Math.max(a.xp ?? 0, b.xp ?? 0),
        dailyGoal: Math.max(
            a.dailyGoal ?? DEFAULT_DAILY_GOAL,
            b.dailyGoal ?? DEFAULT_DAILY_GOAL,
        ),
        todayActions,
        todayXp,
        todayDate,
        dailyGoalMet,
        badges,
    };

    return applyBadgeUnlocks(merged).progress;
}
