"use client";

import { Flame } from "lucide-react";
import type { ProgressState } from "@/lib/progress";
import CairnMascot from "@/app/_components/cairn-mascot";

function formatPracticeDate(isoDate: string | null | undefined) {
    if (!isoDate) return "Not yet";
    try {
        const d = new Date(`${isoDate}T12:00:00`);
        if (Number.isNaN(d.getTime())) return isoDate;
        return d.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
        });
    } catch {
        return isoDate;
    }
}

export default function RhythmPanel({ progress }: { progress: ProgressState }) {
    const goal = progress.dailyGoal || 3;
    const todayActions = progress.todayActions || 0;
    const goalRatio = Math.min(1, todayActions / goal);
    const goalMet = progress.dailyGoalMet || todayActions >= goal;

    const weekEntries = Object.entries(progress.weeklyActivity || {}).sort(
        ([a], [b]) => a.localeCompare(b),
    );
    const recentWeek = weekEntries.slice(-7);

    return (
        <div className="relative mx-auto w-full max-w-md space-y-5 px-4 pb-10 pt-2">
            <div className="lang-wash pointer-events-none absolute inset-0 opacity-35" aria-hidden />

            <div className="relative text-center">
                <div className="mb-3 flex justify-center">
                    <CairnMascot
                        className="h-16 w-auto"
                        mood={goalMet ? "happy" : "idle"}
                        label="Cairn keeps the daily rhythm"
                    />
                </div>
                <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                    <Flame className="h-3.5 w-3.5 text-destructive" />
                    <span>Mindful Daily Rhythm</span>
                </div>
                <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-foreground">
                    {progress.streak || 0}-day rhythm
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    Soft consistency beats intensity. Return each day when you can.
                </p>
            </div>

            <div className="relative grid grid-cols-2 gap-2.5">
                <div className="rounded-2xl border border-border bg-card p-3.5 text-center shadow-soft">
                    <div className="text-2xl font-bold text-primary">{progress.streak || 0}</div>
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Current streak
                    </div>
                </div>
                <div className="rounded-2xl border border-border bg-card p-3.5 text-center shadow-soft">
                    <div className="text-2xl font-bold text-primary">
                        {progress.todayMinutesPracticed || 0}
                    </div>
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Minutes today
                    </div>
                </div>
                <div className="rounded-2xl border border-border bg-card p-3.5 text-center shadow-soft">
                    <div className="text-2xl font-bold text-primary">
                        {formatPracticeDate(progress.lastPracticedDate)}
                    </div>
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Last practiced
                    </div>
                </div>
                <div className="rounded-2xl border border-border bg-card p-3.5 text-center shadow-soft">
                    <div className="text-2xl font-bold text-primary">
                        {todayActions}/{goal}
                    </div>
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Daily actions
                    </div>
                </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-soft">
                <div className="lang-wash pointer-events-none absolute inset-0 opacity-20" aria-hidden />
                <div className="relative mb-2 flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">Today&apos;s intention</span>
                    <span className="text-muted-foreground">
                        {goalMet ? "Fulfilled" : `${Math.round(goalRatio * 100)}%`}
                    </span>
                </div>
                <div className="relative h-2 overflow-hidden rounded-full bg-muted">
                    <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${goalRatio * 100}%` }}
                    />
                </div>
            </div>

            {recentWeek.length > 0 && (
                <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-soft">
                    <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        Recent practice
                    </div>
                    <div className="flex items-end justify-between gap-1.5">
                        {recentWeek.map(([date, minutes]) => {
                            const value = typeof minutes === "number" ? minutes : 0;
                            const height = Math.max(8, Math.min(48, value * 6));
                            return (
                                <div
                                    key={date}
                                    className="flex flex-1 flex-col items-center gap-1"
                                    title={`${date}: ${value} min`}
                                >
                                    <div
                                        className="w-full max-w-[18px] rounded-t-md bg-primary/80"
                                        style={{ height }}
                                    />
                                    <span className="text-[9px] text-muted-foreground">
                                        {date.slice(5)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <p className="relative text-center font-serif text-xs italic text-muted-foreground">
                &ldquo;Show up softly. The rhythm will hold you.&rdquo;
            </p>
        </div>
    );
}
