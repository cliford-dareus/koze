"use client";

import { getLessonsByDirection, LessonStep } from "@/data/lessons";
import { LANGUAGES } from "@/lib/languages";
import { ProgressState, saveProgress } from "@/lib/progress";
import { sound } from "@/lib/sound";
import { speak } from "@/lib/speech";
import { ArrowRight, Check, Flame, Loader2, Sparkles, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";
import CairnMascot from "@/app/_components/cairn-mascot";

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
        LANGUAGES.find((l) => l.value === progress.learningLanguage) || LANGUAGES[0];

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
            className="relative mx-auto w-full max-w-xl px-4 pb-10 pt-2"
        >
            <div className="lang-wash pointer-events-none absolute inset-0 opacity-30" aria-hidden />

            <div className="relative space-y-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
                        <CairnMascot className="h-16 w-auto" mood="thinking" label="Cairn prepares practice" />
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        <p className="text-sm">Preparing a gentle recall…</p>
                    </div>
                ) : loadError ? (
                    <div className="space-y-3 py-10 text-center">
                        <CairnMascot className="mx-auto h-14 w-auto" mood="puzzled" label="Cairn is puzzled" />
                        <p className="text-sm text-muted-foreground">{loadError}</p>
                    </div>
                ) : practiceQuestions.length === 0 ? (
                    <div className="space-y-3 py-10 text-center">
                        <CairnMascot
                            className="mx-auto h-16 w-auto"
                            mood="thinking"
                            label="Cairn has no questions yet"
                        />
                        <h2 className="font-serif text-xl font-semibold text-foreground">
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
                            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                                <Sparkles className="h-3.5 w-3.5" />
                                <span>Mindful Daily Practice</span>
                            </div>
                            <h2 className="mt-1.5 font-serif text-2xl font-semibold tracking-tight text-foreground">
                                Gentle Recall ({currentIndex + 1} of {practiceQuestions.length})
                            </h2>
                            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                                <div
                                    className="h-full rounded-full bg-primary transition-all duration-500"
                                    style={{
                                        width: `${((currentIndex + (isAnswerChecked ? 1 : 0)) / practiceQuestions.length) * 100}%`,
                                    }}
                                />
                            </div>
                        </div>

                        {currentQ && (
                            <div className="space-y-4">
                                <div className="overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-soft sm:p-5">
                                    <div className="lang-wash pointer-events-none absolute inset-0 opacity-20" aria-hidden />
                                    <p className="relative text-base font-medium leading-relaxed text-foreground sm:text-lg">
                                        {"prompt" in currentQ && currentQ.prompt}
                                    </p>
                                </div>

                                {"audioText" in currentQ && currentQ.audioText && (
                                    <button
                                        type="button"
                                        onClick={() => speak(currentQ.audioText!, currentLang.voice)}
                                        className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-primary shadow-xs transition-colors hover:bg-accent"
                                    >
                                        <Volume2 className="h-3.5 w-3.5" />
                                        <span>Listen</span>
                                    </button>
                                )}

                                {optionsForCurrent && (
                                    <div className="grid grid-cols-1 gap-2.5 pt-1 sm:grid-cols-2">
                                        {optionsForCurrent.map((opt: string, i: number) => {
                                            const isSelected = selectedOption === opt;
                                            let style =
                                                "border-border bg-card hover:bg-muted";
                                            if (isAnswerChecked && isSelected && isCorrect) {
                                                style = "border-primary bg-accent text-primary";
                                            } else if (isAnswerChecked && isSelected && !isCorrect) {
                                                style = "border-border bg-muted text-muted-foreground opacity-70";
                                            } else if (isSelected) {
                                                style = "border-primary bg-accent text-primary shadow-xs";
                                            }

                                            return (
                                                <button
                                                    key={i}
                                                    type="button"
                                                    disabled={isAnswerChecked}
                                                    onClick={() => handleSelect(opt)}
                                                    className={`rounded-2xl border-2 p-3.5 text-left text-sm font-medium transition-all ${style}`}
                                                >
                                                    {opt}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        <div
                            className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-4 transition-colors ${isAnswerChecked
                                    ? isCorrect
                                        ? "border-primary/25 bg-accent"
                                        : "border-border bg-muted"
                                    : "border-border bg-card"
                                }`}
                        >
                            <div className="flex items-start gap-2.5">
                                {isAnswerChecked && (
                                    <CairnMascot
                                        className="mt-0.5 h-9 w-auto shrink-0"
                                        mood={isCorrect ? "happy" : "puzzled"}
                                        label={isCorrect ? "Cairn is pleased" : "Cairn reflects"}
                                    />
                                )}
                                <span className="text-xs leading-relaxed text-muted-foreground">
                                    {isAnswerChecked
                                        ? isCorrect
                                            ? "Serene and accurate."
                                            : "A gentle review note. Take a breath and continue."
                                        : "Select an option when you feel ready."}
                                </span>
                            </div>

                            {!isAnswerChecked ? (
                                <button
                                    type="button"
                                    disabled={!selectedOption}
                                    onClick={handleCheck}
                                    className={`shrink-0 rounded-full px-5 py-2.5 text-xs font-semibold transition-all ${selectedOption
                                            ? "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90"
                                            : "cursor-not-allowed bg-muted text-muted-foreground"
                                        }`}
                                >
                                    Check
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90"
                                >
                                    <span>Continue</span>
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="space-y-5 py-4 text-center">
                        <div className="flex justify-center">
                            <CairnMascot
                                className="h-20 w-auto"
                                mood="celebrate"
                                label="Cairn celebrates daily practice"
                            />
                        </div>

                        <div>
                            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                                Mindful Intention Fulfilled
                            </div>
                            <h3 className="mt-1.5 font-serif text-2xl font-semibold tracking-tight text-foreground">
                                Daily Rhythm Preserved
                            </h3>
                            <p className="mt-1.5 text-sm text-muted-foreground">
                                You dedicated a few quiet minutes to language and peace today.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-2.5 py-1">
                            <div className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-destructive shadow-xs">
                                <Flame className="h-3.5 w-3.5 fill-destructive/30" />
                                <span>Streak Protected</span>
                            </div>
                            <div className="rounded-full border border-primary/25 bg-accent px-3.5 py-1.5 text-xs font-semibold text-primary shadow-xs">
                                +25 Lotus XP
                            </div>
                            <div className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-xs">
                                +1 Pebble
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                sound.playPebbleTap(progress.soundEnabled);
                                handleCompleteDailyPractice(3, 25);
                            }}
                            className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-xs transition-all hover:bg-primary/90"
                        >
                            Return with Peace
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
