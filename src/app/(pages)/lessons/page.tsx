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
import { languageLabel } from "@/lib/languages";

export default function LessonsPage() {
    const { data: session } = useSession();
    const [progress, setProgress] = useState<ProgressState>(defaultProgress());
    const [learningLanguage, setLearningLanguage] = useState("en");

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

    const completedSet = new Set(progress.lessonsCompleted.get(primaryDirection) || []);

    const countFor = (direction: LessonDirection) => {
        const lessons = getLessonsByDirection(direction);
        const completedIds = progress.lessonsCompleted.get(direction) || [];
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
            <h1 className="mt-2 font-display text-3xl font-medium">
                Structured practice.
            </h1>
            <p className="mt-2 max-w-prose text-sm text-muted-foreground">
                Your path follows what you chose to learn. Learning English shows French
                → English lessons; learning French shows English → French.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={() => onPickLearning("en")}
                    className={
                        "rounded-full border px-3 py-1.5 text-xs font-medium " +
                        (learningLanguage === "en"
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-card text-foreground")
                    }
                >
                    Learning English
                </button>
                <button
                    type="button"
                    onClick={() => onPickLearning("fr")}
                    className={
                        "rounded-full border px-3 py-1.5 text-xs font-medium " +
                        (learningLanguage === "fr" ||
                            (learningLanguage !== "en" && primaryDirection === "en-fr")
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-card text-foreground")
                    }
                >
                    Learning French
                </button>
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
                Track: {learningTrackLabel(primaryDirection)}
                {session?.user?.learningLanguage
                    ? ` · from profile (${languageLabel(session.user.learningLanguage)})`
                    : null}
            </p>

            <div className="mt-6 rounded-xl border border-border bg-card p-4 shadow-soft">
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
    return (
        <div className="mt-8 space-y-8">
            {units.map((unit) => {
                const unitLessons = getLessonsByDirection(direction).filter((l) => l.unitId === unit.id);
                const unitDone = unitLessons.filter((l) =>
                    completedSet.has(l.id),
                ).length;

                return (
                    <section key={unit.id}>
                        <div className="mb-3 flex items-end justify-between gap-2">
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h2 className="font-display text-xl font-medium">
                                        {unit.title}
                                    </h2>
                                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                                        {directionLabel(unit.direction)}
                                    </span>
                                </div>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                    {unit.description}
                                </p>
                            </div>
                            <span className="shrink-0 text-xs text-muted-foreground">
                                {unitDone}/{unitLessons.length}
                            </span>
                        </div>

                        <ul className="space-y-2">
                            {unitLessons.map((lesson, index) => {
                                const lessonProgress = progress.lessonProgress.get(direction) ?? new Map<string, LessonProgressEntry>();
                                const done = lessonProgress.has(lesson.id) && lessonProgress.get(lesson.id)?.completed;
                                const inProgress = !done && lessonProgress.get(lesson.id);
                                const step = lessonProgress.get(lesson.id)?.currentStep ?? 0;

                                return (
                                    <li key={lesson.id}>
                                        <Link
                                            href={`/lessons/${lesson.slug}?direction=${direction}`}
                                            className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-soft transition-transform duration-150 hover:-translate-y-0.5"
                                        >
                                            <span
                                                className={
                                                    "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold " +
                                                    (done
                                                        ? "bg-primary text-primary-foreground"
                                                        : "bg-accent text-accent-foreground")
                                                }
                                            >
                                                {done ? "✓" : index + 1}
                                            </span>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="font-display text-base font-medium">
                                                        {lesson.title}
                                                    </h3>
                                                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                                                        {lesson.level}
                                                    </span>
                                                </div>
                                                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                                    {lesson.description}
                                                </p>
                                                <p className="mt-2 text-xs font-medium text-primary">
                                                    {done
                                                        ? "Review lesson →"
                                                        : inProgress
                                                            ? `Continue · step ${step + 1} →`
                                                            : `Start · ~${lesson.estimatedMinutes} min · ${lesson.steps.length} steps →`}
                                                </p>
                                            </div>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </section>
                );
            })}
        </div>
    );
}
