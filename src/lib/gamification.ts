import type { ActivityKind, ProgressState } from "@/lib/progress";

/** XP granted per activity kind. Lesson XP only when a lesson is completed. */
export const XP_REWARDS: Record<ActivityKind, number> = {
    translation: 3,
    listening: 5,
    reading: 8,
    quiz: 5,
    lesson: 25,
};

/** Soft daily activity target (actions that count toward the day). */
export const DEFAULT_DAILY_GOAL = 3;

/** Bonus XP once per day when the daily goal is met. */
export const DAILY_GOAL_BONUS_XP = 15;

/**
 * Level curve: level N requires N * 100 cumulative XP
 * (L1 @ 0, L2 @ 100, L3 @ 300, L4 @ 600, …).
 */
export function levelFromXp(xp: number): number {
    let level = 1;
    let need = 100;
    let remaining = Math.max(0, xp);
    while (remaining >= need) {
        remaining -= need;
        level += 1;
        need = level * 100;
    }
    return level;
}

/** XP progress within the current level (0–1 and counts). */
export function levelProgress(xp: number): {
    level: number;
    intoLevel: number;
    needForNext: number;
    ratio: number;
} {
    const level = levelFromXp(xp);
    let spent = 0;
    for (let l = 1; l < level; l++) {
        spent += l * 100;
    }
    const intoLevel = Math.max(0, xp - spent);
    const needForNext = level * 100;
    return {
        level,
        intoLevel,
        needForNext,
        ratio: needForNext === 0 ? 0 : Math.min(1, intoLevel / needForNext),
    };
}

export function xpForActivity(
    kind: ActivityKind,
    extra?: { lessonCompleted?: boolean },
): number {
    if (kind === "lesson") {
        return extra?.lessonCompleted ? XP_REWARDS.lesson : 0;
    }
    return XP_REWARDS[kind] ?? 0;
}

/** Minutes-based goal from onboarding mapped to activity count (gentle). */
export function dailyGoalFromMinutes(minutes?: number | null): number {
    if (!minutes || minutes <= 5) return 2;
    if (minutes <= 10) return 3;
    if (minutes <= 20) return 4;
    return 5;
}

export function ensureTodayCounters(state: ProgressState): ProgressState {
    const today = new Date().toISOString().slice(0, 10);
    if (state.todayDate === today) return state;
    return {
        ...state,
        todayDate: today,
        todayXp: 0,
        todayActions: 0,
        dailyGoalMet: false,
    };
}

export function applyXpAndDailyGoal(
    state: ProgressState,
    kind: ActivityKind,
    extra?: { lessonCompleted?: boolean },
): ProgressState {
    let next = ensureTodayCounters(state);
    const gained = xpForActivity(kind, extra);
    if (gained <= 0 && kind === "lesson" && !extra?.lessonCompleted) {
        return next;
    }

    // Count meaningful actions toward the daily goal
    const countsTowardGoal =
        kind !== "lesson" || Boolean(extra?.lessonCompleted);

    let todayActions = next.todayActions;
    let todayXp = next.todayXp + gained;
    let xp = next.xp + gained;
    let dailyGoalMet = next.dailyGoalMet;

    if (countsTowardGoal) {
        todayActions += 1;
    }

    const goal = next.dailyGoal || DEFAULT_DAILY_GOAL;

    if (!dailyGoalMet && todayActions >= goal) {
        dailyGoalMet = true;
        xp += DAILY_GOAL_BONUS_XP;
        todayXp += DAILY_GOAL_BONUS_XP;
    }

    return {
        ...next,
        xp,
        todayXp,
        todayActions,
        dailyGoalMet,
        dailyGoal: goal,
    };
}
