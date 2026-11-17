"use client";

import TypewriterEffect from "@/app/_components/typewriter-text";
import { Button } from "@/app/_components/ui/button";
import CairnMascot, { type CairnMood } from "@/app/_components/cairn-mascot";
import { LANGUAGES, voiceFor } from "@/lib/languages";
import { speak } from "@/lib/speech";
import { sound } from "@/lib/sound";
import { Volume2 } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
    output: string;
    selectedLang: { to: string; from: string };
    mood?: CairnMood;
    isLoading?: boolean;
};

const ResultComponent = ({
    output,
    selectedLang,
    mood: moodProp,
    isLoading,
}: Props) => {
    const [speaking, setSpeaking] = useState(false);
    const toLang = LANGUAGES.find((l) => l.value === selectedLang.to);

    useEffect(() => {
        setSpeaking(false);
    }, [output]);

    const mood: CairnMood =
        moodProp ??
        (speaking ? "speaking" : output ? "happy" : "idle");

    const onHear = async () => {
        if (!output || speaking) return;
        sound.playPebbleTap(true);
        setSpeaking(true);
        try {
            await speak(output, voiceFor(selectedLang.to));
        } finally {
            window.setTimeout(() => setSpeaking(false), 1200);
        }
    };

    return (
        <section
            className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
            aria-live="polite"
        >
            <div className="lang-wash pointer-events-none absolute inset-0 opacity-50" aria-hidden />

            <div className="relative flex items-start justify-between gap-3 border-b border-border/60 px-5 py-3">
                <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                        {isLoading
                            ? "Listening across tongues"
                            : output
                              ? "Rendered meaning"
                              : "Quiet desk"}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                        {toLang
                            ? `Into ${toLang.name}`
                            : "Choose a path above"}
                    </p>
                </div>
                <CairnMascot
                    className="h-14 w-auto shrink-0 sm:h-16"
                    mood={mood}
                    label={
                        mood === "speaking"
                            ? "Cairn is speaking the translation"
                            : mood === "thinking"
                              ? "Cairn is translating"
                              : mood === "puzzled"
                                ? "Cairn is puzzled"
                                : mood === "happy"
                                  ? "Cairn is happy with the translation"
                                  : "Cairn ready to translate"
                    }
                />
            </div>

            <div className="relative min-h-[11rem] px-5 py-6 sm:min-h-[13rem]">
                {!output && !isLoading ? (
                    <div className="flex h-full min-h-[9rem] flex-col items-center justify-center text-center">
                        <p className="font-serif text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                            Offer a phrase
                        </p>
                        <p className="mt-2 max-w-[16rem] text-sm leading-relaxed text-muted-foreground">
                            Type below, or use the camera and mic. Cairn will hold the other tongue.
                        </p>
                    </div>
                ) : isLoading && !output ? (
                    <div className="flex h-full min-h-[9rem] flex-col items-center justify-center text-center">
                        <p className="font-serif text-lg text-foreground">
                            Gathering the words…
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            A soft moment between languages
                        </p>
                    </div>
                ) : (
                    <div className="flex min-h-[9rem] flex-col items-center justify-center text-center">
                        <div className="w-full max-w-md">
                            <div className="font-serif text-2xl font-medium leading-snug tracking-tight text-foreground sm:text-[1.65rem]">
                                <TypewriterEffect text={output} />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {output ? (
                <div className="relative border-t border-border/60 px-5 py-3">
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="rounded-full"
                        onClick={() => void onHear()}
                        disabled={speaking}
                    >
                        <Volume2 className="h-4 w-4" />
                        {speaking ? "Speaking…" : "Hear translation"}
                    </Button>
                </div>
            ) : null}
        </section>
    );
};

export default ResultComponent;
