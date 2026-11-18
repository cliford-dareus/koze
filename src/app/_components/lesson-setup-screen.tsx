"use client";

import { useEffect, useRef, useState } from "react";
import { getLessonsByDirection } from "@/data/lessons";
import { directionForLearningLanguage } from "@/lib/learning-prefs";
import { LANGUAGES, languageLabel } from "@/lib/languages";
import CairnMascot, { type CairnMood } from "@/app/_components/cairn-mascot";

const MOODS: CairnMood[] = ["thinking", "idle", "encourage", "happy"];

type Props = {
    nativeLanguage: string;
    learningLanguage: string;
    onDone: () => void;
};

export default function LessonSetupScreen({
    nativeLanguage,
    learningLanguage,
    onDone,
}: Props) {
    const native = LANGUAGES.find((l) => l.value === nativeLanguage);
    const learning = LANGUAGES.find((l) => l.value === learningLanguage);
    const lines = [
        "Cairn is gathering stones…",
        `Writing tips in ${native?.name ?? languageLabel(nativeLanguage)}…`,
        `Laying your ${learning?.name ?? languageLabel(learningLanguage)} path…`,
        "The garden is ready.",
    ];

    const [index, setIndex] = useState(0);
    const [ready, setReady] = useState(false);
    const onDoneRef = useRef(onDone);
    onDoneRef.current = onDone;

    useEffect(() => {
        let cancelled = false;
        const started = Date.now();

        async function prepare() {
            const direction = directionForLearningLanguage(
                learningLanguage,
                nativeLanguage,
            );
            try {
                if (direction) {
                    await getLessonsByDirection(direction);
                }
            } catch {
                // still let them in; lessons fall back to English tips
            }
            const elapsed = Date.now() - started;
            const wait = Math.max(0, 2600 - elapsed);
            await new Promise((r) => setTimeout(r, wait));
            if (!cancelled) setReady(true);
        }

        void prepare();
        return () => {
            cancelled = true;
        };
    }, [learningLanguage, nativeLanguage]);

    useEffect(() => {
        if (ready) return;
        const id = setInterval(() => {
            setIndex((i) => Math.min(i + 1, lines.length - 2));
        }, 900);
        return () => clearInterval(id);
    }, [ready, lines.length]);

    useEffect(() => {
        if (!ready) return;
        setIndex(lines.length - 1);
        const id = setTimeout(() => onDoneRef.current(), 700);
        return () => clearTimeout(id);
    }, [ready, lines.length]);

    const mood: CairnMood = ready ? "celebrate" : MOODS[index % MOODS.length];

    return (
        <div className="relative flex min-h-[70vh] flex-col items-center justify-center px-6 py-10 text-center">
            <div className="lang-wash pointer-events-none absolute inset-0 opacity-70" aria-hidden />
            <div className="relative flex flex-col items-center">
                <CairnMascot
                    className="h-36 w-36"
                    mood={mood}
                    label="Cairn is setting up your lessons"
                />
                <p className="mt-6 font-display text-2xl font-medium">
                    Setting up your lessons
                </p>
                <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                    {lines[index]}
                </p>
                <div className="mt-6 flex gap-1.5" aria-hidden>
                    {lines.map((_, i) => (
                        <span
                            key={i}
                            className={
                                "h-1.5 w-6 rounded-full transition-colors " +
                                (i <= index ? "bg-primary" : "bg-muted")
                            }
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
