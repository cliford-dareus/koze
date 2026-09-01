import type { ActivityKind, ProgressState } from "@/lib/progress";
import { defaultProgress } from "@/lib/progress";

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayKey() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
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
    const lessonProgress = {
      ...(next.lessonProgress || {}),
      [lessonId]: { currentStep: stepIndex, completed },
    };
    let lessonsCompleted = [...(next.lessonsCompleted || [])];
    if (completed && !lessonsCompleted.includes(lessonId)) {
      lessonsCompleted.push(lessonId);
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

  return next;
}

function mergeLessonProgress(
  a: ProgressState["lessonProgress"],
  b: ProgressState["lessonProgress"],
): ProgressState["lessonProgress"] {
  const keys = Array.from(
    new Set([...Object.keys(a || {}), ...Object.keys(b || {})]),
  );
  const out: ProgressState["lessonProgress"] = {};
  for (const key of keys) {
    const left = a?.[key];
    const right = b?.[key];
    if (!left) out[key] = right!;
    else if (!right) out[key] = left;
    else {
      out[key] = {
        completed: left.completed || right.completed,
        currentStep: Math.max(left.currentStep, right.currentStep),
      };
    }
  }
  return out;
}

export function mergeProgress(
  local: ProgressState,
  cloud: ProgressState,
): ProgressState {
  const a = { ...defaultProgress(), ...local };
  const b = { ...defaultProgress(), ...cloud };

  const lessonsCompleted = Array.from(
    new Set([...(a.lessonsCompleted || []), ...(b.lessonsCompleted || [])]),
  );

  return {
    translations: Math.max(a.translations, b.translations),
    listeningCorrect: Math.max(a.listeningCorrect, b.listeningCorrect),
    readingSessions: Math.max(a.readingSessions, b.readingSessions),
    quizCorrect: Math.max(a.quizCorrect, b.quizCorrect),
    lessonsCompletedCount: lessonsCompleted.length,
    streak: Math.max(a.streak, b.streak),
    currentWord: a.currentWord || b.currentWord,
    currentWordDate: a.currentWordDate || b.currentWordDate,
    lastActiveDate:
      (a.lastActiveDate || "") > (b.lastActiveDate || "")
        ? a.lastActiveDate
        : b.lastActiveDate,
    lastTopic: a.lastTopic || b.lastTopic,
    lastLessonId: a.lastLessonId || b.lastLessonId,
    lessonProgress: mergeLessonProgress(a.lessonProgress, b.lessonProgress),
    lessonsCompleted,
  };
}
