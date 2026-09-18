"use client";

import { ProgressState } from "@/lib/progress";
import { sound } from "@/lib/sound";
import { BookOpen, Clock, Flame, Layers, Sparkles, X } from "lucide-react";

export default function ZenGarden({ progress }: { progress: ProgressState }) {
    const stonesToShow = Math.min(8, Math.max(1, progress.cairnStonesCount));
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

    return (
        <div
            id="zen-garden-modal"
            className="flex items-center justify-center animate-in fade-in duration-200"
        >
            <div className="w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                <div className="text-center space-y-1">
                    <div className="flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Sanctuary of Consistency</span>
                    </div>
                    <h2 className="font-serif text-3xl font-semibold text-primary tracking-tight">
                        Your Pebble Cairn
                    </h2>
                    <p className="text-xs sm:text-sm text-foreground max-w-md mx-auto">
                        Every completed lesson polishes and balances another stone in your Zen garden.
                    </p>
                </div>

                <div className="relative w-full h-56 sm:h-64 bg-card rounded-2xl border border-border flex flex-col items-center justify-end pb-8 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                        <div className="w-96 h-96 rounded-full border-2 border-border" />
                        <div className="w-72 h-72 rounded-full border border-border absolute" />
                        <div className="w-48 h-48 rounded-full border border-border absolute" />
                    </div>

                    <div className="w-48 h-3 rounded-full bg-muted border border-border shadow-inner mb-1" />

                    <div className="flex flex-col-reverse items-center gap-0.5 z-10">
                        {Array.from({ length: stonesToShow }).map((_, idx) => {
                            const width = stoneWidths[idx] || 40;
                            const color = stoneColors[idx % stoneColors.length];
                            return (
                                <div
                                    key={idx}
                                    className="h-5 sm:h-6 rounded-full shadow-xs transition-transform duration-300 hover:scale-105"
                                    style={{
                                        width: `${width}px`,
                                        backgroundColor: color,
                                        border: "1px solid hsl(var(--border))",
                                    }}
                                    title={`Stone #${idx + 1}`}
                                />
                            );
                        })}
                    </div>

                    <div className="absolute top-4 left-4 px-3 py-1 bg-card/90 border border-border rounded-full text-xs font-semibold text-primary flex items-center gap-1.5 shadow-xs">
                        <Layers className="w-3.5 h-3.5" />
                        <span>{progress.cairnStonesCount} balanced stones</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="p-3 bg-card rounded-xl border border-border text-center">
                        <Flame className="w-4 h-4 text-destructive mx-auto mb-1" />
                        <div className="text-lg font-bold text-primary">{progress.streak}</div>
                        <div className="text-[10px] uppercase font-semibold text-muted-foreground">
                            Day Rhythm
                        </div>
                    </div>

                    <div className="p-3 bg-card rounded-xl border border-border text-center">
                        <Clock className="w-4 h-4 text-primary mx-auto mb-1" />
                        <div className="text-lg font-bold text-primary" />
                        <div className="text-[10px] uppercase font-semibold text-muted-foreground">
                            Today
                        </div>
                    </div>

                    <div className="p-3 bg-card rounded-xl border border-border text-center">
                        <Sparkles className="w-4 h-4 text-destructive mx-auto mb-1" />
                        <div className="text-lg font-bold text-primary">{progress.xp}</div>
                        <div className="text-[10px] uppercase font-semibold text-muted-foreground">
                            Lotus XP
                        </div>
                    </div>

                    <div className="p-3 bg-card rounded-xl border border-border text-center">
                        <BookOpen className="w-4 h-4 text-foreground mx-auto mb-1" />
                        <div className="text-lg font-bold text-primary" />
                        <div className="text-[10px] uppercase font-semibold text-muted-foreground">
                            Words Sown
                        </div>
                    </div>
                </div>

                <div className="p-3.5 bg-secondary rounded-xl border border-border text-center">
                    <p className="font-serif italic text-xs sm:text-sm text-foreground leading-relaxed">
                        "A drop of daily water carves the stone with effortless gentleness. Keep your
                        rhythm soft, steady, and joyful."
                    </p>
                </div>
            </div>
        </div>
    );
}
