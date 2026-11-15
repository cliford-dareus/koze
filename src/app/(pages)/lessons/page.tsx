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
import {
    BookOpen,
    Check,
    Compass,
    GraduationCap,
    Lock,
    Play,
    Sparkles,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { useRouter } from "next/navigation";
import CairnMascot from "@/app/_components/cairn-mascot";

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
        <div className="mx-auto flex w-full max-w-lg flex-col pb-8">
            <header className="mb-5">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                    <GraduationCap className="h-3.5 w-3.5" />
                    Studio · Lessons
                </p>
                <h1 className="mt-1.5 font-serif text-3xl font-semibold tracking-tight text-foreground">
                    Stepping stones of {currentLang.name}
                </h1>
                <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted-foreground">
                    Move from stone to stone with quiet curiosity. Each lesson unlocks when
                    the path is ready.
                </p>
            </header>

            {/* Path progress */}
            <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6">
                <div className="lang-wash pointer-events-none absolute inset-0 opacity-50" aria-hidden />
                <div className="relative flex items-start justify-between gap-3">
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                            Your path
                        </p>
                        <p className="mt-1 font-serif text-2xl font-semibold tracking-tight text-foreground">
                            {primaryStats.done}
                            <span className="text-base font-normal text-muted-foreground">
                                {" "}/ {primaryStats.total}
                            </span>
                        </p>
                        <p className="mt-1 text-[11px] text-muted-foreground">
                            Path · {currentLang.flag} {currentLang.name}
                        </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <p className="text-sm font-semibold text-primary">{pct}%</p>
                        <CairnMascot
                            className="h-14 w-auto"
                            mood={pct >= 100 ? "celebrate" : pct > 0 ? "idle" : "encourage"}
                            label="Cairn on your lesson path"
                        />
                    </div>
                </div>
                <div className="relative mt-4 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${pct}%` }}
                    />
                </div>
            </section>

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

    if (lessons.length === 0) {
        return (
            <div className="mt-6 flex flex-col items-center rounded-2xl border border-border bg-card px-4 py-12 text-center shadow-soft">
                <CairnMascot
                    className="mb-3 h-20 w-auto"
                    mood="thinking"
                    label="Cairn gathering lessons"
                />
                <p className="max-w-xs text-sm text-muted-foreground">
                    No lessons for this path yet. Lessons currently focus on English ↔
                    French — other tongues still work in Translate.
                </p>
            </div>
        );
    }

    return (
        <div className="mt-6 space-y-6">
            {units.map((unit) => {
                const unitLessons = lessons.filter((l) => l.unitId === unit.id);
                if (unitLessons.length === 0) return null;

                const unitDone = unitLessons.filter((l) =>
                    completedSet.has(l.id),
                ).length;
                const isUnitCompleted =
                    unitLessons.length > 0 && unitDone === unitLessons.length;

                return (
                    <section key={unit.id} className="space-y-3">
                        {/* Unit header card */}
                        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6">
                            <div
                                className="lang-wash pointer-events-none absolute inset-0 opacity-40"
                                aria-hidden
                            />
                            <div className="relative flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                                <div>
                                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                        <Compass className="h-3.5 w-3.5 text-primary" />
                                        <span>Unit {unit.order}</span>
                                        <span className="text-border">·</span>
                                        <span>
                                            {unitDone} of {unitLessons.length} explored
                                        </span>
                                    </div>
                                    <h3 className="mt-1.5 font-serif text-2xl font-semibold tracking-tight text-foreground">
                                        {unit.title}
                                    </h3>
                                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                                        {unit.description}
                                    </p>
                                </div>

                                {isUnitCompleted && (
                                    <div className="inline-flex items-center gap-1.5 self-start rounded-full border border-primary/30 bg-accent px-3 py-1 text-xs font-semibold text-primary sm:self-center">
                                        <Sparkles className="h-3.5 w-3.5" />
                                        Unit mastered
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Stepping stones */}
                        <div className="relative flex flex-col items-center py-2">
                            <div className="absolute bottom-8 top-8 -z-0 w-px bg-border" />

                            <div className="relative z-10 w-full space-y-7">
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
                                        "sm:-translate-x-10",
                                        "sm:translate-x-10",
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
                                                    className={`group relative flex size-[4.5rem] items-center justify-center rounded-2xl transition-all duration-300 ${
                                                        isCompleted
                                                            ? "cursor-pointer border-2 border-primary/30 bg-accent text-primary shadow-xs hover:scale-105"
                                                            : isActive
                                                              ? "cursor-pointer border-2 border-primary bg-primary text-primary-foreground shadow-md ring-4 ring-primary/15 hover:scale-105"
                                                              : "cursor-not-allowed border-2 border-border bg-muted/40 text-muted-foreground"
                                                    }`}
                                                >
                                                    {isCompleted ? (
                                                        <Check className="h-7 w-7 stroke-[2.5]" />
                                                    ) : isActive ? (
                                                        <Play className="h-6 w-6 translate-x-0.5 fill-current" />
                                                    ) : (
                                                        <Lock className="h-5 w-5" />
                                                    )}

                                                    <div
                                                        className={`absolute -top-2.5 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider shadow-xs ${
                                                            isCompleted
                                                                ? "border border-primary/30 bg-accent text-primary"
                                                                : isActive
                                                                  ? "border border-border bg-card text-primary"
                                                                  : "border border-border bg-card text-muted-foreground"
                                                        }`}
                                                    >
                                                        +{lesson.xp} XP
                                                    </div>
                                                </button>

                                                <div className="mt-3 max-w-[14rem] px-2 text-center">
                                                    <h4
                                                        className={`font-serif text-sm font-semibold tracking-tight ${
                                                            isActive
                                                                ? "text-primary"
                                                                : isCompleted
                                                                  ? "text-foreground"
                                                                  : "text-muted-foreground"
                                                        }`}
                                                    >
                                                        {lesson.title}
                                                    </h4>
                                                    <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                                                        {lesson.description}
                                                    </p>
                                                    <div className="mt-1.5 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
                                                        <span>
                                                            {lesson.estimatedMinutes} min
                                                        </span>
                                                        <span>·</span>
                                                        <span className="inline-flex items-center gap-0.5">
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
