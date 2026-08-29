import Link from "next/link";
import {
  LucideArrowUpRight,
  LucideBookOpen,
  LucideEar,
  LucideLanguages,
  LucideMessageCircle,
} from "lucide-react";
import ProgressSummary from "@/app/_components/progress-summary";

const ACTIVITIES = [
  {
    title: "Translate",
    href: "/translation",
    copy: "Move between tongues with a quiet desk.",
    icon: LucideLanguages,
  },
  {
    title: "Reading",
    href: "/reading",
    copy: "A single line, spoken slowly.",
    icon: LucideBookOpen,
  },
  {
    title: "Listening",
    href: "/listening",
    copy: "Hear a sentence. Choose what you heard.",
    icon: LucideEar,
  },
  {
    title: "Practice",
    href: "/chat",
    copy: "Pick a topic and take a short quiz.",
    icon: LucideMessageCircle,
  },
];

const WORD = {
  word: "douceur",
  lang: "FR",
  meaning: "gentleness, sweetness",
  example: "Parle avec douceur.",
};

export default function Home() {
  return (
    <div className="flex min-h-full flex-col px-5 pb-28 pt-8">
      <header className="mb-8 flex items-center justify-between">
        <div className="inline-flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-xs font-semibold text-primary-foreground">
            K
          </span>
          <span className="font-display text-xl font-medium tracking-tight">
            Koze
          </span>
        </div>
        <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
          Language studio
        </span>
      </header>

      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        Today
      </p>
      <h1 className="mt-3 max-w-[14ch] font-display text-4xl font-medium">
        Learn in the quiet hours.
      </h1>
      <p className="mt-3 max-w-prose text-muted-foreground">
        Four small practices. Your progress stays on this device — no account
        required.
      </p>

      <ProgressSummary />

      <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-soft">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Word of the day
        </p>
        <p className="mt-3 font-display text-3xl font-medium">{WORD.word}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {WORD.lang} · {WORD.meaning}
        </p>
        <p className="mt-4 border-t border-border pt-4 text-sm italic">
          {WORD.example}
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3">
        {ACTIVITIES.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="group">
              <div className="flex h-full flex-col rounded-xl border border-border bg-card p-4 shadow-soft transition-transform duration-150 group-hover:-translate-y-0.5">
                <span className="flex size-9 items-center justify-center rounded-md bg-accent text-accent-foreground">
                  <Icon size={16} strokeWidth={1.75} />
                </span>
                <h2 className="mt-4 font-display text-lg font-medium">
                  {item.title}
                </h2>
                <p className="mt-1 flex-1 text-xs leading-5 text-muted-foreground">
                  {item.copy}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary">
                  Open
                  <LucideArrowUpRight size={14} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
