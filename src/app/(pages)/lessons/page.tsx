"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import {
    UNITS,
    directionLabel,
    getLessonsByDirection,
    type LessonDirection,
} from "@/data/lessons";
import {
    LessonProgressEntry,
    defaultProgress,
    loadProgress,
    type ProgressState,
} from "@/lib/progress";
import {
    directionForLearningLanguage,
    learningTrackLabel,
    loadLearningPrefs,
    saveLearningPrefs,
} from "@/lib/learning-prefs";
import { LANGUAGES } from "../../../lib/languages";
import { BookOpen, Check, Compass, Lock, Play, Sparkles } from "lucide-react";
import { sound } from "@/lib/sound";
import { useRouter } from "next/navigation";

export default function LessonsPage() {
    const { data: session } = useSession();
    const [progress, setProgress] = useState<ProgressState>(defaultProgress());
    const [learningLanguage, setLearningLanguage] = useState("en");

    const currentLang =
        LANGUAGES.find((l) => l.voice === progress.lessonDirection) ||
        LANGUAGES[0];

    useEffect(() => {
        const refreshProgress = () => setProgress(loadProgress());
        refreshProgress();
        window.addEventListener("koze-progress", refreshProgress);
        window.addEventListener("storage", refreshProgress);

        const applyPrefs = () => {
            const local = loadLearningPrefs();
            const fromSession = session?.user?.learningLanguage;
            if (fromSession) {
                setLearningLanguage(fromSession);
                saveLearningPrefs({
                    learningLanguage: fromSession,
                    nativeLanguage:
                        session?.user?.nativeLanguage || local.nativeLanguage || "en",
                });
            } else {
                setLearningLanguage(local.learningLanguage);
            }
        };
        applyPrefs();
        window.addEventListener("koze-learning-prefs", applyPrefs);

        return () => {
            window.removeEventListener("koze-progress", refreshProgress);
            window.removeEventListener("koze-learning-prefs", applyPrefs);
            window.removeEventListener("storage", refreshProgress);
        };
    }, [session?.user?.learningLanguage, session?.user?.nativeLanguage]);

    const primaryDirection: LessonDirection = useMemo(
        () => directionForLearningLanguage(learningLanguage),
        [learningLanguage],
    );

    const completedSet = new Set(progress.lessonsCompleted.get(primaryDirection!) || []);

    const countFor = (direction: LessonDirection) => {
        const lessons = getLessonsByDirection(direction);
        const completedIds = progress.lessonsCompleted.get(direction!) || [];
        const done = lessons.filter((l) => completedIds.includes(l.id)).length;
        return { done, total: lessons.length };
    };

    const primaryStats = countFor(primaryDirection);
    const pct = primaryStats.total
        ? Math.round((primaryStats.done / primaryStats.total) * 100)
        : 0;

    const onPickLearning = (code: "en" | "fr") => {
        setLearningLanguage(code);
        const local = loadLearningPrefs();
        saveLearningPrefs({
            learningLanguage: code,
            nativeLanguage: code === "en" ? "fr" : local.nativeLanguage || "en",
        });
    };

    return (
        <div className="flex flex-col">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Lessons
            </p>
            <div className="my-6">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#79887C]">
                    Your Learning Path
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#243327] tracking-tight mt-0.5">
                    Stepping Stones of {currentLang.name}
                </h1>
                <p className="text-xs sm:text-sm text-[#6C786E] mt-1">
                    Step from stone to stone with quiet curiosity. Lessons unlock as you walk.
                </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                            Your path
                        </p>
                        <p className="mt-1 font-display text-2xl font-medium">
                            {primaryStats.done}
                            <span className="text-base text-muted-foreground">
                                {" "}
                                / {primaryStats.total}
                            </span>
                        </p>
                    </div>
                    <p className="text-sm font-medium text-primary">{pct}%</p>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                        className="h-full rounded-full bg-primary transition-all duration-300"
                        style={{ width: `${pct}%` }}
                    />
                </div>
            </div>

            <UnitList
                units={UNITS}
                direction={primaryDirection}
                completedSet={completedSet}
                progress={progress}
            />
        </div>
    );
}

