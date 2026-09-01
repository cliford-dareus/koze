"use client";

import { useEffect, useMemo, useState } from "react";
import {
  defaultProgress,
  loadProgress,
  type ProgressState,
} from "@/lib/progress";
import {
  DEFAULT_DAILY_GOAL,
  ensureTodayCounters,
  levelProgress,
} from "@/lib/gamification";

export default function ProgressSummary() {
  const [progress, setProgress] = useState<ProgressState>(defaultProgress());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const refresh = () => {
      const p = ensureTodayCounters(loadProgress());
      setProgress(p);
    };
    refresh();
    setReady(true);
    window.addEventListener("storage", refresh);
    window.addEventListener("koze-progress", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("koze-progress", refresh);
    };
  }, []);

  const levelInfo = useMemo(
    () => levelProgress(progress.xp ?? 0),
    [progress.xp],
  );

  if (!ready) return null;

  const goal = progress.dailyGoal || DEFAULT_DAILY_GOAL;
  const todayActions = progress.todayActions ?? 0;
  const goalRatio = Math.min(1, todayActions / goal);
  const goalMet = progress.dailyGoalMet || todayActions >= goal;
  const lessons =
    progress.lessonsCompletedCount ||
    progress.lessonsCompleted?.length ||
    0;

  return (
    <div className="mt-6 space-y-3">
      <div className="rounded-xl border border-border bg-card p-4 shadow-soft">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Level {levelInfo.level}
            </p>
            <p className="mt-1 font-display text-2xl font-medium">
              {progress.xp ?? 0}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                XP
              </span>
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            {levelInfo.intoLevel}/{levelInfo.needForNext} to next
          </p>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${Math.round(levelInfo.ratio * 100)}%` }}
          />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 shadow-soft">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Today’s goal
            </p>
            <p className="mt-1 font-display text-lg font-medium">
              {Math.min(todayActions, goal)}/{goal}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                actions
              </span>
            </p>
          </div>
          <span
            className={
              "rounded-full px-2.5 py-1 text-[11px] font-medium " +
              (goalMet
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground")
            }
          >
            {goalMet ? "Done" : `${Math.round(goalRatio * 100)}%`}
          </span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary/80 transition-all duration-300"
            style={{ width: `${Math.round(goalRatio * 100)}%` }}
          />
        </div>
        {goalMet ? (
          <p className="mt-2 text-xs text-muted-foreground">
            Daily goal met · +15 XP bonus applied
          </p>
        ) : (
          <p className="mt-2 text-xs text-muted-foreground">
            Finish a lesson, listen, read, translate, or quiz to advance.
          </p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Stat label="Streak" value={`${progress.streak}d`} />
        <Stat label="Lessons" value={String(lessons)} />
        <Stat label="Today XP" value={String(progress.todayXp ?? 0)} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-3 text-center shadow-soft">
      <p className="font-display text-xl font-medium">{value}</p>
      <p className="mt-0.5 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
