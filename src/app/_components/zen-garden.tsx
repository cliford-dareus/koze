"use client";

import { ProgressState } from "@/lib/progress";
import { sound } from "@/lib/sound";
import { BookOpen, Clock, Flame, Layers, Sparkles, X } from "lucide-react";

export default function ZenGarden({ progress }: { progress: ProgressState }) {
    // We compute pebble sizes for the visual cairn stack (up to 8 stacked stones)
    const stonesToShow = Math.min(8, Math.max(1, progress.cairnStonesCount));
    const stoneWidths = [140, 124, 110, 96, 82, 68, 56, 44];
    const stoneColors = [
        '#687569',
        '#7D8C7F',
        '#92A194',
        '#A6B4A8',
        '#738375',
        '#87988A',
        '#5E6D60',
        '#4D5D4F',
    ];

    return (
        <div
            id="zen-garden-modal"
            className="flex items-center justify-center animate-in fade-in duration-200"
        >
            <div className="w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                {/* Header */}
                <div className="text-center space-y-1">
                    <div className="flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#52745F]">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Sanctuary of Consistency</span>
                    </div>
                    <h2 className="font-serif text-3xl font-semibold text-[#243327] tracking-tight">
                        Your Pebble Cairn
                    </h2>
                    <p className="text-xs sm:text-sm text-[#6A786E] max-w-md mx-auto">
                        Every completed lesson polishes and balances another stone in your Zen garden.
                    </p>
                </div>

                {/* Visual Zen Garden Cairn Display */}
                <div className="relative w-full h-56 sm:h-64 bg-[#F4EFE6] rounded-2xl border border-[#E4DDD0] flex flex-col items-center justify-end pb-8 overflow-hidden">
                    {/* Subtle concentric raked sand rings (CSS/SVG) */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                        <div className="w-96 h-96 rounded-full border-2 border-[#8C7A5E]" />
                        <div className="w-72 h-72 rounded-full border border-[#8C7A5E] absolute" />
                        <div className="w-48 h-48 rounded-full border border-[#8C7A5E] absolute" />
                    </div>

                    {/* Stepping Base Platform */}
                    <div className="w-48 h-3 rounded-full bg-[#DCD4C4] border border-[#C9BFA9] shadow-inner mb-1" />

                    {/* Stack of balanced river pebbles */}
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
                                        border: '1px solid rgba(255,255,255,0.25)',
                                    }}
                                    title={`Stone #${idx + 1}`}
                                />
                            );
                        })}
                    </div>

                    {/* Floating pebble count badge */}
                    <div className="absolute top-4 left-4 px-3 py-1 bg-[#FCFAF6]/90 border border-[#E5DFD2] rounded-full text-xs font-semibold text-[#3D5645] flex items-center gap-1.5 shadow-xs">
                        <Layers className="w-3.5 h-3.5" />
                        <span>{progress.cairnStonesCount} balanced stones</span>
                    </div>
                </div>

                {/* Tranquil Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="p-3 bg-[#F6F2EA] rounded-xl border border-[#EAE4D7] text-center">
                        <Flame className="w-4 h-4 text-[#B85C2B] mx-auto mb-1" />
                        <div className="text-lg font-bold text-[#2A362D]">{progress.streak}</div>
                        <div className="text-[10px] uppercase font-semibold text-[#768278]">
                            Day Rhythm
                        </div>
                    </div>

                    <div className="p-3 bg-[#F6F2EA] rounded-xl border border-[#EAE4D7] text-center">
                        <Clock className="w-4 h-4 text-[#486D56] mx-auto mb-1" />
                        <div className="text-lg font-bold text-[#2A362D]">
                            {/*{progress.todayMinutesPracticed}m*/}
                        </div>
                        <div className="text-[10px] uppercase font-semibold text-[#768278]">
                            Today
                        </div>
                    </div>

                    <div className="p-3 bg-[#F6F2EA] rounded-xl border border-[#EAE4D7] text-center">
                        <Sparkles className="w-4 h-4 text-[#9F5A29] mx-auto mb-1" />
                        <div className="text-lg font-bold text-[#2A362D]">{progress.xp}</div>
                        <div className="text-[10px] uppercase font-semibold text-[#768278]">
                            Lotus XP
                        </div>
                    </div>

                    <div className="p-3 bg-[#F6F2EA] rounded-xl border border-[#EAE4D7] text-center">
                        <BookOpen className="w-4 h-4 text-[#4F6C7E] mx-auto mb-1" />
                        <div className="text-lg font-bold text-[#2A362D]">
                            {/*{progress.masteredWords.length}*/}
                        </div>
                        <div className="text-[10px] uppercase font-semibold text-[#768278]">
                            Words Sown
                        </div>
                    </div>
                </div>

                {/* Quiet Zen Reflection */}
                <div className="p-3.5 bg-[#F2EDE2] rounded-xl border border-[#E4DCCF] text-center">
                    <p className="font-serif italic text-xs sm:text-sm text-[#525E54] leading-relaxed">
                        "A drop of daily water carves the stone with effortless gentleness. Keep your
                        rhythm soft, steady, and joyful."
                    </p>
                </div>
            </div>
        </div>
    );

}
