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
import BadgesPanel from "@/app/_components/badges-panel";
import { ArrowRight, Check, Flame } from "lucide-react";

export default function ProgressSummary() {
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    const todayDayIndex = (today.getDay() + 6) % 7;

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
        progress.lessonsCompleted?.get(progress.lessonDirection!)?.length ||
        0;

    return (
        <div className="mt-6 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 rounded-xl border border-border bg-card p-6 shadow-soft">
                <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-[#F6EBE1] border border-[#EBD7C7] flex items-center justify-center text-[#B85C2B]">
                        <Flame className="w-6 h-6 fill-[#B85C2B]/30" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#253328] tracking-tight">
                                {progress.streak}-Day Mindful Rhythm
                            </h2>
                        </div>
                        <p className="text-sm text-[#6C786E]">
                            {goalMet
                                ? "Today's practice intention is fulfilled. Your focus is steady."
                                : `${progress.dailyGoal - progress.todayActions} more mindful actions to complete today's rhythm.`}
                        </p>
                    </div>
                </div>

                {/* Daily Practice CTA */}
                <button
                    id="start-daily-practice-cta-btn"
                    type="button"
                    onClick={() => {
                        // sound.playPebbleTap(progress.soundEnabled);
                        // onStartDailyPractice();
                    }}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#3F614C] hover:bg-[#34513F] text-white text-sm font-medium transition-all shadow-xs hover:shadow-md cursor-pointer whitespace-nowrap"
                >
                    <span>{goalMet ? 'Bonus Practice' : 'Practice Today (3 actions)'}</span>
                    <ArrowRight className="w-4 h-4" />
                </button>
                {goalMet ? (
                    <p className="mt-2 text-xs text-muted-foreground">
                        Daily goal met · +15 XP bonus applied
                    </p>
                ) : (
                    <p className="mt-2 text-xs text-muted-foreground">
                        Finish a lesson, listen, read, translate, or quiz to advance.
                    </p>
                )}

                {/* 7-Day Stone Path (Weekly Rhythm) */}
                <div className="pt-5">
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#808C82] mb-3">
                        Weekly Stepping Stones
                    </div>

                    <div className="grid grid-cols-7 gap-2 sm:gap-3">
                        {daysOfWeek.map((dayName, idx) => {
                            const isPast = idx < todayDayIndex;
                            const isCurrent = idx === todayDayIndex;
                            // Determine completion: if past or current reached
                            const isCompleted = isPast ? true : isCurrent && goalMet;

                            return (
                                <div
                                    key={dayName}
                                    className="flex flex-col items-center gap-1.5"
                                    id={`rhythm-day-${dayName.toLowerCase()}`}
                                >
                                    <div
                                        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-xs font-medium transition-all ${isCompleted
                                            ? 'bg-[#E2ECE5] text-[#2F533E] border border-[#BFD5C6] shadow-xs'
                                            : isCurrent
                                                ? 'bg-[#FAF3EB] text-[#A65324] border-2 border-[#C87342] shadow-xs'
                                                : 'bg-[#F2EFE8] text-[#8C968E] border border-[#E5E0D5]'
                                            }`}
                                    >
                                        {isCompleted ? (
                                            <Check className="w-4 h-4 text-[#356147]" />
                                        ) : isCurrent ? (
                                            <span className="font-bold text-xs">{progress.todayMinutesPracticed}m</span>
                                        ) : (
                                            <span className="text-[11px] opacity-60">·</span>
                                        )}
                                    </div>
                                    <span
                                        className={`text-[11px] tracking-tight ${isCurrent ? 'font-bold text-[#2A382D]' : 'text-[#7D887F]'
                                            }`}
                                    >
                                        {dayName}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* USERS LEVEL */}
                <div className="">
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
            </div>
        </div>
    );
}
