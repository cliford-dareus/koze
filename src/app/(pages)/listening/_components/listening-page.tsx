"use client";

import { LISTENING_TRACKS, ListeningTrack } from "@/data/listening-tracks";
import { StoryVocabulary } from "@/data/reading-stories";
import { LANGUAGES } from "@/lib/languages";
import { defaultProgress, loadProgress, ProgressState } from "@/lib/progress";
import { sound } from "@/lib/sound";
import { Check, Clock, Play, Search } from "lucide-react";
import { useEffect, useState } from "react";
import ListeningManager from "./listening-manager";

export const ListeningPage = () => {
    const [progress, setProgress] = useState<ProgressState>(defaultProgress());
    // Navigation & Track selection state
    const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
    const [selectedLevel, setSelectedLevel] = useState<'all' | 'gentle' | 'growing' | 'deep'>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');

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
        LANGUAGES.find((l) => l.value === progress?.learningLanguage) ||
        LANGUAGES[0];

    const tracksForLanguage = LISTENING_TRACKS.filter(
        (t) => t.languageId === currentLang.id
    );

    const filteredTracks = tracksForLanguage.filter((t) => {
        const matchesLevel = selectedLevel === 'all' || t.level === selectedLevel;
        const matchesSearch =
            searchQuery.trim() === '' ||
            t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.nativeTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.soundscapeDescription.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesLevel && matchesSearch;
    });

    const handleOpenTrack = (track: ListeningTrack) => {
        sound.playPebbleTap(progress.soundEnabled);
        setActiveTrackId(track.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const completedListeningIds = progress.completedListeningIds || [];
    const completedCount = tracksForLanguage.filter((t) =>
        completedListeningIds.includes(t.id)
    ).length;

    return (
        <div>
            <div className="mt-6">
                {/* Listening Shelf Metrics */}
                <div
                    id="listening-shelf-metrics"
                    className="bg-background border border-border rounded-2xl p-4 grid grid-cols-3 gap-3 text-center"
                >
                    <div>
                        <div className="text-xs text-muted-foreground">Tracks Absorbed</div>
                        <div className="text-lg font-semibold text-foreground mt-0.5">
                            {completedCount} / {tracksForLanguage.length}
                        </div>
                    </div>
                    <div className="border-x border-border">
                        <div className="text-xs text-muted-foreground">Cairn Pebbles</div>
                        <div className="text-lg font-semibold text-foreground mt-0.5 flex items-center justify-center gap-1">
                            <span>🪨</span>
                            <span>{progress.cairnStonesCount}</span>
                        </div>
                    </div>
                    <div>
                        <div className="text-xs text-muted-foreground">Word Garden</div>
                        <div className="text-lg font-semibold text-foreground mt-0.5 flex items-center justify-center gap-1">
                            <span>🌱</span>
                            {/*<span>{progress.masteredWords.length} words</span>*/}
                        </div>
                    </div>
                </div>

                {/* Search Input & Level Filters */}
                <div className="my-3">
                    <div className="relative flex items-center gap-2 ">
                        <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            id="listening-search-input"
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search audio tracks by title, theme, or atmosphere..."
                            className="w-full bg-background border border-border focus:border-border rounded-full pl-9 pr-14 py-2 text-xs text-foreground placeholder-[#646862] outline-none transition-colors"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    <div className="flex items-center justify-center gap-1.5 flex-wrap mt-3">
                        {[
                            { id: 'all', label: 'All Tracks' },
                            { id: 'gentle', label: 'Gentle 🌱' },
                            { id: 'growing', label: 'Growing 🌿' },
                            { id: 'deep', label: 'Deep 🌳' },
                        ].map((lvl) => {
                            const isSelected = selectedLevel === lvl.id;
                            return (
                                <button
                                    key={lvl.id}
                                    id={`listening-filter-level-${lvl.id}`}
                                    type="button"
                                    onClick={() => {
                                        sound.playPebbleTap(progress.soundEnabled);
                                        setSelectedLevel(lvl.id as any);
                                    }}
                                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${isSelected
                                        ? 'bg-[#EAE8E0] text-[#161715] font-semibold shadow-xs'
                                        : 'bg-[#181917] text-[#70756F] hover:text-[#ECEBE6] border border-[#272926]'
                                        }`}
                                >
                                    {lvl.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Track Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                        {filteredTracks.map((track) => {
                            const isDone = completedListeningIds.includes(track.id);
                            return (
                                <div
                                    key={track.id}
                                    id={`track-card-${track.id}`}
                                    onClick={() => handleOpenTrack(track)}
                                    className="group bg-background hover:bg-[#1E201C] border border-border hover:border-border rounded-2xl p-5 flex flex-col justify-between transition-all cursor-pointer shadow-xs hover:shadow-lg"
                                >
                                    <div className="space-y-3">
                                        {/* Top metadata row */}
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-[11px] font-medium text-[#7D8F82] bg-background px-2.5 py-0.5 rounded-full border border-border">
                                                {track.category}
                                            </span>
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {track.durationMinutes}m
                                                </span>
                                                {isDone && (
                                                    <span className="w-5 h-5 rounded-full bg-background text-[#A8D3B6] flex items-center justify-center text-[10px]">
                                                        <Check className="w-3 h-3" />
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Titles */}
                                        <div>
                                            <h3 className="font-serif text-lg font-medium text-foreground group-hover:text-white transition-colors line-clamp-1">
                                                {track.title}
                                            </h3>
                                            <p className="text-xs font-serif text-muted-foreground mt-0.5 line-clamp-1">
                                                {track.nativeTitle}
                                            </p>
                                        </div>

                                        {/* Soundscape preview */}
                                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed italic">
                                            "{track.soundscapeDescription}"
                                        </p>

                                        {/* Speakers row */}
                                        <div className="pt-1 flex items-center gap-1.5 flex-wrap">
                                            {track.speakers.map((spk) => (
                                                <div
                                                    key={spk.id}
                                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-background border border-border text-[10px] text-muted-foreground"
                                                >
                                                    <span>{spk.avatar}</span>
                                                    <span>{spk.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Bottom action row */}
                                    <div className="pt-4 mt-4 border-t border-border flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                            <span className="capitalize">{track.level}</span>
                                            <span>•</span>
                                            <span className="text-[#A8D3B6]">+{track.xpReward} XP</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-[#D8DED5] group-hover:text-[#A8D3B6] font-medium transition-colors">
                                            <Play className="w-3 h-3 fill-current" />
                                            <span>Listen</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {filteredTracks.length === 0 && (
                        <div className="text-center py-12 px-4 text-sm text-muted-foreground bg-card rounded-2xl border border-border">
                            No listening tracks matched your search. Try adjusting the level or search term.
                        </div>
                    )}
                </div>
            </div>

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
}
