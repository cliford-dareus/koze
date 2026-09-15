"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Lesson, LessonDirection, LessonStep } from "@/data/lessons";
import { directionLabel } from "@/data/lessons";
import { enhanceLesson, tagLabel } from "@/lib/lesson-pedagogy";
import { loadProgress, recordActivity } from "@/lib/progress";
import { Button } from "@/app/_components/ui/button";
import MicAudioVisualizer from "@/app/_components/mic-audio-visualizer";

type Props = {
    lesson: Lesson;
    unitTitle: string;
    nextSlug?: string;
    nextTitle?: string;
    direction: LessonDirection;
};

export default function LessonPlayer({
    lesson: rawLesson,
    unitTitle,
    nextSlug,
    nextTitle,
    direction,
}: Props) {
    const [lesson, setLesson] = useState(rawLesson);
    const steps = lesson.steps;
    const [stepIndex, setStepIndex] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [checked, setChecked] = useState(false);
    const [finished, setFinished] = useState(false);
    const [spoke, setSpoke] = useState(false);

    useEffect(() => {
        const p = loadProgress();
        const completed =
            p.lessonsCompleted?.get?.(direction) ??
            (Array.isArray(p.lessonsCompleted) ? p.lessonsCompleted : []);
        const completedIds = Array.isArray(completed)
            ? completed
            : Array.from(completed as string[]);

        const enhanced = enhanceLesson(rawLesson, {
            completedLessonIds: completedIds.filter((id) => id !== rawLesson.id),
            includeSpeak: true,
            includeReview: true,
        });
        setLesson(enhanced);

        const directionLesson = p.lessonProgress?.get?.(direction);
        const entry = directionLesson?.get?.(rawLesson.id);
        if (entry?.completed) {
            setFinished(true);
            setStepIndex(Math.max(0, enhanced.steps.length - 1));
        } else if (entry && entry.currentStep > 0) {
            setStepIndex(Math.min(entry.currentStep, enhanced.steps.length - 1));
        } else {
            setStepIndex(0);
            setFinished(false);
        }
        setSelected(null);
        setChecked(false);
        setSpoke(false);
    }, [rawLesson, direction]);

    const step: LessonStep | undefined = steps[stepIndex];
    const progressPct = useMemo(() => {
        if (finished) return 100;
        if (!steps.length) return 0;
        return Math.round((stepIndex / steps.length) * 100);
    }, [finished, stepIndex, steps.length]);

    const persist = (index: number, completed: boolean) => {
        recordActivity("lesson", {
            lessonId: lesson.id,
            stepIndex: index,
            lessonCompleted: completed,
            topic: lesson.slug,
            direction: direction,
        });
    };

    const goNext = () => {
        setSelected(null);
        setChecked(false);
        setSpoke(false);

        if (stepIndex >= steps.length - 1) {
            setFinished(true);
            persist(steps.length - 1, true);
            return;
        }

        const next = stepIndex + 1;
        setStepIndex(next);
        persist(next, false);
    };

    const goBack = () => {
        if (stepIndex <= 0) return;
        setSelected(null);
        setChecked(false);
        setSpoke(false);
        setFinished(false);
        const prev = stepIndex - 1;
        setStepIndex(prev);
        persist(prev, false);
    };

    if (!step) {
        return (
            <p className="text-sm text-muted-foreground">
                This lesson has no steps.
            </p>
        );
    }

    return (
        <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    {unitTitle}
                </p>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    {directionLabel(lesson.direction)}
                </span>
            </div>
            <h1 className="mt-2 font-display text-3xl font-medium">
                {lesson.title}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
                {lesson.description}
            </p>

            {lesson.tags?.length ? (
                <div className="mt-3 flex flex-wrap gap-1.5">
                    {lesson.tags.map((t) => (
                        <span
                            key={t}
                            className="rounded-full border border-border bg-card px-2 py-0.5 text-[10px] font-medium capitalize text-muted-foreground"
                        >
                            {tagLabel(t)}
                        </span>
                    ))}
                </div>
            ) : null}

            <div className="mt-4">
                <div className="mb-1 flex justify-between text-[11px] text-muted-foreground">
                    <span>
                        Step {Math.min(stepIndex + 1, steps.length)} of{" "}
                        {steps.length}
                    </span>
                    <span>{progressPct}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                        className="h-full rounded-full bg-primary transition-all duration-300"
                        style={{ width: `${progressPct}%` }}
                    />
                </div>
            </div>

            {finished ? (
                <div className="mt-8 rounded-xl border border-border bg-card p-6 shadow-soft">
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                        Complete
                    </p>
                    <h2 className="mt-2 font-display text-2xl font-medium">
                        Well done.
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        You finished &ldquo;{lesson.title}&rdquo;. Later lessons will
                        weave in short reviews of what you already know.
                    </p>
                    <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                        <Button asChild variant="default">
                            <Link href="/lessons">Back to lessons</Link>
                        </Button>
                        {nextSlug ? (
                            <Button asChild variant="outline">
                                <Link
                                    href={`/lessons/${nextSlug}?direction=${direction}`}
                                >
                                    Next: {nextTitle ?? "Continue"}
                                </Link>
                            </Button>
                        ) : null}
                    </div>
                    <button
                        type="button"
                        className="mt-4 text-xs font-medium text-primary"
                        onClick={() => {
                            setFinished(false);
                            setStepIndex(0);
                            setSelected(null);
                            setChecked(false);
                            setSpoke(false);
                            persist(0, false);
                        }}
                    >
                        Review from the start
                    </button>
                </div>
            ) : (
                <div className="mt-6 rounded-xl border border-border bg-card p-5 shadow-soft">
                    <StepBody
                        step={step}
                        selected={selected}
                        checked={checked}
                        spoke={spoke}
                        onSelect={setSelected}
                        onSpoke={() => setSpoke(true)}
                    />

                    <div className="mt-8 flex items-center justify-between gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={goBack}
                            disabled={stepIndex === 0}
                        >
                            Back
                        </Button>

                        {step.type === "check" ? (
                            <Button
                                type="button"
                                onClick={() => {
                                    if (!checked) {
                                        if (selected === null) return;
                                        setChecked(true);
                                        return;
                                    }
                                    goNext();
                                }}
                                disabled={selected === null}
                            >
                                {checked
                                    ? stepIndex >= steps.length - 1
                                        ? "Finish"
                                        : "Continue"
                                    : "Check"}
                            </Button>
                        ) : step.type === "speak" ? (
                            <Button type="button" onClick={goNext}>
                                {spoke || true
                                    ? stepIndex >= steps.length - 1
                                        ? "Finish"
                                        : "Continue"
                                    : "I said it"}
                            </Button>
                        ) : (
                            <Button type="button" onClick={goNext}>
                                {stepIndex >= steps.length - 1
                                    ? "Finish"
                                    : "Continue"}
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function StepBody({
    step,
    selected,
    checked,
    spoke,
    onSelect,
    onSpoke,
}: {
    step: LessonStep;
    selected: number | null;
    checked: boolean;
    spoke: boolean;
    onSelect: (i: number) => void;
    onSpoke: () => void;
}) {
    if (step.type === "intro") {
        return (
            <div>
                <h2 className="font-display text-xl font-medium">{step.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {step.body}
                </p>
            </div>
        );
    }

    if (step.type === "tip") {
        return (
            <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">
                    Tip
                </p>
                <h2 className="mt-1 font-display text-xl font-medium">
                    {step.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {step.body}
                </p>
                {step.bullets?.length ? (
                    <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
                        {step.bullets.map((b) => (
                            <li key={b}>{b}</li>
                        ))}
                    </ul>
                ) : null}
            </div>
        );
    }

    if (step.type === "vocab") {
        return (
            <div>
                <h2 className="font-display text-xl font-medium">{step.title}</h2>
                <ul className="mt-4 space-y-2">
                    {step.items.map((item) => (
                        <li
                            key={item.term}
                            className="flex flex-col rounded-lg border border-border px-3 py-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3"
                        >
                            <span className="font-medium">{item.term}</span>
                            <span className="text-sm text-muted-foreground">
                                {item.meaning}
                                {item.note ? (
                                    <span className="ml-1 text-xs">
                                        · {item.note}
                                    </span>
                                ) : null}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    if (step.type === "phrase") {
        return (
            <div>
                <h2 className="font-display text-xl font-medium">{step.title}</h2>
                {(step.sourceLabel || step.targetLabel) && (
                    <p className="mt-1 text-[11px] text-muted-foreground">
                        {step.sourceLabel ?? "Source"} →{" "}
                        {step.targetLabel ?? "Target"}
                    </p>
                )}
                <ul className="mt-4 space-y-3">
                    {step.phrases.map((p) => (
                        <li
                            key={p.source + p.target}
                            className="rounded-lg border border-border px-3 py-3"
                        >
                            <p className="text-xs text-muted-foreground">
                                {p.source}
                            </p>
                            <p className="mt-1 font-display text-lg font-medium">
                                {p.target}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    if (step.type === "speak") {
        return (
            <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">
                    Speak
                </p>
                <h2 className="mt-1 font-display text-xl font-medium">
                    {step.title}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">{step.prompt}</p>

                {step.hint ? (
                    <p className="mt-4 text-xs text-muted-foreground">
                        Prompt: {step.hint}
                    </p>
                ) : null}

                <p className="mt-3 rounded-xl border border-primary/25 bg-accent/40 px-4 py-4 text-center font-display text-2xl font-medium leading-snug">
                    {step.targetLine}
                </p>

                <div className="mt-4">
                    <MicAudioVisualizer
                        label="Your voice"
                        barCount={36}
                        canvasClassName="h-20"
                        className="border-0 bg-transparent p-0 shadow-none"
                    />
                </div>

                <Button
                    type="button"
                    variant={spoke ? "default" : "outline"}
                    size="sm"
                    className="mt-3"
                    onClick={onSpoke}
                >
                    {spoke ? "Marked as spoken" : "I said it"}
                </Button>
            </div>
        );
    }

    // check
    return (
        <div>
            <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-xl font-medium">{step.title}</h2>
                {step.isReview ? (
                    <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-primary">
                        Review
                    </span>
                ) : null}
            </div>
            <p className="mt-3 text-sm">{step.prompt}</p>
            <ul className="mt-4 space-y-2">
                {step.options.map((opt, i) => {
                    const isCorrect = i === step.answerIndex;
                    const isSelected = selected === i;
                    let style =
                        "border-border bg-background hover:bg-muted/50 text-foreground";
                    if (checked && isCorrect) {
                        style = "border-primary bg-accent text-accent-foreground";
                    } else if (checked && isSelected && !isCorrect) {
                        style =
                            "border-destructive/50 bg-destructive/5 text-foreground";
                    } else if (isSelected) {
                        style = "border-primary bg-primary/5 text-foreground";
                    }

                    return (
                        <li key={opt}>
                            <button
                                type="button"
                                disabled={checked}
                                onClick={() => onSelect(i)}
                                className={`w-full rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${style}`}
                            >
                                {opt}
                            </button>
                        </li>
                    );
                })}
            </ul>
            {checked && step.explanation ? (
                <p className="mt-3 text-sm text-muted-foreground">
                    {step.explanation}
                </p>
            ) : null}
        </div>
    );
}
