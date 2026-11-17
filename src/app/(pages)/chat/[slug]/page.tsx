"use client";

import { getData } from "@/app/_actions/chat";
import { Button } from "@/app/_components/ui/button";
import Link from "next/link";
import React, { useCallback, useMemo, useState } from "react";
import { getTopic } from "@/lib/quiz-topics";
import { recordActivity } from "@/lib/progress";
import { cn } from "@/lib/utils";
import CairnMascot from "@/app/_components/cairn-mascot";

type Props = {
    params: {
        slug: string;
    };
};

export type FormDataType = {
    prompt: string;
    category: string;
};

type ResponseType = {
    quiz: QuestionState;
    success?: boolean;
};

type QuestionState = {
    question: string;
    choices: string[];
    correctIndex: number;
    image: string;
};

const emptyQuestion: QuestionState = {
    question: "",
    choices: [],
    correctIndex: 0,
    image: "",
};

function shuffle<T>(array: T[]) {
    const a = [...array];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const Chat = ({ params }: Props) => {
    const topic = getTopic(params.slug);
    const title = topic?.title ?? params.slug.replace(/-/g, " ");

    const [started, setStarted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [state, setState] = useState<QuestionState>(emptyQuestion);
    const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
    const [selected, setSelected] = useState<string | null>(null);
    const [revealed, setRevealed] = useState(false);
    const [score, setScore] = useState(0);

    const options = useMemo(() => {
        return shuffle([...state.choices.filter(Boolean)]);
    }, [state.choices]);

    const loadQuestion = useCallback(
        async (prompt: string) => {
            setLoading(true);
            setError("");
            setSelected(null);
            setRevealed(false);
            try {
                const data = (await getData({
                    prompt,
                    category: params.slug,
                })) as ResponseType | undefined;

                if (data?.success) {
                    setState(data.quiz);
                    setCorrectAnswer(data.quiz.choices[data.quiz.correctIndex]);
                    setStarted(true);
                }
            } catch {
                setError("Something went wrong. Try again.");
            } finally {
                setLoading(false);
            }
        },
        [params.slug],
    );

    const onPick = (option: string) => {
        if (revealed || loading) return;
        setSelected(option);
        setRevealed(true);
        if (option === correctAnswer) {
            setScore((s) => s + 1);
            recordActivity("quiz", { topic: params.slug });
        }
    };

    if (!started) {
        return (
            <div className="relative mx-auto flex w-full max-w-lg flex-col pb-10">
                <div
                    className="lang-wash pointer-events-none absolute inset-0 opacity-25"
                    aria-hidden
                />

                <div className="relative mb-4 flex justify-center">
                    <CairnMascot
                        className="h-20 w-auto"
                        mood="happy"
                        label="Cairn is ready for a quiet quiz"
                    />
                </div>

                <header className="relative text-center">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                        Studio · {title}
                    </p>
                    <h1 className="mt-1.5 font-serif text-3xl font-semibold tracking-tight text-foreground">
                        Ready when you are.
                    </h1>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {topic?.description ??
                            "Short questions on this topic. Answers are saved to your local progress."}
                    </p>
                </header>

                {error && (
                    <p className="relative mt-4 text-center text-sm text-destructive">
                        {error}
                    </p>
                )}

                <div className="relative mt-8 flex flex-col gap-2.5">
                    <Button
                        size="lg"
                        className="rounded-full"
                        disabled={loading}
                        onClick={() => loadQuestion("Start a new quiz question.")}
                    >
                        {loading ? "Preparing…" : "Start quiz"}
                    </Button>
                    <Button variant="outline" className="rounded-full" asChild>
                        <Link href="/chat">Choose another topic</Link>
                    </Button>
                </div>
            </div>
        );
    }

    const cairnMood = revealed
        ? selected === correctAnswer
            ? "happy"
            : "puzzled"
        : loading
          ? "thinking"
          : "idle";

    return (
        <div className="relative mx-auto flex w-full max-w-lg flex-col pb-10">
            <div
                className="lang-wash pointer-events-none absolute inset-0 opacity-15"
                aria-hidden
            />

            <div className="relative flex items-center justify-between gap-3">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                        Studio · {title}
                    </p>
                    <h1 className="mt-1 font-serif text-xl font-semibold tracking-tight text-foreground">
                        Quiet recognition
                    </h1>
                </div>
                <span className="shrink-0 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-primary shadow-xs">
                    Score {score}
                </span>
            </div>

            {state.image ? (
                <div className="relative mt-4 h-[28vh] overflow-hidden rounded-2xl border border-border bg-muted shadow-soft">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={state.image}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                </div>
            ) : null}

            <div className="relative mt-4 overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-soft sm:p-5">
                <div
                    className="lang-wash pointer-events-none absolute inset-0 opacity-20"
                    aria-hidden
                />
                <div className="relative flex items-start gap-3">
                    <CairnMascot
                        className="mt-0.5 h-12 w-auto shrink-0"
                        mood={cairnMood}
                        label="Cairn with the question"
                    />
                    <p className="font-serif text-xl leading-snug text-foreground">
                        {state.question ||
                            (loading ? "Thinking…" : "No question yet")}
                    </p>
                </div>
            </div>

            <div className="relative mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {options.map((item) => {
                    const isCorrect = item === correctAnswer;
                    const isSelected = item === selected;
                    return (
                        <button
                            key={item}
                            type="button"
                            disabled={revealed || loading}
                            onClick={() => onPick(item)}
                            className={cn(
                                "rounded-2xl border-2 border-border bg-card p-3.5 text-left text-sm shadow-soft transition-all",
                                revealed &&
                                    isCorrect &&
                                    "border-primary bg-accent text-primary",
                                revealed &&
                                    isSelected &&
                                    !isCorrect &&
                                    "border-border bg-muted text-muted-foreground opacity-70",
                                !revealed && "hover:border-primary/30 hover:bg-muted",
                            )}
                        >
                            {item}
                        </button>
                    );
                })}
            </div>

            {error && (
                <p className="relative mt-3 text-sm text-destructive">{error}</p>
            )}

            <div className="relative mt-6 flex flex-col gap-2">
                <Button
                    className="rounded-full"
                    disabled={loading || !revealed}
                    onClick={() => loadQuestion("Next question, please.")}
                >
                    {loading ? "Preparing…" : "Next question"}
                </Button>
                <Button variant="ghost" asChild>
                    <Link href="/chat">Change topic</Link>
                </Button>
            </div>
        </div>
    );
};

export default Chat;
