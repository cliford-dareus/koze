"use client";

import Link from "next/link";
import { useCallback, useMemo, useRef, useState } from "react";
import { LucideMic, LucideSend, LucideVolume2 } from "lucide-react";
import {
    TUTOR_SCENARIOS,
    TUTOR_UNIT_LABEL,
    getScenario,
    type TutorScenario,
    type TutorUnit,
} from "@/data/tutor-scenarios";
import { Button } from "@/app/_components/ui/button";
import MicAudioVisualizer from "@/app/_components/mic-audio-visualizer";
import { recordActivity } from "@/lib/progress";
import {
    directionForLearningLanguage,
    loadLearningPrefs,
} from "@/lib/learning-prefs";
import { voiceFor, type LangCode } from "@/lib/languages";
import { speak, startListening } from "@/lib/speech";
import { cn } from "@/lib/utils";

type ChatMsg = {
    role: "user" | "assistant";
    content: string;
    correction?: string | null;
    betterPhrase?: string | null;
};

type TutorApiOk = {
    success: true;
    reply: string;
    correction: string | null;
    betterPhrase: string | null;
    continue: boolean;
    summaryHint: string | null;
};

function targetLangFromPrefs(): LangCode {
    const prefs = loadLearningPrefs();
    const dir = directionForLearningLanguage(prefs.learningLanguage);
    // Learning French → speak French; learning English → speak English
    return dir === "en-fr" ? "fr" : "en";
}

function supportLangFromPrefs(): LangCode {
    const prefs = loadLearningPrefs();
    return (prefs.nativeLanguage as LangCode) || "en";
}

