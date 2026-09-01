import type { ProgressState } from "@/lib/progress";
import { LESSONS, UNITS } from "@/data/lessons";
import { levelFromXp } from "@/lib/gamification";

export type BadgeDef = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  /** Return true when the learner has earned this badge. */
  isEarned: (p: ProgressState) => boolean;
};

function unitComplete(p: ProgressState, unitId: string): boolean {
  const ids = LESSONS.filter((l) => l.unitId === unitId).map((l) => l.id);
  if (!ids.length) return false;
  const done = new Set(p.lessonsCompleted || []);
  return ids.every((id) => done.has(id));
}

export const BADGES: BadgeDef[] = [
  {
    id: "first-steps",
    title: "First steps",
    description: "Complete any practice action.",
    emoji: "🌱",
    isEarned: (p) =>
      p.translations +
        p.listeningCorrect +
        p.readingSessions +
        p.quizCorrect +
        (p.lessonsCompleted?.length || 0) >=
      1,
  },
  {
    id: "first-lesson",
    title: "Lesson learned",
    description: "Finish your first structured lesson.",
    emoji: "📖",
    isEarned: (p) => (p.lessonsCompleted?.length || 0) >= 1,
  },
  {
    id: "streak-3",
    title: "Three quiet days",
    description: "Keep a 3-day streak.",
    emoji: "🕯️",
    isEarned: (p) => (p.streak || 0) >= 3,
  },
  {
    id: "streak-7",
    title: "Week of practice",
    description: "Keep a 7-day streak.",
    emoji: "🌙",
    isEarned: (p) => (p.streak || 0) >= 7,
  },
  {
    id: "ear-tuned",
    title: "Ear tuned",
    description: "Get 10 listening answers right.",
    emoji: "🎧",
    isEarned: (p) => (p.listeningCorrect || 0) >= 10,
  },
  {
    id: "polyglot-desk",
    title: "Polyglot desk",
    description: "Complete 25 translations.",
    emoji: "✍️",
    isEarned: (p) => (p.translations || 0) >= 25,
  },
  {
    id: "reader",
    title: "Quiet reader",
    description: "Finish 10 reading sessions.",
    emoji: "📕",
    isEarned: (p) => (p.readingSessions || 0) >= 10,
  },
  {
    id: "quiz-mind",
    title: "Quiz mind",
    description: "Answer 20 quiz questions correctly.",
    emoji: "🧩",
    isEarned: (p) => (p.quizCorrect || 0) >= 20,
  },
  {
    id: "foundations-seal",
    title: "Foundations seal",
    description: "Complete every Foundations lesson.",
    emoji: "🏛️",
    isEarned: (p) => unitComplete(p, "foundations"),
  },
  {
    id: "everyday-seal",
    title: "Everyday seal",
    description: "Complete every Everyday life lesson.",
    emoji: "☕",
    isEarned: (p) => unitComplete(p, "everyday"),
  },
  {
    id: "travel-seal",
    title: "Travel seal",
    description: "Complete every Travel lesson.",
    emoji: "🚂",
    isEarned: (p) => unitComplete(p, "travel"),
  },
  {
    id: "level-3",
    title: "Rising steady",
    description: "Reach level 3.",
    emoji: "✨",
    isEarned: (p) => levelFromXp(p.xp || 0) >= 3,
  },
  {
    id: "level-5",
    title: "Steady light",
    description: "Reach level 5.",
    emoji: "🔆",
    isEarned: (p) => levelFromXp(p.xp || 0) >= 5,
  },
  {
    id: "daily-devotee",
    title: "Daily devotee",
    description: "Meet your daily goal.",
    emoji: "🎯",
    isEarned: (p) => Boolean(p.dailyGoalMet),
  },
  {
    id: "curriculum",
    title: "Full path",
    description: "Complete all lessons in the catalog.",
    emoji: "🏅",
    isEarned: (p) =>
      LESSONS.length > 0 &&
      LESSONS.every((l) => (p.lessonsCompleted || []).includes(l.id)),
  },
];

export function getBadge(id: string): BadgeDef | undefined {
  return BADGES.find((b) => b.id === id);
}

/** Newly earned badge ids not yet stored on progress. */
export function evaluateNewBadges(p: ProgressState): string[] {
  const have = new Set(p.badges || []);
  const earned: string[] = [];
  for (const badge of BADGES) {
    if (have.has(badge.id)) continue;
    try {
      if (badge.isEarned(p)) earned.push(badge.id);
    } catch {
      // ignore bad evaluators
    }
  }
  return earned;
}

export function applyBadgeUnlocks(p: ProgressState): {
  progress: ProgressState;
  unlocked: string[];
} {
  const unlocked = evaluateNewBadges(p);
  if (!unlocked.length) return { progress: p, unlocked: [] };
  const badges = Array.from(new Set([...(p.badges || []), ...unlocked]));
  return {
    progress: { ...p, badges },
    unlocked,
  };
}

// Keep UNITS referenced so tree-shaking doesn’t drop unit helpers in some builds
void UNITS;
