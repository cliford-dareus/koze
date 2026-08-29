"use client";

import { Mic, Send } from "lucide-react";
import { useRef, useState } from "react";

// import { useProgress } from "@/lib/progress";
// import { askTutor } from "@/lib/server/tutor";
// import { startListening } from "@/lib/speech";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/_components/ui/select";
import { Button } from "@/app/_components/ui/button";
import { LANGUAGES, LangCode, voiceFor } from "@/lib/languages";
import { PRACTICE_PROMPTS } from "@/lib/quiz-topics";


type Msg = { role: "user" | "assistant"; content: string };

export default function PracticePage() {
    // const bump = useProgress((s) => s.bump);
    const [lang, setLang] = useState<LangCode>("fr");
    const [messages, setMessages] = useState<Msg[]>([]);
    const [draft, setDraft] = useState("");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const [listening, setListening] = useState(false);
    const started = useRef(false);

    async function send(text: string) {
        const content = text.trim();
        // if (!content || busy) return;
        // setDraft("");
        // setError("");
        // const next: Msg[] = [...messages, { role: "user", content }];
        // setMessages(next);
        // setBusy(true);
        // const res = await askTutor({
        //     data: {
        //         language: LANGUAGES.find((l) => l.code === lang)?.name ?? "French",
        //         messages: next,
        //     },
        // });
        // setBusy(false);
        // if (!res.ok) {
        //     setError(res.error);
        //     return;
        // }
        // setMessages([...next, { role: "assistant", content: res.text }]);
        // if (!started.current) {
        //     started.current = true;
        //     bump("practice");
        // }
    }

    function listen() {
    //     if (listening) return;
    //     setListening(true);
    //     const stop = startListening(
    //         voiceFor(lang),
    //         (text) => {
    //             setDraft(text);
    //             setListening(false);
    //         },
    //         () => setListening(false),
    //     );
    //     if (!stop) {
    //         setListening(false);
    //         setError("Voice input is not available in this browser.");
    //     }
    }

    return (
        <div>
            <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
                Practice
            </p>
            <h1 className="mt-2 text-3xl font-medium">A patient conversation.</h1>

            <div className="mt-5">
                <Select value={lang} onValueChange={(v) => setLang(v as LangCode)}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {LANGUAGES.filter((l) => l.value !== "en").map((l) => (
                            <SelectItem key={l.value} value={l.value}>
                                Practice {l.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {messages.length === 0 ? (
                <div className="mt-6 flex flex-col gap-2">
                    {PRACTICE_PROMPTS.map((p) => (
                        <button
                            key={p}
                            type="button"
                            onClick={() => send(p)}
                            className="rounded-lg border border-border bg-card px-4 py-3 text-left text-sm hover:bg-muted"
                        >
                            {p}
                        </button>
                    ))}
                </div>
            ) : (
                <div className="mt-6 flex flex-col gap-3">
                    {messages.map((m, i) => (
                        <div
                            key={i}
                            className={cn(
                                "px-4 py-3 text-sm leading-6 shadow-none",
                                m.role === "user"
                                    ? "ml-8 bg-primary text-primary-foreground"
                                    : "mr-8",
                            )}
                        >
                            {m.content}
                        </div>
                    ))}
                    {busy ? (
                        <p className="text-xs text-muted-foreground">The tutor is thinking…</p>
                    ) : null}
                </div>
            )}

            {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}

            <form
                className="mt-6 flex gap-2"
                onSubmit={(e) => {
                    e.preventDefault();
                    void send(draft);
                }}
            >
                <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Write a reply"
                    disabled={busy}
                />
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={listen}
                    aria-label="Speak"
                >
                    <Mic />
                </Button>
                <Button type="submit" size="icon" disabled={busy || !draft.trim()} aria-label="Send">
                    <Send />
                </Button>
            </form>
        </div>
    );
}
