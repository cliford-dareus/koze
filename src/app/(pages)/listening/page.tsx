import MultiChoice from "./_components/multi-choice";
import { getRandomFacts } from "@/app/_actions/translate";
import TextToSpeechWithVirsual from "@/app/_components/text-to-speech-with-virsual";
import MicAudioVisualizer from "@/app/_components/mic-audio-visualizer";
import { Leaf } from "lucide-react";
import { ListeningPage } from "./_components/listening-page";

const Listening = async () => {
    const randomFact = await getRandomFacts();
    if (randomFact === null) return null;

    return (
        <div className="relative w-full">
            <p className="flex items-center gap-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                <Leaf className="w-3 h-3 text-[#A5C9B1]" />                
                Listening
            </p>
            <h1 className="mt-2 font-display text-3xl font-medium">
                Listening Sanctuary.
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
                Tune your ear to genuine conversations, atmospheric soundscapes, and native cadence without the pressure of speed.
            </p>

            <ListeningPage />
        </div>
    );
};

export default Listening;
