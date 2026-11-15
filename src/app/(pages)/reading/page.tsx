import { BookOpen } from "lucide-react";
import { ReadingPage } from "./_components/reading-page";

const Reading = async () => {
    return (
        <div className="mx-auto flex w-full max-w-lg flex-col pb-8">
            <header className="mb-2">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                    <BookOpen className="h-3.5 w-3.5" />
                    Studio · Reading
                </p>
                <h1 className="mt-1.5 font-serif text-3xl font-semibold tracking-tight text-foreground">
                    Quiet passages
                </h1>
                <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted-foreground">
                    Peaceful native prose, bilingual reflections, and unhurried cultural
                    vignettes — one page at a time.
                </p>
            </header>

            <ReadingPage />
        </div>
    );
};

export default Reading;
