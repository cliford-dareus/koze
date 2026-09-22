"use client";

import { Dialog, DialogContent } from "@/app/_components/ui/dialog";
import { Drawer, DrawerContent } from "@/app/_components/ui/drawer";
import { ListeningTrack } from "@/data/listening-tracks";
import { StoryVocabulary } from "@/data/reading-stories";
import { LanguageOption } from "@/lib/languages";
import { ProgressState } from "@/lib/progress";
import { sound } from "@/lib/sound";
import { speak, stopSpeaking } from "@/lib/speech";
import { CheckCircle2, Eye, EyeOff, Headphones, Info, Pause, Play, Plus, RotateCcw, SkipBack, SkipForward, Volume2, Wind } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
    activeTrackId: string | null;
    setActiveTrackId: (id: string | null) => void;
    progress: ProgressState;
    activeTrack: ListeningTrack | undefined;
    completedListeningIds: string[];
    currentLanguage: LanguageOption;
};

const ListeningManager = ({ activeTrackId, setActiveTrackId, progress, activeTrack, completedListeningIds, currentLanguage }: Props) => {
    // Audio Playback state
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentLineIndex, setCurrentLineIndex] = useState<number>(0);
    const [audioSpeed, setAudioSpeed] = useState<number>(0.9); // 0.75, 0.9, 1.0
    const [ambientSoundActive, setAmbientSoundActive] = useState<boolean>(false);
    const [focusMode, setFocusMode] = useState<'immersion' | 'guided' | 'bilingual'>('guided');
    const [peekImmersion, setPeekImmersion] = useState(false);

    // Vocab Inspection & Reflection
    const [activeVocab, setActiveVocab] = useState<{
        vocab: StoryVocabulary;
        lineId: string;
    } | null>(null);
    const [selectedAnswerIdx, setSelectedAnswerIdx] = useState<number | null>(null);

    // Animation pulse state for audio wave
    const [waveHeight, setWaveHeight] = useState<number[]>([40, 60, 30, 80, 50, 70, 45]);

    // Waveform animation ticker when audio is actively playing
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isPlaying) {
            interval = setInterval(() => {
                setWaveHeight(
                    Array.from({ length: 7 }, () => Math.floor(Math.random() * 55) + 25)
                );
            }, 180);
        } else {
            setWaveHeight([20, 25, 20, 30, 20, 25, 20]);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isPlaying]);

    // Speak a specific line by index
    const speakLine = async (lineIdx: number, continuous: boolean = true) => {
        if (!activeTrack || lineIdx < 0 || lineIdx >= activeTrack.lines.length) {
            stopSpeaking();
            return;
        }

        const line = activeTrack.lines[lineIdx];
        const speaker = activeTrack.speakers.find((s) => s.id === line.speakerId);

        setCurrentLineIndex(lineIdx);
        setIsPlaying(true);


        const u = await speak(line.text, currentLanguage.voice, audioSpeed, speaker?.pitch);
        if (!u) {
            setIsPlaying(false);
            return;
        }

        u.onstart = () => {
            setCurrentLineIndex(lineIdx);
            setIsPlaying(true);
        };

        u.onend = () => {
            if (continuous && lineIdx + 1 < activeTrack.lines.length) {
                // Natural conversational pause between speakers
                setTimeout(() => {
                    speakLine(lineIdx + 1, true);
                }, 650);
            } else {
                setIsPlaying(false);
            }
        }

        u.onerror = () => {
            setIsPlaying(false);
        };
    };

    const handleStepLine = (direction: 'prev' | 'next') => {
        if (!activeTrack) return;
        sound.playPebbleTap(progress.soundEnabled);
        stopSpeaking();

        let newIdx = currentLineIndex;
        if (direction === 'prev') {
            newIdx = Math.max(0, currentLineIndex - 1);
        } else {
            newIdx = Math.min(activeTrack.lines.length - 1, currentLineIndex + 1);
        }
        setCurrentLineIndex(newIdx);
        speakLine(newIdx, false);
    };

    // Play / Pause Master Button
    const handleTogglePlay = () => {
        if (!activeTrack) return;
        sound.playPebbleTap(progress.soundEnabled);

        if (isPlaying) {
            stopSpeaking();
        } else {
            // If at end of lines, start from top; otherwise continue from currentLineIndex
            const targetIdx = currentLineIndex >= activeTrack.lines.length - 1 ? 0 : currentLineIndex;
            speakLine(targetIdx, true);
        }
    };

    const handleReplayCurrentLine = () => {
        if (!activeTrack) return;
        sound.playPebbleTap(progress.soundEnabled);
        stopSpeaking();
        speakLine(currentLineIndex, false);
    };

    const handleSelectLineToPlay = (idx: number) => {
        sound.playPebbleTap(progress.soundEnabled);
        stopSpeaking();
        setCurrentLineIndex(idx);
        speakLine(idx, false);
    };

    const isCurrentTrackCompleted = activeTrack
        ? completedListeningIds.includes(activeTrack.id)
        : false;

    // Render dialogue line text with clickable highlighted vocabulary
    const renderLineTextWithVocab = (
        text: string,
        vocabList?: StoryVocabulary[],
        lineId?: string
    ) => {
        if (!vocabList || vocabList.length === 0) {
            return text;
        }

        const sortedVocab = [...vocabList].sort((a, b) => b.word.length - a.word.length);
        const escapedWords = sortedVocab.map((v) =>
            v.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        );
        const regex = new RegExp(`(${escapedWords.join('|')})`, 'g');

        const parts = text.split(regex);
        return (
            <span>
                {parts.map((part, index) => {
                    const matchingVocab = sortedVocab.find((v) => v.word === part);
                    if (matchingVocab) {
                        const isSelected =
                            activeVocab?.vocab.word === matchingVocab.word &&
                            activeVocab?.lineId === lineId;
                        return (
                            <button
                                key={index}
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    sound.playPebbleTap(progress.soundEnabled);
                                    setActiveVocab(
                                        isSelected
                                            ? null
                                            : { vocab: matchingVocab, lineId: lineId || '' }
                                    );
                                }}
                                className={`inline underline decoration-dotted decoration-[#7FA98D] underline-offset-4 cursor-pointer transition-all px-0.5 rounded text-left ${isSelected
                                    ? 'bg-card text-[#BEE3C8] font-medium'
                                    : 'text-foreground hover:text-[#BEE3C8] hover:bg-background'
                                    }`}
                                title={`Inspect "${matchingVocab.word}" (${matchingVocab.translation})`}
                            >
                                {part}
                            </button>
                        );
                    }
                    return <span key={index}>{part}</span>;
                })}
            </span>
        );
    };

    return (
        <Drawer open={!!activeTrackId} onOpenChange={() => setActiveTrackId(null)}>
            <DrawerContent className="min-h-screen h-full">
                <div className="p-4 h-full overflow-y-auto">
                    <div className="bg-background border border-border rounded-2xl p-4 sm:p-5 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-medium text-[#7D8F82] bg-background px-2.5 py-0.5 rounded-full border border-border">
                                        {activeTrack?.category}
                                    </span>
                                    <span className="text-xs text-[#70756F] capitalize">
                                        {activeTrack?.level} level • {activeTrack?.durationMinutes} min
                                    </span>
                                    {isCurrentTrackCompleted && (
                                        <span className="text-[11px] text-[#A8D3B6] flex items-center gap-1">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            <span>Absorbed</span>
                                        </span>
                                    )}
                                </div>
                                <h2 className="font-serif text-2xl font-normal text-foreground mt-1.5">
                                    {activeTrack?.title}
                                </h2>
                                <p className="font-serif text-sm text-muted-foreground mt-0.5">
                                    {activeTrack?.nativeTitle}
                                </p>
                            </div>

                            {/* Right controls: Ambient sound toggle & Speed */}
                            <div className="flex items-center gap-2 flex-wrap">
                                {/* Ambient sound generator */}
                                <button
                                    id="listening-ambient-toggle-btn"
                                    type="button"
                                    // onClick={handleToggleAmbient}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all border ${ambientSoundActive
                                        ? 'bg-card text-[#BEE3C8] border-[#3B5441] shadow-xs'
                                        : 'bg-background text-muted-foreground hover:text-foreground border-border'
                                        }`}
                                    title="Toggle background ambient atmosphere (rustling wind/tea rain)"
                                >
                                    <Wind className="w-3.5 h-3.5" />
                                    <span>{ambientSoundActive ? 'Atmosphere On' : 'Atmosphere'}</span>
                                </button>

                                {/* Audio Speed Selector */}
                                <div className="flex items-center rounded-full bg-background border border-border p-0.5 text-xs">
                                    {[0.75, 0.9, 1.0].map((rate) => (
                                        <button
                                            key={rate}
                                            type="button"
                                            onClick={() => {
                                                sound.playPebbleTap(progress.soundEnabled);
                                                setAudioSpeed(rate);
                                            }}
                                            className={`px-2 py-0.5 rounded-full cursor-pointer transition-all ${audioSpeed === rate
                                                ? 'bg-card text-foreground font-medium'
                                                : 'text-muted-foreground hover:text-foreground'
                                                }`}
                                        >
                                            {rate}x
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Cultural atmosphere note */}
                        <div className="text-xs text-muted-foreground bg-background rounded-xl p-3 border border-border flex items-start gap-2.5">
                            <Info className="w-4 h-4 text-[#7FA98D] shrink-0 mt-0.5" />
                            <div>
                                <span className="font-semibold text-primary">Acoustic Atmosphere: </span>
                                <span>{activeTrack?.soundscapeDescription}</span>
                            </div>
                        </div>

                        {/* Focus Mode Tabs */}
                        <div className="flex items-center justify-between pt-1 border-t border-border flex-wrap gap-2">
                            <div className="text-[11px] uppercase font-semibold text-muted-foreground">
                                Listening Mode:
                            </div>
                            <div className="flex items-center gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => {
                                        sound.playPebbleTap(progress.soundEnabled);
                                        setFocusMode('immersion');
                                    }}
                                    className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${focusMode === 'immersion'
                                        ? 'bg-card text-primary font-semibold border border-[#3A4F3E]'
                                        : 'bg-background text-muted-foreground hover:text-foreground border border-border'
                                        }`}
                                >
                                    🎧 Pure Immersion
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        sound.playPebbleTap(progress.soundEnabled);
                                        setFocusMode('guided');
                                    }}
                                    className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${focusMode === 'guided'
                                        ? 'bg-card text-primary font-semibold border border-[#3A4F3E]'
                                        : 'bg-background text-muted-foreground hover:text-foreground border border-border'
                                        }`}
                                >
                                    📜 Guided Dialogue
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        sound.playPebbleTap(progress.soundEnabled);
                                        setFocusMode('bilingual');
                                    }}
                                    className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${focusMode === 'bilingual'
                                        ? 'bg-card text-primary font-semibold border border-[#3A4F3E]'
                                        : 'bg-background text-muted-foreground hover:text-foreground border border-border'
                                        }`}
                                >
                                    🌐 Bilingual Harmony
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ================= AUDIO PLAYER CONTROLS DOCK ================= */}
                    <div
                        id="listening-audio-player-bar"
                        className="bg-background border border-border rounded-2xl p-4 mt-4 sm:p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                        {/* Left: Active speaker indicator and wave pulses */}
                        <div className="flex items-center gap-3.5">
                            <div className="w-12 h-12 rounded-2xl bg-card border border-border flex items-center justify-center text-xl shrink-0">
                                {activeTrack?.speakers.find(
                                    (s) => s.id === activeTrack.lines[currentLineIndex]?.speakerId
                                )?.avatar || '🎧'}
                            </div>
                            <div>
                                <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                    <span>
                                        {activeTrack?.speakers.find(
                                            (s) => s.id === activeTrack?.lines[currentLineIndex]?.speakerId
                                        )?.name}
                                    </span>
                                    <span className="text-muted-foreground font-normal text-[11px]">
                                        ({activeTrack?.speakers.find(
                                            (s) => s.id === activeTrack?.lines[currentLineIndex]?.speakerId
                                        )?.role})
                                    </span>
                                </div>
                                <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                                    <span>
                                        Line {currentLineIndex + 1} of {activeTrack?.lines.length}
                                    </span>
                                    <span>•</span>
                                    <span className="text-muted-foreground italic">
                                        {activeTrack?.lines[currentLineIndex]?.tonePrompt || 'Natural dialogue'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Center: Audio Waveform Equalizer Display */}
                        <div className="flex items-center gap-1 h-8 px-3">
                            {waveHeight.map((h, i) => (
                                <div
                                    key={i}
                                    className="w-1 rounded-full bg-[#7FA98D] transition-all duration-150"
                                    style={{
                                        height: `${h}%`,
                                        opacity: isPlaying ? 0.9 : 0.3,
                                    }}
                                />
                            ))}
                        </div>

                        {/* Right: Master playback buttons */}
                        <div className="flex items-center gap-2 self-center sm:self-auto">
                            <button
                                id="listening-step-prev-btn"
                                type="button"
                                onClick={() => handleStepLine('prev')}
                                disabled={currentLineIndex === 0}
                                className="p-2 rounded-full bg-background hover:bg-card text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors border border-border"
                                title="Previous line"
                            >
                                <SkipBack className="w-4 h-4" />
                            </button>

                            <button
                                id="listening-master-play-pause-btn"
                                type="button"
                                onClick={handleTogglePlay}
                                className="px-5 py-2.5 rounded-full  bg-inherit hover:bg-card text-foreground border border-border font-semibold text-xs transition-all shadow-md hover:scale-105 cursor-pointer flex items-center gap-2"
                            >
                                {isPlaying ? (
                                    <>
                                        <Pause className="w-4 h-4 fill-current" />
                                        <span>Pause</span>
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-4 h-4 fill-current" />
                                        <span>{currentLineIndex > 0 ? 'Resume' : 'Play Track'}</span>
                                    </>
                                )}
                            </button>

                            <button
                                id="listening-step-next-btn"
                                type="button"
                                onClick={() => handleStepLine('next')}
                                disabled={currentLineIndex >= (activeTrack as ListeningTrack)?.lines.length - 1}
                                className="p-2 rounded-full bg-background hover:bg-card text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors border border-border"
                                title="Next line"
                            >
                                <SkipForward className="w-4 h-4" />
                            </button>

                            <button
                                id="listening-replay-line-btn"
                                type="button"
                                onClick={handleReplayCurrentLine}
                                className="p-2 rounded-full bg-background hover:bg-card text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors border border-border"
                                title="Replay current line"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* ================= MODE 1: PURE IMMERSION ================= */}
                    {focusMode === 'immersion' && (
                        <div className="bg-background border border-border mt-4 rounded-3xl p-8 sm:p-12 text-center space-y-6">
                            <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                                {/* Glowing breathing rings */}
                                <div
                                    className={`absolute inset-0 rounded-full border border-border transition-all duration-1000 ${isPlaying
                                        ? 'animate-ping opacity-25 scale-110'
                                        : 'opacity-10 scale-100'
                                        }`}
                                />
                                <div
                                    className={`w-28 h-28 rounded-full bg-background border border-border flex items-center justify-center transition-transform duration-700 ${isPlaying ? 'scale-105 shadow-2xl' : 'scale-95'
                                        }`}
                                >
                                    <Headphones
                                        className={`w-10 h-10 text-[#A5C9B1] transition-transform ${isPlaying ? 'scale-110' : 'scale-100'
                                            }`}
                                    />
                                </div>
                            </div>

                            <div className="max-w-md mx-auto space-y-2">
                                <h3 className="font-serif text-xl font-normal text-foreground">
                                    Pure Auditory Presence
                                </h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Text is hidden so your ears absorb intonation, pitch variation,
                                    and breath without reading reflexes. Close your eyes and breathe.
                                </p>
                            </div>

                            {/* Peek Transcript toggle button */}
                            <div className="pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        sound.playPebbleTap(progress.soundEnabled);
                                        setPeekImmersion(!peekImmersion);
                                    }}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background hover:bg-[#1E201C] border border-[#272926] text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                                >
                                    {peekImmersion ? (
                                        <>
                                            <EyeOff className="w-3.5 h-3.5" />
                                            <span>Hide Peek Transcript</span>
                                        </>
                                    ) : (
                                        <>
                                            <Eye className="w-3.5 h-3.5" />
                                            <span>Peek at Current Line</span>
                                        </>
                                    )}
                                </button>

                                {peekImmersion && (
                                    <div className="mt-4 p-4 rounded-2xl bg-background border border-border max-w-lg mx-auto text-left space-y-2 animate-fade-in">
                                        <div className="text-[11px] text-primary font-medium">
                                            Speaker:{' '}
                                            {
                                                activeTrack?.speakers.find(
                                                    (s) =>
                                                        s.id === activeTrack?.lines[currentLineIndex]?.speakerId
                                                )?.name
                                            }
                                        </div>
                                        <div className="font-serif text-base text-foreground">
                                            {activeTrack?.lines[currentLineIndex]?.text}
                                        </div>
                                        {activeTrack?.lines[currentLineIndex]?.phonetic && (
                                            <div className="text-xs text-[#8E9E92] font-mono">
                                                {activeTrack?.lines[currentLineIndex]?.phonetic}
                                            </div>
                                        )}
                                        <div className="text-xs text-muted-foreground">
                                            {activeTrack?.lines[currentLineIndex]?.translation}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ================= MODE 2 & 3: GUIDED DIALOGUE & BILINGUAL ================= */}
                    {focusMode !== 'immersion' && (
                        <div className="my-4">
                            {activeTrack?.lines.map((line, idx) => {
                                const speaker = activeTrack?.speakers.find(
                                    (s) => s.id === line.speakerId
                                );
                                const isCurrent = currentLineIndex === idx;

                                return (
                                    <div
                                        key={line.id}
                                        id={`line-card-${line.id}`}
                                        onClick={() => handleSelectLineToPlay(idx)}
                                        className={`group rounded-2xl p-5 border mt-4 transition-all cursor-pointer ${isCurrent
                                            ? 'bg-card border-[#395240] shadow-md'
                                            : 'bg-background hover:bg-card border-border'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-center gap-2.5">
                                                <span className="text-xl">{speaker?.avatar || '👤'}</span>
                                                <div>
                                                    <span className="text-xs font-semibold text-[#ECEBE6]">
                                                        {speaker?.name}
                                                    </span>
                                                    <span className="text-[11px] text-[#70756F] ml-1.5">
                                                        {speaker?.role}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {isCurrent && isPlaying && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#293B2F] text-[10px] text-[#A8D3B6] animate-pulse">
                                                        <Volume2 className="w-3 h-3" />
                                                        <span>Speaking</span>
                                                    </span>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleSelectLineToPlay(idx);
                                                    }}
                                                    className="p-1.5 rounded-lg text-muted group-hover:text-foreground hover:bg-[#252824] transition-colors"
                                                    title="Play this line"
                                                >
                                                    <Play className="w-3.5 h-3.5 fill-current" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Main text with underlined interactive vocabulary words */}
                                        <div className="mt-3.5 font-serif text-lg sm:text-xl text-foreground leading-relaxed">
                                            {renderLineTextWithVocab(
                                                line.text,
                                                line.vocabulary,
                                                line.id
                                            )}
                                        </div>

                                        {/* Phonetic guide */}
                                        {line.phonetic && (
                                            <div className="mt-1 text-xs text-muted-foreground font-mono tracking-wide">
                                                {line.phonetic}
                                            </div>
                                        )}

                                        {/* English translation (Always shown in bilingual, or when active in guided) */}
                                        {(focusMode === 'bilingual' || isCurrent) && (
                                            <div className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-[#252824] pt-2">
                                                {line.translation}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* ================= VOCABULARY INSPECTION MODAL ================= */}
                    <Dialog open={!!activeVocab} onOpenChange={() => setActiveVocab(null)}>
                        <DialogContent className="w-[90%] bg-[#1C211D] border border-[#344537] rounded-2xl p-5 shadow-2xl animate-fade-in">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <div className="text-[10px] uppercase font-semibold text-[#7FA98D] tracking-wider">
                                        Heard in Dialogue
                                    </div>
                                    <h4 className="font-serif text-2xl text-[#ECEBE6] mt-0.5">
                                        {activeVocab?.vocab.word}
                                    </h4>
                                    {activeVocab?.vocab.phonetic && (
                                        <div className="text-xs text-[#8EA092] font-mono mt-0.5">
                                            {activeVocab.vocab.phonetic}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            sound.playPebbleTap(progress.soundEnabled);
                                            if (
                                                typeof window !== 'undefined' &&
                                                'speechSynthesis' in window
                                            ) {
                                                const utt = new SpeechSynthesisUtterance(
                                                    activeVocab?.vocab.word
                                                );
                                                utt.lang = currentLanguage.voice;
                                                utt.rate = 0.85;
                                                window.speechSynthesis.speak(utt);
                                            }
                                        }}
                                        className="p-2 rounded-full bg-[#252E27] hover:bg-[#303B32] text-[#A8D3B6] cursor-pointer transition-colors border border-[#37493A]"
                                        title="Pronounce word"
                                    >
                                        <Volume2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="mt-3 pt-3 border-t border-[#2A362D] space-y-1.5">
                                <div className="text-sm font-medium text-[#ECEBE6]">
                                    "{activeVocab?.vocab.translation}"
                                </div>
                                {activeVocab?.vocab.note && (
                                    <div className="text-xs text-[#8A968B] italic">
                                        Cultural Note: {activeVocab?.vocab.note}
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 flex items-center justify-end">
                                <button
                                    type="button"
                                    // onClick={() => handleAddToWordGarden(activeVocab?.vocab)}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#2E4133] hover:bg-[#3A5240] text-[#BEE3C8] text-xs font-semibold transition-all cursor-pointer border border-[#435F4B] shadow-xs"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Add to Word Garden</span>
                                </button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default ListeningManager;
