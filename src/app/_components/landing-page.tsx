"use client";

import { useEffect, useState } from "react";
import Hero from "./hero";
import ProgressSummary from "./progress-summary";
import WordOfTheDay from "./word-of-the-day";
import MainHeader from "./main-header";
import { defaultProgress, loadProgress, ProgressState } from "@/lib/progress";
import { ensureTodayCounters } from "@/lib/gamification";
import { WelcomePanel } from "./welcome-panel";

export function LandingPage({ word }: { word: { ok: boolean; text?: string | undefined; error?: string | undefined; } }) {
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

    if (!ready) return null;

    if (progress && !progress.nativeLanguage) {
        return (
            <WelcomePanel progress={progress} />
        );
    }

    return (
        <div className="">
            <MainHeader progress={progress} ready={ready} />
            <Hero progress={progress} ready={ready} />
            <WordOfTheDay word={word} />
            <ProgressSummary progress={progress} ready={ready} />
        </div>
    );
}
