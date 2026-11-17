import { Ear } from "lucide-react";
import { ListeningPage } from "./_components/listening-page";

const Listening = async () => {
    return (
        <div className="relative mx-auto w-full max-w-lg pb-8">
            <header className="mb-2">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                    <Ear className="h-3.5 w-3.5" />
                    Studio · Listening
                </p>
                <h1 className="mt-1.5 font-serif text-3xl font-semibold tracking-tight text-foreground">
                    Listening sanctuary
                </h1>
                <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted-foreground">
                    Genuine conversations, soft soundscapes, and native cadence — without
                    the pressure of speed.
                </p>
            </header>

            <ListeningPage />
        </div>
    );
};

export default Listening;
