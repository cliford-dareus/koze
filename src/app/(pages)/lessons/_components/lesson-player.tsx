"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Lesson, LessonDirection, LessonStep } from "@/data/lessons";
import { enhanceLesson } from "@/lib/lesson-pedagogy";
import { loadProgress, recordActivity } from "@/lib/progress";
import { Button } from "@/app/_components/ui/button";
import MicAudioVisualizer from "@/app/_components/mic-audio-visualizer";
import { sound } from "@/lib/sound";
import { speak } from "@/lib/speech";
import { ArrowRight, Check, RotateCcw, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
    const [finished, setFinished] = useState(false);
    const [selected, setSelected] = useState<number | null>(null);
    const [checked, setChecked] = useState(false);
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
            direction,
        });
    };

    const goNext = () => {
        if (stepIndex >= steps.length - 1) {
            setFinished(true);
            persist(stepIndex, true);
            return;
        }
        const next = stepIndex + 1;
        setStepIndex(next);
        setSelected(null);
        setChecked(false);
        setSpoke(false);
        persist(next, false);
    };

    if (finished) {
        return (
            <div className="flex flex-col gap-6 pb-8">
                <div className="rounded-xl border border-border bg-card p-6 text-center shadow-soft">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-primary">
                        <Check className="h-7 w-7" />
                    </div>
                    <h1 className="font-display text-2xl font-medium text-foreground">
                        Lesson complete
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {lesson.title} · {unitTitle}
                    </p>
                    <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
                        <Button asChild>
                            <Link href="/lessons">Back to path</Link>
                        </Button>
                        {nextSlug ? (
                            <Button variant="outline" asChild>
                                <Link href={`/lessons/${nextSlug}?direction=${direction}`}>
                                    Next: {nextTitle || "Continue"}
                                    <ArrowRight className="ml-1 h-4 w-4" />
                                </Link>
                            </Button>
                        ) : null}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 pb-8">
            <div>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    {unitTitle}
                </p>
                <h1 className="mt-1 font-display text-2xl font-medium text-foreground">
                    {lesson.title}
                </h1>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${progressPct}%` }}
                    />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                    Step {stepIndex + 1} of {steps.length}
                </p>
            </div>

            {step ? (
                <div className="rounded-xl border border-border bg-card p-5 shadow-soft">
                    {"prompt" in step && step.prompt ? (
                        <p className="text-base font-medium text-foreground">{step.prompt}</p>
                    ) : null}
                    {"text" in step && (step as { text?: string }).text ? (
                        <p className="mt-2 text-sm leading-relaxed text-foreground">
                            {(step as { text?: string }).text}
                        </p>
                    ) : null}

                    {step.type === "speak" ? (
                        <div className="mt-4 space-y-3">
                            <MicAudioVisualizer active={false} />
                            <Button
                                type="button"
                                className="w-full"
                                onClick={() => {
                                    setSpoke(true);
                                    const line =
                                        ("text" in step && (step as { text?: string }).text) ||
                                        ("prompt" in step && step.prompt) ||
                                        "";
                                    if (line) void speak(String(line), "fr-FR");
                                }}
                            >
                                <Volume2 className="mr-2 h-4 w-4" />
                                Practice saying this
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                disabled={!spoke}
                                onClick={goNext}
                            >
                                Continue
                            </Button>
                        </div>
                    ) : null}

                    {"options" in step && Array.isArray((step as { options?: string[] }).options) ? (
                        <div className="mt-4 grid gap-2">
                            {((step as { options: string[] }).options).map((opt, i) => {
                                const isSel = selected === i;
                                const answer =
                                    "answerIndex" in step
                                        ? Number((step as { answerIndex: number }).answerIndex)
                                        : 0;
                                const show = checked;
                                const isCorrect = i === answer;
                                return (
                                    <button
                                        key={i}
                                        type="button"
                                        disabled={checked}
                                        onClick={() => setSelected(i)}
                                        className={cn(
                                            "rounded-xl border px-4 py-3 text-left text-sm transition-colors",
                                            isSel && !show && "border-primary bg-accent text-primary",
                                            !isSel && !show && "border-border bg-background hover:bg-muted",
                                            show && isCorrect && "border-primary bg-accent text-primary",
                                            show && isSel && !isCorrect && "border-destructive bg-destructive/10 text-destructive",
                                        )}
                                    >
                                        {opt}
                                    </button>
                                );
                            })}
                            <div className="mt-2 flex gap-2">
                                {!checked ? (
                                    <Button
                                        type="button"
                                        disabled={selected === null}
                                        onClick={() => setChecked(true)}
                                        className="flex-1"
                                    >
                                        Check
                                    </Button>
                                ) : (
                                    <Button type="button" onClick={goNext} className="flex-1">
                                        Continue
                                        <ArrowRight className="ml-1 h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    ) : null}

                    {!("options" in step) && step.type !== "speak" ? (
                        <div className="mt-4">
                            <Button type="button" onClick={goNext} className="w-full">
                                Continue
                                <ArrowRight className="ml-1 h-4 w-4" />
                            </Button>
                        </div>
                    ) : null}
                </div>
            ) : null}

            <button
                type="button"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => {
                    setStepIndex(0);
                    setFinished(false);
                    setSelected(null);
                    setChecked(false);
                    setSpoke(false);
                }}
            >
                <RotateCcw className="h-3.5 w-3.5" />
                Restart lesson
            </button>
        </div>
    );
}
