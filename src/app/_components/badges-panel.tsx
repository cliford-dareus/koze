"use client";

import { useEffect, useMemo, useState } from "react";
import { BADGES, getBadge } from "@/data/badges";
import {
  defaultProgress,
  loadProgress,
  type ProgressState,
} from "@/lib/progress";

export default function BadgesPanel() {
  const [progress, setProgress] = useState<ProgressState>(defaultProgress());
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const refresh = () => setProgress(loadProgress());
    refresh();

    const onBadges = (e: Event) => {
      const detail = (e as CustomEvent<{ unlocked: string[] }>).detail;
      const id = detail?.unlocked?.[0];
      const badge = id ? getBadge(id) : undefined;
      if (badge) {
        setToast(`${badge.emoji} ${badge.title}`);
        window.setTimeout(() => setToast(null), 3200);
      }
      refresh();
    };

    window.addEventListener("koze-progress", refresh);
    window.addEventListener("koze-badges", onBadges);
    return () => {
      window.removeEventListener("koze-progress", refresh);
      window.removeEventListener("koze-badges", onBadges);
    };
  }, []);

  const earned = useMemo(
    () => new Set(progress.badges || []),
    [progress.badges],
  );

  const unlockedCount = earned.size;

  return (
    <div className="mt-3 rounded-xl border border-border bg-card p-4 shadow-soft">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Badges
        </p>
        <span className="text-xs text-muted-foreground">
          {unlockedCount}/{BADGES.length}
        </span>
      </div>

      <ul className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
        {BADGES.map((badge) => {
          const on = earned.has(badge.id);
          return (
            <li
              key={badge.id}
              title={`${badge.title} — ${badge.description}`}
              className={
                "flex flex-col items-center rounded-lg border px-1 py-2 text-center transition-opacity " +
                (on
                  ? "border-primary/30 bg-accent/40"
                  : "border-border/60 bg-muted/30 opacity-45")
              }
            >
              <span className="text-lg" aria-hidden>
                {badge.emoji}
              </span>
              <span className="mt-1 line-clamp-2 text-[9px] font-medium leading-tight">
                {badge.title}
              </span>
            </li>
          );
        })}
      </ul>

      {toast ? (
        <p
          className="mt-3 rounded-lg bg-primary px-3 py-2 text-center text-xs font-medium text-primary-foreground"
          role="status"
        >
          Badge unlocked · {toast}
        </p>
      ) : (
        <p className="mt-3 text-xs text-muted-foreground">
          Earn badges by practicing steadily — no rush.
        </p>
      )}
    </div>
  );
}
