"use client";

import { useTranscriber } from "@/app/_components/providers/transcribe-provider";
import SpeechToText, { AudioDataType } from "@/app/_components/speech-to-text";
import { Button } from "@/app/_components/ui/button";
import { useState } from "react";

type Props = {
    quote: string;
};

const ReadingManager = ({ quote }: Props) => {
    const { start, output } = useTranscriber();
    const [audioData, setAudioData] = useState<AudioDataType | undefined>(
        undefined,
    );

    return (
        <div className="px-4">
            <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    Pronunciation
                </p>
                <h2 className="mt-2 font-display text-2xl font-medium">
                    Read it back
                </h2>
                <p className="mt-6 text-center font-display text-xl leading-snug">
                    {quote}
                </p>
                <p className="mt-3 text-center text-xs text-muted-foreground">
                    Record yourself — the bars move with your voice.
                </p>
            </div>

            <div className="mt-10 flex w-full justify-center">
                <SpeechToText setAudioData={setAudioData} />
            </div>

            {audioData ? (
                <div className="mt-6 flex justify-center">
                    <Button
                        type="button"
                        size="lg"
                        className="min-w-[10rem]"
                        onClick={() => {
                            start(audioData.buffer);
                        }}
                    >
                        Check
                    </Button>
                </div>
            ) : null}

            {output ? (
                <p className="mt-4 rounded-xl border border-border bg-card p-3 text-center text-sm shadow-soft">
                    {output.text}
                </p>
            ) : null}
        </div>
    );
};

export default ReadingManager;
