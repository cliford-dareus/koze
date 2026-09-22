"use client";

import { Drawer, DrawerContent } from "@/app/_components/ui/drawer";
import { READING_STORIES, ReadingStory, StoryVocabulary } from "@/data/reading-stories";
import { LANGUAGES } from "@/lib/languages";
import { defaultProgress, loadProgress, ProgressState } from "@/lib/progress";
import { sound } from "@/lib/sound";
import { Check, Clock, Leaf, Plus, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";
import ReadingManager from "./reading-manager";

export function ReadingPage() {
    const [progress, setProgress] = useState<ProgressState>(defaultProgress());
    const [activeStoryId, setActiveStoryId] = useState<string | null>(null);
    const [selectedLevel, setSelectedLevel] = useState<'all' | 'gentle' | 'growing' | 'deep'>('all');

    const [activeVocab, setActiveVocab] = useState<{ vocab: StoryVocabulary; paragraphId: string } | null>(null);
    const [selectedAnswerIdx, setSelectedAnswerIdx] = useState<number | null>(null);
    const [hasCompletedActiveStory, setHasCompletedActiveStory] = useState(false);
    const [currentlySpeakingParaId, setCurrentlySpeakingParaId] = useState<string | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

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

    const activeStory = READING_STORIES.find((s) => s.id === activeStoryId);

    const currentLang =
        LANGUAGES.find((l) => l.value === progress?.learningLanguage) ||
        LANGUAGES[0];

    // Filter stories for current language & selected difficulty level
    const storiesForLanguage = READING_STORIES.filter(
        (s) => s.languageId === currentLang.id
    );

    const filteredStories = storiesForLanguage.filter((s) => {
        if (selectedLevel === 'all') return true;
        return s.level === selectedLevel;
    });

    const completedStoryIds = progress.completedStoryIds || [];
    const completedCount = storiesForLanguage.filter((s) =>
        completedStoryIds.includes(s.id)
    ).length

    const handleOpenStory = (story: ReadingStory) => {
        sound.playPebbleTap(progress.soundEnabled);
        setActiveStoryId(story.id);
        setSelectedAnswerIdx(null);
        setActiveVocab(null);
        setHasCompletedActiveStory(completedStoryIds.includes(story.id));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Handle reflection question answer
    const handleSelectAnswer = (idx: number) => {
        if (selectedAnswerIdx !== null) return;
        setSelectedAnswerIdx(idx);

        if (activeStory && idx === activeStory.reflection.correctIndex) {
            sound.playGentleChime(progress.soundEnabled);
        } else {
            sound.playPebbleTap(progress.soundEnabled);
        }
    };

    // Mark story as completed and collect rewards
    const handleCompleteStory = () => {
        if (!activeStory) return;

        sound.playGentleChime(progress.soundEnabled);

        // Extract all vocabulary from story paragraphs
        const allVocab = activeStory.paragraphs.flatMap((p) => p.vocabulary || []);
        const wordPayload = allVocab.map((v) => ({
            word: v.word,
            translation: v.translation,
            phonetic: v.phonetic,
        }));

        // const updated = recordStoryCompletion(
        //     progress,
        //     activeStory.id,
        //     activeStory.xpReward,
        //     activeStory.readTimeMinutes,
        //     wordPayload,
        //     progress.learningLanguage            
        // );

        // onUpdateProgress(updated);
        setHasCompletedActiveStory(true);
        // triggerToast(`Reflected on "${activeStory.nativeTitle}"! +${activeStory.xpReward} XP & +1 Pebble`);
    };

    return (
        <div>
            <div className="mt-6">
                {/* Reading Shelf Stats */}
                <div
                    id="reading-shelf-stats"
                    className="bg-background border border-border rounded-[24px] p-4 sm:p-5 grid grid-cols-3 gap-3 text-center"
                >
                    <div className="border-r border-border pr-2">
                        <div className="text-xl sm:text-2xl font-serif text-foreground">
                            {completedCount} <span className="text-xs font-sans text-[#70756F]">/ {storiesForLanguage.length}</span>
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">Stories Read</div>
                    </div>

                    <div className="border-r border-border px-2">
                        <div className="text-xl sm:text-2xl font-serif text-foreground">
                            {progress.cairnStonesCount}
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">Pebbles Placed</div>
                    </div>

                    <div className="pl-2">
                        <div className="text-xl sm:text-2xl font-serif text-foreground">
                            {/*{progress.masteredWords.length}*/}
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">Words in Garden</div>
                    </div>
                </div>

                {/* Level Filter Tabs */}
                <div className="flex items-center justify-center gap-1.5 flex-wrap mt-4">
                    {[
                        { id: 'all', label: 'All Stories' },
                        { id: 'gentle', label: 'Gentle 🌱' },
                        { id: 'growing', label: 'Growing 🌿' },
                        { id: 'deep', label: 'Deep 🌳' },
                    ].map((lvl) => {
                        const isSelected = selectedLevel === lvl.id;
                        return (
                            <button
                                key={lvl.id}
                                id={`filter-level-${lvl.id}`}
                                type="button"
                                onClick={() => {
                                    sound.playPebbleTap(progress.soundEnabled);
                                    setSelectedLevel(lvl.id as any);
                                }}
                                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${isSelected
                                    ? 'bg-[#EAE8E0] text-[#161715] font-semibold shadow-xs'
                                    : 'bg-[#181917] text-[#70756F] hover:text-[#ECEBE6] border border-[#272926]'
                                    }`}
                            >
                                {lvl.label}
                            </button>
                        );
                    })}
                </div>

                {/* Stories Cards Grid */}
                <div className="mt-4">
                    {filteredStories.map((story) => {
                        const isCompleted = completedStoryIds.includes(story.id);
                        return (
                            <article
                                key={story.id}
                                id={`story-card-${story.id}`}
                                className="group relative bg-background hover:bg-[#20221E] border border-border hover:border-[#383B35] rounded-[26px] p-5 mt-4 sm:p-6 shadow-xs transition-all flex flex-col justify-between cursor-pointer"
                                onClick={() => handleOpenStory(story)}
                            >
                                <div>
                                    {/* Top Badges */}
                                    <div className="flex items-center justify-between gap-2 mb-3">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${story.level === 'gentle'
                                                    ? 'bg-[#19261E] text-[#9AC6A9] border-[#2A3F32]'
                                                    : story.level === 'growing'
                                                        ? 'bg-[#222619] text-[#C2D19D] border-[#3C4329]'
                                                        : 'bg-[#261E22] text-[#D8A7BA] border-[#442D38]'
                                                    }`}
                                            >
                                                {story.level === 'gentle'
                                                    ? 'Gentle 🌱'
                                                    : story.level === 'growing'
                                                        ? 'Growing 🌿'
                                                        : 'Deep 🌳'}
                                            </span>

                                            <span className="text-[11px] text-[#70756F] flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                <span>{story.readTimeMinutes} min</span>
                                            </span>

                                            <span className="text-[11px] text-[#636860] hidden sm:inline">
                                                • {story.category}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {isCompleted ? (
                                                <span className="inline-flex items-center gap-1 text-[11px] text-[#86B495] bg-[#1B271F] px-2 py-0.5 rounded-full border border-[#2B4133]">
                                                    <Check className="w-3 h-3" />
                                                    <span>Reflected</span>
                                                </span>
                                            ) : (
                                                <span className="text-[11px] text-[#70756F] bg-[#161715] px-2 py-0.5 rounded-full border border-[#272825]">
                                                    +{story.xpReward} XP
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Titles */}
                                    <div className="space-y-1">
                                        <h2 className="font-serif text-xl sm:text-2xl font-normal text-foreground group-hover:text-white transition-colors">
                                            {story.title}
                                        </h2>
                                        <div className="text-xs text-muted-foreground font-medium tracking-wide">
                                            {story.nativeTitle}
                                        </div>
                                    </div>

                                    {/* Summary */}
                                    <p className="text-xs sm:text-[13px] text-[#70756F] leading-relaxed mt-2.5 line-clamp-2">
                                        {story.summary}
                                    </p>
                                </div>

                                {/* Bottom Action Footer */}
                                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
                                    <span className="text-[11px] text-muted-foreground">
                                        {story.paragraphs.length} reflective passages
                                    </span>

                                    <button
                                        type="button"
                                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground group-hover:text-white transition-colors"
                                    >
                                        <span>{isCompleted ? 'Read Again' : 'Read Peacefully'}</span>
                                        <span>→</span>
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </div>

                <ReadingManager
                    progress={progress}
                    activeStoryId={activeStoryId}
                    setActiveStoryId={setActiveStoryId}
                    activeVocab={activeVocab}
                    activeStory={activeStory}
                    setActiveVocab={setActiveVocab}
                    currentlySpeakingParaId={currentlySpeakingParaId}
                    selectedAnswerIdx={selectedAnswerIdx}
                    handleSelectAnswer={handleSelectAnswer}
                    handleCompleteStory={handleCompleteStory}
                    hasCompletedActiveStory={hasCompletedActiveStory}
                />
            </div>
        </div>
    );
}
