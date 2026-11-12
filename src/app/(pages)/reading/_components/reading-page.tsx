"use client

import { READING_STORIES, ReadingStory, StoryVocabulary } from "@/data/reading-stories";
import { LANGUAGES } from "@/lib/languages";
import { defaultProgress, loadProgress, ProgressState } from "@/lib/progress";
import { sound } from "@/lib/sound";
import { ArrowUpRight, Check, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import ReadingManager from "./reading-manager";

export function ReadingPage() {
    const [progress, setProgress] = useState<ProgressState>(defaultProgress());
    const [activeStoryId, setActiveStoryId] = useState<string | null>(null);
    const [selectedLevel, setSelectedLevel] = useState<
        "all" | "gentle" | "growing" | "deep"
    >("all");

    const [activeVocab, setActiveVocab] = useState<{
        vocab: StoryVocabulary;
        paragraphId: string;
    } | null>(null);
    const [selectedAnswerIdx, setSelectedAnswerIdx] = useState<number | null>(null);
    const [hasCompletedActiveStory, setHasCompletedActiveStory] = useState(false);
    const [currentlySpeakingParaId, setCurrentlySpeakingParaId] = useState<string | null>(
        null,
    );

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
        LANGUAGES.find((l) => l.value === progress?.learningLanguage) || LANGUAGES[0];

    const storiesForLanguage = READING_STORIES.filter(
        (s) => s.languageId === currentLang.id,
    );

    const filteredStories = storiesForLanguage.filter((s) => {
        if (selectedLevel === "all") return true;
        return s.level === selectedLevel;
    });

    const completedStoryIds = progress.completedStoryIds || [];
    const completedCount = storiesForLanguage.filter((s) =>
        completedStoryIds.includes(s.id),
    ).length;

    const wordsSown =
        (progress.savedPhrases?.length || 0) + (progress.translations || 0);

    const handleOpenStory = (story: ReadingStory) => {
        sound.playPebbleTap(progress.soundEnabled);
        setActiveStoryId(story.id);
        setSelectedAnswerIdx(null);
        setActiveVocab(null);
        setHasCompletedActiveStory(completedStoryIds.includes(story.id));
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSelectAnswer = (idx: number) => {
        if (selectedAnswerIdx !== null) return;
        setSelectedAnswerIdx(idx);

        if (activeStory && idx === activeStory.reflection.correctIndex) {
            sound.playGentleChime(progress.soundEnabled);
        } else {
            sound.playPebbleTap(progress.soundEnabled);
        }
    };

    const handleCompleteStory = () => {
        if (!activeStory) return;
        sound.playGentleChime(progress.soundEnabled);
        setHasCompletedActiveStory(true);
    };

    const levelLabel = (level: string) =>
        level === "gentle"
            ? "Gentle 🌱"
            : level === "growing"
              ? "Growing 🌿"
              : "Deep 🌳";

    return (
        <div>
            <div className="mt-6">
                <div
                    id="reading-shelf-stats"
                    className="grid grid-cols-3 gap-2 rounded-2xl border border-border bg-card p-4 text-center shadow-soft sm:gap-3 sm:p-5"
                >
                    <div className="border-r border-border pr-2">
                        <div className="font-serif text-xl text-foreground sm:text-2xl">
                            {completedCount}{" "}
                            <span className="font-sans text-xs text-muted-foreground">
                                / {storiesForLanguage.length}
                            </span>
                        </div>
                        <div className="mt-0.5 text-[11px] text-muted-foreground">
                            Stories read
                        </div>
                    </div>

                    <div className="border-r border-border px-2">
                        <div className="font-serif text-xl text-foreground sm:text-2xl">
                            {progress.cairnStonesCount || 0}
                        </div>
                        <div className="mt-0.5 text-[11px] text-muted-foreground">
                            Pebbles placed
                        </div>
                    </div>

                    <div className="pl-2">
                        <div className="font-serif text-xl text-foreground sm:text-2xl">
                            {wordsSown}
                        </div>
                        <div className="mt-0.5 text-[11px] text-muted-foreground">
                            Words sown
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
                    {[
                        { id: "all", label: "All stories" },
                        { id: "gentle", label: "Gentle 🌱" },
                        { id: "growing", label: "Growing 🌿" },
                        { id: "deep", label: "Deep 🌳" },
                    ].map((lvl) => {
                        const isSelected = selectedLevel === lvl.id;
                        return (
                            <button
                                key={lvl.id}
                                id={`filter-level-${lvl.id}`}
                                type="button"
                                onClick={() => {
                                    sound.playPebbleTap(progress.soundEnabled);
                                    setSelectedLevel(lvl.id as typeof selectedLevel);
                                }}
                                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
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

                <div className="mt-4 space-y-3">
                    {filteredStories.map((story) => {
                        const isCompleted = completedStoryIds.includes(story.id);
                        return (
                            <article
                                key={story.id}
                                id={`story-card-${story.id}`}
                                className="group relative flex cursor-pointer flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/25 active:translate-y-0 sm:p-6"
                                onClick={() => handleOpenStory(story)}
                            >
                                <div>
                                    <div className="mb-3 flex items-center justify-between gap-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="rounded-full border border-border bg-accent px-2.5 py-0.5 text-[11px] font-medium text-primary">
                                                {levelLabel(story.level)}
                                            </span>

                                            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                                <Clock className="h-3 w-3" />
                                                <span>{story.readTimeMinutes} min</span>
                                            </span>

                                            <span className="hidden text-[11px] text-muted-foreground sm:inline">
                                                · {story.category}
                                            </span>
                                        </div>

                                        {isCompleted ? (
                                            <span className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-accent px-2 py-0.5 text-[11px] text-primary">
                                                <Check className="h-3 w-3" />
                                                <span>Reflected</span>
                                            </span>
                                        ) : (
                                            <span className="rounded-full border border-border bg-background px-2 py-0.5 text-[11px] text-muted-foreground">
                                                +{story.xpReward} XP
                                            </span>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <h2 className="font-serif text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                                            {story.title}
                                        </h2>
                                        <div className="text-xs font-medium tracking-wide text-muted-foreground">
                                            {story.nativeTitle}
                                        </div>
                                    </div>

                                    <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:text-[13px]">
                                        {story.summary}
                                    </p>
                                </div>

                                <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs">
                                    <span className="text-[11px] text-muted-foreground">
                                        {story.paragraphs.length} reflective passages
                                    </span>

                                    <span className="inline-flex items-center gap-1 font-semibold text-primary">
                                        <span>{isCompleted ? "Read again" : "Read peacefully"}</span>
                                        <ArrowUpRight
                                            size={13}
                                            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                        />
                                    </span>
                                </div>
                            </article>
                        );
                    })}

                    {filteredStories.length === 0 && (
                        <div className="rounded-2xl border border-border bg-card px-4 py-12 text-center text-sm text-muted-foreground shadow-soft">
                            No stories match this filter. Try another level.
                        </div>
                    )}
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
