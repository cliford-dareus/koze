"use client";

import { getData } from "@/app/_actions/chat";
import { Button } from "@/app/_components/ui/button";
import Link from "next/link";
import React, { useCallback, useMemo, useState } from "react";
import { getTopic } from "@/lib/quiz-topics";
import { recordActivity } from "@/lib/progress";
import { cn } from "@/lib/utils";

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
  text: string;
  success?: boolean;
  succes?: boolean;
};

type QuestionState = {
  Question: string;
  wrong_answer: string[];
  correct_answer: string;
  image: string;
};

const emptyQuestion: QuestionState = {
  Question: "",
  wrong_answer: [],
  correct_answer: "",
  image: "",
};

function parseQuizText(text: string): QuestionState {
  const inputs = text.split("\n");
  const newData: QuestionState = {
    Question: "",
    wrong_answer: [],
    correct_answer: "",
    image: "",
  };

  for (const input of inputs) {
    const trimInput = input.trim();
    if (!trimInput) continue;
    const identifier = trimInput.split(":")[0]?.trim();

    if (identifier === "wrong_answer") {
      const match = trimInput.match(/wrong_answer:\s*\[(.*?)\]/);
      newData.wrong_answer = match
        ? match[1].split(",").map((s) => s.trim()).filter(Boolean)
        : [];
    } else if (identifier === "image") {
      const url = trimInput.slice(trimInput.indexOf("image:") + 6).trim();
      newData.image = url.endsWith(".") ? url.slice(0, -1) : url;
    } else if (identifier === "correct_answer") {
      let v = trimInput.split(":").slice(1).join(":").trim();
      if (v.endsWith(".")) v = v.slice(0, -1);
      newData.correct_answer = v.trim();
    } else if (identifier === "Question" || identifier === "question") {
      newData.Question = trimInput.split(":").slice(1).join(":").trim();
    }
  }

  return newData;
}

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
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);

  const options = useMemo(() => {
    if (!state.correct_answer) return [];
    return shuffle([
      state.correct_answer,
      ...state.wrong_answer.filter(Boolean),
    ]);
  }, [state.Question, state.correct_answer, state.wrong_answer.join("|")]);

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

        if (!data?.text) {
          setError("Could not load a question. Try again.");
          return;
        }
        setState(parseQuizText(data.text));
        setStarted(true);
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
    if (option === state.correct_answer) {
      setScore((s) => s + 1);
      recordActivity("quiz", { topic: params.slug });
    }
  };

  if (!started) {
    return (
      <div className="flex flex-col">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {topic?.emoji} {title}
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium">
          Ready when you are.
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {topic?.description ??
            "Short questions on this topic. Answers are saved to your local progress."}
        </p>

        {error && (
          <p className="mt-4 text-sm text-destructive">{error}</p>
        )}

        <div className="mt-8 flex flex-col gap-3">
          <Button
            size="lg"
            disabled={loading}
            onClick={() => loadQuestion("Start a new quiz question.")}
          >
            {loading ? "Loading…" : "Start quiz"}
          </Button>
          <Button variant="outline" asChild>
            <Link href="/chat">Choose another topic</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col pb-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {title}
        </p>
        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
          Score {score}
        </span>
      </div>

      {state.image ? (
        <div className="relative mt-4 h-[28vh] overflow-hidden rounded-xl border border-border bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={state.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      ) : null}

      <div className="mt-4 rounded-xl border border-border bg-card p-4 shadow-soft">
        <p className="font-display text-xl leading-snug">
          {state.Question || (loading ? "Thinking…" : "No question yet")}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {options.map((item) => {
          const isCorrect = item === state.correct_answer;
          const isSelected = item === selected;
          return (
            <button
              key={item}
              type="button"
              disabled={revealed || loading}
              onClick={() => onPick(item)}
              className={cn(
                "rounded-xl border border-border bg-card p-3 text-left text-sm shadow-soft transition-colors",
                revealed && isCorrect && "border-primary bg-accent",
                revealed && isSelected && !isCorrect && "border-destructive/40 bg-destructive/10",
                !revealed && "hover:bg-muted",
              )}
            >
              {item}
            </button>
          );
        })}
      </div>

      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

      <div className="mt-6 flex flex-col gap-2">
        <Button
          disabled={loading || !revealed}
          onClick={() => loadQuestion("Next question, please.")}
        >
          {loading ? "Loading…" : "Next question"}
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/chat">Change topic</Link>
        </Button>
      </div>
    </div>
  );
};

export default Chat;
