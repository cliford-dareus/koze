"use client";

import { speak } from "@/lib/speech";

export function SplitText({ randomQuote }: { randomQuote: { quote: string, author: string } }) {
    return (
        <div className="mt-5 flex flex-wrap gap-1.5">
                {randomQuote?.quote.split(" ").map((w, i) => (
                    <button
                        key={`${w}-${i}`}
                        type="button"
                        className="rounded-sm bg-muted px-2 py-1 text-sm text-foreground transition-colors hover:bg-accent"
                        onClick={() => {
                            speak(w.replace(/[.,]/g, ""), "en-US");
                        }}
                    >
                        {w}
                    </button>
                ))}
            </div>
    );
}