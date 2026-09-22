"use client";

import { useMemo } from "react";
import { ProgressState } from "../../lib/progress";
import { DEFAULT_DAILY_GOAL, levelProgress } from "../../lib/gamification";
import { Leaf, Sparkles } from "lucide-react";
import { LanguageOption, LANGUAGES } from "../../lib/languages";
import { sound } from "@/lib/sound";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";
import ZenGarden from "./zen-garden";
import DailyPractice from "./daily-practice";

export default function Hero({ progress, ready, currentLang }: { progress: ProgressState; ready: boolean; currentLang: LanguageOption; }) {
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
        <div>
            <section
                id="hero-sanctuary"
                className="relative overflow-hidden rounded-xl border border-border bg-background p-6 shadow-soft sm:p-8"
            >
                <div className="max-w-2xl space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                        <Leaf className="w-3.5 h-3.5" />
                        <span>Mindful Language Sanctuary</span>
                    </div>

                    <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-primary tracking-tight">
                        {currentLang.greeting}
                    </h1>

                    <p className="text-sm sm:text-base text-foreground leading-relaxed">
                        {currentLang.description}
                    </p>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                    <Drawer>
                        <DrawerTrigger asChild>
                            <button
                                id="hero-start-practice-btn"
                                type="button"
                                onClick={() => {
                                    sound.playPebbleTap(progress.soundEnabled);
                                }}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold transition-all shadow-xs hover:shadow-md cursor-pointer"
                            >
                                <Sparkles className="w-4 h-4" />
                                <span>Today's Mindful 3-min Practice</span>
                            </button>
                        </DrawerTrigger>
                        <DrawerContent className="border border-border bg-background">
                            <DailyPractice progress={progress} />
                        </DrawerContent>
                    </Drawer>

                    <Drawer>
                        <DrawerTrigger asChild>
                            <button
                                id="hero-open-cairn-btn"
                                type="button"
                                onClick={() => {
                                    sound.playPebbleTap(progress.soundEnabled);
                                }}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-secondary hover:bg-secondary text-primary text-sm font-medium transition-colors border border-border"
                            >
                                <span>View Pebble Cairn ({progress.cairnStonesCount})</span>
                            </button>
                        </DrawerTrigger>
                        <DrawerContent className="border border-border bg-background">
                            <ZenGarden progress={progress} />
                        </DrawerContent>
                    </Drawer>
                </div>
            </section>
        </div>
    );
}
