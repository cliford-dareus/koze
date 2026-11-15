"use client";

import { Drawer, DrawerContent } from "@/app/_components/ui/drawer";
import { ReadingStory, StoryVocabulary } from "@/data/reading-stories";
import { ProgressState } from "@/lib/progress";
import { sound } from "@/lib/sound";
import { ArrowLeft, Check, CheckCircle2, Eye, EyeOff, Plus, Sparkles, Volume2 } from "lucide-react";
import CairnMascot from "@/app/_components/cairn-mascot";
import { useState } from "react";

type Props = {
    progress: ProgressState;
    activeStoryId: string | null;
    setActiveStoryId: (id: string | null) => void;
    activeVocab: { vocab: StoryVocabulary; paragraphId: string } | null;
    activeStory: ReadingStory | undefined;
    currentlySpeakingParaId: string | null;
    setActiveVocab: (vocab: { vocab: StoryVocabulary; paragraphId: string } | null) => void;
    selectedAnswerIdx: number | null;
    handleSelectAnswer: (idx: number) => void;
    handleCompleteStory: () => void;
    hasCompletedActiveStory: boolean;
};

const ReadingManager = ({
    progress,
    activeStoryId,
    setActiveStoryId,
    activeVocab,
    activeStory,
    currentlySpeakingParaId,
    setActiveVocab,
    selectedAnswerIdx,
    handleSelectAnswer,
    handleCompleteStory,
    hasCompletedActiveStory,
}: Props) => {
    const [storyIndex, setStoryIndex] = useState<number>(0);
    const [showAllTranslations, setShowAllTranslations] = useState<boolean>(true);
    const [showPhonetics, setShowPhonetics] = useState<boolean>(true);
    const [fontSize, setFontSize] = useState<'normal' | 'comfortable' | 'spacious'>('comfortable');
    const [audioSpeed, setAudioSpeed] = useState<0.8 | 1.0>(1.0);

    const activeParagraph = activeStory?.paragraphs[storyIndex];

    const isSpeakingThis = currentlySpeakingParaId === activeParagraph?.id;


    const nextStory = () => {
        if (!activeStory) return;
        setStoryIndex((prevIndex) => (prevIndex + 1) % activeStory?.paragraphs.length);
    };

    const prevStory = () => {
        if (!activeStory) return;
        setStoryIndex((prevIndex) => (prevIndex - 1 + activeStory?.paragraphs.length) % activeStory?.paragraphs.length);
    };

    const getFontSizeClasses = () => {
        switch (fontSize) {
            case 'normal':
                return 'text-[17px] leading-[1.85]';
            case 'comfortable':
                return 'text-[20px] sm:text-[21px] leading-[1.95]';
            case 'spacious':
                return 'text-[23px] sm:text-[25px] leading-[2.1]';
        }
    };

    return (
        <Drawer open={!!activeStoryId} onOpenChange={() => setActiveStoryId(null)}>
            <DrawerContent className="min-h-screen h-full">
                <div className="relative mx-auto h-full max-w-2xl overflow-y-auto px-4 pb-10 pt-2">
                    <div className="lang-wash pointer-events-none absolute inset-0 opacity-25" aria-hidden />
                    {/* Reader Controls Toolbar */}
                    <div
                        id="reader-toolbar"
                        className="relative flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-border bg-card p-3 text-xs shadow-soft"
                    >
                        {/* Text Size Switcher */}
                        <div className="flex items-center gap-1">
                            <span className="text-[11px] text-muted-foreground mr-1 hidden sm:inline">Size:</span>
                            {(['normal', 'comfortable', 'spacious'] as const).map((sz) => (
                                <button
                                    key={sz}
                                    type="button"
                                    onClick={() => {
                                        sound.playPebbleTap(progress.soundEnabled);
                                        setFontSize(sz);
                                    }}
                                    className={`cursor-pointer rounded-full px-2.5 py-1 text-xs transition-colors ${fontSize === sz
                                        ? 'border border-primary bg-primary font-semibold text-primary-foreground'
                                        : 'border border-transparent text-muted-foreground hover:bg-muted hover:text-foreground'
                                        }`}
                                >
                                    {sz === 'normal' ? 'A' : sz === 'comfortable' ? 'A+' : 'A++'}
                                </button>
                            ))}
                        </div>

                        {/* Audio Speed Switcher */}
                        <div className="flex items-center gap-1">
                            <span className="text-[11px] text-muted-foreground mr-1 hidden sm:inline">Audio:</span>
                            <button
                                type="button"
                                onClick={() => {
                                    sound.playPebbleTap(progress.soundEnabled);
                                    setAudioSpeed((prev) => (prev === 1.0 ? 0.8 : 1.0));
                                }}
                                className="px-2 py-1 rounded-lg text-xs bg-card hover:bg-muted border border-border text-foreground transition-colors cursor-pointer"
                                title="Toggle narration speed"
                            >
                                {audioSpeed}x Speed
                            </button>
                        </div>

                        {/* Bilingual Visibility Toggle */}
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    sound.playPebbleTap(progress.soundEnabled);
                                    setShowAllTranslations(!showAllTranslations);
                                }}
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer border ${showAllTranslations
                                    ? 'bg-accent text-primary border-primary/30'
                                    : 'bg-card text-muted-foreground border-border'
                                    }`}
                                title="Toggle native English translation"
                            >
                                {showAllTranslations ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                <span>Translation</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    sound.playPebbleTap(progress.soundEnabled);
                                    setShowPhonetics(!showPhonetics);
                                }}
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer border ${showPhonetics
                                    ? 'bg-accent text-primary border-primary/30'
                                    : 'bg-card text-muted-foreground border-border'
                                    }`}
                                title="Toggle phonetic / furigana reading guide"
                            >
                                <span>Phonetics</span>
                            </button>
                        </div>
                    </div>

                    {/* Story Header Card */}
                    <header className="text-center space-y-2 py-3">
                        <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                            <span>{activeStory?.category}</span>
                            <span>•</span>
                            <span>{activeStory?.readTimeMinutes} min calm read</span>
                        </div>

                        <h1
                            id="active-story-title"
                            className="font-serif text-[32px] sm:text-[40px] font-normal text-primary-foreground leading-tight"
                        >
                            {activeStory?.title}
                        </h1>

                        <div className="text-sm font-medium text-muted-foreground tracking-wide">
                            {activeStory?.nativeTitle}
                        </div>
                    </header>

                    {/* Paragraphs Stream */}
                    <div className="space-y-6 pt-2">
                        <section
                            key={activeParagraph?.id}
                            id={`passage-${activeParagraph?.id}`}
                            className="relative space-y-3.5 overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-soft transition-colors sm:p-7"
                        >
                            {/* Top passage indicator & Audio button */}
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span className="text-[11px] font-mono">§ {storyIndex + 1}</span>

                                <button
                                    type="button"
                                    // onClick={() => handleSpeakText(para.text, para.id)}
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs transition-colors cursor-pointer border ${isSpeakingThis
                                        ? 'bg-accent text-primary border-primary/40 animate-pulse'
                                        : 'bg-card text-muted-foreground hover:text-primary-foreground border-border'
                                        }`}
                                    title="Listen to tranquil pronunciation"
                                >
                                    <Volume2 className="w-3.5 h-3.5" />
                                    <span>{isSpeakingThis ? 'Listening...' : 'Listen'}</span>
                                </button>
                            </div>

                            {/* Target Language Main Text */}
                            <div
                                className={`font-serif text-foreground tracking-wide selection:bg-card ${getFontSizeClasses()}`}
                            >
                                {/* Highlight interactive vocabulary words if present */}
                                {activeParagraph?.vocabulary && activeParagraph.vocabulary.length > 0 ? (
                                    <span>
                                        {activeParagraph.text}
                                    </span>
                                ) : (
                                    activeParagraph?.text
                                )}
                            </div>

                            {/* Phonetic / Furigana Guide */}
                            {showPhonetics && activeParagraph?.phonetic && (
                                <div className="text-xs sm:text-[13px] text-foreground font-mono leading-relaxed bg-card border border-border rounded-xl px-3.5 py-2">
                                    {activeParagraph?.phonetic}
                                </div>
                            )}

                            {/* Native English Translation */}
                            {showAllTranslations && (
                                <div className="text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border pt-3">
                                    {activeParagraph?.translation}
                                </div>
                            )}

                            {/* Interactive Vocabulary Chips */}
                            {activeParagraph?.vocabulary && activeParagraph.vocabulary.length > 0 && (
                                <div className="pt-2 border-t border-border">
                                    <div className="text-[10px] uppercase font-semibold text-foreground tracking-wider mb-2">
                                        Key Words (Tap to inspect)
                                    </div>

                                    <div className="flex flex-wrap gap-1.5">
                                        {activeParagraph.vocabulary.map((vocab) => {
                                            const isSelected =
                                                activeVocab?.vocab.word === vocab.word &&
                                                activeVocab?.paragraphId === activeParagraph.id;

                                            return (
                                                <button
                                                    key={vocab.word}
                                                    type="button"
                                                    onClick={() => {
                                                        sound.playPebbleTap(progress.soundEnabled);
                                                        setActiveVocab(
                                                            isSelected ? null : { vocab, paragraphId: activeParagraph?.id }
                                                        );
                                                    }}
                                                    className={`px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer border ${isSelected
                                                        ? 'bg-card text-foreground font-semibold border-border'
                                                        : 'bg-card text-foreground hover:text-foreground border-border'
                                                        }`}
                                                >
                                                    {vocab.word}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Active Vocabulary Popover / Inset */}
                            {activeVocab && activeVocab.paragraphId === activeParagraph?.id && (
                                <div
                                    id="vocab-inspector-box"
                                    className="mt-3 bg-card border border-border rounded-2xl p-3.5 text-xs space-y-2.5 animate-in fade-in"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-baseline gap-2">
                                            <span className="font-serif text-base text-primary-foreground font-medium">
                                                {activeVocab.vocab.word}
                                            </span>
                                            {activeVocab.vocab.phonetic && (
                                                <span className="text-[11px] text-foreground font-mono">
                                                    [{activeVocab.vocab.phonetic}]
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-1.5">
                                            <button
                                                type="button"
                                                // onClick={() =>
                                                //     handleSpeakText(activeVocab.vocab.word, `vocab-${activeVocab.vocab.word}`)
                                                // }
                                                className="p-1 rounded-md bg-card text-primary hover:bg-card cursor-pointer"
                                                title="Listen to word"
                                            >
                                                <Volume2 className="w-3.5 h-3.5" />
                                            </button>

                                            <button
                                                type="button"
                                                // onClick={() => handleAddWordToGarden(activeVocab.vocab)}
                                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-card hover:bg-card text-primary text-[11px] font-medium transition-colors cursor-pointer border border-border"
                                            >
                                                <Plus className="w-3 h-3" />
                                                <span>Add to Garden</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="text-xs text-foreground">
                                        <span className="text-muted-foreground mr-1.5">Meaning:</span>
                                        <span className="font-medium">{activeVocab.vocab.translation}</span>
                                    </div>

                                    {activeVocab.vocab.note && (
                                        <div className="text-[11px] text-foreground">
                                            {activeVocab.vocab.note}
                                        </div>
                                    )}
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Mindful Reflection & Comprehension Check */}
                    <section
                        id="story-reflection-card"
                        className="relative mt-8 space-y-4 overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-7"
                    >
                        <div className="lang-wash pointer-events-none absolute inset-0 opacity-20" aria-hidden />
                        <div className="relative flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>Mindful Reflection</span>
                        </div>

                        <h3 className="relative text-base font-medium leading-snug text-foreground sm:text-lg">
                            {activeStory?.reflection.question}
                        </h3>

                        <div className="space-y-2">
                            {activeStory?.reflection.options.map((option, optIdx) => {
                                const isSelected = selectedAnswerIdx === optIdx;
                                const isCorrect = optIdx === activeStory?.reflection.correctIndex;
                                const showResult = selectedAnswerIdx !== null;

                                let cardStyle = 'border-border bg-background hover:bg-muted text-foreground';
                                if (showResult) {
                                    if (isCorrect) {
                                        cardStyle = 'border-primary/40 bg-accent text-primary';
                                    } else if (isSelected && !isCorrect) {
                                        cardStyle = 'border-border bg-muted text-muted-foreground opacity-70';
                                    }
                                }

                                return (
                                    <button
                                        key={option}
                                        type="button"
                                        // onClick={() => handleSelectAnswer(optIdx)}
                                        disabled={showResult}
                                        className={`w-full text-left p-3.5 rounded-2xl text-xs sm:text-sm border transition-all cursor-pointer flex items-center justify-between gap-3 ${cardStyle}`}
                                    >
                                        <span>{option}</span>
                                        {showResult && isCorrect && (
                                            <Check className="w-4 h-4 text-primary shrink-0" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Reflection Feedback & Zen Affirmation */}
                        {selectedAnswerIdx !== null && (
                            <div className="pt-2 space-y-3 animate-in fade-in">
                                <div className="rounded-2xl border border-border bg-background p-3.5 text-xs leading-relaxed text-muted-foreground">
                                    <span className="font-semibold text-foreground">Insight: </span>
                                    {activeStory?.reflection.explanation}
                                </div>

                                <div className="space-y-1 rounded-2xl border border-border bg-background p-4 text-center">
                                    <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                                        Zen Takeaway
                                    </div>
                                    <p className="font-serif text-sm sm:text-base text-foreground italic">
                                        "{activeStory?.reflection.zenAffirmation}"
                                    </p>
                                </div>

                                {!hasCompletedActiveStory ? (
                                    <button
                                        id="claim-story-reward-btn"
                                        type="button"
                                        // onClick={handleCompleteStory}
                                        className="mt-2 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-xs transition-all hover:bg-primary/90 active:scale-[0.99]"
                                    >
                                        <Sparkles className="h-4 w-4" />
                                        <span>Complete Passage · +{activeStory?.xpReward} XP</span>
                                    </button>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 pt-3 text-center">
                                        <CairnMascot
                                            className="h-14 w-auto"
                                            mood="celebrate"
                                            label="Cairn celebrates a finished passage"
                                        />
                                        <div className="inline-flex items-center gap-1.5 text-xs text-primary">
                                            <CheckCircle2 className="h-4 w-4 text-primary" />
                                            <span>Passage completed & recorded in your journey</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </section>

                    {/* Bottom Navigation */}
                    <div className="relative flex items-center justify-between pb-4 pt-6">
                        <button
                            id="finish-reading-return-shelf-btn"
                            type="button"
                            onClick={() => {
                                sound.playPebbleTap(progress.soundEnabled);
                                prevStory();
                            }}
                            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Prev</span>
                        </button>

                        <button
                            id="return-sanctuary-from-reader-btn"
                            type="button"
                            onClick={() => {
                                sound.playPebbleTap(progress.soundEnabled);
                                nextStory();
                            }}
                            className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-primary transition-colors hover:text-primary/80"
                        >
                            <span>Next</span>
                            <span>→</span>
                        </button>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default ReadingManager;
