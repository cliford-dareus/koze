"use client";

import { useMemo } from "react";
import {
    type ProgressState,
} from "@/lib/progress";
import {
    DEFAULT_DAILY_GOAL,
    ensureTodayCounters,
    levelProgress,
} from "@/lib/gamification";
import { ArrowRight, Check, Clock, Flame } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";
import { sound } from "@/lib/sound";
import DailyPractice from "./daily-practice";

export default function ProgressSummary({ progress, ready }: { progress: ProgressState; ready: boolean; }) {
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    const todayDayIndex = (today.getDay() + 6) % 7;

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

    const percentComplete = Math.min(
        100,
        Math.round((progress.todayMinutesPracticed / progress.dailyGoalMinutes) * 100)
    );

    const onUpdateDailyGoal = (mins: number) => {

    };

    return (
        <div className="mt-6 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 rounded-xl border border-border bg-background p-6 shadow-soft">
                <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-card border border-border flex items-center justify-center text-destructive">
                        <Flame className="w-6 h-6 fill-destructive/30" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-primary tracking-tight">
                                {progress.streak}-Day Mindful Rhythm
                            </h2>
                        </div>
                        <p className="text-sm text-foreground">
                            {goalMet
                                ? "Today's practice intention is fulfilled. Your focus is steady."
                                : `${progress.dailyGoal - progress.todayActions} more mindful actions to complete today's rhythm.`}
                        </p>
                    </div>
                </div>

                <Drawer>
                    <DrawerTrigger asChild>
                        <button
                            id="start-daily-practice-cta-btn"
                            type="button"
                            onClick={() => {
                                sound.playPebbleTap(progress.soundEnabled);
                            }}
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium transition-all shadow-xs hover:shadow-md cursor-pointer whitespace-nowrap"
                        >
                            <span>{goalMet ? 'Bonus Practice' : 'Practice Today (3 actions)'}</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </DrawerTrigger>
                    <DrawerContent className="border border-border bg-background">
                        <DailyPractice progress={progress} />
                    </DrawerContent>
                </Drawer>

                {goalMet ? (
                    <p className="mt-2 text-xs text-muted-foreground">
                        Daily goal met · +15 XP bonus applied
                    </p>
                ) : (
                    <p className="mt-2 text-xs text-muted-foreground">
                        Finish a lesson, listen, read, translate, or quiz to advance.
                    </p>
                )}

                <div className="pt-5">
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                        Weekly Stepping Stones
                    </div>

                    <div className="grid grid-cols-7 gap-2 sm:gap-3">
                        {daysOfWeek.map((dayName, idx) => {
                            const isPast = idx < todayDayIndex;
                            const isCurrent = idx === todayDayIndex;
                            const isCompleted = isPast ? true : isCurrent && goalMet;

                            return (
                                <div
                                    key={dayName}
                                    className="flex flex-col items-center gap-1.5"
                                    id={`rhythm-day-${dayName.toLowerCase()}`}
                                >
                                    <div
                                        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-xs font-medium transition-all ${isCompleted
                                                ? 'bg-accent text-primary border border-primary/30 shadow-xs'
                                                : isCurrent
                                                    ? 'bg-card text-destructive border-2 border-border shadow-xs'
                                                    : 'bg-card text-muted-foreground border border-border'
                                            }`}
                                    >
                                        {isCompleted ? (
                                            <Check className="w-4 h-4 text-primary" />
                                        ) : isCurrent ? (
                                            <span className="font-bold text-xs">{progress.todayMinutesPracticed}m</span>
                                        ) : (
                                            <span className="text-[11px] opacity-60">·</span>
                                        )}
                                    </div>
                                    <span
                                        className={`text-[11px] tracking-tight ${isCurrent ? 'font-bold text-primary' : 'text-muted-foreground'
                                            }`}
                                    >
                                        {dayName}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-4 pt-5 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1 max-w-sm">
                        <div className="flex items-center justify-between text-xs text-foreground mb-1.5">
                            <span className="flex items-center gap-1 font-medium">
                                <Clock className="w-3.5 h-3.5 text-primary" />
                                Today's Focus: {progress.todayMinutesPracticed} of {progress.dailyGoalMinutes} min
                            </span>
                            <span className="font-semibold text-primary">{percentComplete}%</span>
                        </div>
                        <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary rounded-full transition-all duration-500"
                                style={{ width: `${percentComplete}%` }}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground whitespace-nowrap">Daily target:</span>
                        {[5, 10, 15].map((mins) => {
                            const isSelected = progress.dailyGoalMinutes === mins;
                            return (
                                <button
                                    key={mins}
                                    type="button"
                                    onClick={() => {
                                        sound.playPebbleTap(progress.soundEnabled);
                                        onUpdateDailyGoal(mins);
                                    }}
                                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${isSelected
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-secondary text-foreground hover:bg-secondary'
                                        }`}
                                >
                                    {mins}m
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-4">
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
