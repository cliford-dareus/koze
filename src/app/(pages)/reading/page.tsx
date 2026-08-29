import ReadingManager from "./_components/reading-manager";
import { getQuote } from "@/app/_actions/translate";
import TextToSpeechWithVirsual from "@/app/_components/text-to-speech-with-virsual";
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
} from "@/app/_components/ui/drawer";
import { Button } from "@/app/_components/ui/button";
import { speak } from "@/lib/speech";
import { SplitText } from "./_components/split-text";

const Reading = async () => {
    const randomQuote = await getQuote();
    if (randomQuote === null) return null;

    return (
        <div className="flex flex-col">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Reading
            </p>
            <h1 className="mt-2 font-display text-3xl font-medium">
                One line, given time.
            </h1>

            <div className="mt-6 rounded-xl border border-border bg-card p-6 shadow-soft">
                <p className="font-display text-2xl leading-snug">
                    {randomQuote?.quote}
                </p>
                {randomQuote?.author ? (
                    <p className="mt-6 text-sm text-muted-foreground">
                        {randomQuote.author}
                    </p>
                ) : null}
            </div>

            <SplitText randomQuote={randomQuote} />

            <div className="mt-4 rounded-xl border border-border bg-card p-4 shadow-soft">
                <h2 className="text-sm font-medium">Listen</h2>
                <div className="mt-3 flex items-center gap-4">
                    <TextToSpeechWithVirsual
                        classname="h-[30px] w-[60%]"
                        randomFact={randomQuote?.quote}
                    />
                </div>
            </div>

            <div className="mt-8 flex w-full justify-center">
                <Drawer>
                    <DrawerTrigger asChild>
                        <Button className="w-full max-w-xs font-medium" size="lg">
                            Start reading
                        </Button>
                    </DrawerTrigger>

                    <DrawerContent className="border-border bg-background pb-20 pt-8">
                        <ReadingManager quote={randomQuote?.quote} />
                    </DrawerContent>
                </Drawer>
            </div>
        </div>
    );
};

export default Reading;
