import { describe, expect, it } from "vitest";
import { defaultProgress, totalActivities } from "@/lib/progress";
import {
  bumpStreak,
  isLessonDirection,
  mergeStringLists,
  mergeWeeklyActivity,
} from "@/lib/progress-server";
import { levelFromXp } from "@/lib/gamification";

function utcKey(offsetDays = 0) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

describe("default progress", () => {
  it("starts at zero with empty collections", () => {
    const p = defaultProgress();
    expect(p.translations).toBe(0);
    expect(p.listeningCorrect).toBe(0);
    expect(p.readingSessions).toBe(0);
    expect(p.quizCorrect).toBe(0);
    expect(p.practiceSessions).toBe(0);
    expect(p.streak).toBe(0);
    expect(p.xp).toBe(0);
    expect(p.cairnStonesCount).toBe(0);
    expect(p.badges).toEqual([]);
    expect(p.savedPhrases).toEqual([]);
    expect(p.weeklyActivity).toEqual({});
    expect(totalActivities(p)).toBe(0);
  });
});

describe("totalActivities", () => {
  it("sums the activity counters", () => {
    const p = {
      ...defaultProgress(),
      translations: 2,
      listeningCorrect: 1,
      readingSessions: 3,
      quizCorrect: 4,
      practiceSessions: 1,
      lessonsCompletedCount: 2,
    };
    expect(totalActivities(p)).toBe(13);
  });
});

describe("bumpStreak", () => {
  it("does not change the streak when already active today", () => {
    const today = utcKey(0);
    const state = { ...defaultProgress(), streak: 4, lastActiveDate: today };
    expect(bumpStreak(state)).toEqual(state);
  });

  it("increments the streak when the last activity was yesterday", () => {
    const state = {
      ...defaultProgress(),
      streak: 4,
      lastActiveDate: utcKey(-1),
    };
    const next = bumpStreak(state);
    expect(next.streak).toBe(5);
    expect(next.lastActiveDate).toBe(utcKey(0));
  });

  it("resets the streak when the last activity is older than yesterday", () => {
    const state = {
      ...defaultProgress(),
      streak: 9,
      lastActiveDate: utcKey(-3),
    };
    const next = bumpStreak(state);
    expect(next.streak).toBe(1);
    expect(next.lastActiveDate).toBe(utcKey(0));
  });
});

describe("merge helpers", () => {
  it("unions string lists without duplicates", () => {
    expect(mergeStringLists(["a", "b"], ["b", "c"])).toEqual(["a", "b", "c"]);
  });

  it("keeps the higher count for each weekly activity day", () => {
    expect(
      mergeWeeklyActivity(
        { "2026-11-10": 2, "2026-11-11": 1 },
        { "2026-11-11": 4, "2026-11-12": 1 },
      ),
    ).toEqual({
      "2026-11-10": 2,
      "2026-11-11": 4,
      "2026-11-12": 1,
    });
  });
});

describe("isLessonDirection", () => {
  it("accepts known directions and rejects junk", () => {
    expect(isLessonDirection("en-es")).toBe(true);
    expect(isLessonDirection("es-en")).toBe(true);
    expect(isLessonDirection("nope")).toBe(false);
    expect(isLessonDirection(null)).toBe(false);
  });
});

describe("levelFromXp", () => {
  it("starts at level 1 and steps up the curve", () => {
    expect(levelFromXp(0)).toBe(1);
    expect(levelFromXp(99)).toBe(1);
    expect(levelFromXp(100)).toBe(2);
    expect(levelFromXp(300)).toBe(3);
  });
});
