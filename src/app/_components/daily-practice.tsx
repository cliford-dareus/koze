"use client";

import { getLessonsByDirection, Lesson, LessonStep } from "@/data/lessons";
import { LANGUAGES } from "@/lib/languages";
import { ProgressState } from "@/lib/progress";
import { sound } from "@/lib/sound";
import { speak } from "@/lib/speech";
import { ArrowRight, Check, Flame, Sparkles, Volume2, X } from "lucide-react";
import { useState } from "react";

export default function DailyPractice({ progress }: { progress: ProgressState }) {
    const currentLang =
        LANGUAGES.find((l) => l.value === progress.lessonDirection.split('-')[1]) ||
        LANGUAGES[0];

    const course = getLessonsByDirection(progress.lessonDirection);

    const [practiceQuestions] = useState<LessonStep[]>(() => {
        const allQuestions: any[] = [];
        const isCheck = (step: LessonStep) => step.type === 'check';
        const isContextDialogue = (step: LessonStep) => step.type === 'context-dialogue';

        for (let i = 0; i < course.length; i++) {
            const lesson = course[i];
            for (let j = 0; j < lesson.steps.length; j++) {
                const step = lesson.steps[j];
                if (isCheck(step) || isContextDialogue(step)) {
                    allQuestions.push(step);
                }
            }
        }
        allQuestions.sort(() => Math.random() - 0.5);
        return allQuestions.slice(0, 4);
    });

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
        if (currentQ.type === 'check' || currentQ.type === 'listen') {
            correct = selectedOption === currentQ.answerIndex.toString();
        } else if (currentQ.type === 'context-dialogue') {
            correct = selectedOption === currentQ.correctAnswer;
        } else {
            correct = true;
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

    return (
        <div
            id="daily-practice-modal"
            className="flex items-center justify-center animate-in fade-in duration-200"
        >
            <div className="w-full max-w-xl bg-card p-6 sm:p-8 shadow-2xl space-y-6 relative">
                {!isFinished ? (
                    <>
                        <div>
                            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Mindful Daily Practice (3 min)</span>
                            </div>
                            <h2 className="font-serif text-2xl font-semibold text-primary tracking-tight mt-1">
                                Gentle Recall ({currentIndex + 1} of {practiceQuestions.length})
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
                                        onClick={() => speak(currentQ.audioText!, currentLang.voice)}
                                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary text-xs font-medium text-primary"
                                    >
                                        <Volume2 className="w-3.5 h-3.5 text-primary" />
                                        <span>Listen audio</span>
                                    </button>
                                )}

                                {'options' in currentQ && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                                        {currentQ.options.map((opt: string, i: number) => {
                                            const isSelected = selectedOption === opt;
                                            return (
                                                <button
                                                    key={i}
                                                    type="button"
                                                    disabled={isAnswerChecked}
                                                    onClick={() => handleSelect(opt)}
                                                    className={`p-3.5 rounded-xl border text-left text-sm font-medium transition-all ${
                                                        isSelected
                                                            ? 'bg-accent border-primary text-primary'
                                                            : 'bg-card border-border hover:border-border'
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

                        <div className="pt-4 border-t border-border flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                                {isAnswerChecked
                                    ? isCorrect
                                        ? 'Serene and accurate.'
                                        : 'A gentle review note.'
                                    : 'Select an option to check.'}
                            </span>

                            {!isAnswerChecked ? (
                                <button
                                    type="button"
                                    disabled={!selectedOption}
                                    onClick={handleCheck}
                                    className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                                        selectedOption
                                            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                            : 'bg-secondary text-muted-foreground cursor-not-allowed'
                                    }`}
                                >
                                    Check
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="px-5 py-2 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold flex items-center gap-1.5"
                                >
                                    <span>Continue</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-4 space-y-5">
                        <div className="w-16 h-16 rounded-full bg-accent border-2 border-primary/30 flex items-center justify-center text-primary mx-auto">
                            <Check className="w-8 h-8" />
                        </div>

                        <div>
                            <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                                Mindful Intention Fulfilled
                            </div>
                            <h3 className="font-serif text-2xl font-semibold text-primary mt-1">
                                Daily Rhythm Preserved
                            </h3>
                            <p className="text-xs sm:text-sm text-foreground mt-1">
                                You dedicated 3 quiet minutes to language and peace today.
                            </p>
                        </div>

                        <div className="flex items-center justify-center gap-4 py-2">
                            <div className="px-4 py-2 bg-card rounded-xl border border-border text-xs font-semibold text-destructive flex items-center gap-1.5">
                                <Flame className="w-4 h-4 fill-destructive/30" />
                                <span>Streak Protected</span>
                            </div>
                            <div className="px-4 py-2 bg-accent rounded-xl border border-primary/30 text-xs font-semibold text-primary">
                                +25 Lotus XP
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                sound.playPebbleTap(progress.soundEnabled);
                            }}
                            className="w-full py-3 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold transition-all"
                        >
                            Return with Peace
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