function UnitList({
    units,
    direction,
    completedSet,
    progress,
}: {
    units: typeof UNITS;
    direction: LessonDirection;
    completedSet: Set<string>;
    progress: ProgressState;
}) {
    const router = useRouter();
    return (
        <div className="mt-8 space-y-8">
            {units.map((unit) => {
                const unitLessons = getLessonsByDirection(direction).filter((l) => l.unitId === unit.id);
                const unitDone = unitLessons.filter((l) =>
                    completedSet.has(l.id),
                ).length;
                const isUnitCompleted = unitDone === unitLessons.length;

                return (
                    <section key={unit.id}>
                        {/* Unit Header Card */}
                        <div className="bg-card border border-[#E7E2D8] rounded-2xl p-5 sm:p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#68756A]">
                                        <Compass className="w-4 h-4 text-[#4D6D5A]" />
                                        <span>Unit {unit.order}</span>
                                        <span className="text-[#C0B9AA]">•</span>
                                        <span>
                                            {unitDone} of {unitLessons.length} lessons explored
                                        </span>
                                    </div>
                                    <h3 className="font-serif text-2xl font-semibold text-[#253328] mt-1 tracking-tight">
                                        {unit.title}
                                    </h3>
                                    <p className="text-sm text-[#616E63] mt-1 leading-relaxed">
                                        {unit.description}
                                    </p>
                                </div>

                                {isUnitCompleted && (
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E3EDE6] text-[#2F523C] text-xs font-semibold border border-[#C5DACB] self-start sm:self-center">
                                        <Sparkles className="w-3.5 h-3.5 text-[#4D705B]" />
                                        Unit Mastered
                                    </div>
                                )}
                            </div>
                        </div>


                        {/* Stepping Stone Nodes Path */}
                        <div className="relative py-4 flex flex-col items-center">
                            {/* Stepping stone path connector line */}
                            <div className="absolute top-6 bottom-6 w-0.5 bg-secondary -z-0" />

                            <div className="w-full space-y-8 relative z-10">
                                {unitLessons.map((lesson, index) => {
                                    const lessonProgress = progress.lessonProgress.get(direction!) ?? new Map<string, LessonProgressEntry>();
                                    const lessonCompleted = progress.lessonsCompleted.get(direction!) ?? [];
                                    const isCompleted = lessonProgress.has(lesson.id) && lessonProgress.get(lesson.id)?.completed;
                                    const inProgress = !isCompleted && lessonProgress.get(lesson.id)?.completed === false;
                                    const step = lessonProgress.get(lesson.id)?.currentStep ?? 0;

                                    // Active if previous lesson is completed OR it's the very first lesson of first unit
                                    const prevLesson = index > 0 ? unit.order === 1 ? null : unitLessons[index - 1] : null;
                                    const isUnlocked =
                                        index === 0 ||
                                        (prevLesson
                                            ? lessonCompleted.includes(prevLesson.id)
                                            : Boolean(isCompleted)) ||
                                        inProgress;

                                    const isActive = isUnlocked && !isCompleted;

                                    // Alternating left/center/right organic stepping stone placement
                                    const alignmentClasses = [
                                        'sm:translate-x-0',
                                        'sm:-translate-x-12',
                                        'sm:translate-x-12',
                                    ][index % 3];

                                    return (
                                        <div
                                            key={lesson.id}
                                            className={`flex flex-col items-center transition-all ${alignmentClasses}`}
                                        >
                                            <div className="flex flex-col items-center">
                                                {/* Stepping Stone Node Button */}
                                                <button
                                                    id={`lesson-node-${lesson.id}`}
                                                    type="button"
                                                    disabled={!isUnlocked}
                                                    onClick={() => {
                                                        if (isUnlocked) {
                                                            sound.playPebbleTap(progress.soundEnabled);
                                                            router.push(`/lessons/${lesson.slug}?direction=${direction}`);
                                                        }
                                                    }}
                                                    className={`group relative w-18 h-18! sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center transition-all duration-300 ${isCompleted
                                                        ? 'bg-[#E4ECE6] text-[#2E4E3A] border-2 border-[#BFD5C6] hover:bg-[#D7E3DA] hover:scale-105 shadow-xs cursor-pointer'
                                                        : isActive
                                                            ? 'bg-[#3F614C] text-white border-4 border-[#C7DACF] ring-4 ring-[#3F614C]/15 hover:scale-105 shadow-md cursor-pointer'
                                                            : 'bg-[#EAE5DA] text-[#9EA79F] border-2 border-[#DCD6C9] cursor-not-allowed'
                                                        }`}
                                                >
                                                    {isCompleted ? (
                                                        <Check className="w-8 h-8 text-[#365D46] stroke-[2.5]" />
                                                    ) : isActive ? (
                                                        <div className="flex flex-col items-center">
                                                            <Play className="w-7 h-7 fill-white translate-x-0.5" />
                                                        </div>
                                                    ) : (
                                                        <Lock className="w-6 h-6 text-[#9CA69E]" />
                                                    )}

                                                    {/* XP Pill Floating Above */}
                                                    <div
                                                        className={`absolute -top-3 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-colors ${isCompleted
                                                            ? 'bg-[#E3EFE7] text-[#345942] border border-[#C6DDD0]'
                                                            : isActive
                                                                ? 'bg-[#FAF3EB] text-[#A25327] border border-[#E9DACD]'
                                                                : 'bg-[#E3DFD4] text-[#868F87]'
                                                            }`}
                                                    >
                                                        +{lesson.xp} XP
                                                    </div>
                                                </button>

                                                {/* Lesson Title & Brief details */}
                                                <div className="mt-3 text-center max-w-xs px-2">
                                                    <h4
                                                        className={`text-sm font-semibold tracking-tight ${isActive
                                                            ? 'text-[#223326] font-bold'
                                                            : isCompleted
                                                                ? 'text-[#3E4F42]'
                                                                : 'text-[#879088]'
                                                            }`}
                                                    >
                                                        {lesson.title}
                                                    </h4>
                                                    <p className="text-xs text-[#6F7A71] line-clamp-1 mt-0.5">
                                                        {lesson.description}
                                                    </p>
                                                    <div className="flex items-center justify-center gap-2 mt-1 text-[11px] text-[#7C887E]">
                                                        <span>{lesson.estimatedMinutes} min</span>
                                                        <span>•</span>
                                                        <span className="flex items-center gap-0.5">
                                                            <BookOpen className="w-3 h-3" />
                                                            {lesson.level.length} words
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </section>
                );
            })}
        </div>
    );
}
