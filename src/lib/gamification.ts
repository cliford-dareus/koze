import type { ActivityKind, ProgressState } from "@/lib/progress";

/** XP granted per activity kind. Lesson XP only when a lesson is completed. */
export const XP_REWARDS: Record<ActivityKind, number> = {
    translation: 3,
    listening: 5,
    reading: 8,
    quiz: 5,
    practice: 12,
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
    let level = 1;
    let need = 100;
    let remaining = Math.max(0, xp);
    while (remaining >= need) {
        remaining -= need;
        level += 1;
        need = level * 100;
    }
    return {
        level,
        intoLevel: remaining,
        needForNext: need,
        ratio: need > 0 ? remaining / need : 0,
    };
}

function todayKey() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

/** Reset daily counters when the local calendar day changes. */
export function ensureTodayCounters(state: ProgressState): ProgressState {
    const today = todayKey();
    if (state.todayDate === today) return state;
    return {
        ...state,
        todayDate: today,
        todayActions: 0,
        todayXp: 0,
        dailyGoalMet: false,
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

/**
 * Apply XP and daily-goal bookkeeping for one activity.
 * Lesson steps that are not completions grant 0 XP and do not count toward the goal.
 */
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
