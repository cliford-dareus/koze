import Link from "next/link";
import {
    Badge,
    LucideArrowUpRight,
    LucideBookOpen,
    LucideEar,
    LucideLanguages,
    LucideMessageCircle,
} from "lucide-react";
import ProgressSummary from "@/app/_components/progress-summary";
import AuthMenu from "@/app/_components/auth-menu";
import { getRandomWord } from "./_actions/translate";
import WordOfTheDay from "./_components/word-of-the-day";
import KOZE_LOGO from "../../public/koze-logo.png";
import Image from "next/image";

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
            <header className="mb-8 flex items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2">
                    <span className="flex size-7 items-center justify-center">
                        <Image src={KOZE_LOGO} width={20} height={20} alt="Koze" className="size-7" />
                    </span>
                    <span className="font-display text-xl font-medium tracking-tight">
                        Koze
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span>
                        <Badge />
                    </span>
                    <AuthMenu />
                </div>
            </header>

            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Today
            </p>
            <h1 className="mt-3 max-w-[14ch] font-display text-4xl font-medium">
                Learn in the quiet hours.
            </h1>
            <p className="mt-3 max-w-prose text-muted-foreground">
                Four small practices. Sign in to sync progress across devices — or keep
                practicing as a guest on this device.
            </p>

            <ProgressSummary />

            <WordOfTheDay word={Word} />

            <div className="mt-8 grid grid-cols-2 gap-3">
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
