"use client";

import TypewriterEffect from "@/app/_components/typewriter-text";
import { Button } from "@/app/_components/ui/button";
import CairnMascot, { type CairnMood } from "@/app/_components/cairn-mascot";
import { voiceFor } from "@/lib/languages";
import { speak } from "@/lib/speech";
import { Volume2 } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
    output: string;
    selectedLang: { to: string; from: string };
    /** Parent-driven mood override (e.g. thinking while loading) */
    mood?: CairnMood;
};

const ResultComponent = ({ output, selectedLang, mood: moodProp }: Props) => {
    const [speaking, setSpeaking] = useState(false);

    // Reset speaking when the translation text changes
    useEffect(() => {
        setSpeaking(false);
    }, [output]);

    const mood: CairnMood =
        moodProp ??
        (speaking ? "speaking" : output ? "happy" : "idle");

    const onHear = async () => {
        if (!output || speaking) return;
        setSpeaking(true);
        try {
            await speak(output, voiceFor(selectedLang.to));
        } finally {
            // speak() may resolve before audio ends; keep a short speaking window
            window.setTimeout(() => setSpeaking(false), 1200);
        }
    };

    return (
        <div className="relative min-h-[32vh] rounded-xl border border-border bg-card p-5 shadow-soft">
            <div className="absolute right-3 top-3 sm:right-4 sm:top-4">
                <CairnMascot
                    className="h-16 w-auto sm:h-20"
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

            {!output ? (
                <div className="flex h-full min-h-[28vh] flex-col items-center justify-end pb-2 pr-16 text-center sm:pr-20">
                    <h1 className="font-display text-2xl font-medium">
                        From one tongue to another
                    </h1>
                    <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                        Translate from image, voice, or text — then hear both sides.
                    </p>
                </div>
            ) : (
                <div className="flex min-h-[28vh] items-center justify-center pt-8 pr-14 sm:pr-16">
                    <div className="w-full text-center">
                        <p className="mb-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                            Translation
                        </p>
                        <div className="font-display text-2xl leading-snug">
                            <TypewriterEffect text={output} />
                        </div>
                    </div>
                </div>
            )}

            {output ? (
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mt-4"
                    onClick={() => void onHear()}
                    disabled={speaking}
                >
                    <Volume2 />
                    {speaking ? "Speaking…" : "Hear translation"}
                </Button>
            ) : null}
        </div>
    );
};

export default ResultComponent;
