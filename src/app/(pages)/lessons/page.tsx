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
import { directionForLearningLanguage } from "@/lib/learning-prefs";
import { LANGUAGES } from "../../../lib/languages";
import { BookOpen, Check, Compass, Leaf, Lock, Play, Sparkles } from "lucide-react";
import { sound } from "@/lib/sound";
import { useRouter } from "next/navigation";

export default function LessonsPage() {
    const { data: session } = useSession();
    const [progress, setProgress] = useState<ProgressState>(defaultProgress());
    const [learningLanguage, setLearningLanguage] = useState(
        progress.learningLanguage || "en",
    );
    const [lessons, setLessons] = useState<Lesson[]>([]);

    const currentLang =
        LANGUAGES.find((l) => l.value === progress.learningLanguage) || LANGUAGES[0];

    const primaryDirection: LessonDirection = useMemo(
        () =>
            directionForLearningLanguage(
                learningLanguage,
                progress.nativeLanguage!,
            ),
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
            const next = await getLessonsByDirection(primaryDirection);
            setLessons(next);
        };
        void refreshLesson();
    }, [primaryDirection]);

    useEffect(() => {
        setLearningLanguage(progress.learningLanguage!);
    }, [progress]);

    const completedSet = new Set(
        progress.lessonsCompleted.get(primaryDirection!) || [],
    );

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
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                <Leaf className="h-3 w-3" />
                Lessons
            </p>
            <div className="my-6">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Your learning path
                </div>
                <h1 className="mt-0.5 font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                    Stepping stones of {currentLang.name}
                </h1>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                    Step from stone to stone with quiet curiosity. Lessons unlock as you
                    walk.
                </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                            Your path
                        </p>
                        <p className="mt-1 font-serif text-2xl font-semibold tracking-tight text-foreground">
                            {primaryStats.done}
                            <span className="text-base font-normal text-muted-foreground">
                                {" "}/ {primaryStats.total}
                            </span>
                        </p>
                    </div>
                    <p className="text-sm font-semibold text-primary">{pct}%</p>
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
                const isUnitCompleted =
                    unitLessons.length > 0 && unitDone === unitLessons.length;

                return (
                    <section key={unit.id}>
                        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6">
                            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                                <div>
                                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                        <Compass className="h-4 w-4 text-primary" />
                                        <span>Unit {unit.order}</span>
                                        <span>·</span>
                                        <span>
                                            {unitDone} of {unitLessons.length} lessons
                                            explored
                                        </span>
                                    </div>
                                    <h3 className="mt-1 font-serif text-2xl font-semibold tracking-tight text-foreground">
                                        {unit.title}
                                    </h3>
                                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                                        {unit.description}
                                    </p>
                                </div>

                                {isUnitCompleted && (
                                    <div className="inline-flex items-center gap-1.5 self-start rounded-full border border-primary/30 bg-accent px-3 py-1 text-xs font-semibold text-primary sm:self-center">
                                        <Sparkles className="h-3.5 w-3.5 text-primary" />
                                        Unit mastered
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="relative flex flex-col items-center py-4">
                            <div className="absolute bottom-6 top-6 -z-0 w-0.5 bg-border" />

                            <div className="relative z-10 w-full space-y-8">
                                {unitLessons.map((lesson, index) => {
                                    const lessonProgress =
                                        progress.lessonProgress.get(direction!) ??
                                        new Map<string, LessonProgressEntry>();
                                    const lessonCompleted =
                                        progress.lessonsCompleted.get(direction!) ?? [];
                                    const isCompleted =
                                        lessonProgress.has(lesson.id) &&
                                        lessonProgress.get(lesson.id)?.completed;
                                    const inProgress =
                                        !isCompleted &&
                                        lessonProgress.get(lesson.id)?.completed ===
                                            false;

                                    const prevLesson =
                                        index > 0 ? unitLessons[index - 1] : null;
                                    const isUnlocked =
                                        index === 0 ||
                                        (prevLesson
                                            ? lessonCompleted.includes(prevLesson.id)
                                            : Boolean(isCompleted)) ||
                                        inProgress;

                                    const isActive = isUnlocked && !isCompleted;

                                    const alignmentClasses = [
                                        "sm:translate-x-0",
                                        "sm:-translate-x-12",
                                        "sm:translate-x-12",
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
                                                            sound.playPebbleTap(
                                                                progress.soundEnabled,
                                                            );
                                                            router.push(
                                                                `/lessons/${lesson.slug}?direction=${direction}`,
                                                            );
                                                        }
                                                    }}
                                                    className={`group relative flex h-20 w-20 items-center justify-center rounded-3xl transition-all duration-300 ${
                                                        isCompleted
                                                            ? "cursor-pointer border-2 border-primary/30 bg-accent text-primary shadow-xs hover:scale-105 hover:bg-accent"
                                                            : isActive
                                                              ? "cursor-pointer border-4 border-primary/30 bg-primary text-primary-foreground shadow-md ring-4 ring-primary/15 hover:scale-105"
                                                              : "cursor-not-allowed border-2 border-border bg-secondary text-muted-foreground"
                                                    }`}
                                                >
                                                    {isCompleted ? (
                                                        <Check className="h-8 w-8 stroke-[2.5] text-primary" />
                                                    ) : isActive ? (
                                                        <Play className="h-7 w-7 translate-x-0.5 fill-primary-foreground" />
                                                    ) : (
                                                        <Lock className="h-6 w-6 text-muted-foreground" />
                                                    )}

                                                    <div
                                                        className={`absolute -top-3 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                                                            isCompleted
                                                                ? "border border-primary/30 bg-accent text-primary"
                                                                : isActive
                                                                  ? "border border-border bg-card text-destructive"
                                                                  : "bg-secondary text-muted-foreground"
                                                        }`}
                                                    >
                                                        +{lesson.xp} XP
                                                    </div>
                                                </button>

                                                <div className="mt-3 max-w-xs px-2 text-center">
                                                    <h4
                                                        className={`text-sm font-semibold tracking-tight ${
                                                            isActive
                                                                ? "font-bold text-primary"
                                                                : isCompleted
                                                                  ? "text-primary"
                                                                  : "text-muted-foreground"
                                                        }`}
                                                    >
                                                        {lesson.title}
                                                    </h4>
                                                    <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                                                        {lesson.description}
                                                    </p>
                                                    <div className="mt-1 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
                                                        <span>
                                                            {lesson.estimatedMinutes} min
                                                        </span>
                                                        <span>·</span>
                                                        <span className="flex items-center gap-0.5">
                                                            <BookOpen className="h-3 w-3" />
                                                            {lesson.level}
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
