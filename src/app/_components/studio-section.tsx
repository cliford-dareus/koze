"use client";

import Link from "next/link";
import {
    ArrowUpRight,
    BookOpen,
    Ear,
    GraduationCap,
    Languages,
    MessageCircle,
    type LucideIcon,
} from "lucide-react";
import { sound } from "@/lib/sound";

type StudioActivity = {
    title: string;
    href: string;
    copy: string;
    icon: LucideIcon;
    accent?: boolean;
};

const STUDIO_ACTIVITIES: StudioActivity[] = [
    {
        title: "Lessons",
        href: "/lessons",
        copy: "Guided paths, one quiet step at a time.",
        icon: GraduationCap,
        accent: true,
    },
    {
        title: "Translate",
        href: "/translation",
        copy: "Move between tongues at a calm desk.",
        icon: Languages,
    },
    {
        title: "Reading",
        href: "/reading",
        copy: "A single line, held and spoken slowly.",
        icon: BookOpen,
    },
    {
        title: "Listening",
        href: "/listening",
        copy: "Hear a sentence. Choose what you heard.",
        icon: Ear,
    },
    {
        title: "Practice",
        href: "/chat",
        copy: "Short topic quizzes to keep the path warm.",
        icon: MessageCircle,
    },
];

export default function StudioSection({
    soundEnabled = true,
}: {
    soundEnabled?: boolean;
}) {
    const featured = STUDIO_ACTIVITIES.find((a) => a.accent);
    const rest = STUDIO_ACTIVITIES.filter((a) => !a.accent);

    return (
        <section id="studio" className="mt-8 space-y-4" aria-labelledby="studio-heading">
            <div className="flex items-end justify-between gap-3">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                        Open desk
                    </p>
                    <h2
                        id="studio-heading"
                        className="mt-1 font-serif text-2xl font-semibold tracking-tight text-foreground"
                    >
                        Studio
                    </h2>
                    <p className="mt-1 max-w-prose text-sm text-muted-foreground">
                        Five calm practices. Enter when you have a few quiet minutes.
                    </p>
                </div>
            </div>

            {featured && (
                <Link
                    href={featured.href}
                    className="group block"
                    onClick={() => sound.playPebbleTap(soundEnabled)}
                >
                    <article className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-soft transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-primary/30 group-active:translate-y-0 sm:p-6">
                        <div
                            className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full blur-2xl"
                            style={{ background: "var(--lang-theme-glow)" }}
                            aria-hidden
                        />
                        <div className="relative flex items-start gap-4">
                            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
                                <featured.icon size={18} strokeWidth={1.75} />
                            </span>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-serif text-xl font-semibold tracking-tight text-foreground">
                                        {featured.title}
                                    </h3>
                                    <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                                        Path
                                    </span>
                                </div>
                                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                                    {featured.copy}
                                </p>
                                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                                    Enter lessons
                                    <ArrowUpRight
                                        size={14}
                                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                    />
                                </span>
                            </div>
                        </div>
                    </article>
                </Link>
            )}

            <div className="grid grid-cols-2 gap-3">
                {rest.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="group block h-full"
                            onClick={() => sound.playPebbleTap(soundEnabled)}
                        >
                            <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-4 shadow-soft transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-primary/25 group-active:translate-y-0">
                                <span className="flex size-9 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                                    <Icon size={16} strokeWidth={1.75} />
                                </span>
                                <h3 className="mt-3 font-serif text-base font-semibold tracking-tight text-foreground sm:text-lg">
                                    {item.title}
                                </h3>
                                <p className="mt-1 flex-1 text-xs leading-5 text-muted-foreground">
                                    {item.copy}
                                </p>
                                <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary">
                                    Open
                                    <ArrowUpRight
                                        size={13}
                                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                    />
                                </span>
                            </article>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
