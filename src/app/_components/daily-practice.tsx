"use client";

import { getLessonsByDirection, LessonStep } from "@/data/lessons";
import { LANGUAGES } from "@/lib/languages";
import { ProgressState, saveProgress } from "@/lib/progress";
import { sound } from "@/lib/sound";
import { speak } from "@/lib/speech";
import { ArrowRight, Check, Flame, Loader2, Sparkles, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";

type PracticeStep = Extract<
    LessonStep,
    { type: "check" } | { type: "listen" } | { type: "context-dialogue" }
>;

function isPracticeStep(step: LessonStep): step is PracticeStep {
    return (
        step.type === "check" ||
        step.type === "listen" ||
        step.type === "context-dialogue"
    );
}

function shuffle<T>(items: T[]): T[] {
    const next = [...items];
    for (let i = next.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [next[i], next[j]] = [next[j], next[i]];
    }
    return next;
}

export default function DailyPractice({ progress }: { progress: ProgressState }) {
    const [practiceQuestions, setPracticeQuestions] = useState<PracticeStep[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    const currentLang =
        LANGUAGES.find((l) => l.value === progress.learningLanguage) ||
        LANGUAGES[0];

    useEffect(() => {
        let cancelled = false;

        async function loadQuestions() {
            setLoading(true);
            setLoadError(null);

            try {
                const direction =
                    progress.lessonDirection ??
                    (progress.nativeLanguage && progress.learningLanguage
                        ? (`${progress.nativeLanguage}-${progress.learningLanguage}` as const)
                        : "en-fr");

                const lessons = await getLessonsByDirection(direction);
                if (cancelled) return;

                const allQuestions: PracticeStep[] = [];
                for (const lesson of lessons) {
                    for (const step of lesson.steps) {
                        if (isPracticeStep(step)) {
                            allQuestions.push(step);
                        }
                    }
                }

                setPracticeQuestions(shuffle(allQuestions).slice(0, 4));
            } catch (err) {
                if (cancelled) return;
                if (process.env.NODE_ENV !== "production") {
                    console.error("Daily practice failed to load lessons:", err);
                }
                setLoadError("Could not load today's practice. Try again in a moment.");
                setPracticeQuestions([]);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        void loadQuestions();

        return () => {
            cancelled = true;
        };
    }, [
        progress.lessonDirection,
        progress.nativeLanguage,
        progress.learningLanguage,
    ]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isAnswerChecked, setIsAnswerChecked] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const currentQ = practiceQuestions[currentIndex];

    const handleSelect = (option: string) => {
        if (isAnswerChecked) return;
        sound.playPebbleTap(progress.soundEnabled);
        setSelectedOption(option);
        speak(option, currentLang.voice);
    };

    const handleCheck = () => {
        if (!currentQ || !selectedOption) return;

        let correct = false;
        if (currentQ.type === "check" || currentQ.type === "listen") {
            correct = selectedOption === currentQ.options[currentQ.answerIndex];
        } else if (currentQ.type === "context-dialogue") {
            correct = selectedOption === currentQ.correctAnswer;
        }

        setIsCorrect(correct);
        setIsAnswerChecked(true);

        if (correct) {
            sound.playGentleChime(progress.soundEnabled);
        } else {
            sound.playReflectionTone(progress.soundEnabled);
        }
    };

    const handleNext = () => {
        sound.playPebbleTap(progress.soundEnabled);
        if (currentIndex + 1 < practiceQuestions.length) {
            setCurrentIndex((prev) => prev + 1);
            setSelectedOption(null);
            setIsAnswerChecked(false);
            setIsCorrect(false);
        } else {
            sound.playMilestoneHarp(progress.soundEnabled);
            setIsFinished(true);
        }
    };

    const handleCompleteDailyPractice = (minutes: number, xp: number) => {
        const today = new Date().toISOString().split("T")[0];
        const isNewDay = progress.lastPracticedDate !== today;
        const newStreak = isNewDay ? progress.streak + 1 : progress.streak;

        const updated: ProgressState = {
            ...progress,
            streak: newStreak,
            lastPracticedDate: today,
            todayMinutesPracticed: (progress.todayMinutesPracticed || 0) + minutes,
            xp: (progress.xp || 0) + xp,
            cairnStonesCount: (progress.cairnStonesCount || 0) + 1,
            weeklyActivity: {
                ...progress.weeklyActivity,
                [today]: ((progress.weeklyActivity?.[today] as number) || 0) + minutes,
            },
        };

        saveProgress(updated);
    };

    const optionsForCurrent =
        currentQ && "options" in currentQ ? currentQ.options : null;

    return (
        <div
            id="daily-practice-modal"
            className="flex items-center justify-center animate-in fade-in duration-200"
        >
            <div className="relative w-full max-w-xl space-y-6 bg-background p-6 shadow-2xl sm:p-8">
                {loading ? (
                    <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <p className="text-sm">Preparing a gentle recall…</p>
                    </div>
                ) : loadError ? (
                    <div className="space-y-3 py-10 text-center">
                        <p className="text-sm text-muted-foreground">{loadError}</p>
                    </div>
                ) : practiceQuestions.length === 0 ? (
                    <div className="space-y-3 py-10 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent text-primary">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <h2 className="font-serif text-xl font-semibold text-primary">
                            No practice ready yet
                        </h2>
                        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
                            Complete a lesson or switch language path so we can gather a few
                            calm review questions for you.
                        </p>
                    </div>
                ) : !isFinished ? (
                    <>
                        <div>
                            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                                <Sparkles className="h-3.5 w-3.5" />
                                <span>Mindful Daily Practice (3 min)</span>
                            </div>
                            <h2 className="mt-1 font-serif text-2xl font-semibold tracking-tight text-primary">
                                Gentle Recall ({currentIndex + 1} of{" "}
                                {practiceQuestions.length})
                            </h2>
                        </div>

                        {currentQ && (
                            <div className="space-y-4">
                                <div className="text-lg font-medium text-primary">
                                    {"prompt" in currentQ && currentQ.prompt}
                                </div>

                                {"audioText" in currentQ && currentQ.audioText && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            speak(currentQ.audioText!, currentLang.voice)
                                        }
                                        className="inline-flex items-center gap-2 rounded-full bg-secondary px-3.5 py-1.5 text-xs font-medium text-primary"
                                    >
                                        <Volume2 className="h-3.5 w-3.5 text-primary" />
                                        <span>Listen audio</span>
                                    </button>
                                )}

                                {optionsForCurrent && (
                                    <div className="grid grid-cols-1 gap-2.5 pt-2 sm:grid-cols-2">
                                        {optionsForCurrent.map((opt: string, i: number) => {
                                            const isSelected = selectedOption === opt;
                                            return (
                                                <button
                                                    key={i}
                                                    type="button"
                                                    disabled={isAnswerChecked}
                                                    onClick={() => handleSelect(opt)}
                                                    className={`rounded-xl border p-3.5 text-left text-sm font-medium transition-all ${
                                                        isSelected
                                                            ? "border-primary bg-accent text-primary"
                                                            : "border-border bg-card hover:border-border"
                                                    }`}
                                                >
                                                    {opt}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center justify-between border-t border-border pt-4">
                            <span className="text-xs text-muted-foreground">
                                {isAnswerChecked
                                    ? isCorrect
                                        ? "Serene and accurate."
                                        : "A gentle review note."
                                    : "Select an option to check."}
                            </span>

                            {!isAnswerChecked ? (
                                <button
                                    type="button"
                                    disabled={!selectedOption}
                                    onClick={handleCheck}
                                    className={`rounded-full px-5 py-2 text-xs font-semibold transition-all ${
                                        selectedOption
                                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                            : "cursor-not-allowed bg-secondary text-muted-foreground"
                                    }`}
                                >
                                    Check
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                                >
                                    <span>Continue</span>
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="space-y-5 py-4 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary/30 bg-accent text-primary">
                            <Check className="h-8 w-8" />
                        </div>

                        <div>
                            <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                                Mindful Intention Fulfilled
                            </div>
                            <h3 className="mt-1 font-serif text-2xl font-semibold text-primary">
                                Daily Rhythm Preserved
                            </h3>
                            <p className="mt-1 text-xs text-foreground sm:text-sm">
                                You dedicated 3 quiet minutes to language and peace today.
                            </p>
                        </div>

                        <div className="flex items-center justify-center gap-4 py-2">
                            <div className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-destructive">
                                <Flame className="h-4 w-4 fill-destructive/30" />
                                <span>Streak Protected</span>
                            </div>
                            <div className="rounded-xl border border-primary/30 bg-accent px-4 py-2 text-xs font-semibold text-primary">
                                +25 Lotus XP
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                sound.playPebbleTap(progress.soundEnabled);
                                handleCompleteDailyPractice(3, 25);
                            }}
                            className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
                        >
                            Return with Peace
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
