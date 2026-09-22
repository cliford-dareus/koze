"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import {
    Lesson,
    UNITS,
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
} from "@/lib/learning-prefs";
import { LANGUAGES } from "../../../lib/languages";
import { BookOpen, Check, Compass, Leaf, Lock, Play, Sparkles } from "lucide-react";
import { sound } from "@/lib/sound";
import { useRouter } from "next/navigation";

export default function LessonsPage() {
    const { data: session } = useSession();
    const [progress, setProgress] = useState<ProgressState>(defaultProgress());
    const [learningLanguage, setLearningLanguage] = useState(progress.learningLanguage || "en");
    const [lessons, setLessons] = useState<Lesson[]>([]);

    const currentLang =
        LANGUAGES.find((l) => l.value === progress.learningLanguage) ||
        LANGUAGES[0];

    const primaryDirection: LessonDirection = useMemo(
        () => directionForLearningLanguage(learningLanguage, progress.nativeLanguage!),
        [learningLanguage, progress.nativeLanguage],
    );

    useEffect(() => {
        const refreshProgress = () => setProgress(loadProgress());
        refreshProgress();
        window.addEventListener("koze-progress", refreshProgress);
        window.addEventListener("storage", refreshProgress);

        return () => {
            window.removeEventListener("koze-progress", refreshProgress);
            window.removeEventListener("storage", refreshProgress);
        };
    }, [session?.user?.learningLanguage, session?.user?.nativeLanguage]);

    useEffect(() => {
        const refreshLesson = async () => {
            const lessons = await getLessonsByDirection(primaryDirection);
            setLessons(lessons);
        };
        refreshLesson();
    }, [primaryDirection]);

    useEffect(() => {
        setLearningLanguage(progress.learningLanguage!);
    }, [progress]);

    const completedSet = new Set(progress.lessonsCompleted.get(primaryDirection!) || []);

    const countFor = (direction: LessonDirection) => {
        const completedIds = progress.lessonsCompleted.get(direction!) || [];
        const done = lessons.filter((l) => completedIds.includes(l.id)).length;
        return { done, total: lessons.length };
    };

    const primaryStats = countFor(primaryDirection);
    const pct = primaryStats.total
        ? Math.round((primaryStats.done / primaryStats.total) * 100)
        : 0;

    return (
        <div className="flex flex-col">
            <p className="flex items-center gap-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                <Leaf className="w-3 h-3 text-[#A5C9B1]" />
                Lessons
            </p>
            <div className="my-6">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Your Learning Path
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-primary tracking-tight mt-0.5">
                    Stepping Stones of {currentLang.name}
                </h1>
                <p className="text-xs sm:text-sm text-foreground mt-1">
                    Step from stone to stone with quiet curiosity. Lessons unlock as you walk.
                </p>
            </div>

            <div className="rounded-xl border border-border bg-background p-6 shadow-soft">
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
                lessons={lessons}
            />
        </div>
    );
}

function UnitList({
    units,
    direction,
    completedSet,
    progress,
    lessons,
}: {
    units: typeof UNITS;
    direction: LessonDirection;
    completedSet: Set<string>;
    progress: ProgressState;
    lessons: Lesson[];
}) {
    const router = useRouter();
    return (
        <div className="mt-8 space-y-8">
            {units.map((unit) => {
                const unitLessons = lessons.filter((l) => l.unitId === unit.id);
                const unitDone = unitLessons.filter((l) =>
                    completedSet.has(l.id),
                ).length;
                const isUnitCompleted = unitDone === unitLessons.length;

                return (
                    <section key={unit.id}>
                        <div className="bg-background border border-border rounded-2xl p-6 sm:p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-foreground">
                                        <Compass className="w-4 h-4 text-primary" />
                                        <span>Unit {unit.order}</span>
                                        <span className="text-muted-foreground">•</span>
                                        <span>
                                            {unitDone} of {unitLessons.length} lessons explored
                                        </span>
                                    </div>
                                    <h3 className="font-serif text-2xl font-semibold text-primary mt-1 tracking-tight">
                                        {unit.title}
                                    </h3>
                                    <p className="text-sm text-foreground mt-1 leading-relaxed">
                                        {unit.description}
                                    </p>
                                </div>

                                {isUnitCompleted && (
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-primary text-xs font-semibold border border-primary/30 self-start sm:self-center">
                                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                                        Unit Mastered
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="relative py-4 flex flex-col items-center">
                            <div className="absolute top-6 bottom-6 w-0.5 bg-secondary -z-0" />

                            <div className="w-full space-y-8 relative z-10">
                                {unitLessons.map((lesson, index) => {
                                    const lessonProgress = progress.lessonProgress.get(direction!) ?? new Map<string, LessonProgressEntry>();
                                    const lessonCompleted = progress.lessonsCompleted.get(direction!) ?? [];
                                    const isCompleted = lessonProgress.has(lesson.id) && lessonProgress.get(lesson.id)?.completed;
                                    const inProgress = !isCompleted && lessonProgress.get(lesson.id)?.completed === false;

                                    const prevLesson = index > 0 ? unitLessons[index - 1] : null;
                                    const isUnlocked =
                                        index === 0 ||
                                        (prevLesson
                                            ? lessonCompleted.includes(prevLesson.id)
                                            : Boolean(isCompleted)) ||
                                        inProgress;

                                    const isActive = isUnlocked && !isCompleted;

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
                                                        ? 'bg-accent text-primary border-2 border-primary/30 hover:bg-accent hover:scale-105 shadow-xs cursor-pointer'
                                                        : isActive
                                                            ? 'bg-primary text-primary-foreground border-4 border-primary/30 ring-4 ring-primary/15 hover:scale-105 shadow-md cursor-pointer'
                                                            : 'bg-secondary text-muted-foreground border-2 border-border cursor-not-allowed'
                                                        }`}
                                                >
                                                    {isCompleted ? (
                                                        <Check className="w-8 h-8 text-primary stroke-[2.5]" />
                                                    ) : isActive ? (
                                                        <div className="flex flex-col items-center">
                                                            <Play className="w-7 h-7 fill-primary-foreground translate-x-0.5" />
                                                        </div>
                                                    ) : (
                                                        <Lock className="w-6 h-6 text-muted-foreground" />
                                                    )}

                                                    <div
                                                        className={`absolute -top-3 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-colors ${isCompleted
                                                            ? 'bg-accent text-primary border border-primary/30'
                                                            : isActive
                                                                ? 'bg-card text-destructive border border-border'
                                                                : 'bg-secondary text-muted-foreground'
                                                            }`}
                                                    >
                                                        +{lesson.xp} XP
                                                    </div>
                                                </button>

                                                <div className="mt-3 text-center max-w-xs px-2">
                                                    <h4
                                                        className={`text-sm font-semibold tracking-tight ${isActive
                                                            ? 'text-primary font-bold'
                                                            : isCompleted
                                                                ? 'text-primary'
                                                                : 'text-muted-foreground'
                                                            }`}
                                                    >
                                                        {lesson.title}
                                                    </h4>
                                                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                                                        {lesson.description}
                                                    </p>
                                                    <div className="flex items-center justify-center gap-2 mt-1 text-[11px] text-muted-foreground">
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
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                );
            })}
        </div>
    );
}
