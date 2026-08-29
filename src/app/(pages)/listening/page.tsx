import MultiChoice from "./_components/multi-choice";
import { getRandomFacts } from "@/app/_actions/translate";
import TextToSpeechWithVirsual from "@/app/_components/text-to-speech-with-virsual";

const Listening = async () => {
    const randomFact = await getRandomFacts();

    if (randomFact === null) return null;

    return (
        <div className="relative w-full">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Listening
            </p>
            <h1 className="mt-2 font-display text-3xl font-medium">
                Hear it, then choose.
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
                Play the sentence once. Pick the line that matches.
            </p>

            <div className="mt-6 flex min-h-[28vh] flex-col items-center justify-center gap-4 rounded-xl border border-border bg-card p-8 shadow-soft">
                <TextToSpeechWithVirsual
                    classname="h-[80px]"
                    randomFact={randomFact?.text}
                />
            </div>

            <div className="mt-6">
                <h2 className="font-medium">What did you hear?</h2>
                <p className="text-sm text-muted-foreground">
                    Choose the correct sentence
                </p>
                <div className="mt-3">
                    <MultiChoice quote={randomFact?.text} />
                </div>
            </div>
        </div>
    );
};

export default Listening;
