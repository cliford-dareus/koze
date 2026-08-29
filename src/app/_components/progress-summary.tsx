"use client";

import { useEffect, useState } from "react";
import {
  defaultProgress,
  loadProgress,
  totalActivities,
  type ProgressState,
} from "@/lib/progress";

export default function ProgressSummary() {
  const [progress, setProgress] = useState<ProgressState>(defaultProgress());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const refresh = () => setProgress(loadProgress());
    refresh();
    setReady(true);
    window.addEventListener("storage", refresh);
    window.addEventListener("koze-progress", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("koze-progress", refresh);
    };
  }, []);

  if (!ready) return null;

  const total = totalActivities(progress);

  return (
    <div className="mt-6 grid grid-cols-3 gap-2">
      <Stat label="Streak" value={`${progress.streak}d`} />
      <Stat label="Actions" value={String(total)} />
      <Stat label="Listening" value={String(progress.listeningCorrect)} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-3 text-center shadow-soft">
      <p className="font-display text-xl font-medium">{value}</p>
      <p className="mt-0.5 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
