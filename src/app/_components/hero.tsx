"use client";

import { useMemo } from "react";
import { ProgressState } from "../../lib/progress";
import { DEFAULT_DAILY_GOAL, levelProgress } from "../../lib/gamification";
import { Leaf, Sparkles } from "lucide-react";
import { LANGUAGES } from "../../lib/languages";
import { sound } from "@/lib/sound";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";
import ZenGarden from "./zen-garden";
import DailyPractice from "./daily-practice";

export default function Hero({ progress, ready }: { progress: ProgressState; ready: boolean }) {
    const currentLang =
        LANGUAGES.find((l) => l.value === progress.lessonDirection.split('-')[1]) ||
        LANGUAGES[0];

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
                className="relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-soft sm:p-8"
            >
                <div className="max-w-2xl space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#52745F]">
                        <Leaf className="w-3.5 h-3.5" />
                        <span>Mindful Language Sanctuary</span>
                    </div>

                    <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#223326] tracking-tight">
                        {currentLang.greeting}
                    </h1>

                    <p className="text-sm sm:text-base text-[#68756A] leading-relaxed">
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
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#3F614C] hover:bg-[#34513F] text-white text-sm font-semibold transition-all shadow-xs hover:shadow-md cursor-pointer"
                            >
                                <Sparkles className="w-4 h-4" />
                                <span>Today's Mindful 3-min Practice</span>
                            </button>
                        </DrawerTrigger>
                        <DrawerContent>
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
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#EFECE4] hover:bg-[#E5E0D5] text-[#3A493D] text-sm font-medium transition-colors border border-[#DDD7CC]"
                            >
                                <span>View Pebble Cairn ({progress.cairnStonesCount})</span>
                            </button>
                        </DrawerTrigger>
                        <DrawerContent>
                            <ZenGarden progress={progress} />
                        </DrawerContent>
                    </Drawer>
                </div>
            </section>
        </div>
    );
}