export default function PracticePage() {
    const [phase, setPhase] = useState<"pick" | "chat" | "summary">("pick");
    const [scenario, setScenario] = useState<TutorScenario | null>(null);
    const [messages, setMessages] = useState<ChatMsg[]>([]);
    const [draft, setDraft] = useState("");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const [listening, setListening] = useState(false);
    const [showMicViz, setShowMicViz] = useState(false);
    const [userTurns, setUserTurns] = useState(0);
    const [summaryHint, setSummaryHint] = useState<string | null>(null);
    const [lastBetter, setLastBetter] = useState<string | null>(null);
    const stopListenRef = useRef<(() => void) | null>(null);

    const targetLanguage = useMemo(() => targetLangFromPrefs(), []);
    const supportLanguage = useMemo(() => supportLangFromPrefs(), []);
    const voiceLang = voiceFor(targetLanguage);

    const units = useMemo(() => {
        const map = new Map<TutorUnit, TutorScenario[]>();
        for (const s of TUTOR_SCENARIOS) {
            const list = map.get(s.unit) ?? [];
            list.push(s);
            map.set(s.unit, list);
        }
        return map;
    }, []);

    const callTutor = useCallback(
        async (opts: {
            scenarioId: string;
            messages: { role: "user" | "assistant"; content: string }[];
            start?: boolean;
        }) => {
            const res = await fetch("/api/tutor", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    scenarioId: opts.scenarioId,
                    targetLanguage,
                    supportLanguage,
                    messages: opts.messages,
                    start: opts.start,
                }),
            });
            const data = await res.json();
            if (!res.ok || !data?.success) {
                throw new Error(data?.error || "Tutor request failed");
            }
            return data as TutorApiOk;
        },
        [supportLanguage, targetLanguage],
    );

    const beginScenario = async (s: TutorScenario) => {
        setError("");
        setScenario(s);
        setMessages([]);
        setUserTurns(0);
        setSummaryHint(null);
        setLastBetter(null);
        setPhase("chat");
        setBusy(true);
        try {
            const data = await callTutor({
                scenarioId: s.id,
                messages: [],
                start: true,
            });
            setMessages([
                {
                    role: "assistant",
                    content: data.reply,
                },
            ]);
            void speak(data.reply, voiceLang);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Could not start.");
            setPhase("pick");
            setScenario(null);
        } finally {
            setBusy(false);
        }
    };

    const finishSession = (hint: string | null, better: string | null) => {
        setSummaryHint(hint);
        setLastBetter(better);
        setPhase("summary");
        recordActivity("quiz", {
            topic: scenario?.id ?? "practice",
        });
    };

    const send = async (text: string) => {
        const content = text.trim();
        if (!content || busy || !scenario) return;
        setDraft("");
        setError("");

        const nextUser: ChatMsg = { role: "user", content };
        const prior = [...messages, nextUser];
        setMessages(prior);
        const turns = userTurns + 1;
        setUserTurns(turns);
        setBusy(true);

        try {
            const data = await callTutor({
                scenarioId: scenario.id,
                messages: prior.map((m) => ({
                    role: m.role,
                    content: m.content,
                })),
            });

            const assistant: ChatMsg = {
                role: "assistant",
                content: data.reply,
                correction: data.correction,
                betterPhrase: data.betterPhrase,
            };
            setMessages([...prior, assistant]);
            void speak(data.reply, voiceLang);

            const hitLimit = turns >= scenario.maxTurns;
            if (!data.continue || hitLimit) {
                finishSession(
                    data.summaryHint ||
                        (hitLimit
                            ? "Nice work staying in the scene. Try the same scenario again when you like."
                            : null),
                    data.betterPhrase,
                );
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : "Something went wrong.");
        } finally {
            setBusy(false);
        }
    };

    const listen = () => {
        if (listening || busy) return;
        setListening(true);
        setShowMicViz(true);
        const stop = startListening(
            voiceLang,
            (text) => {
                setDraft(text);
                setListening(false);
                setShowMicViz(false);
            },
            () => {
                setListening(false);
                setShowMicViz(false);
            },
        );
        stopListenRef.current = stop;
        if (!stop) {
            setListening(false);
            setShowMicViz(false);
            setError("Voice input is not available in this browser.");
        }
    };

    const reset = () => {
        stopListenRef.current?.();
        setPhase("pick");
        setScenario(null);
        setMessages([]);
        setDraft("");
        setError("");
        setUserTurns(0);
        setSummaryHint(null);
        setLastBetter(null);
        setShowMicViz(false);
    };

    if (phase === "pick") {
        return (
            <div className="flex flex-col pb-4">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    Practice
                </p>
                <h1 className="mt-2 font-display text-3xl font-medium">
                    A patient conversation.
                </h1>
                <p className="mt-2 max-w-prose text-sm text-muted-foreground">
                    Short roleplays tied to your path. Aim for a few turns, get one
                    gentle correction, and stop while it still feels calm. Practicing{" "}
                    <span className="font-medium text-foreground">
                        {targetLanguage === "fr" ? "French" : "English"}
                    </span>
                    .
                </p>

                {error ? (
                    <p className="mt-4 text-sm text-destructive" role="alert">
                        {error}
                    </p>
                ) : null}

                <div className="mt-8 space-y-8">
                    {Array.from(units.entries()).map(([unit, list]) => (
                        <section key={unit}>
                            <h2 className="font-display text-lg font-medium">
                                {TUTOR_UNIT_LABEL[unit]}
                            </h2>
                            <ul className="mt-3 space-y-2">
                                {list.map((s) => (
                                    <li key={s.id}>
                                        <button
                                            type="button"
                                            disabled={busy}
                                            onClick={() => void beginScenario(s)}
                                            className="w-full rounded-xl border border-border bg-card p-4 text-left shadow-soft transition-transform duration-150 hover:-translate-y-0.5"
                                        >
                                            <p className="font-display text-base font-medium">
                                                {s.title}
                                            </p>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {s.description}
                                            </p>
                                            <p className="mt-2 text-xs font-medium text-primary">
                                                Start · up to {s.maxTurns} turns →
                                            </p>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    ))}
                </div>

                <Button variant="ghost" className="mt-6" asChild>
                    <Link href="/chat">Back to practice home</Link>
                </Button>
            </div>
        );
    }

    if (phase === "summary" && scenario) {
        return (
            <div className="flex flex-col pb-4">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    Session complete
                </p>
                <h1 className="mt-2 font-display text-3xl font-medium">
                    Well held.
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    {scenario.title} · {userTurns} of your turns
                </p>

                <div className="mt-6 rounded-xl border border-border bg-card p-5 shadow-soft">
                    {summaryHint ? (
                        <p className="text-sm leading-relaxed">{summaryHint}</p>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            You stayed with the scene. That is enough for today.
                        </p>
                    )}
                    {lastBetter ? (
                        <div className="mt-4 rounded-lg border border-primary/20 bg-accent/40 px-3 py-3">
                            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                                Phrase to keep
                            </p>
                            <p className="mt-1 font-display text-lg font-medium">
                                {lastBetter}
                            </p>
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="mt-2 gap-1.5"
                                onClick={() => void speak(lastBetter, voiceLang)}
                            >
                                <LucideVolume2 size={14} />
                                Hear it
                            </Button>
                        </div>
                    ) : null}
                    <p className="mt-4 text-xs text-muted-foreground">
                        Progress counted toward your daily practice goal.
                    </p>
                </div>

                <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                    <Button type="button" onClick={reset}>
                        Choose another scenario
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            const s = getScenario(scenario.id);
                            if (s) void beginScenario(s);
                        }}
                    >
                        Replay this one
                    </Button>
                </div>
            </div>
        );
    }

    // chat phase
    return (
        <div className="flex flex-col pb-4">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                        {scenario ? TUTOR_UNIT_LABEL[scenario.unit] : "Practice"}
                    </p>
                    <h1 className="mt-1 font-display text-2xl font-medium">
                        {scenario?.title ?? "Conversation"}
                    </h1>
                    {scenario ? (
                        <p className="mt-1 text-xs text-muted-foreground">
                            Goal: {scenario.goal}
                        </p>
                    ) : null}
                </div>
                <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                    {userTurns}/{scenario?.maxTurns ?? "—"}
                </span>
            </div>

            <div className="mt-6 flex flex-col gap-3">
                {messages.map((m, i) => (
                    <div key={i} className="flex flex-col gap-1">
                        <div
                            className={cn(
                                "rounded-xl px-4 py-3 text-sm leading-6 shadow-soft",
                                m.role === "user"
                                    ? "ml-6 border border-primary/20 bg-primary text-primary-foreground"
                                    : "mr-6 border border-border bg-card",
                            )}
                        >
                            {m.content}
                        </div>
                        {m.role === "assistant" &&
                        (m.correction || m.betterPhrase) ? (
                            <div className="mr-6 rounded-lg border border-border/80 bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                                {m.correction ? (
                                    <p>
                                        <span className="font-medium text-foreground">
                                            Note:{" "}
                                        </span>
                                        {m.correction}
                                    </p>
                                ) : null}
                                {m.betterPhrase ? (
                                    <p className={m.correction ? "mt-1" : ""}>
                                        <span className="font-medium text-foreground">
                                            Try:{" "}
                                        </span>
                                        {m.betterPhrase}
                                    </p>
                                ) : null}
                            </div>
                        ) : null}
                    </div>
                ))}
                {busy ? (
                    <p className="text-xs text-muted-foreground">The tutor is thinking…</p>
                ) : null}
            </div>

            {showMicViz ? (
                <div className="mt-4">
                    <MicAudioVisualizer
                        controlled
                        active={listening}
                        label="Listening"
                        canvasClassName="h-16"
                        barCount={28}
                    />
                </div>
            ) : null}

            {error ? (
                <p className="mt-3 text-sm text-destructive" role="alert">
                    {error}
                </p>
            ) : null}

            <form
                className="mt-6 flex items-center gap-2"
                onSubmit={(e) => {
                    e.preventDefault();
                    void send(draft);
                }}
            >
                <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Your reply…"
                    disabled={busy}
                    className="min-h-11 flex-1 rounded-xl border border-border bg-card px-3 text-sm outline-none ring-ring focus:ring-2"
                />
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={listen}
                    disabled={busy}
                    aria-label="Speak"
                    className={listening ? "border-primary" : ""}
                >
                    <LucideMic size={18} />
                </Button>
                <Button
                    type="submit"
                    size="icon"
                    disabled={busy || !draft.trim()}
                    aria-label="Send"
                >
                    <LucideSend size={18} />
                </Button>
            </form>

            <button
                type="button"
                className="mt-4 text-xs font-medium text-muted-foreground hover:text-foreground"
                onClick={reset}
            >
                Leave scenario
            </button>
        </div>
    );
}
