import type { LessonDirection } from "@/data/lessons";
import { isDirectionCode } from "@/data/multi-native";
import { applyBadgeUnlocks } from "@/data/badges";
import {
  applyXpAndDailyGoal,
  type ActivityKind,
} from "@/lib/gamification";
import {
  defaultProgress,
  type ProgressState,
  type LessonProgressEntry,
  type SavedPhrase,
} from "@/lib/progress";

export function isLessonDirection(
  v: unknown,
): v is Exclude<LessonDirection, null> {
  return isDirectionCode(v);
}

/** UTC calendar day key (YYYY-MM-DD). Matches the keys used by progress tests. */
export function utcDateKey(offsetDays = 0): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

export function bumpStreak(state: ProgressState): ProgressState {
  const today = utcDateKey(0);
  const yesterday = utcDateKey(-1);
  if (state.lastActiveDate === today) return state;
  if (state.lastActiveDate === yesterday) {
    return { ...state, streak: (state.streak || 0) + 1, lastActiveDate: today };
  }
  return { ...state, streak: 1, lastActiveDate: today };
}

/** Union two string lists, preserving first-list order and dropping duplicates. */
export function mergeStringLists(a: string[] = [], b: string[] = []): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of [...a, ...b]) {
    if (typeof item !== "string" || seen.has(item)) continue;
    seen.add(item);
    out.push(item);
  }
  return out;
}

/** Keep the higher count for each day key. */
export function mergeWeeklyActivity(
  a: Record<string, number> = {},
  b: Record<string, number> = {},
): Record<string, number> {
  const keys = new Set([...Object.keys(a || {}), ...Object.keys(b || {})]);
  const out: Record<string, number> = {};
  for (const key of keys) {
    const av = typeof a[key] === "number" ? a[key] : 0;
    const bv = typeof b[key] === "number" ? b[key] : 0;
    out[key] = Math.max(av, bv);
  }
  return out;
}

function maxNum(a: number | undefined, b: number | undefined): number {
  return Math.max(a || 0, b || 0);
}

function mergeMapsOfMaps(
  a: Map<string, Map<string, LessonProgressEntry>>,
  b: Map<string, Map<string, LessonProgressEntry>>,
): Map<string, Map<string, LessonProgressEntry>> {
  const out = new Map(a);
  for (const [dir, lessons] of b) {
    const existing = new Map(out.get(dir) || []);
    for (const [id, entry] of lessons) {
      const prev = existing.get(id);
      if (!prev || entry.currentStep > prev.currentStep || entry.completed) {
        existing.set(id, {
          currentStep: Math.max(prev?.currentStep || 0, entry.currentStep || 0),
          completed: Boolean(prev?.completed || entry.completed),
        });
      }
    }
    out.set(dir, existing);
  }
  return out;
}

function mergeMapsOfArrays(
  a: Map<string, string[]>,
  b: Map<string, string[]>,
): Map<string, string[]> {
  const out = new Map(a);
  for (const [dir, ids] of b) {
    out.set(dir, mergeStringLists(out.get(dir) || [], ids));
  }
  return out;
}

function mergeSavedPhrases(
  a: SavedPhrase[] = [],
  b: SavedPhrase[] = [],
): SavedPhrase[] {
  const byId = new Map<string, SavedPhrase>();
  for (const ph of [...a, ...b]) {
    if (!ph?.id || !ph.text) continue;
    const prev = byId.get(ph.id);
    if (!prev || (ph.savedAt && prev.savedAt && ph.savedAt > prev.savedAt)) {
      byId.set(ph.id, ph);
    }
  }
  return Array.from(byId.values()).slice(0, 50);
}

/**
 * Merge two progress snapshots (typically local + cloud).
 * Numbers take the max; lists are unioned; weekly activity keeps the higher count.
 */
