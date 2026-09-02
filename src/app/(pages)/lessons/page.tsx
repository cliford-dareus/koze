"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LESSONS, UNITS } from "@/data/lessons";
import {
  defaultProgress,
  loadProgress,
  type ProgressState,
} from "@/lib/progress";

export default function LessonsPage() {
  const [progress, setProgress] = useState<ProgressState>(defaultProgress());

  useEffect(() => {
    const refresh = () => setProgress(loadProgress());
    refresh();
    window.addEventListener("koze-progress", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("koze-progress", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const completedSet = new Set(progress.lessonsCompleted || []);
  const completedCount = completedSet.size;
  const total = LESSONS.length;
  const pct = total ? Math.round((completedCount / total) * 100) : 0;

  const units = [...UNITS].sort((a, b) => a.order - b.order);

  return (
    <div className="flex flex-col">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        Lessons
      </p>
      <h1 className="mt-2 font-display text-3xl font-medium">
        Structured practice.
      </h1>
      <p className="mt-2 max-w-prose text-sm text-muted-foreground">
        Short units with vocabulary, phrases, and a quick check. Progress stays
        on this device — and syncs when you are signed in.
      </p>

      <div className="mt-6 rounded-xl border border-border bg-card p-4 shadow-soft">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Overall
            </p>
            <p className="mt-1 font-display text-2xl font-medium">
              {completedCount}
              <span className="text-base text-muted-foreground"> / {total}</span>
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

      <div className="mt-8 space-y-8">
        {units.map((unit) => {
          const unitLessons = LESSONS.filter((l) => l.unitId === unit.id);
          const unitDone = unitLessons.filter((l) =>
            completedSet.has(l.id),
          ).length;

          return (
            <section key={unit.id}>
              <div className="mb-3 flex items-end justify-between gap-2">
                <div>
                  <h2 className="font-display text-xl font-medium">
                    {unit.title}
                  </h2>
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
                  const done = completedSet.has(lesson.id);
                  const inProgress =
                    !done && progress.lessonProgress?.get(lesson.id);
                  const step =
                    progress.lessonProgress?.get(lesson.id)?.currentStep ?? 0;

                  return (
                    <li key={lesson.id}>
                      <Link
                        href={`/lessons/${lesson.slug}`}
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
                                : `Start · ${lesson.estimatedMinutes} min →`}
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
    </div>
  );
}
