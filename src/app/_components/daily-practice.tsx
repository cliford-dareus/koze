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

    // Gather a mix of questions from the current course
    const [practiceQuestions] = useState<LessonStep[]>(() => {
        const allQuestions: any[] = [];

        // loop through the course and collect check questions
        //  from different units]
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
        // Shuffle the questions
        allQuestions.sort(() => Math.random() - 0.5);

        // Pick 3 or 4 questions
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
    
    const persistProgress = () => {
        
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

    const onCompletePractice = (time: number, xpEarned: number) => {
        sound.playMilestoneHarp(progress.soundEnabled);
        setIsFinished(true);
        // persistProgress(time, xpEarned);
    };

    return (
        <div
            id="daily-practice-modal"
            className="flex items-center justify-center animate-in fade-in duration-200"
        >
            <div className="w-full max-w-xl bg-card p-6 sm:p-8 shadow-2xl space-y-6 relative">
                {!isFinished ? (
                    <>
                        {/* Header */}
                        <div>
                            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#557A66]">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Mindful Daily Practice (3 min)</span>
                            </div>
                            <h2 className="font-serif text-2xl font-semibold text-[#243327] tracking-tight mt-1">
                                Gentle Recall ({currentIndex + 1} of {practiceQuestions.length})
                            </h2>
                        </div>

                        {/* Question */}
                        {currentQ && (
                            <div className="space-y-4">
                                <div className="text-lg font-medium text-[#223326]">
                                    {"prompt" in currentQ && currentQ.prompt}
                                </div>

                                {"audioText" in currentQ && currentQ.audioText && (
                                    <button
                                        type="button"
                                        onClick={() => speak(currentQ.audioText!, currentLang.voice)}
                                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFECE4] text-xs font-medium text-[#2C382E]"
                                    >
                                        <Volume2 className="w-3.5 h-3.5 text-[#4D6D5A]" />
                                        <span>Listen audio</span>
                                    </button>
                                )}

                                {/* Options if MC/listening */}
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
                                                    className={`p-3.5 rounded-xl border text-left text-sm font-medium transition-all ${isSelected
                                                        ? 'bg-[#EAF2ED] border-[#4D6F5A] text-[#243527]'
                                                        : 'bg-[#FAF7F0] border-[#E6E0D4] hover:border-[#CDC5B5]'
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

                        {/* Bottom Bar */}
                        <div className="pt-4 border-t border-[#EAE5DC] flex items-center justify-between">
                            <span className="text-xs text-[#7B877E]">
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
                                    className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${selectedOption
                                        ? 'bg-[#3F614C] text-white hover:bg-[#34513F]'
                                        : 'bg-[#E3DFD4] text-[#9EA79F] cursor-not-allowed'
                                        }`}
                                >
                                    Check
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="px-5 py-2 rounded-full bg-[#3F614C] hover:bg-[#34513F] text-white text-xs font-semibold flex items-center gap-1.5"
                                >
                                    <span>Continue</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    </>
                ) : (
                    /* Finished Screen */
                    <div className="text-center py-4 space-y-5">
                        <div className="w-16 h-16 rounded-full bg-[#E5EFE7] border-2 border-[#C5DDD0] flex items-center justify-center text-[#3D664D] mx-auto">
                            <Check className="w-8 h-8" />
                        </div>

                        <div>
                            <div className="text-xs font-semibold uppercase tracking-wider text-[#52745F]">
                                Mindful Intention Fulfilled
                            </div>
                            <h3 className="font-serif text-2xl font-semibold text-[#243327] mt-1">
                                Daily Rhythm Preserved
                            </h3>
                            <p className="text-xs sm:text-sm text-[#6A786E] mt-1">
                                You dedicated 3 quiet minutes to language and peace today.
                            </p>
                        </div>

                        <div className="flex items-center justify-center gap-4 py-2">
                            <div className="px-4 py-2 bg-[#F3EFE6] rounded-xl border border-[#E7E0D3] text-xs font-semibold text-[#8E4922] flex items-center gap-1.5">
                                <Flame className="w-4 h-4 fill-[#8E4922]/30" />
                                <span>Streak Protected</span>
                            </div>
                            <div className="px-4 py-2 bg-[#EBF2EE] rounded-xl border border-[#D2E2D7] text-xs font-semibold text-[#375B44]">
                                +25 Lotus XP
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                sound.playPebbleTap(progress.soundEnabled);
                                // onCompletePractice(3, 25);
                            }}
                            className="w-full py-3 rounded-full bg-[#3F614C] hover:bg-[#34513F] text-white text-sm font-semibold transition-all"
                        >
                            Return with Peace
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
