"use client";

import { ProgressState } from "@/lib/progress";
import { BookOpen, Clock, Flame, Layers, Sparkles } from "lucide-react";
import CairnMascot from "@/app/_components/cairn-mascot";

/**
 * Single pebble drawn like the stones in CairnMascot:
 * soft shadow ellipse + muted body + tiny primary speckles.
 */
function CairnStone({
    width,
    height,
    index,
}: {
    width: number;
    height: number;
    index: number;
}) {
    // index used for natural sway
    // Slight horizontal sway so the stack feels balanced, not rigid
    const sway = ((index % 3) - 1) * 4;
    const rx = width / 2;
    const ry = height / 2;
    const vbW = width + 8;
    const vbH = height + 6;
    const cx = vbW / 2 + sway * 0.15;
    const cy = vbH / 2;

    // Speckle positions relative to center (mascot-style)
    const speckles = [
        { dx: -rx * 0.35, dy: -ry * 0.15, r: Math.max(1.1, width * 0.018) },
        { dx: rx * 0.28, dy: ry * 0.12, r: Math.max(0.9, width * 0.014) },
    ];

    return (
        <svg
            width={width}
            height={height + 4}
            viewBox={`0 0 ${vbW} ${vbH}`}
            className="shrink-0 transition-transform duration-300 hover:scale-105"
            style={{ marginLeft: sway }}
            aria-hidden
        >
            {/* Soft under-shadow (matches mascot muted-foreground/20) */}
            <ellipse
                cx={cx}
                cy={cy + 1.5}
                rx={rx}
                ry={ry}
                className="fill-muted-foreground/20 dark:fill-muted-foreground/30"
            />
            {/* Stone body (matches mascot fill-muted) */}
            <ellipse
                cx={cx}
                cy={cy}
                rx={rx - 2}
                ry={ry - 1.2}
                className="fill-muted stroke-border"
                strokeWidth="0.75"
            />
            {/* Primary speckles */}
            {speckles.map((s, i) => (
                <circle
                    key={i}
                    cx={cx + s.dx}
                    cy={cy + s.dy}
                    r={s.r}
                    className={i === 0 ? "fill-primary/25" : "fill-primary/20"}
                />
            ))}
        </svg>
    );
}

export default function ZenGarden({ progress }: { progress: ProgressState }) {
    const stonesToShow = Math.min(8, Math.max(0, progress.cairnStonesCount || 0));

    // Bottom → top: widest base, tapering like a real cairn (and the mascot)
    const stoneSizes = [
        { w: 148, h: 22 },
        { w: 128, h: 20 },
        { w: 112, h: 18 },
        { w: 96, h: 17 },
        { w: 82, h: 15 },
        { w: 68, h: 14 },
        { w: 56, h: 13 },
        { w: 44, h: 12 },
    ];

    const todayMinutes = progress.todayMinutesPracticed || 0;
    const wordsSown =
        (progress.savedPhrases?.length || 0) + (progress.translations || 0);

    return (
        <div
            id="zen-garden-modal"
            className="relative mx-auto w-full max-w-md px-4 pb-10 pt-2"
        >
            <div
                className="lang-wash pointer-events-none absolute inset-0 opacity-40"
                aria-hidden
            />

            <div className="relative space-y-1 text-center">
                <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Sanctuary of Consistency</span>
                </div>
                <h2 className="mt-1.5 font-serif text-3xl font-semibold tracking-tight text-foreground">
                    Your Pebble Cairn
                </h2>
                <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted-foreground">
                    Every completed lesson polishes and balances another stone in your
                    garden.
                </p>
            </div>

            <div className="relative mt-5 flex h-56 w-full flex-col items-center justify-end overflow-hidden rounded-2xl border border-border bg-card pb-8 shadow-soft sm:h-64">
                <div
                    className="lang-wash pointer-events-none absolute inset-0 opacity-30"
                    aria-hidden
                />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-15">
                    <div className="h-96 w-96 rounded-full border-2 border-border" />
                    <div className="absolute h-72 w-72 rounded-full border border-border" />
                    <div className="absolute h-48 w-48 rounded-full border border-border" />
                </div>

                {/* Ground pad under the stack */}
                <div className="mb-0.5 h-2.5 w-40 rounded-full bg-muted-foreground/15 dark:bg-muted-foreground/25" />

                <div className="z-10 flex flex-col-reverse items-center gap-0">
                    {stonesToShow === 0 ? (
                        <div className="mb-4 flex flex-col items-center gap-2 px-4">
                            <CairnMascot
                                className="h-16 w-auto"
                                mood="thinking"
                                label="Cairn waits for the first pebble"
                            />
                            <p className="text-center text-xs text-muted-foreground">
                                Complete a lesson or daily practice to place your first pebble.
                            </p>
                        </div>
                    ) : (
                        Array.from({ length: stonesToShow }).map((_, idx) => {
                            const size = stoneSizes[idx] || { w: 40, h: 12 };
                            return (
                                <CairnStone
                                    key={idx}
                                    width={size.w}
                                    height={size.h}
                                    index={idx}
                                />
                            );
                        })
                    )}
                </div>

                <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-border bg-card/90 px-3 py-1 text-xs font-semibold text-primary shadow-xs backdrop-blur-sm">
                    <Layers className="h-3.5 w-3.5" />
                    <span>{progress.cairnStonesCount || 0} balanced stones</span>
                </div>
            </div>

            <div className="relative mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                <div className="rounded-2xl border border-border bg-card p-3 text-center shadow-soft">
                    <Flame className="mx-auto mb-1 h-4 w-4 text-destructive" />
                    <div className="text-lg font-bold text-primary">
                        {progress.streak || 0}
                    </div>
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Day Rhythm
                    </div>
                </div>
                <div className="rounded-2xl border border-border bg-card p-3 text-center shadow-soft">
                    <Clock className="mx-auto mb-1 h-4 w-4 text-primary" />
                    <div className="text-lg font-bold text-primary">{todayMinutes}</div>
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Min Today
                    </div>
                </div>
                <div className="rounded-2xl border border-border bg-card p-3 text-center shadow-soft">
                    <Sparkles className="mx-auto mb-1 h-4 w-4 text-primary" />
                    <div className="text-lg font-bold text-primary">
                        {progress.xp || 0}
                    </div>
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Lotus XP
                    </div>
                </div>
                <div className="rounded-2xl border border-border bg-card p-3 text-center shadow-soft">
                    <BookOpen className="mx-auto mb-1 h-4 w-4 text-foreground" />
                    <div className="text-lg font-bold text-primary">{wordsSown}</div>
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Words Sown
                    </div>
                </div>
            </div>

            <div className="relative mt-4 overflow-hidden rounded-2xl border border-border bg-card p-4 text-center shadow-soft">
                <div
                    className="lang-wash pointer-events-none absolute inset-0 opacity-25"
                    aria-hidden
                />
                <p className="relative font-serif text-xs italic leading-relaxed text-muted-foreground sm:text-sm">
                    &ldquo;A drop of daily water carves the stone with effortless
                    gentleness. Keep your rhythm soft, steady, and joyful.&rdquo;
                </p>
            </div>
        </div>
    );
}
