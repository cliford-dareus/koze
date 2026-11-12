"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import {
    BookOpen,
    Ear,
    Flame,
    GraduationCap,
    Languages,
    LogOut,
    MessageCircle,
    Sparkles,
    Target,
} from "lucide-react";
import { BADGES, BADGES_ICON_MAP } from "@/data/badges";
import {
    DEFAULT_DAILY_GOAL,
    ensureTodayCounters,
    levelProgress,
} from "@/lib/gamification";
import {
    defaultProgress,
    loadProgress,
    saveProgress,
    totalActivities,
    type ProgressState,
} from "@/lib/progress";
import { LANGUAGES, languageLabel } from "@/lib/languages";
import { learningTrackLabel } from "@/lib/learning-prefs";
import { Button } from "@/app/_components/ui/button";
import ThemeToggle from "@/app/_components/theme-toggle";
import { sound } from "@/lib/sound";

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

    const earned = useMemo(
        () => new Set(progress.badges || []),
        [progress.badges],
    );

    const learningLang =
        LANGUAGES.find((l) => l.value === progress.learningLanguage) ||
        LANGUAGES[0];
    const nativeLang = LANGUAGES.find((l) => l.value === progress.nativeLanguage);

    const direction = progress.lessonDirection || "en-fr";
    const lessonsDone =
        progress.lessonsCompleted?.get?.(direction)?.length ??
        progress.lessonsCompletedCount ??
        0;

    const goal = progress.dailyGoal || DEFAULT_DAILY_GOAL;
    const todayActions = progress.todayActions ?? 0;
    const goalRatio = Math.min(1, todayActions / goal);
    const goalMet = progress.dailyGoalMet || todayActions >= goal;
    const minutesGoal = progress.dailyGoalMinutes || 10;
    const minutesRatio = Math.min(
        1,
        (progress.todayMinutesPracticed || 0) / minutesGoal,
    );

    const displayName =
        session?.user?.name ||
        (status === "authenticated" ? "Learner" : "Guest");
    const initial = displayName.trim().charAt(0).toUpperCase() || "K";

    const toggleSound = () => {
        const next = {
            ...progress,
            soundEnabled: !progress.soundEnabled,
        };
        saveProgress(next);
        setProgress(next);
        sound.playPebbleTap(next.soundEnabled);
    };

    if (!ready) {
        return (
            <div className="py-8 text-center text-sm text-muted-foreground">
                Loading profile…
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-4">
            <div>
                <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                    <span className="h-1.5 w-1.5 rounded-full lang-swatch" aria-hidden />
                    Profile
                </p>
                <h1 className="mt-1 font-serif text-3xl font-semibold tracking-tight text-foreground">
                    Your sanctuary
                </h1>
                <p className="mt-1 max-w-prose text-sm text-muted-foreground">
                    Path, rhythm, and quiet marks of progress — held on this device
                    {session?.user ? " and synced when signed in" : ""}.
                </p>
            </div>

            {/* Identity */}
            <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6">
                <div className="lang-wash pointer-events-none absolute inset-0" aria-hidden />
                <div className="relative flex items-start gap-4">
                    <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary font-serif text-2xl font-semibold text-primary-foreground shadow-xs">
                        {initial}
                    </span>
                    <div className="min-w-0 flex-1">
                        <h2 className="font-serif text-2xl font-semibold tracking-tight text-foreground">
                            {displayName}
                        </h2>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                            {session?.user?.email
                                ? session.user.email
                                : "Practicing as a guest on this device"}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            <span
                                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/80 px-2.5 py-1 text-xs font-medium text-foreground"
                                style={{
                                    boxShadow: learningLang.themeColor
                                        ? `inset 0 0 0 1px ${learningLang.themeColor}33`
                                        : undefined,
                                }}
                            >
                                <span
                                    className="h-2 w-2 rounded-full"
                                    style={{
                                        backgroundColor:
                                            learningLang.themeColor ||
                                            "hsl(var(--primary))",
                                    }}
                                    aria-hidden
                                />
                                <span>{learningLang.flag}</span>
                                <span>Learning {learningLang.name}</span>
                            </span>
                            {nativeLang && (
                                <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background/60 px-2.5 py-1 text-xs text-muted-foreground">
                                    <span>{nativeLang.flag}</span>
                                    <span>From {nativeLang.name}</span>
                                </span>
                            )}
                            <span className="text-[11px] text-muted-foreground">
                                {learningTrackLabel(direction)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="relative mt-5 flex flex-wrap gap-2">
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
                            className="gap-1.5"
                        >
                            <LogOut className="h-3.5 w-3.5" />
                            Sign out
                        </Button>
                    )}
                    <Button asChild size="sm" variant="ghost">
                        <Link href="/lessons" className="gap-1.5">
                            <GraduationCap className="h-3.5 w-3.5" />
                            Lessons
                        </Link>
                    </Button>
                </div>
            </section>

            {/* Level + daily intention */}
            <section className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                    <div className="flex items-center justify-between gap-2">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                            Level {levelInfo.level}
                        </p>
                        <Sparkles className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <p className="mt-2 font-serif text-3xl font-semibold tracking-tight text-foreground">
                        {progress.xp ?? 0}{" "}
                        <span className="text-sm font-normal text-muted-foreground">
                            XP
                        </span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        {levelInfo.intoLevel}/{levelInfo.needForNext} to next level
                    </p>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                        <div
                            className="h-full rounded-full bg-primary transition-all duration-300"
                            style={{
                                width: `${Math.round(levelInfo.ratio * 100)}%`,
                            }}
                        />
                    </div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                    <div className="flex items-center justify-between gap-2">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                            Today's intention
                        </p>
                        <Target className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div className="mt-2 flex items-end justify-between gap-2">
                        <p className="font-serif text-3xl font-semibold tracking-tight text-foreground">
                            {Math.min(todayActions, goal)}
                            <span className="text-base font-normal text-muted-foreground">
                                /{goal}
                            </span>
                        </p>
                        <span
                            className={
                                "rounded-full px-2.5 py-1 text-[11px] font-medium " +
                                (goalMet
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground")
                            }
                        >
                            {goalMet ? "Fulfilled" : `${Math.round(goalRatio * 100)}%`}
                        </span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                        <div
                            className="h-full rounded-full bg-primary/80 transition-all duration-300"
                            style={{ width: `${Math.round(goalRatio * 100)}%` }}
                        />
                    </div>
                    <p className="mt-2 text-[11px] text-muted-foreground">
                        Focus time {progress.todayMinutesPracticed || 0}m of {minutesGoal}m
                        · {Math.round(minutesRatio * 100)}%
                    </p>
                </div>
            </section>

            {/* Activity grid */}
            <section>
                <div className="mb-3 flex items-end justify-between gap-2">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                            Practice marks
                        </p>
                        <h2 className="mt-0.5 font-serif text-xl font-semibold tracking-tight text-foreground">
                            Activity
                        </h2>
                    </div>
                    <span className="text-xs text-muted-foreground">
                        {totalActivities(progress)} total
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    <Stat
                        icon={<Flame className="h-3.5 w-3.5" />}
                        label="Streak"
                        value={`${progress.streak || 0}d`}
                    />
                    <Stat
                        icon={<GraduationCap className="h-3.5 w-3.5" />}
                        label="Lessons"
                        value={String(lessonsDone)}
                    />
                    <Stat
                        icon={<Languages className="h-3.5 w-3.5" />}
                        label="Translate"
                        value={String(progress.translations || 0)}
                    />
                    <Stat
                        icon={<Ear className="h-3.5 w-3.5" />}
                        label="Listening"
                        value={String(progress.listeningCorrect || 0)}
                    />
                    <Stat
                        icon={<BookOpen className="h-3.5 w-3.5" />}
                        label="Reading"
                        value={String(progress.readingSessions || 0)}
                    />
                    <Stat
                        icon={<MessageCircle className="h-3.5 w-3.5" />}
                        label="Quiz"
                        value={String(progress.quizCorrect || 0)}
                    />
                    <Stat
                        icon={<Sparkles className="h-3.5 w-3.5" />}
                        label="Cairn"
                        value={String(progress.cairnStonesCount || 0)}
                    />
                    <Stat
                        icon={<Target className="h-3.5 w-3.5" />}
                        label="Today XP"
                        value={String(progress.todayXp ?? 0)}
                    />
                    <Stat
                        icon={<Languages className="h-3.5 w-3.5" />}
                        label="Path"
                        value={direction.toUpperCase().replace("-", "→")}
                    />
                </div>
            </section>

            {/* Preferences */}
            <section className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Preferences
                </p>
                <h2 className="mt-0.5 font-serif text-xl font-semibold tracking-tight text-foreground">
                    Comfort
                </h2>

                <div className="mt-4 space-y-4">
                    <div>
                        <p className="mb-2 text-xs font-medium text-foreground">
                            Appearance
                        </p>
                        <ThemeToggle />
                        <p className="mt-2 text-[11px] text-muted-foreground">
                            System follows your device. Choice is saved on this device.
                        </p>
                    </div>

                    <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
                        <div>
                            <p className="text-xs font-medium text-foreground">
                                Soft sounds
                            </p>
                            <p className="mt-0.5 text-[11px] text-muted-foreground">
                                Pebble taps and gentle chimes
                            </p>
                        </div>
                        <button
                            type="button"
                            role="switch"
                            aria-checked={progress.soundEnabled !== false}
                            onClick={toggleSound}
                            className={`relative h-7 w-12 rounded-full transition-colors ${
                                progress.soundEnabled !== false
                                    ? "bg-primary"
                                    : "bg-muted"
                            }`}
                        >
                            <span
                                className={`absolute top-0.5 h-6 w-6 rounded-full bg-background shadow-xs transition-transform ${
                                    progress.soundEnabled !== false
                                        ? "translate-x-5"
                                        : "translate-x-0.5"
                                }`}
                            />
                        </button>
                    </div>
                </div>
            </section>

            {/* Badges */}
            <section>
                <div className="mb-3 flex items-end justify-between gap-2">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                            Collected
                        </p>
                        <h2 className="mt-0.5 font-serif text-xl font-semibold tracking-tight text-foreground">
                            Badges
                        </h2>
                    </div>
                    <span className="text-xs text-muted-foreground">
                        {earned.size}/{BADGES.length}
                    </span>
                </div>

                <ul className="space-y-2">
                    {BADGES.map((badge) => {
                        const on = earned.has(badge.id);
                        const icon = BADGES_ICON_MAP[badge.id];
                        return (
                            <li
                                key={badge.id}
                                className={
                                    "flex items-start gap-3 rounded-2xl border p-4 shadow-soft transition-colors " +
                                    (on
                                        ? "border-primary/25 bg-card"
                                        : "border-border/70 bg-muted/15 opacity-75")
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
                                        <h3 className="font-serif text-base font-semibold tracking-tight text-foreground">
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

            <p className="pb-2 text-center text-[11px] text-muted-foreground">
                Progress stays on this device
                {session?.user ? " and syncs when you are signed in" : ""}.
            </p>
        </div>
    );
}

function Stat({
    label,
    value,
    icon,
}: {
    label: string;
    value: string;
    icon?: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-border bg-card px-3 py-3 shadow-soft">
            <div className="flex items-center gap-1.5 text-primary">
                {icon}
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    {label}
                </p>
            </div>
            <p className="mt-1.5 font-serif text-xl font-semibold tracking-tight text-foreground">
                {value}
            </p>
        </div>
    );
}
