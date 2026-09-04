"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { BADGES, BADGES_ICON_MAP } from "@/data/badges";
import {
  DEFAULT_DAILY_GOAL,
  ensureTodayCounters,
  levelProgress,
} from "@/lib/gamification";
import {
  defaultProgress,
  loadProgress,
  totalActivities,
  type ProgressState,
} from "@/lib/progress";
import { languageLabel } from "@/lib/languages";
import {
  learningTrackLabel,
  loadLearningPrefs,
} from "@/lib/learning-prefs";
import { Button } from "@/app/_components/ui/button";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [progress, setProgress] = useState<ProgressState>(defaultProgress());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const refresh = () => {
      setProgress(ensureTodayCounters(loadProgress()));
    };
    refresh();
    setReady(true);
    window.addEventListener("koze-progress", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("koze-progress", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const levelInfo = useMemo(
    () => levelProgress(progress.xp ?? 0),
    [progress.xp],
  );

  const prefs = useMemo(() => {
    if (typeof window === "undefined") return null;
    return loadLearningPrefs();
  }, [ready, progress.lessonDirection]);

  const earned = useMemo(
    () => new Set(progress.badges || []),
    [progress.badges],
  );

  const direction = progress.lessonDirection || "en-fr";
  const lessonsDone =
    progress.lessonsCompleted?.get?.(direction)?.length ??
    progress.lessonsCompletedCount ??
    0;

  const goal = progress.dailyGoal || DEFAULT_DAILY_GOAL;
  const todayActions = progress.todayActions ?? 0;
  const goalRatio = Math.min(1, todayActions / goal);
  const goalMet = progress.dailyGoalMet || todayActions >= goal;

  const displayName =
    session?.user?.name ||
    (status === "authenticated" ? "Learner" : "Guest");
  const initial = displayName.trim().charAt(0).toUpperCase() || "K";

  if (!ready) {
    return (
      <div className="app-shell">
        <p className="text-sm text-muted-foreground">Loading profile…</p>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        Profile
      </p>

      <header className="mt-3 flex items-start gap-4">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary font-display text-2xl font-medium text-primary-foreground">
          {initial}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-3xl font-medium tracking-tight">
            {displayName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {session?.user?.email
              ? session.user.email
              : "Practicing as a guest on this device"}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {learningTrackLabel(direction)}
            {prefs?.learningLanguage
              ? ` · learning ${languageLabel(prefs.learningLanguage)}`
              : null}
          </p>
        </div>
      </header>

      <div className="mt-6 flex flex-wrap gap-2">
        {!session?.user ? (
          <>
            <Button asChild size="sm">
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/register">Create account</Link>
            </Button>
          </>
        ) : (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Sign out
          </Button>
        )}
        <Button asChild size="sm" variant="ghost">
          <Link href="/lessons">Lessons</Link>
        </Button>
      </div>

      {/* Level */}
      <section className="mt-8 rounded-xl border border-border bg-card p-4 shadow-soft">
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
      </section>

      {/* Daily goal */}
      <section className="mt-3 rounded-xl border border-border bg-card p-4 shadow-soft">
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
      </section>

      {/* Stats grid */}
      <section className="mt-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Activity
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          <Stat label="Streak" value={`${progress.streak}d`} />
          <Stat label="Total actions" value={String(totalActivities(progress))} />
          <Stat label="Lessons done" value={String(lessonsDone)} />
          <Stat label="Translations" value={String(progress.translations)} />
          <Stat label="Listening" value={String(progress.listeningCorrect)} />
          <Stat label="Reading" value={String(progress.readingSessions)} />
          <Stat label="Quiz correct" value={String(progress.quizCorrect)} />
          <Stat label="Today XP" value={String(progress.todayXp ?? 0)} />
          <Stat
            label="Track"
            value={direction === "fr-en" ? "FR→EN" : "EN→FR"}
          />
        </div>
      </section>

      {/* Badges */}
      <section className="mt-8">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Badges
          </p>
          <span className="text-xs text-muted-foreground">
            {earned.size}/{BADGES.length}
          </span>
        </div>

        <ul className="mt-3 space-y-2">
          {BADGES.map((badge) => {
            const on = earned.has(badge.id);
            const icon = BADGES_ICON_MAP[badge.id];
            return (
              <li
                key={badge.id}
                className={
                  "flex items-start gap-3 rounded-xl border p-3 shadow-soft " +
                  (on
                    ? "border-primary/25 bg-card"
                    : "border-border/70 bg-muted/20 opacity-70")
                }
              >
                <span
                  className={
                    "flex size-12 shrink-0 items-center justify-center rounded-xl " +
                    (on ? "bg-accent" : "bg-muted")
                  }
                >
                  {icon ? (
                    <Image
                      src={icon}
                      width={28}
                      height={28}
                      alt=""
                      className="size-7"
                    />
                  ) : (
                    <span className="text-xl" aria-hidden>
                      {badge.emoji}
                    </span>
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-base font-medium">
                      {badge.title}
                    </h3>
                    {on ? (
                      <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground">
                        Earned
                      </span>
                    ) : (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                        Locked
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {badge.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <p className="mt-8 mb-4 text-center text-xs text-muted-foreground">
        Progress stays on this device
        {session?.user ? " and syncs when you are signed in" : ""}.
      </p>
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
