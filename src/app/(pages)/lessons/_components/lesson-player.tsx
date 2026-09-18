"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Lesson, LessonDirection, LessonStep, PairItem } from "@/data/lessons";
import { directionLabel } from "@/data/lessons";
import { enhanceLesson, tagLabel } from "@/lib/lesson-pedagogy";
import { loadProgress, recordActivity } from "@/lib/progress";
import { Button } from "@/app/_components/ui/button";
import MicAudioVisualizer from "@/app/_components/mic-audio-visualizer";
import { sound } from "@/lib/sound";
import { speak } from "@/lib/speech";
import { ArrowRight, Check, MessageCircle, RotateCcw, Volume2 } from "lucide-react";

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

    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    // Sentence builder state
    const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
    const [availableTokens, setAvailableTokens] = useState<string[]>([]);

    // Pair matching state
    const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);

    // Evaluation states
    const [evaluation, setEvaluation] = useState<'idle' | 'correct' | 'review'>('idle');
    const [feedbackExplanation, setFeedbackExplanation] = useState<string>('');

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

        setEvaluation('idle');
        setFeedbackExplanation('');
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

    const persist = (index: number, completed: boolean, xpEarned?: number) => {
        recordActivity("lesson", {
            lessonId: lesson.id,
            stepIndex: index,
            lessonCompleted: completed,
            topic: lesson.slug,
            direction: direction,
            xpEarned: xpEarned
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

    // Check Answer Handler
    const handleCheck = () => {
        let isCorrect = false;
        let explanationText = step?.explanation || '';

        if (step.type === 'listen') {
            const mc = step;
            // isCorrect = selectedOption === mc.correctAnswer;
        } else if (step.type === 'check') {
            const mc = step;
            isCorrect = selected === mc.answerIndex;
        } else if (step.type === 'context-dialogue') {
            const cd = step;
            isCorrect = selectedOption === cd.correctAnswer;
        } else if (step.type === 'sentence-builder') {
            const sb = step
            isCorrect =
                selectedTokens.length === sb.correctTokens.length &&
                selectedTokens.every((val, i) => val === sb.correctTokens[i]);
            if (!isCorrect) {
                explanationText = `Target phrasing: "${sb.targetSentence}" (${sb.targetTranslation})`;
            }
        } else if (step.type === 'pair-matching') {
            const pm = step;
            isCorrect = matchedPairIds.length === pm.pairs.length;
        }

        if (isCorrect) {
            sound.playGentleChime(true);
            setEvaluation('correct');
            // setCorrectCount((prev) => prev + 1);
            setFeedbackExplanation(explanationText || 'Wonderful clarity and focus.');
        } else {
            sound.playReflectionTone(true);
            setEvaluation('review');
            setFeedbackExplanation(
                explanationText || 'Take a gentle breath. We will revisit this phrase shortly.'
            );
            // Re-queue this question at the end for positive, pressure-free mastery
            // setQuestionQueue((prev) => [...prev, currentQ]);
        }
    };

    const handleContinue = () => {
        sound.playPebbleTap(true);

        setSelected(null);
        setChecked(false);
        setSpoke(false);

        if (stepIndex + 1 < steps.length) {
            const next = stepIndex + 1;
            setStepIndex(next);
            setEvaluation('idle');
            persist(next, false);
        } else if (stepIndex >= steps.length - 1) {
            // Completed all questions in the queue!
            setFinished(true);
            persist(steps.length - 1, true, lesson.xp);
            sound.playMilestoneHarp(true);
            return;
        }
    };

    const canSubmit = () => {
        if (evaluation !== 'idle') return false;

        if (step.type === 'check') {
            return selected !== null;
        }
        if (step.type === 'listen' || step.type === 'context-dialogue') {
            return !!selectedOption;
        }
        if (step.type === 'sentence-builder') {
            return selectedTokens.length > 0;
        }
        if (step.type === 'pair-matching') {
            const pm = step;
            return matchedPairIds.length === pm.pairs.length;
        }
        return false;
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
                        matchedPairIds={matchedPairIds}
                        setMatchedPairIds={setMatchedPairIds}
                        evaluation={evaluation}
                        selectedTokens={selectedTokens}
                        setSelectedTokens={setSelectedTokens}
                        availableTokens={availableTokens}
                        setAvailableTokens={setAvailableTokens}
                        selectedOption={selectedOption}
                        setSelectedOption={setSelectedOption}
                    />

                    <div
                        id="lesson-bottom-bar"
                        className={`w-full border-t transition-colors duration-200 py-5 px-4 sm:px-6 ${evaluation === 'correct'
                            ? 'bg-[#EAF3ED] border-[#C3DCB0]'
                            : evaluation === 'review'
                                ? 'bg-[#F9F4EC] border-[#E8DDCF]'
                                : 'bg-[#FAF8F5] border-[#EAE5DC]'
                            }`}
                    >
                        {
                            (step.type === 'check'
                                || step.type === 'listen'
                                || step.type === 'context-dialogue'
                                || step.type === 'pair-matching'
                                || step.type === 'sentence-builder'
                            ) ? (<div className="max-w-2xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                {evaluation === 'idle' ? (
                                    <>
                                        <div className="text-xs text-[#7A867C]">
                                            Take your time. Mindful learning thrives on presence.
                                        </div>
                                        <button
                                            id="check-answer-btn"
                                            type="button"
                                            disabled={!canSubmit()}
                                            onClick={handleCheck}
                                            className={`px-7 py-3 rounded-full text-sm font-semibold transition-all shadow-xs ${canSubmit()
                                                ? 'bg-[#3F614C] hover:bg-[#34513F] text-white cursor-pointer hover:shadow-md'
                                                : 'bg-[#E3DFD4] text-[#9AA39B] cursor-not-allowed'
                                                }`}
                                        >
                                            Check Answer
                                        </button>
                                    </>
                                ) : evaluation === 'correct' ? (
                                    <>
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-full bg-[#3F614C] text-white flex items-center justify-center shrink-0 mt-0.5">
                                                <Check className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-[#2A4B36]">
                                                    Serene Understanding
                                                </div>
                                                <div className="text-xs text-[#486350] mt-0.5 leading-relaxed">
                                                    {feedbackExplanation}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            id="continue-correct-btn"
                                            type="button"
                                            onClick={handleContinue}
                                            className="px-7 py-3 rounded-full bg-[#3F614C] hover:bg-[#34513F] text-white text-sm font-semibold transition-all shadow-xs hover:shadow-md flex items-center justify-center gap-2"
                                        >
                                            <span>Continue</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-full bg-[#B86E40] text-white flex items-center justify-center shrink-0 mt-0.5">
                                                <RotateCcw className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-[#8C4A21]">
                                                    Mindful Reflection
                                                </div>
                                                <div className="text-xs text-[#70523C] mt-0.5 leading-relaxed">
                                                    {feedbackExplanation}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            id="continue-review-btn"
                                            type="button"
                                            onClick={handleContinue}
                                            className="px-7 py-3 rounded-full bg-[#B86E40] hover:bg-[#9F5B32] text-white text-sm font-semibold transition-all shadow-xs hover:shadow-md flex items-center justify-center gap-2"
                                        >
                                            <span>Understood</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </>
                                )}
                            </div>)
                                : (
                                    <div className="mt-8 flex items-center justify-between gap-3">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={goBack}
                                            disabled={stepIndex === 0}
                                        >
                                            Back
                                        </Button>

                                        <Button type="button" onClick={goNext}>
                                            {stepIndex >= steps.length - 1
                                                ? "Finish"
                                                : "Continue"}
                                        </Button>
                                    </div>)}
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
    matchedPairIds,
    setMatchedPairIds,
    evaluation,
    selectedTokens,
    setSelectedTokens,
    availableTokens,
    setAvailableTokens,
    selectedOption,
    setSelectedOption
}: {
    step: LessonStep;
    selected: number | null;
    checked: boolean;
    spoke: boolean;
    onSelect: (i: number) => void;
    onSpoke: () => void;
    matchedPairIds: string[];
    setMatchedPairIds: (ids: string[]) => void;
    evaluation?: "correct" | "review" | "idle";
    selectedTokens: string[];
    setSelectedTokens: (tokens: string[]) => void;
    availableTokens: string[];
    setAvailableTokens: (tokens: string[]) => void;
    selectedOption: string | null;
    setSelectedOption: (option: string | null) => void;
}) {
    // Pair matching state
    const [selectedForeignId, setSelectedForeignId] = useState<string | null>(null);
    const [selectedNativeId, setSelectedNativeId] = useState<string | null>(null);

    // Initialize per question
    useEffect(() => {
        if (!step) return;

        if (step.type === 'sentence-builder') {
            const sb = step;
            setAvailableTokens([...sb.scrambledTokens]);
            setSelectedTokens([]);
        } else if (step.type === 'pair-matching') {
            setMatchedPairIds([]);
            setSelectedForeignId(null);
            setSelectedNativeId(null);
        }

        // Auto-play speech for listening questions
        // if (step.type === 'listening' && step.audioText) {
        //     setTimeout(() => {
        //         speech.speak(currentQ.audioText!, speechLang);
        //     }, 400);
        // }
    }, [step]);

    // Handle Token Tap in Sentence Builder
    const handleAddToken = (token: string, idx: number) => {
        sound.playPebbleTap(true);
        setSelectedTokens([...selectedTokens, token]);
        const nextAvail = [...availableTokens];
        nextAvail.splice(idx, 1);
        setAvailableTokens(nextAvail);
        if (nextAvail.length < 2) {
            onSelect(1);
        }
    };

    const handleRemoveToken = (token: string, idx: number) => {
        sound.playPebbleTap(true);
        const nextSelected = [...selectedTokens];
        nextSelected.splice(idx, 1);
        setSelectedTokens(nextSelected);
        setAvailableTokens([...availableTokens, token]);
    };

    // Handle Pair Matching Selection
    const handleSelectForeign = (item: PairItem) => {
        sound.playPebbleTap(true);
        if (matchedPairIds.includes(item.id)) return;
        // speak(item.foreign, speechLang);

        if (selectedNativeId) {
            // Check if match
            if (selectedNativeId === item.id) {
                sound.playGentleChime(true);
                setMatchedPairIds([...matchedPairIds, item.id]);
                setSelectedForeignId(null);
                setSelectedNativeId(null);
            } else {
                sound.playReflectionTone(true);
                setSelectedForeignId(null);
                setSelectedNativeId(null);
            }
        } else {
            setSelectedForeignId(item.id);
        }
    };

    const handleSelectNative = (item: PairItem) => {
        sound.playPebbleTap(true);
        if (matchedPairIds.includes(item.id)) return;

        if (selectedForeignId) {
            if (selectedForeignId === item.id) {
                sound.playGentleChime(true);
                setMatchedPairIds([...matchedPairIds, item.id]);
                onSelect(1);
                setSelectedForeignId(null);
                setSelectedNativeId(null);
            } else {
                sound.playReflectionTone(true);
                setSelectedForeignId(null);
                setSelectedNativeId(null);
            }
        } else {
            setSelectedNativeId(item.id);
        }
    };

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

    if (step.type === 'pair-matching') {
        return (
            <div className="space-y-4">
                <div className="text-xs text-[#738075] text-center mb-2">
                    Match the harmonious pairs ({matchedPairIds.length} of{' '}
                    {(step).pairs.length} paired)
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Foreign Words Column */}
                    <div className="space-y-2.5">
                        {(step).pairs.map((pair) => {
                            const isMatched = matchedPairIds.includes(pair.id);
                            const isSelected = selectedForeignId === pair.id;

                            return (
                                <button
                                    key={pair.id}
                                    type="button"
                                    disabled={isMatched || evaluation !== 'idle'}
                                    onClick={() => handleSelectForeign(pair)}
                                    className={`w-full p-3.5 rounded-xl border-2 text-left transition-all ${isMatched
                                        ? 'bg-[#EBF2EE] border-transparent opacity-40 cursor-default'
                                        : isSelected
                                            ? 'bg-[#E3EEE6] border-[#4D6F5A] scale-102 shadow-xs'
                                            : 'bg-[#FCFAF6] border-[#E7E2D8] hover:border-[#CDC6B6]'
                                        }`}
                                >
                                    <div className="font-semibold text-sm text-[#253328]">
                                        {pair.foreign}
                                    </div>
                                    {pair.phonetic && (
                                        <div className="text-[11px] text-[#717E73]">{pair.phonetic}</div>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Native Meaning Column */}
                    <div className="space-y-2.5">
                        {step.pairs.map((pair) => {
                            const isMatched = matchedPairIds.includes(pair.id);
                            const isSelected = selectedNativeId === pair.id;

                            return (
                                <button
                                    key={pair.id}
                                    type="button"
                                    disabled={isMatched || evaluation !== 'idle'}
                                    onClick={() => handleSelectNative(pair)}
                                    className={`w-full p-3.5 rounded-xl border-2 text-left transition-all ${isMatched
                                        ? 'bg-[#EBF2EE] border-transparent opacity-40 cursor-default'
                                        : isSelected
                                            ? 'bg-[#E3EEE6] border-[#4D6F5A] scale-102 shadow-xs'
                                            : 'bg-[#FCFAF6] border-[#E7E2D8] hover:border-[#CDC6B6]'
                                        }`}
                                >
                                    <div className="font-medium text-sm text-[#253328]">
                                        {pair.native}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        )
    }

    if (step.type === 'sentence-builder') {
        return (
            <div className="space-y-6">
                {/* Target Meaning */}
                <div className="text-center p-3 bg-[#F5F2EB] rounded-xl text-sm font-serif italic text-[#556358]">
                    "{step.targetTranslation}"
                </div>

                {/* Answer Assembled Slot */}
                <div className="min-h-20 p-4 bg-[#FCFAF6] border-2 border-dashed border-[#DED7CA] rounded-2xl flex flex-wrap items-center gap-2">
                    {selectedTokens.length === 0 ? (
                        <span className="text-xs text-[#9DA79F] italic mx-auto">
                            Tap word pebbles below to weave your sentence
                        </span>
                    ) : (
                        selectedTokens.map((token, idx) => (
                            <button
                                key={idx}
                                type="button"
                                disabled={evaluation !== 'idle'}
                                onClick={() => handleRemoveToken(token, idx)}
                                className="px-3.5 py-2 rounded-xl bg-[#E6EFE9] border border-[#BFD6C6] text-[#2C4A37] text-sm font-medium shadow-xs hover:bg-[#DBE9DF] transition-transform active:scale-95"
                            >
                                {token}
                            </button>
                        ))
                    )}
                </div>

                {/* Available Tokens Pebble Bank */}
                <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                    {availableTokens.map((token, idx) => (
                        <button
                            key={idx}
                            type="button"
                            disabled={evaluation !== 'idle'}
                            onClick={() => handleAddToken(token, idx)}
                            className="px-4 py-2.5 rounded-xl bg-[#EFECE4] border border-[#DDD7CD] text-[#344037] text-sm font-medium hover:bg-[#E5E0D5] hover:scale-105 transition-all active:scale-95 shadow-xs"
                        >
                            {token}
                        </button>
                    ))}
                </div>
            </div>
        )
    }

    if (step.type === 'context-dialogue') {
        return (
            <div className="space-y-6">
                {/* Dialogue bubble */}
                <div className="bg-[#FAF6EE] border border-[#E7E0D3] rounded-2xl p-5 relative">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#637265] mb-2">
                        <MessageCircle className="w-3.5 h-3.5 text-[#4D6F5A]" />
                        <span>{step.dialoguePartner}</span>
                    </div>
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <div className="font-serif text-xl text-[#243327]">
                                {step.partnerSays}
                            </div>
                            {step.partnerSaysPhonetic && (
                                <div className="text-xs text-[#778379] mt-0.5">
                                    {step.partnerSaysPhonetic}
                                </div>
                            )}
                            <div className="text-xs text-[#636E65] mt-1 italic">
                                "{step.partnerSaysTranslation}"
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                // speak(
                                //     step.partnerSays,
                                //     speechLang
                                // );
                            }}
                            className="p-2 rounded-full bg-[#EFECE4] text-[#3D4C40] hover:bg-[#E6E1D7] transition-colors shrink-0"
                            title="Listen to partner"
                        >
                            <Volume2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Response Options */}
                <div className="space-y-3">
                    {step.options.map((option, idx) => {
                        const isSelected = selectedOption === option;
                        return (
                            <button
                                key={idx}
                                id={`dialogue-option-${idx}`}
                                type="button"
                                disabled={evaluation !== 'idle'}
                                onClick={() => {
                                    sound.playPebbleTap(true);
                                    setSelectedOption(option);
                                    // speech.speak(option, speechLang);
                                }}
                                className={`w-full p-4 rounded-2xl text-left border-2 transition-all ${isSelected
                                    ? 'bg-[#EBF2EE] border-[#4D6F5A] shadow-xs'
                                    : 'bg-[#FCFAF6] border-[#E8E3D8] hover:border-[#CDC6B6]'
                                    }`}
                            >
                                <span className="text-sm sm:text-base font-medium text-[#243327]">
                                    {option}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        )
    }


    return (
        <div>
            <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-xl font-medium">{step.title}</h2>
                {step.type === "check" && step.isReview ? (
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
                    const phonetic = step.type === "listen" ? step?.phoneticAnswers?.[opt] : null;

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
                                disabled={evaluation !== 'idle' || checked}
                                onClick={() => {
                                    sound.playPebbleTap(true);
                                    onSelect(i);
                                    setSelectedOption(opt);
                                    // speak(option, speechLang);
                                }}
                                className={`w-full rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${style}`}
                            >
                                <div className="font-medium text-base text-[#243327]">{opt}</div>
                                {phonetic && (
                                    <div className="text-xs text-[#717E73] mt-0.5">{phonetic}</div>
                                )}
                            </button>
                        </li>
                    );
                })}
            </ul>
            {checked && step?.explanation ? (
                <p className="mt-3 text-sm text-muted-foreground">
                    {step.explanation}
                </p>
            ) : null}
        </div>
    );
}
