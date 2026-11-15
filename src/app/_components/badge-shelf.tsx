"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Lock, Sparkles } from "lucide-react";
import { BADGES, BADGES_ICON_MAP } from "@/data/badges";
import { sound } from "@/lib/sound";
import CairnMascot from "@/app/_components/cairn-mascot";

type Filter = "all" | "earned" | "locked";

export default function BadgeShelf({
    earnedIds,
    soundEnabled = true,
}: {
    earnedIds: string[];
    soundEnabled?: boolean;
}) {
    const [filter, setFilter] = useState<Filter>("all");
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const earned = useMemo(() => new Set(earnedIds), [earnedIds]);
    const earnedCount = earned.size;
    const total = BADGES.length;
    const ratio = total ? earnedCount / total : 0;

    const sorted = useMemo(() => {
        const list = [...BADGES];
        list.sort((a, b) => {
            const aOn = earned.has(a.id) ? 0 : 1;
            const bOn = earned.has(b.id) ? 0 : 1;
            if (aOn !== bOn) return aOn - bOn;
            return a.title.localeCompare(b.title);
        });
        return list;
    }, [earned]);

    const visible = sorted.filter((b) => {
        const on = earned.has(b.id);
        if (filter === "earned") return on;
        if (filter === "locked") return !on;
        return true;
    });

    const selected = BADGES.find((b) => b.id === selectedId) || null;
    const selectedEarned = selected ? earned.has(selected.id) : false;

    return (
        <section aria-labelledby="badge-shelf-heading">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                        Collected
                    </p>
                    <h2
                        id="badge-shelf-heading"
                        className="mt-0.5 font-serif text-xl font-semibold tracking-tight text-foreground"
                    >
                        Badge shelf
                    </h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Quiet seals of rhythm and path — earned, not rushed.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div
                        className="relative flex size-14 items-center justify-center rounded-full"
                        style={{
                            background: `conic-gradient(hsl(var(--primary)) ${ratio * 360}deg, hsl(var(--muted)) 0deg)`,
                        }}
                        aria-label={`${earnedCount} of ${total} badges earned`}
                    >
                        <div className="flex size-11 flex-col items-center justify-center rounded-full bg-card text-center shadow-xs">
                            <span className="font-serif text-sm font-semibold leading-none text-foreground">
                                {earnedCount}
                            </span>
                            <span className="text-[9px] text-muted-foreground">
                                /{total}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-4 flex flex-wrap gap-1.5">
                {(
                    [
                        { id: "all", label: "All" },
                        { id: "earned", label: `Earned (${earnedCount})` },
                        { id: "locked", label: `Still open (${total - earnedCount})` },
                    ] as const
                ).map((tab) => {
                    const active = filter === tab.id;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => {
                                sound.playPebbleTap(soundEnabled);
                                setFilter(tab.id);
                            }}
                            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                                active
                                    ? "bg-primary text-primary-foreground shadow-xs"
                                    : "border border-border bg-card text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {visible.map((badge) => {
                    const on = earned.has(badge.id);
                    const icon = BADGES_ICON_MAP[badge.id];
                    const isSelected = selectedId === badge.id;

                    return (
                        <li key={badge.id}>
                            <button
                                type="button"
                                onClick={() => {
                                    sound.playPebbleTap(soundEnabled);
                                    setSelectedId((prev) =>
                                        prev === badge.id ? null : badge.id,
                                    );
                                    if (on) sound.playGentleChime(soundEnabled);
                                }}
                                className={`group relative flex w-full flex-col items-center rounded-2xl border p-4 text-center shadow-soft transition-all duration-200 ${
                                    on
                                        ? "border-primary/30 bg-card hover:-translate-y-0.5 hover:border-primary/50"
                                        : "border-border/60 bg-muted/10 hover:bg-muted/20"
                                } ${
                                    isSelected ? "ring-2 ring-primary/40" : ""
                                }`}
                                aria-pressed={isSelected}
                                aria-label={`${badge.title}${on ? ", earned" : ", locked"}`}
                            >
                                {on && (
                                    <span
                                        className="pointer-events-none absolute inset-x-4 top-2 h-16 rounded-full opacity-70 blur-2xl"
                                        style={{
                                            background:
                                                "var(--lang-theme-glow, hsl(var(--primary) / 0.25))",
                                        }}
                                        aria-hidden
                                    />
                                )}

                                <span
                                    className={`relative mb-3 flex size-16 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-105 ${
                                        on
                                            ? "bg-accent shadow-xs ring-2 ring-primary/20"
                                            : "bg-muted/60 ring-1 ring-border"
                                    }`}
                                >
                                    {icon ? (
                                        <Image
                                            src={icon}
                                            width={36}
                                            height={36}
                                            alt=""
                                            className={`size-9 ${on ? "" : "opacity-40 grayscale"}`}
                                        />
                                    ) : (
                                        <span
                                            className={`text-2xl ${on ? "" : "opacity-40 grayscale"}`}
                                            aria-hidden
                                        >
                                            {badge.emoji}
                                        </span>
                                    )}

                                    {!on && (
                                        <span className="absolute -bottom-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-xs">
                                            <Lock className="h-2.5 w-2.5" />
                                        </span>
                                    )}
                                    {on && (
                                        <span className="absolute -bottom-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xs">
                                            <Sparkles className="h-2.5 w-2.5" />
                                        </span>
                                    )}
                                </span>

                                <span
                                    className={`relative line-clamp-2 font-serif text-sm font-semibold leading-snug tracking-tight ${
                                        on ? "text-foreground" : "text-muted-foreground"
                                    }`}
                                >
                                    {badge.title}
                                </span>
                                <span
                                    className={`relative mt-1 text-[10px] font-medium uppercase tracking-wider ${
                                        on ? "text-primary" : "text-muted-foreground/80"
                                    }`}
                                >
                                    {on ? "Earned" : "Sealed"}
                                </span>
                            </button>
                        </li>
                    );
                })}
            </ul>

            {visible.length === 0 && (
                <div className="flex flex-col items-center rounded-2xl border border-border bg-card px-4 py-10 text-center shadow-soft">
                    <CairnMascot
                        className="mb-4 h-24 w-auto"
                        mood={filter === "earned" ? "encourage" : "celebrate"}
                        label={
                            filter === "earned"
                                ? "Cairn waiting for your first seal"
                                : "Cairn celebrating a full shelf"
                        }
                    />
                    <p className="max-w-xs text-sm text-muted-foreground">
                        {filter === "earned"
                            ? "No seals yet — a single mindful action begins the shelf."
                            : "Nothing left locked on this path. Beautiful."}
                    </p>
                </div>
            )}

            {selected && (
                <div
                    className={`mt-4 overflow-hidden rounded-2xl border p-5 shadow-soft transition-colors ${
                        selectedEarned
                            ? "border-primary/30 bg-card"
                            : "border-border bg-muted/20"
                    }`}
                    role="status"
                >
                    <div className="flex items-start gap-4">
                        <span
                            className={`flex size-14 shrink-0 items-center justify-center rounded-2xl ${
                                selectedEarned ? "bg-accent" : "bg-muted"
                            }`}
                        >
                            {BADGES_ICON_MAP[selected.id] ? (
                                <Image
                                    src={BADGES_ICON_MAP[selected.id]}
                                    width={32}
                                    height={32}
                                    alt=""
                                    className={`size-8 ${selectedEarned ? "" : "opacity-50 grayscale"}`}
                                />
                            ) : (
                                <span className="text-2xl" aria-hidden>
                                    {selected.emoji}
                                </span>
                            )}
                        </span>
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-serif text-lg font-semibold tracking-tight text-foreground">
                                    {selected.title}
                                </h3>
                                <span
                                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                                        selectedEarned
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted text-muted-foreground"
                                    }`}
                                >
                                    {selectedEarned ? "On your shelf" : "Still sealed"}
                                </span>
                            </div>
                            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                                {selected.description}
                            </p>
                            {!selectedEarned && (
                                <p className="mt-2 text-[11px] italic text-muted-foreground">
                                    Keep a soft rhythm — this seal will open when the path is ready.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
