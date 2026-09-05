"use client";

import { LucideMonitor, LucideMoon, LucideSun } from "lucide-react";
import { useTheme } from "@/app/_components/providers/theme-provider";
import type { ThemeMode } from "@/lib/theme";

const OPTIONS: {
  id: ThemeMode;
  label: string;
  icon: typeof LucideSun;
}[] = [
  { id: "system", label: "System", icon: LucideMonitor },
  { id: "light", label: "Light", icon: LucideSun },
  { id: "dark", label: "Dark", icon: LucideMoon },
];

export default function ThemeToggle({
  compact = false,
}: {
  compact?: boolean;
}) {
  const { mode, setMode, cycleMode, resolved } = useTheme();

  if (compact) {
    const Icon =
      mode === "system"
        ? LucideMonitor
        : resolved === "dark"
          ? LucideMoon
          : LucideSun;
    return (
      <button
        type="button"
        onClick={cycleMode}
        className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-soft transition-colors hover:bg-muted"
        aria-label={`Theme: ${mode}. Click to cycle.`}
        title={`Theme: ${mode}`}
      >
        <Icon size={16} strokeWidth={1.75} />
      </button>
    );
  }

  return (
    <div
      className="flex rounded-xl border border-border bg-card p-1 shadow-soft"
      role="group"
      aria-label="Color theme"
    >
      {OPTIONS.map((opt) => {
        const Icon = opt.icon;
        const active = mode === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => setMode(opt.id)}
            className={
              "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors " +
              (active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground")
            }
            aria-pressed={active}
          >
            <Icon size={14} strokeWidth={1.75} aria-hidden />
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
