"use client";

import { ProgressState } from "@/lib/progress";
import { BookOpen, Clock, Flame, Layers, Sparkles } from "lucide-react";

export default function ZenGarden({ progress }: { progress: ProgressState }) {
    const stonesToShow = Math.min(8, Math.max(0, progress.cairnStonesCount || 0));
    const stoneWidths = [140, 124, 110, 96, 82, 68, 56, 44];
    // Theme-aware pebble tones (primary / muted mix)
    const stoneColors = [
        "hsl(var(--primary))",
        "hsl(var(--muted-foreground))",
        "hsl(var(--primary) / 0.75)",
        "hsl(var(--muted-foreground) / 0.85)",
        "hsl(var(--primary) / 0.9)",
        "hsl(var(--accent-foreground) / 0.7)",
        "hsl(var(--primary) / 0.65)",
        "hsl(var(--muted-foreground) / 0.7)",
    ];

    const todayMinutes = progress.todayMinutesPracticed || 0;
    const wordsSown =
        (progress.savedPhrases?.length || 0) + (progress.translations || 0);

    return (
        <div
            id="zen-garden-modal"
            className="flex items-center justify-center animate-in fade-in duration-200"
        >
            <div className="relative w-full overflow-hidden p-6 shadow-2xl sm:p-8">
                <div className="space-y-1 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Sanctuary of Consistency</span>
                    </div>
                    <h2 className="font-serif text-3xl font-semibold tracking-tight text-primary">
                        Your Pebble Cairn
                    </h2>
                    <p className="mx-auto max-w-md text-xs text-foreground sm:text-sm">
                        Every completed lesson polishes and balances another stone in your Zen
                        garden.
                    </p>
                </div>

                <div className="relative mt-4 flex h-56 w-full flex-col items-center justify-end overflow-hidden rounded-2xl border border-border bg-background pb-8 sm:h-64">
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-20">
                        <div className="h-96 w-96 rounded-full border-2 border-border" />
                        <div className="absolute h-72 w-72 rounded-full border border-border" />
                        <div className="absolute h-48 w-48 rounded-full border border-border" />
                    </div>

                    <div className="mb-1 h-3 w-48 rounded-full border border-border bg-muted shadow-inner" />

                    <div className="z-10 flex flex-col-reverse items-center gap-0.5">
                        {stonesToShow === 0 ? (
                            <p className="mb-6 px-4 text-center text-xs text-muted-foreground">
                                Complete a lesson or daily practice to place your first pebble.
                            </p>
                        ) : (
                            Array.from({ length: stonesToShow }).map((_, idx) => {
                                const width = stoneWidths[idx] || 40;
                                const color = stoneColors[idx % stoneColors.length];
                                return (
                                    <div
                                        key={idx}
                                        className="h-5 rounded-full shadow-xs transition-transform duration-300 hover:scale-105 sm:h-6"
                                        style={{
                                            width: `${width}px`,
                                            backgroundColor: color,
                                            border: "1px solid hsl(var(--border))",
                                        }}
                                        title={`Stone #${idx + 1}`}
                                    />
                                );
                            })
                        )}
                    </div>

                    <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-border bg-card/90 px-3 py-1 text-xs font-semibold text-primary shadow-xs">
                        <Layers className="h-3.5 w-3.5" />
                        <span>{progress.cairnStonesCount || 0} balanced stones</span>
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                    <div className="rounded-xl border border-border bg-card p-3 text-center">
                        <Flame className="mx-auto mb-1 h-4 w-4 text-destructive" />
                        <div className="text-lg font-bold text-primary">{progress.streak || 0}</div>
                        <div className="text-[10px] font-semibold uppercase text-muted-foreground">
                            Day Rhythm
                        </div>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-3 text-center">
                        <Clock className="mx-auto mb-1 h-4 w-4 text-primary" />
                        <div className="text-lg font-bold text-primary">{todayMinutes}</div>
                        <div className="text-[10px] font-semibold uppercase text-muted-foreground">
                            Today (min)
                        </div>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-3 text-center">
                        <Sparkles className="mx-auto mb-1 h-4 w-4 text-destructive" />
                        <div className="text-lg font-bold text-primary">{progress.xp || 0}</div>
                        <div className="text-[10px] font-semibold uppercase text-muted-foreground">
                            Lotus XP
                        </div>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-3 text-center">
                        <BookOpen className="mx-auto mb-1 h-4 w-4 text-foreground" />
                        <div className="text-lg font-bold text-primary">{wordsSown}</div>
                        <div className="text-[10px] font-semibold uppercase text-muted-foreground">
                            Words Sown
                        </div>
                    </div>
                </div>

                <div className="mt-4 rounded-xl border border-border bg-background p-3.5 text-center">
                    <p className="font-serif text-xs italic leading-relaxed text-foreground sm:text-sm">
                        "A drop of daily water carves the stone with effortless gentleness. Keep
                        your rhythm soft, steady, and joyful."
                    </p>
                </div>
            </div>
        </div>
    );
}