export async function mergeProgress(
  a: ProgressState,
  b: ProgressState,
): Promise<ProgressState> {
  const base = defaultProgress();
  const lessonProgress = mergeMapsOfMaps(
    a.lessonProgress || new Map(),
    b.lessonProgress || new Map(),
  );
  const lessonsCompleted = mergeMapsOfArrays(
    a.lessonsCompleted || new Map(),
    b.lessonsCompleted || new Map(),
  );

  const next: ProgressState = {
    ...base,
    translations: maxNum(a.translations, b.translations),
    listeningCorrect: maxNum(a.listeningCorrect, b.listeningCorrect),
    readingSessions: maxNum(a.readingSessions, b.readingSessions),
    quizCorrect: maxNum(a.quizCorrect, b.quizCorrect),
    practiceSessions: maxNum(a.practiceSessions, b.practiceSessions),
    savedPhrases: mergeSavedPhrases(a.savedPhrases, b.savedPhrases),
    lessonsCompletedCount: Array.from(lessonsCompleted.values()).reduce(
      (sum, arr) => sum + arr.length,
      0,
    ),
    streak: maxNum(a.streak, b.streak),
    currentWord: a.currentWord || b.currentWord || null,
    currentWordDate: a.currentWordDate || b.currentWordDate || null,
    lastActiveDate:
      (a.lastActiveDate || "") > (b.lastActiveDate || "")
        ? a.lastActiveDate
        : b.lastActiveDate || null,
    lastTopic: a.lastTopic || b.lastTopic || null,
    lastLessonId: a.lastLessonId || b.lastLessonId || null,
    lessonProgress,
    lessonsCompleted,
    completedStoryIds: mergeStringLists(
      a.completedStoryIds,
      b.completedStoryIds,
    ),
    completedListeningIds: mergeStringLists(
      a.completedListeningIds,
      b.completedListeningIds,
    ),
    lessonDirection: isLessonDirection(a.lessonDirection)
      ? a.lessonDirection
      : isLessonDirection(b.lessonDirection)
        ? b.lessonDirection
        : null,
    nativeLanguage: a.nativeLanguage || b.nativeLanguage || null,
    learningLanguage: a.learningLanguage || b.learningLanguage || null,
    xp: maxNum(a.xp, b.xp),
    dailyGoal: Math.max(a.dailyGoal || 0, b.dailyGoal || 0) || base.dailyGoal,
    todayActions: maxNum(a.todayActions, b.todayActions),
    todayXp: maxNum(a.todayXp, b.todayXp),
    todayDate: a.todayDate || b.todayDate || null,
    dailyGoalMet: Boolean(a.dailyGoalMet || b.dailyGoalMet),
    lastPracticedDate:
      (a.lastPracticedDate || "") > (b.lastPracticedDate || "")
        ? a.lastPracticedDate
        : b.lastPracticedDate || base.lastPracticedDate,
    todayMinutesPracticed: maxNum(
      a.todayMinutesPracticed,
      b.todayMinutesPracticed,
    ),
    dailyGoalMinutes:
      Math.max(a.dailyGoalMinutes || 0, b.dailyGoalMinutes || 0) ||
      base.dailyGoalMinutes,
    weeklyActivity: mergeWeeklyActivity(a.weeklyActivity, b.weeklyActivity),
    badges: mergeStringLists(a.badges, b.badges),
    cairnStonesCount: maxNum(a.cairnStonesCount, b.cairnStonesCount),
    soundEnabled: a.soundEnabled !== false && b.soundEnabled !== false,
    ambientSoundEnabled: Boolean(
      a.ambientSoundEnabled || b.ambientSoundEnabled,
    ),
  };

  const { progress } = await applyBadgeUnlocks(next);
  return progress;
}

export type ApplyActivityExtra = {
  topic?: string;
  lessonId?: string;
  stepIndex?: number;
  lessonCompleted?: boolean;
  direction?: LessonDirection;
  xpEarned?: number;
  minutes?: number;
};

/**
 * Server-side equivalent of the client `recordActivity` path.
 * Updates counters, streak, XP, weekly minutes, and badges.
 */
export async function applyActivity(
  state: ProgressState,
  kind: ActivityKind,
  extra: ApplyActivityExtra = {},
): Promise<ProgressState> {
  let next = bumpStreak(state);

  if (kind === "translation")
    next = { ...next, translations: (next.translations || 0) + 1 };
  if (kind === "listening")
    next = { ...next, listeningCorrect: (next.listeningCorrect || 0) + 1 };
  if (kind === "reading")
    next = { ...next, readingSessions: (next.readingSessions || 0) + 1 };
  if (kind === "quiz")
    next = { ...next, quizCorrect: (next.quizCorrect || 0) + 1 };
  if (kind === "practice")
    next = { ...next, practiceSessions: (next.practiceSessions || 0) + 1 };

  if (kind === "lesson" && extra.lessonId) {
    const lessonId = extra.lessonId;
    const stepIndex = extra.stepIndex ?? 0;
    const completed = Boolean(extra.lessonCompleted);
    const direction: Exclude<LessonDirection, null> | null =
      isLessonDirection(extra.direction)
        ? extra.direction
        : isLessonDirection(next.lessonDirection)
          ? next.lessonDirection
          : null;

    if (direction) {
      const entry: LessonProgressEntry = {
        currentStep: stepIndex,
        completed,
      };

      const lessonProgress = new Map(next.lessonProgress || []);
      const existingDirectionMap = lessonProgress.get(direction);
      const directionProgress = new Map(existingDirectionMap || []);
      directionProgress.set(lessonId, entry);
      lessonProgress.set(direction, directionProgress);

      const lessonsCompleted = new Map(next.lessonsCompleted || []);
      const completedLessons = [...(lessonsCompleted.get(direction) ?? [])];

      if (completed && !completedLessons.includes(lessonId)) {
        completedLessons.push(lessonId);
        lessonsCompleted.set(direction, completedLessons);
      }

      next = {
        ...next,
        lessonProgress,
        lessonsCompleted,
        lessonDirection: direction,
        cairnStonesCount:
          (next.cairnStonesCount || 0) + (completed ? 1 : 0),
        lessonsCompletedCount: Array.from(lessonsCompleted.values()).reduce(
          (sum, arr) => sum + arr.length,
          0,
        ),
        lastLessonId: lessonId,
      };
    }
  }

  if (extra.topic) next = { ...next, lastTopic: extra.topic };

  if (typeof extra.minutes === "number" && extra.minutes > 0) {
    const today = utcDateKey(0);
    const weekly = { ...(next.weeklyActivity || {}) };
    weekly[today] = (weekly[today] || 0) + extra.minutes;
    next = {
      ...next,
      todayMinutesPracticed:
        (next.todayDate === today ? next.todayMinutesPracticed || 0 : 0) +
        extra.minutes,
      lastPracticedDate: today,
      weeklyActivity: weekly,
    };
  }

  next = applyXpAndDailyGoal(next, kind, {
    lessonCompleted: extra.lessonCompleted,
    xpEarned: extra.xpEarned,
  });

  const { progress } = await applyBadgeUnlocks(next);
  return progress;
}
