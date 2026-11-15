"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
    directionLabel,
    type Lesson,
    type LessonDirection,
    type LessonStep,
} from "@/data/lessons";
import { enhanceLesson, tagLabel } from "@/lib/lesson-pedagogy";
import { loadProgress, recordActivity } from "@/lib/progress";
import { Button } from "@/app/_components/ui/button";
import { sound } from "@/lib/sound";
import { ArrowRight, Check, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { LANGUAGES } from "@/lib/languages";
import CairnMascot from "@/app/_components/cairn-mascot";
import { StepBody } from "./step-body";

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

    const currentLanguage = LANGUAGES.find(
        (l) => l.value === direction?.split("-")[1],
    );

    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
    const [availableTokens, setAvailableTokens] = useState<string[]>([]);
    const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);
    const [evaluation, setEvaluation] = useState<
        "idle" | "correct" | "review"
    >("idle");
    const [feedbackExplanation, setFeedbackExplanation] = useState("");

    useEffect(() => {
        const p = loadProgress();
        const completed =
            p.lessonsCompleted?.get?.(direction!) ??
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

        const directionLesson = p.lessonProgress?.get?.(direction!);
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

        setEvaluation("idle");
        setFeedbackExplanation("");
        setSelected(null);
        setChecked(false);
        setSpoke(false);
        setSelectedOption(null);
        setSelectedTokens([]);
        setAvailableTokens([]);
        setMatchedPairIds([]);
    }, [rawLesson, direction]);

    const step: LessonStep | undefined = steps[stepIndex];
    const progressPct = useMemo(() => {
        if (finished) return 100;
        if (!steps.length) return 0;
        return Math.round((stepIndex / steps.length) * 100);
    }, [finished, stepIndex, steps.length]);

    const persist = (index: number, completed: boolean, xpEarned?: number) => {
        recordActivity("lesson", {
            lessonId: lesson.id,
            stepIndex: index,
            lessonCompleted: completed,
            topic: lesson.slug,
            direction: direction,
            xpEarned: xpEarned,
        });
    };

    const goNext = () => {
        setSelected(null);
        setChecked(false);
        setSpoke(false);
        setSelectedOption(null);
        setEvaluation("idle");
        setFeedbackExplanation("");

        if (stepIndex >= steps.length - 1) {
            setFinished(true);
            persist(steps.length - 1, true, lesson.xp);
            sound.playMilestoneHarp(true);
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
        setSelectedOption(null);
        setFinished(false);
        setEvaluation("idle");
        setFeedbackExplanation("");
        const prev = stepIndex - 1;
        setStepIndex(prev);
        persist(prev, false);
    };

    const handleCheck = () => {
        let isCorrect = false;
        let explanationText = step?.explanation || "";

        if (step.type === "listen") {
            // listen steps rely on selected index like check
            isCorrect = selected === (step as { answerIndex?: number }).answerIndex;
        } else if (step.type === "check") {
            isCorrect = selected === step.answerIndex;
        } else if (step.type === "context-dialogue") {
            isCorrect = selectedOption === step.correctAnswer;
        } else if (step.type === "sentence-builder") {
            isCorrect =
                selectedTokens.length === step.correctTokens.length &&
                selectedTokens.every((val, i) => val === step.correctTokens[i]);
            if (!isCorrect) {
                explanationText = `Target phrasing: "${step.targetSentence}" (${step.targetTranslation})`;
            }
        } else if (step.type === "pair-matching") {
            isCorrect = matchedPairIds.length === step.pairs.length;
        }

        if (isCorrect) {
            sound.playGentleChime(true);
            setEvaluation("correct");
            setFeedbackExplanation(
                explanationText || "Wonderful clarity and focus.",
            );
        } else {
            sound.playReflectionTone(true);
            setEvaluation("review");
            setFeedbackExplanation(
                explanationText ||
                "Take a gentle breath. We will revisit this phrase shortly.",
            );
        }
        setChecked(true);
    };

    const handleContinue = () => {
        sound.playPebbleTap(true);
        setSelected(null);
        setChecked(false);
        setSpoke(false);
        setSelectedOption(null);
        setSelectedTokens([]);
        setAvailableTokens([]);
        setMatchedPairIds([]);

        if (stepIndex + 1 < steps.length) {
            const next = stepIndex + 1;
            setStepIndex(next);
            setEvaluation("idle");
            setFeedbackExplanation("");
            persist(next, false);
        } else {
            setFinished(true);
            persist(steps.length - 1, true, lesson.xp);
            sound.playMilestoneHarp(true);
        }
    };

    const canSubmit = () => {
        if (evaluation !== "idle") return false;
        if (!step) return false;

        if (step.type === "check" || step.type === "listen") {
            return selected !== null;
        }
        if (step.type === "context-dialogue") {
            return !!selectedOption;
        }
        if (step.type === "sentence-builder") {
            return selectedTokens.length > 0;
        }
        if (step.type === "pair-matching") {
            return matchedPairIds.length === step.pairs.length;
        }
        return false;
    };

    const isInteractiveStep =
        step &&
        (step.type === "check" ||
            step.type === "listen" ||
            step.type === "context-dialogue" ||
            step.type === "pair-matching" ||
            step.type === "sentence-builder");

    if (!step) {
        return (
            <p className="text-sm text-muted-foreground">
                This lesson has no steps.
            </p>
        );
    }

    return (
        <div className="mx-auto flex w-full max-w-lg flex-col pb-10">
            {/* ── Sanctuary header ─────────────────────────────────────── */}
            <header className="mb-1">
                <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                        Studio · {unitTitle}
                    </p>
                    <span className="rounded-full border border-border bg-card px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                        {directionLabel(lesson.direction)}
                    </span>
                </div>
                <h1 className="mt-1.5 font-serif text-3xl font-semibold tracking-tight text-foreground">
                    {lesson.title}
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {lesson.description}
                </p>
            </header>

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

            {/* ── Path progress ────────────────────────────────────────── */}
            <div className="mt-5">
                <div className="mb-1.5 flex justify-between text-[11px] text-muted-foreground">
                    <span>
                        Step {Math.min(stepIndex + 1, steps.length)} of{" "}
                        {steps.length}
                    </span>
                    <span className="font-medium text-primary">
                        {progressPct}%
                    </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                        className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                        style={{ width: `${progressPct}%` }}
                    />
                </div>
            </div>

            {/* ── Finished state ───────────────────────────────────────── */}
            {finished ? (
                <div className="relative mt-8 overflow-hidden rounded-2xl border border-border bg-card p-6 text-center shadow-soft">
                    <div
                        className="lang-wash pointer-events-none absolute inset-0 opacity-50"
                        aria-hidden
                    />
                    <div className="relative">
                        <div className="mb-3 flex justify-center">
                            <CairnMascot
                                className="h-20 w-auto"
                                mood="celebrate"
                                label="Cairn celebrates a finished lesson"
                            />
                        </div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                            Path complete
                        </p>
                        <h2 className="mt-2 font-serif text-2xl font-semibold tracking-tight text-foreground">
                            Well done.
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            You finished &ldquo;{lesson.title}&rdquo;. Later
                            lessons will weave in short reviews of what you
                            already know.
                        </p>
                        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
                            <Button asChild variant="default" className="rounded-full">
                                <Link href="/lessons">Back to lessons</Link>
                            </Button>
                            {nextSlug ? (
                                <Button asChild variant="outline" className="rounded-full">
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
                            className="mt-4 text-xs font-medium text-primary hover:underline"
                            onClick={() => {
                                setFinished(false);
                                setStepIndex(0);
                                setSelected(null);
                                setChecked(false);
                                setSpoke(false);
                                setEvaluation("idle");
                                persist(0, false);
                            }}
                        >
                            Review from the start
                        </button>
                    </div>
                </div>
            ) : (
                /* ── Active step card ──────────────────────────────────── */
                <div className="relative mt-6 overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6">
                    <div
                        className="lang-wash pointer-events-none absolute inset-0 opacity-30"
                        aria-hidden
                    />
                    <div className="relative">
                        <StepBody
                            step={step}
                            selected={selected}
                            checked={checked}
                            spoke={spoke}
                            onSelect={setSelected}
                            onSpoke={() => setSpoke(true)}
                            matchedPairIds={matchedPairIds}
                            setMatchedPairIds={setMatchedPairIds}
                            evaluation={evaluation}
                            selectedTokens={selectedTokens}
                            setSelectedTokens={setSelectedTokens}
                            availableTokens={availableTokens}
                            setAvailableTokens={setAvailableTokens}
                            selectedOption={selectedOption}
                            setSelectedOption={setSelectedOption}
                            currentLanguage={currentLanguage}
                        />

                        {/* ── Bottom evaluation / nav bar ───────────────── */}
                        <div
                            id="lesson-bottom-bar"
                            className={cn(
                                "mt-5 w-full border-t pt-5 transition-colors duration-200",
                                evaluation === "correct"
                                    ? "border-primary/25"
                                    : evaluation === "review"
                                        ? "border-border"
                                        : "border-border",
                            )}
                        >
                            {isInteractiveStep ? (
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    {evaluation === "idle" ? (
                                        <>
                                            <p className="text-xs text-muted-foreground">
                                                Take your time. Mindful learning
                                                thrives on presence.
                                            </p>
                                            <button
                                                id="check-answer-btn"
                                                type="button"
                                                disabled={!canSubmit()}
                                                onClick={handleCheck}
                                                className={cn(
                                                    "rounded-full px-7 py-3 text-sm font-semibold shadow-xs transition-all",
                                                    canSubmit()
                                                        ? "cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md"
                                                        : "cursor-not-allowed bg-muted text-muted-foreground",
                                                )}
                                            >
                                                Check answer
                                            </button>
                                        </>
                                    ) : evaluation === "correct" ? (
                                        <>
                                            <div className="flex items-start gap-3">
                                                <CairnMascot
                                                    className="h-10 w-auto shrink-0"
                                                    mood="happy"
                                                    label="Cairn is happy with your answer"
                                                />
                                                <div>
                                                    <div className="text-sm font-semibold text-primary">
                                                        Serene understanding
                                                    </div>
                                                    <div className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                                                        {feedbackExplanation}
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                id="continue-correct-btn"
                                                type="button"
                                                onClick={handleContinue}
                                                className="flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-xs transition-all hover:bg-primary/90 hover:shadow-md"
                                            >
                                                <span>Continue</span>
                                                <ArrowRight className="h-4 w-4" />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex items-start gap-3">
                                                <CairnMascot
                                                    className="h-10 w-auto shrink-0"
                                                    mood="puzzled"
                                                    label="Cairn reflects with you"
                                                />
                                                <div>
                                                    <div className="text-sm font-semibold text-primary">
                                                        Mindful reflection
                                                    </div>
                                                    <div className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                                                        {feedbackExplanation}
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                id="continue-review-btn"
                                                type="button"
                                                onClick={handleContinue}
                                                className="flex items-center justify-center gap-2 rounded-full bg-secondary px-7 py-3 text-sm font-semibold text-secondary-foreground shadow-xs transition-all hover:bg-secondary/90 hover:shadow-md"
                                            >
                                                <span>Understood</span>
                                                <ArrowRight className="h-4 w-4" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center justify-between gap-3">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="rounded-full"
                                        onClick={goBack}
                                        disabled={stepIndex === 0}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        type="button"
                                        className="rounded-full"
                                        onClick={goNext}
                                    >
                                        {stepIndex >= steps.length - 1
                                            ? "Finish"
                                            : "Continue"}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
