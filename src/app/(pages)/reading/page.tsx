import { Leaf } from "lucide-react";
import { ReadingPage } from "./_components/reading-page";

const Reading = async () => {
    return (
        <div className="flex flex-col">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                <Leaf className="h-3 w-3" />
                Reading
            </p>
            <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-foreground">
                Quiet passages
            </h1>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                Peaceful native prose, bilingual reflections, and authentic cultural
                vignettes — at an unhurried pace.
            </p>

            <ReadingPage />
        </div>
    );
};

export default Reading;
