"use client";

import { Drawer, DrawerContent } from "@/app/_components/ui/drawer";
import { ReadingStory, StoryVocabulary } from "@/data/reading-stories";
import { ProgressState } from "@/lib/progress";
import { sound } from "@/lib/sound";
import { ArrowLeft, Check, CheckCircle2, Eye, EyeOff, Plus, Sparkles, Volume2 } from "lucide-react";
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
                <div className="p-4 h-full overflow-y-auto">
                    {/* Reader Controls Toolbar */}
                    <div
                        id="reader-toolbar"
                        className="bg-background border border-border rounded-[22px] p-3 flex items-center justify-between flex-wrap gap-2 text-xs"
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
                                    className={`px-2 py-1 rounded-lg text-xs transition-colors cursor-pointer ${fontSize === sz
                                        ? 'bg-[#272926] text-[#F3F2EE] font-semibold border border-[#3A3D36]'
                                        : 'text-[#70756F] hover:text-[#ECEBE6]'
                                        }`}
                                >
                                    {sz === 'normal' ? 'A' : sz === 'comfortable' ? 'A+' : 'A++'}
                                </button>
                            ))}
                        </div>

                        {/* Audio Speed Switcher */}
                        <div className="flex items-center gap-1">
                            <span className="text-[11px] text-[#70756F] mr-1 hidden sm:inline">Audio:</span>
                            <button
                                type="button"
                                onClick={() => {
                                    sound.playPebbleTap(progress.soundEnabled);
                                    setAudioSpeed((prev) => (prev === 1.0 ? 0.8 : 1.0));
                                }}
                                className="px-2 py-1 rounded-lg text-xs bg-[#161715] hover:bg-[#20221E] border border-[#272825] text-[#D8DED5] transition-colors cursor-pointer"
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
                                    ? 'bg-[#232924] text-[#A8D3B6] border-[#36483C]'
                                    : 'bg-[#161715] text-[#70756F] border-[#272825]'
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
                                    ? 'bg-[#26241C] text-[#D8C79D] border-[#443E2C]'
                                    : 'bg-[#161715] text-[#70756F] border-[#272825]'
                                    }`}
                                title="Toggle phonetic / furigana reading guide"
                            >
                                <span>Phonetics</span>
                            </button>
                        </div>
                    </div>

                    {/* Story Header Card */}
                    <header className="text-center space-y-2 py-3">
                        <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-wider text-[#70756F] font-semibold">
                            <span>{activeStory?.category}</span>
                            <span>•</span>
                            <span>{activeStory?.readTimeMinutes} min calm read</span>
                        </div>

                        <h1
                            id="active-story-title"
                            className="font-serif text-[32px] sm:text-[40px] font-normal text-[#F3F2EE] leading-tight"
                        >
                            {activeStory?.title}
                        </h1>

                        <div className="text-sm font-medium text-[#8E948A] tracking-wide">
                            {activeStory?.nativeTitle}
                        </div>
                    </header>

                    {/* Paragraphs Stream */}
                    <div className="space-y-6 pt-2">
                        <section
                            key={activeParagraph?.id}
                            id={`passage-${activeParagraph?.id}`}
                            className="relative bg-background border border-border rounded-[26px] p-5 sm:p-7 shadow-xs space-y-3.5 transition-colors"
                        >
                            {/* Top passage indicator & Audio button */}
                            <div className="flex items-center justify-between text-xs text-[#61665D]">
                                <span className="text-[11px] font-mono">§ {storyIndex + 1}</span>

                                <button
                                    type="button"
                                    // onClick={() => handleSpeakText(para.text, para.id)}
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs transition-colors cursor-pointer border ${isSpeakingThis
                                        ? 'bg-[#2E3C32] text-[#A8D3B6] border-[#486350] animate-pulse'
                                        : 'bg-[#161715] text-[#868B82] hover:text-[#F3F2EE] border-[#272825]'
                                        }`}
                                    title="Listen to tranquil pronunciation"
                                >
                                    <Volume2 className="w-3.5 h-3.5" />
                                    <span>{isSpeakingThis ? 'Listening...' : 'Listen'}</span>
                                </button>
                            </div>

                            {/* Target Language Main Text */}
                            <div
                                className={`font-serif text-foreground tracking-wide selection:bg-[#2C332A] ${getFontSizeClasses()}`}
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
                                <div className="text-xs sm:text-[13px] text-[#A1A69D] font-mono leading-relaxed bg-[#151614] border border-[#222420] rounded-xl px-3.5 py-2">
                                    {activeParagraph?.phonetic}
                                </div>
                            )}

                            {/* Native English Translation */}
                            {showAllTranslations && (
                                <div className="text-xs sm:text-sm text-[#70756F] leading-relaxed border-t border-[#262824] pt-3">
                                    {activeParagraph?.translation}
                                </div>
                            )}

                            {/* Interactive Vocabulary Chips */}
                            {activeParagraph?.vocabulary && activeParagraph.vocabulary.length > 0 && (
                                <div className="pt-2 border-t border-[#222420]">
                                    <div className="text-[10px] uppercase font-semibold text-[#5A5F56] tracking-wider mb-2">
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
                                                        ? 'bg-[#EAE8E0] text-[#161715] font-semibold border-[#EAE8E0]'
                                                        : 'bg-[#161715] text-[#9EA399] hover:text-[#ECEBE6] border-[#272825]'
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
                                    className="mt-3 bg-[#171816] border border-[#2E302C] rounded-2xl p-3.5 text-xs space-y-2.5 animate-in fade-in"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-baseline gap-2">
                                            <span className="font-serif text-base text-[#F3F2EE] font-medium">
                                                {activeVocab.vocab.word}
                                            </span>
                                            {activeVocab.vocab.phonetic && (
                                                <span className="text-[11px] text-[#A1A69D] font-mono">
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
                                                className="p-1 rounded-md bg-[#222421] text-[#A8D3B6] hover:bg-[#2A2D29] cursor-pointer"
                                                title="Listen to word"
                                            >
                                                <Volume2 className="w-3.5 h-3.5" />
                                            </button>

                                            <button
                                                type="button"
                                                // onClick={() => handleAddWordToGarden(activeVocab.vocab)}
                                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#253328] hover:bg-[#324536] text-[#A8D3B6] text-[11px] font-medium transition-colors cursor-pointer border border-[#3A4B3D]"
                                            >
                                                <Plus className="w-3 h-3" />
                                                <span>Add to Garden</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="text-xs text-[#ECEBE6]">
                                        <span className="text-[#70756F] mr-1.5">Meaning:</span>
                                        <span className="font-medium">{activeVocab.vocab.translation}</span>
                                    </div>

                                    {activeVocab.vocab.note && (
                                        <div className="text-[11px] text-[#6E7369]">
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
                        className="bg-background border border-border rounded-[26px] p-5 sm:p-7 shadow-xs space-y-4 mt-8"
                    >
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#A5C9B1]">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Mindful Reflection</span>
                        </div>

                        <h3 className="text-base sm:text-lg font-medium text-[#ECEBE6] leading-snug">
                            {activeStory?.reflection.question}
                        </h3>

                        <div className="space-y-2">
                            {activeStory?.reflection.options.map((option, optIdx) => {
                                const isSelected = selectedAnswerIdx === optIdx;
                                const isCorrect = optIdx === activeStory?.reflection.correctIndex;
                                const showResult = selectedAnswerIdx !== null;

                                let cardStyle = 'bg-[#161715] hover:bg-[#20221E] border-[#272825] text-[#B5B9B2]';
                                if (showResult) {
                                    if (isCorrect) {
                                        cardStyle = 'bg-[#1E2B21] border-[#39533F] text-[#C2E5CD]';
                                    } else if (isSelected && !isCorrect) {
                                        cardStyle = 'bg-[#291B1D] border-[#52292E] text-[#E5A7AD]';
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
                                            <Check className="w-4 h-4 text-[#A8D3B6] shrink-0" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Reflection Feedback & Zen Affirmation */}
                        {selectedAnswerIdx !== null && (
                            <div className="pt-2 space-y-3 animate-in fade-in">
                                <div className="text-xs text-[#8A9085] leading-relaxed bg-[#161715] border border-[#272825] rounded-2xl p-3.5">
                                    <span className="font-semibold text-[#D8DED5]">Insight: </span>
                                    {activeStory?.reflection.explanation}
                                </div>

                                <div className="bg-[#1D2520] border border-[#35483B] rounded-2xl p-4 text-center space-y-1">
                                    <div className="text-[11px] font-semibold tracking-wider uppercase text-[#88B897]">
                                        Zen Takeaway
                                    </div>
                                    <p className="font-serif text-sm sm:text-base text-[#D7EADE] italic">
                                        "{activeStory?.reflection.zenAffirmation}"
                                    </p>
                                </div>

                                {!hasCompletedActiveStory ? (
                                    <button
                                        id="claim-story-reward-btn"
                                        type="button"
                                        // onClick={handleCompleteStory}
                                        className="w-full h-12 rounded-full bg-[#EAE8E0] hover:bg-white text-[#161715] font-semibold text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] mt-2"
                                    >
                                        <Sparkles className="w-4 h-4 text-[#161715]" />
                                        <span>Complete Passage & Claim +{activeStory?.xpReward} XP</span>
                                    </button>
                                ) : (
                                    <div className="text-center pt-2">
                                        <div className="inline-flex items-center gap-1.5 text-xs text-[#A8D3B6]">
                                            <CheckCircle2 className="w-4 h-4" />
                                            <span>Passage completed & peacefully recorded in your journey</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </section>

                    {/* Bottom Navigation */}
                    <div className="pt-4 pb-8 flex items-center justify-between">
                        <button
                            id="finish-reading-return-shelf-btn"
                            type="button"
                            onClick={() => {
                                sound.playPebbleTap(progress.soundEnabled);
                                prevStory();
                            }}
                            className="inline-flex items-center gap-1.5 text-xs text-[#70756F] hover:text-[#ECEBE6] transition-colors cursor-pointer"
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
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#EAE8E0] hover:text-white transition-colors cursor-pointer"
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
