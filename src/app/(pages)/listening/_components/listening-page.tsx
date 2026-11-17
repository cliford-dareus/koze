"use client";

import CairnMascot from "@/app/_components/cairn-mascot";
import { LISTENING_TRACKS, ListeningTrack } from "@/data/listening-tracks";
import { LANGUAGES } from "@/lib/languages";
import { defaultProgress, loadProgress, ProgressState } from "@/lib/progress";
import { sound } from "@/lib/sound";
import { Check, Clock, Ear, Layers, Play, Search } from "lucide-react";
import { useEffect, useState } from "react";
import ListeningManager from "./listening-manager";

export const ListeningPage = () => {
    const [progress, setProgress] = useState<ProgressState>(defaultProgress());
    const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
    const [selectedLevel, setSelectedLevel] = useState<
        "all" | "gentle" | "growing" | "deep"
    >("all");
    const [searchQuery, setSearchQuery] = useState<string>("");

    useEffect(() => {
        const refreshProgress = () => setProgress(loadProgress());
        refreshProgress();
        window.addEventListener("koze-progress", refreshProgress);
        window.addEventListener("storage", refreshProgress);

        return () => {
            window.removeEventListener("koze-progress", refreshProgress);
            window.removeEventListener("storage", refreshProgress);
        };
    }, []);

    const activeTrack = LISTENING_TRACKS.find((t) => t.id === activeTrackId);
    const currentLang =
        LANGUAGES.find((l) => l.value === progress?.learningLanguage) || LANGUAGES[0];

    const tracksForLanguage = LISTENING_TRACKS.filter(
        (t) => t.languageId === currentLang.id,
    );

    const filteredTracks = tracksForLanguage.filter((t) => {
        const matchesLevel = selectedLevel === "all" || t.level === selectedLevel;
        const q = searchQuery.toLowerCase();
        const matchesSearch =
            searchQuery.trim() === "" ||
            t.title.toLowerCase().includes(q) ||
            t.nativeTitle.toLowerCase().includes(q) ||
            t.category.toLowerCase().includes(q) ||
            t.soundscapeDescription.toLowerCase().includes(q);
        return matchesLevel && matchesSearch;
    });

    const handleOpenTrack = (track: ListeningTrack) => {
        sound.playPebbleTap(progress.soundEnabled);
        setActiveTrackId(track.id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const completedListeningIds = progress.completedListeningIds || [];
    const completedCount = tracksForLanguage.filter((t) =>
        completedListeningIds.includes(t.id),
    ).length;

    const wordsSown =
        (progress.savedPhrases?.length || 0) + (progress.translations || 0);

    return (
        <div className="mt-5">
            {/* Rhythm metrics */}
            <div
                id="listening-shelf-metrics"
                className="relative overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-soft sm:p-5"
            >
                <div className="lang-wash pointer-events-none absolute inset-0 opacity-50" aria-hidden />
                <div className="relative grid grid-cols-3 gap-2 text-center">
                    <div className="border-r border-border/70 pr-2">
                        <div className="flex items-center justify-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                            <Ear className="h-3 w-3" />
                            Heard
                        </div>
                        <div className="mt-1 font-serif text-lg font-semibold text-foreground sm:text-xl">
                            {completedCount}
                            <span className="font-sans text-xs font-normal text-muted-foreground">
                                {" "}
                                / {tracksForLanguage.length}
                            </span>
                        </div>
                    </div>
                    <div className="border-r border-border/70 px-2">
                        <div className="flex items-center justify-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                            <Layers className="h-3 w-3" />
                            Pebbles
                        </div>
                        <div className="mt-1 font-serif text-lg font-semibold text-foreground sm:text-xl">
                            {progress.cairnStonesCount || 0}
                        </div>
                    </div>
                    <div className="pl-2">
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                            Words sown
                        </div>
                        <div className="mt-1 font-serif text-lg font-semibold text-foreground sm:text-xl">
                            {wordsSown}
                        </div>
                    </div>
                </div>
                <p className="relative mt-3 text-center text-[11px] text-muted-foreground">
                    Path · {currentLang.flag} {currentLang.name}
                </p>
            </div>

            {/* Search + filters */}
            <div className="mt-4">
                <div className="relative flex items-center gap-2">
                    <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <input
                        id="listening-search-input"
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by title, theme, or atmosphere…"
                        className="w-full rounded-full border border-border bg-card py-2.5 pl-9 pr-14 text-xs text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground hover:text-foreground"
                        >
                            Clear
                        </button>
                    )}
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
                    {(
                        [
                            { id: "all", label: "All tracks" },
                            { id: "gentle", label: "Gentle 🌱" },
                            { id: "growing", label: "Growing 🌿" },
                            { id: "deep", label: "Deep 🌳" },
                        ] as const
                    ).map((lvl) => {
                        const isSelected = selectedLevel === lvl.id;
                        return (
                            <button
                                key={lvl.id}
                                id={`listening-filter-level-${lvl.id}`}
                                type="button"
                                onClick={() => {
                                    sound.playPebbleTap(progress.soundEnabled);
                                    setSelectedLevel(lvl.id);
                                }}
                                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                                    isSelected
                                        ? "bg-primary font-semibold text-primary-foreground shadow-xs"
                                        : "border border-border bg-card text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                {lvl.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Track shelf */}
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {filteredTracks.map((track) => {
                    const isDone = completedListeningIds.includes(track.id);
                    return (
                        <article
                            key={track.id}
                            id={`track-card-${track.id}`}
                            onClick={() => handleOpenTrack(track)}
                            className="group flex cursor-pointer flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/25 active:translate-y-0"
                        >
                            <div className="space-y-3">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="rounded-full border border-border bg-accent px-2.5 py-0.5 text-[11px] font-medium text-primary">
                                        {track.category}
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                            <Clock className="h-3 w-3" />
                                            {track.durationMinutes}m
                                        </span>
                                        {isDone && (
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-primary/25 bg-accent text-primary">
                                                <Check className="h-3 w-3" />
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="line-clamp-1 font-serif text-lg font-semibold tracking-tight text-foreground">
                                        {track.title}
                                    </h3>
                                    <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                                        {track.nativeTitle}
                                    </p>
                                </div>

                                <p className="line-clamp-2 text-xs italic leading-relaxed text-muted-foreground">
                                    &ldquo;{track.soundscapeDescription}&rdquo;
                                </p>

                                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                    {track.speakers.map((spk) => (
                                        <div
                                            key={spk.id}
                                            className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2 py-0.5 text-[10px] text-muted-foreground"
                                        >
                                            <span>{spk.avatar}</span>
                                            <span>{spk.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs">
                                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                    <span className="capitalize">{track.level}</span>
                                    <span>·</span>
                                    <span className="text-primary">+{track.xpReward} XP</span>
                                </div>
                                <div className="flex items-center gap-1 font-semibold text-primary">
                                    <Play className="h-3 w-3 fill-current" />
                                    <span>{isDone ? "Listen again" : "Listen"}</span>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>

            {filteredTracks.length === 0 && (
                <div className="mt-4 flex flex-col items-center rounded-2xl border border-border bg-card px-4 py-12 text-center shadow-soft">
                    <CairnMascot
                        className="mb-3 h-20 w-auto"
                        mood="listening"
                        label="Cairn listening for a track"
                    />
                    <p className="max-w-xs text-sm text-muted-foreground">
                        No tracks matched for {currentLang.name}. Adjust the level or search,
                        or change your learning language.
                    </p>
                </div>
            )}

            <ListeningManager
                activeTrackId={activeTrackId}
                setActiveTrackId={setActiveTrackId}
                progress={progress}
                activeTrack={activeTrack}
                completedListeningIds={completedListeningIds}
                currentLanguage={currentLang}
            />
        </div>
    );
};
