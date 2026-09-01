import TypewriterEffect from "@/app/_components/typewriter-text";
import { Button } from "@/app/_components/ui/button";
import { voiceFor } from "@/lib/languages";
import { speak } from "@/lib/speech";
import { Mic, Volume2 } from "lucide-react";
import { useState } from "react";

type Props = {
    output: string;
    selectedLang: { to: string; from: string };
};

const ResultComponent = ({ output, selectedLang }: Props) => {
    const [listening, setListening] = useState(false);

    return (
        <div className="relative min-h-[32vh] rounded-xl border border-border bg-card p-5 shadow-soft">
            {!output ? (
                <div className="flex h-full min-h-[28vh] flex-col items-center justify-end pb-2 text-center">
                    <h1 className="font-display text-2xl font-medium">
                        From one tongue to another
                    </h1>
                    <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                        Translate from image, voice, or text — then hear both sides.
                    </p>
                </div>
            ) : (
                <div className="flex min-h-[28vh] items-center justify-center pt-8">
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
                    onClick={() => speak(output, voiceFor(selectedLang.to))}
                >
                    <Volume2 />
                    Hear translation
                </Button>
            ) : null}


        </div>
    );
};

export default ResultComponent;
