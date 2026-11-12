import { Leaf } from "lucide-react";
import { ListeningPage } from "./_components/listening-page";

const Listening = async () => {
    return (
        <div className="relative w-full">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                <Leaf className="h-3 w-3" />
                Listening
            </p>
            <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-foreground">
                Listening sanctuary
            </h1>
            <p className="mt-2 max-w-prose text-sm text-muted-foreground">
                Genuine conversations, atmospheric soundscapes, and native cadence —
                without the pressure of speed.
            </p>

            <ListeningPage />
        </div>
    );
};

export default Listening;
