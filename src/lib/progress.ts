import {
  applyXpAndDailyGoal,
  DEFAULT_DAILY_GOAL,
  levelFromXp,
} from "@/lib/gamification";

export type LessonProgressEntry = {
  currentStep: number;
  completed: boolean;
};

export type ProgressState = {
  translations: number;
  listeningCorrect: number;
  readingSessions: number;
  quizCorrect: number;
  lessonsCompletedCount: number;
  streak: number;
  currentWord: string | null;
  currentWordDate: string | null;
  lastActiveDate: string | null;
  lastTopic: string | null;
  lastLessonId: string | null;
  lessonProgress: Record<string, LessonProgressEntry>;
  lessonsCompleted: string[];
  /** Lifetime XP */
  xp: number;
  /** Target actions per day */
  dailyGoal: number;
  /** Actions completed today (toward goal) */
  todayActions: number;
  /** XP earned today */
  todayXp: number;
  /** YYYY-MM-DD for today counters */
  todayDate: string | null;
  /** Whether daily goal bonus already granted today */
  dailyGoalMet: boolean;
};

export const PROGRESS_KEY = "koze-progress-v1";

export const defaultProgress = (): ProgressState => ({
  translations: 0,
  listeningCorrect: 0,
  readingSessions: 0,
  quizCorrect: 0,
  lessonsCompletedCount: 0,
  streak: 0,
  currentWord: null,
  currentWordDate: null,
  lastActiveDate: null,
  lastTopic: null,
  lastLessonId: null,
  lessonProgress: {},
  lessonsCompleted: [],
  xp: 0,
  dailyGoal: DEFAULT_DAILY_GOAL,
  todayActions: 0,
  todayXp: 0,
  todayDate: null,
  dailyGoalMet: false,
});

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayKey() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function loadProgress(): ProgressState {
  if (typeof window === "undefined") return defaultProgress();
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return defaultProgress();
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return {
      ...defaultProgress(),
      ...parsed,
      lessonProgress: parsed.lessonProgress ?? {},
      lessonsCompleted: parsed.lessonsCompleted ?? [],
      xp: parsed.xp ?? 0,
      dailyGoal: parsed.dailyGoal ?? DEFAULT_DAILY_GOAL,
      todayActions: parsed.todayActions ?? 0,
      todayXp: parsed.todayXp ?? 0,
      todayDate: parsed.todayDate ?? null,
      dailyGoalMet: parsed.dailyGoalMet ?? false,
    };
  } catch {
    return defaultProgress();
  }
}

export function saveProgress(state: ProgressState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent("koze-progress"));
  } catch {
    // quota / private mode
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
  | "lesson";

export function recordActivity(
  kind: ActivityKind,
  extra?: {
    topic?: string;
    lessonId?: string;
    stepIndex?: number;
    lessonCompleted?: boolean;
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

  if (kind === "lesson" && extra?.lessonId) {
    const lessonId = extra.lessonId;
    const stepIndex = extra.stepIndex ?? 0;
    const completed = Boolean(extra.lessonCompleted);
    const entry: LessonProgressEntry = {
      currentStep: stepIndex,
      completed,
    };
    const lessonProgress = { ...next.lessonProgress, [lessonId]: entry };
    let lessonsCompleted = next.lessonsCompleted;
    if (completed && !lessonsCompleted.includes(lessonId)) {
      lessonsCompleted = [...lessonsCompleted, lessonId];
    }
    next = {
      ...next,
      lessonProgress,
      lessonsCompleted,
      lessonsCompletedCount: lessonsCompleted.length,
      lastLessonId: lessonId,
    };
  }

  if (extra?.topic) next = { ...next, lastTopic: extra.topic };

  next = applyXpAndDailyGoal(next, kind, {
    lessonCompleted: extra?.lessonCompleted,
  });

  saveProgress(next);

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
          saveProgress({ ...defaultProgress(), ...data.progress });
        }
      })
      .catch(() => {});
  }

  return next;
}

export function totalActivities(p: ProgressState) {
  return (
    p.translations +
    p.listeningCorrect +
    p.readingSessions +
    p.quizCorrect +
    (p.lessonsCompletedCount || p.lessonsCompleted?.length || 0)
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
        saveProgress({ ...defaultProgress(), ...data.progress });
        return data.progress as ProgressState;
      }
    }

    const getRes = await fetch("/api/progress");
    if (getRes.ok) {
      const data = await getRes.json();
      if (data?.success && data.progress) {
        saveProgress({ ...defaultProgress(), ...data.progress });
        return data.progress as ProgressState;
      }
    }
  } catch {
    // keep local
  }

  return local;
}
