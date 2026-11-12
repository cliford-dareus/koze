"use client";

import { useMemo } from "react";
import { ProgressState } from "../../lib/progress";
import { DEFAULT_DAILY_GOAL, levelProgress } from "../../lib/gamification";
import { Leaf, Sparkles } from "lucide-react";
import { LanguageOption } from "../../lib/languages";
import { sound } from "@/lib/sound";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";
import ZenGarden from "./zen-garden";
import DailyPractice from "./daily-practice";

export default function Hero({
    progress,
    ready,
    currentLang,
}: {
    progress: ProgressState;
    ready: boolean;
    currentLang: LanguageOption;
}) {
    const levelInfo = useMemo(
        () => levelProgress(progress.xp ?? 0),
        [progress.xp],
    );

    if (!ready) return null;

    const goal = progress.dailyGoal || DEFAULT_DAILY_GOAL;
    const todayActions = progress.todayActions ?? 0;
    const goalMet = progress.dailyGoalMet || todayActions >= goal;

    return (
        <div>
            <section
                id="hero-sanctuary"
                className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8"
            >
                <div className="lang-wash pointer-events-none absolute inset-0" aria-hidden />

                <div className="relative max-w-2xl space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                        <span
                            className="h-2 w-2 rounded-full lang-swatch shadow-xs"
                            aria-hidden
                        />
                        <Leaf className="h-3.5 w-3.5" />
                        <span>Mindful Language Sanctuary</span>
                    </div>

                    <h1 className="font-serif text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
                        {currentLang.greeting}
                    </h1>

                    <p className="text-sm leading-relaxed text-foreground sm:text-base">
                        {currentLang.description}
                    </p>
                </div>

                <div className="relative mt-5 flex flex-wrap items-center gap-3">
                    <Drawer>
                        <DrawerTrigger asChild>
                            <button
                                id="hero-start-practice-btn"
                                type="button"
                                onClick={() => {
                                    sound.playPebbleTap(progress.soundEnabled);
                                }}
                                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-xs transition-all hover:bg-primary/90 hover:shadow-md"
                            >
                                <Sparkles className="h-4 w-4" />
                                <span>
                                    {goalMet
                                        ? "Bonus mindful practice"
                                        : "Today's Mindful 3-min Practice"}
                                </span>
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
                                className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-secondary"
                            >
                                <span>
                                    View Pebble Cairn ({progress.cairnStonesCount || 0})
                                </span>
                            </button>
                        </DrawerTrigger>
                        <DrawerContent className="border border-border bg-background">
                            <ZenGarden progress={progress} />
                        </DrawerContent>
                    </Drawer>
                </div>

                <p className="relative mt-4 text-[11px] text-muted-foreground">
                    Path hue · {currentLang.name}
                    {levelInfo ? ` · Level ${levelInfo.level}` : ""}
                </p>
            </section>
        </div>
    );
}
