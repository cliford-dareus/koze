import Link from "next/link";
import {
    Badge,
    LucideArrowUpRight,
    LucideBookOpen,
    LucideEar,
    LucideLanguages,
    LucideMessageCircle,
} from "lucide-react";
import { getRandomWord } from "./_actions/translate";
import WordOfTheDay from "./_components/word-of-the-day";
import MainHeader from "./_components/main-header";
import ProgressSummary from "./_components/progress-summary";
import Hero from "./_components/hero";
import { LandingPage } from "./_components/landing-page";

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
    {
        title: "Lessons",
        href: "/lessons",
        copy: "Learn from structured lessons.",
        icon: LucideBookOpen,
    },
];

export default async function Home() {
    const Word = await getRandomWord();
    return (
        <div className="app-shell">
            <LandingPage word={Word} />
            <div className="mt-6 grid grid-cols-2 gap-3">
                {ACTIVITIES.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link key={item.href} href={item.href} className="group">
                            <div className="flex h-full flex-col rounded-xl border border-border bg-card p-4 shadow-soft transition-transform duration-150 group-hover:-translate-y-0.5 active:translate-y-0">
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
