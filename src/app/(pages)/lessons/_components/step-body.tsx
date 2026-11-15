"use client";

import { useEffect, useState } from "react";
import {
    PairItem,
    PairMatchingQuestion,
    type LessonStep,
} from "@/data/lessons";
import { Button } from "@/app/_components/ui/button";
import MicAudioVisualizer from "@/app/_components/mic-audio-visualizer";
import { speak } from "@/lib/speech";
import { sound } from "@/lib/sound";
import { MessageCircle, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LanguageOption } from "@/lib/languages";
import CairnMascot from "@/app/_components/cairn-mascot";

export function StepBody({
    step,
    selected,
    checked,
    spoke,
    onSelect,
    onSpoke,
    matchedPairIds,
    setMatchedPairIds,
    evaluation,
    selectedTokens,
    setSelectedTokens,
    availableTokens,
    setAvailableTokens,
    selectedOption,
    setSelectedOption,
    currentLanguage,
}: {
    step: LessonStep;
    selected: number | null;
    checked: boolean;
    spoke: boolean;
    onSelect: (i: number) => void;
    onSpoke: () => void;
    matchedPairIds: string[];
    setMatchedPairIds: (ids: string[]) => void;
    evaluation?: "correct" | "review" | "idle";
    selectedTokens: string[];
    setSelectedTokens: (tokens: string[]) => void;
    availableTokens: string[];
    setAvailableTokens: (tokens: string[]) => void;
    selectedOption: string | null;
    setSelectedOption: (option: string | null) => void;
    currentLanguage: LanguageOption | undefined;
}) {
    const [selectedForeignId, setSelectedForeignId] = useState<string | null>(null);
    const [selectedNativeId, setSelectedNativeId] = useState<string | null>(null);

    useEffect(() => {
        if (!step) return;

        if (step.type === "sentence-builder") {
            setAvailableTokens([...step.scrambledTokens]);
            setSelectedTokens([]);
        } else if (step.type === "pair-matching") {
            setMatchedPairIds([]);
            setSelectedForeignId(null);
            setSelectedNativeId(null);
        }
    }, [step]);

    const handleAddToken = (token: string, idx: number) => {
        sound.playPebbleTap(true);
        setSelectedTokens([...selectedTokens, token]);
        const nextAvail = [...availableTokens];
        nextAvail.splice(idx, 1);
        setAvailableTokens(nextAvail);
        if (nextAvail.length < 2) {
            onSelect(1);
        }
    };

    const handleRemoveToken = (token: string, idx: number) => {
        sound.playPebbleTap(true);
        const nextSelected = [...selectedTokens];
        nextSelected.splice(idx, 1);
        setSelectedTokens(nextSelected);
        setAvailableTokens([...availableTokens, token]);
    };

    const handleSelectForeign = (item: PairItem) => {
        sound.playPebbleTap(true);
        if (matchedPairIds.includes(item.id)) return;

        if (selectedNativeId) {
            if (selectedNativeId === item.id) {
                sound.playGentleChime(true);
                setMatchedPairIds([...matchedPairIds, item.id]);
                setSelectedForeignId(null);
                setSelectedNativeId(null);
            } else {
                sound.playReflectionTone(true);
                setSelectedForeignId(null);
                setSelectedNativeId(null);
            }
        } else {
            setSelectedForeignId(item.id);
        }
    };

    const handleSelectNative = (item: PairItem) => {
        sound.playPebbleTap(true);
        if (matchedPairIds.includes(item.id)) return;

        if (selectedForeignId) {
            if (selectedForeignId === item.id) {
                sound.playGentleChime(true);
                setMatchedPairIds([...matchedPairIds, item.id]);
                onSelect(1);
                setSelectedForeignId(null);
                setSelectedNativeId(null);
            } else {
                sound.playReflectionTone(true);
                setSelectedForeignId(null);
                setSelectedNativeId(null);
            }
        } else {
            setSelectedNativeId(item.id);
        }
    };

    // ── Intro ──────────────────────────────────────────────────────────────
    if (step.type === "intro") {
        return (
            <div className="space-y-4">
                <div className="flex items-start gap-3">
                    <CairnMascot
                        className="h-14 w-auto shrink-0"
                        mood="happy"
                        label="Cairn greets the path"
                    />
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                            Begin
                        </p>
                        <h2 className="mt-1 font-serif text-xl font-semibold tracking-tight text-foreground">
                            {step.title}
                        </h2>
                    </div>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                    {step.body}
                </p>
            </div>
        );
    }

    // ── Tip ────────────────────────────────────────────────────────────────
    if (step.type === "tip") {
        return (
            <div className="space-y-4">
                <div className="flex items-start gap-3">
                    <CairnMascot
                        className="h-12 w-auto shrink-0"
                        mood="thinking"
                        label="Cairn shares a tip"
                    />
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                            Gentle tip
                        </p>
                        <h2 className="mt-1 font-serif text-xl font-semibold tracking-tight text-foreground">
                            {step.title}
                        </h2>
                    </div>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                    {step.body}
                </p>
                {step.bullets?.length ? (
                    <ul className="space-y-2">
                        {step.bullets.map((b) => (
                            <li
                                key={b}
                                className="flex gap-2.5 rounded-xl border border-border/80 bg-background/50 px-3.5 py-2.5 text-sm text-muted-foreground"
                            >
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                                <span>{b}</span>
                            </li>
                        ))}
                    </ul>
                ) : null}
            </div>
        );
    }

    // ── Vocab ──────────────────────────────────────────────────────────────
    if (step.type === "vocab") {
        return (
            <div className="space-y-4">
                <h2 className="font-serif text-xl font-semibold tracking-tight text-foreground">
                    {step.title}
                </h2>
                <ul className="space-y-2">
                    {step.items.map((item) => (
                        <li
                            key={item.term}
                            className="flex flex-col gap-0.5 rounded-2xl border border-border bg-background/60 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3"
                        >
                            <span className="font-medium text-foreground">
                                {item.term}
                            </span>
                            <span className="text-sm text-muted-foreground">
                                {item.meaning}
                                {item.note ? (
                                    <span className="ml-1 text-xs opacity-80">
                                        · {item.note}
                                    </span>
                                ) : null}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    // ── Phrase ─────────────────────────────────────────────────────────────
    if (step.type === "phrase") {
        return (
            <div className="space-y-4">
                <div>
                    <h2 className="font-serif text-xl font-semibold tracking-tight text-foreground">
                        {step.title}
                    </h2>
                    {(step.sourceLabel || step.targetLabel) && (
                        <p className="mt-1 text-[11px] text-muted-foreground">
                            {step.sourceLabel ?? "Source"} →{" "}
                            {step.targetLabel ?? "Target"}
                        </p>
                    )}
                </div>
                <ul className="space-y-2.5">
                    {step.phrases.map((p) => (
                        <li
                            key={p.source + p.target}
                            className="rounded-2xl border border-border bg-background/50 px-4 py-3.5"
                        >
                            <p className="text-xs text-muted-foreground">
                                {p.source}
                            </p>
                            <p className="mt-1 font-display text-lg font-medium text-foreground">
                                {p.target}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    // ── Speak ──────────────────────────────────────────────────────────────
    if (step.type === "speak") {
        return (
            <div className="space-y-4">
                <div className="flex items-start gap-3">
                    <CairnMascot
                        className="h-12 w-auto shrink-0"
                        mood={spoke ? "happy" : "listening"}
                        label={spoke ? "Cairn heard you" : "Cairn is listening"}
                    />
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                            Speak
                        </p>
                        <h2 className="mt-1 font-serif text-xl font-semibold tracking-tight text-foreground">
                            {step.title}
                        </h2>
                    </div>
                </div>
                <p className="text-sm text-muted-foreground">{step.prompt}</p>

                {step.hint ? (
                    <p className="text-xs text-muted-foreground">
                        Prompt: {step.hint}
                    </p>
                ) : null}

                <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-accent/30 px-5 py-5 text-center">
                    <div
                        className="lang-wash pointer-events-none absolute inset-0 opacity-40"
                        aria-hidden
                    />
                    <p className="relative font-display text-2xl font-medium leading-snug text-foreground">
                        {step.targetLine}
                    </p>
                </div>

                <div className="mt-1">
                    <MicAudioVisualizer
                        label="Your voice"
                        barCount={36}
                        canvasClassName="h-20"
                        className="border-0 bg-transparent p-0 shadow-none"
                    />
                </div>

                <Button
                    type="button"
                    variant={spoke ? "default" : "outline"}
                    size="sm"
                    className="rounded-full"
                    onClick={onSpoke}
                >
                    {spoke ? "Marked as spoken" : "I said it"}
                </Button>
            </div>
        );
    }

    // ── Pair matching ──────────────────────────────────────────────────────
    if (step.type === "pair-matching") {
        const pm = step as PairMatchingQuestion;
        return (
            <div className="space-y-4">
                <div className="text-center">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                        Pair matching
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Match the harmonious pairs · {matchedPairIds.length} of{" "}
                        {pm.pairs.length} paired
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                        {pm.pairs.map((pair) => {
                            const isMatched = matchedPairIds.includes(pair.id);
                            const isSelected = selectedForeignId === pair.id;
                            return (
                                <button
                                    key={pair.id}
                                    type="button"
                                    disabled={isMatched || evaluation !== "idle"}
                                    onClick={() => handleSelectForeign(pair)}
                                    className={cn(
                                        "w-full rounded-2xl border-2 p-3.5 text-left transition-all",
                                        isMatched
                                            ? "cursor-default border-transparent bg-background opacity-40"
                                            : isSelected
                                                ? "scale-[1.02] border-primary bg-accent text-primary shadow-xs"
                                                : "border-border bg-background hover:bg-muted",
                                    )}
                                >
                                    <div className="text-sm font-semibold">
                                        {pair.foreign}
                                    </div>
                                    {pair.phonetic && (
                                        <div className="mt-0.5 text-[11px] text-muted-foreground">
                                            {pair.phonetic}
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <div className="space-y-2">
                        {pm.pairs.map((pair) => {
                            const isMatched = matchedPairIds.includes(pair.id);
                            const isSelected = selectedNativeId === pair.id;
                            return (
                                <button
                                    key={pair.id}
                                    type="button"
                                    disabled={isMatched || evaluation !== "idle"}
                                    onClick={() => handleSelectNative(pair)}
                                    className={cn(
                                        "w-full rounded-2xl border-2 p-3.5 text-left transition-all",
                                        isMatched
                                            ? "cursor-default border-transparent opacity-40"
                                            : isSelected
                                                ? "scale-[1.02] border-primary bg-accent text-primary shadow-xs"
                                                : "border-border bg-background hover:bg-muted",
                                    )}
                                >
                                    <div className="text-sm font-medium">
                                        {pair.native}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    // ── Sentence builder ───────────────────────────────────────────────────
    if (step.type === "sentence-builder") {
        return (
            <div className="space-y-5">
                <div className="text-center">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                        Weave the sentence
                    </p>
                    <p className="mt-2 rounded-2xl border border-border/60 bg-background/60 px-4 py-3 font-serif text-sm italic text-muted-foreground">
                        &ldquo;{step.targetTranslation}&rdquo;
                    </p>
                </div>

                <div className="flex min-h-[5rem] flex-wrap items-center gap-2 rounded-2xl border-2 border-dashed border-border bg-background/40 p-4">
                    {selectedTokens.length === 0 ? (
                        <span className="mx-auto text-xs italic text-muted-foreground">
                            Tap word pebbles below to weave your sentence
                        </span>
                    ) : (
                        selectedTokens.map((token, idx) => (
                            <button
                                key={`${token}-${idx}`}
                                type="button"
                                disabled={evaluation !== "idle"}
                                onClick={() => handleRemoveToken(token, idx)}
                                className="rounded-xl border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground shadow-xs transition-transform hover:bg-accent active:scale-95"
                            >
                                {token}
                            </button>
                        ))
                    )}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                    {availableTokens.map((token, idx) => (
                        <button
                            key={`${token}-${idx}`}
                            type="button"
                            disabled={evaluation !== "idle"}
                            onClick={() => handleAddToken(token, idx)}
                            className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-muted-foreground shadow-xs transition-all hover:scale-105 hover:bg-accent active:scale-95"
                        >
                            {token}
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    // ── Context dialogue ───────────────────────────────────────────────────
    if (step.type === "context-dialogue") {
        return (
            <div className="space-y-5">
                <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-soft">
                    <div
                        className="lang-wash pointer-events-none absolute inset-0 opacity-25"
                        aria-hidden
                    />
                    <div className="relative">
                        <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                            <MessageCircle className="h-3.5 w-3.5 text-primary" />
                            <span>{step.dialoguePartner}</span>
                        </div>
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <div className="font-serif text-xl text-primary">
                                    {step.partnerSays}
                                </div>
                                {step.partnerSaysPhonetic && (
                                    <div className="mt-0.5 text-xs text-muted-foreground">
                                        {step.partnerSaysPhonetic}
                                    </div>
                                )}
                                <div className="mt-1 text-xs italic text-muted-foreground">
                                    &ldquo;{step.partnerSaysTranslation}&rdquo;
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    speak(step.partnerSays, currentLanguage?.voice);
                                }}
                                className="shrink-0 rounded-full bg-background p-2 text-foreground transition-colors hover:bg-accent"
                                title="Listen to partner"
                            >
                                <Volume2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-2.5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                        Your reply
                    </p>
                    {step.options.map((option, idx) => {
                        const isSelected = selectedOption === option;
                        return (
                            <button
                                key={idx}
                                id={`dialogue-option-${idx}`}
                                type="button"
                                disabled={evaluation !== "idle"}
                                onClick={() => {
                                    sound.playPebbleTap(true);
                                    setSelectedOption(option);
                                    speak(option, currentLanguage?.voice);
                                }}
                                className={cn(
                                    "w-full rounded-2xl border-2 p-4 text-left transition-all",
                                    isSelected
                                        ? "border-primary bg-accent text-primary shadow-xs"
                                        : "border-border bg-background hover:bg-muted",
                                )}
                            >
                                <span className="text-sm font-medium text-foreground sm:text-base">
                                    {option}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }

    // ── Check / Listen (default MC) ────────────────────────────────────────
    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-serif text-xl font-semibold tracking-tight text-foreground">
                    {step.title}
                </h2>
                {step.type === "check" && step.isReview ? (
                    <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-primary">
                        Review
                    </span>
                ) : null}
            </div>
            <p className="text-sm text-muted-foreground">{step.prompt}</p>
            <ul className="space-y-2.5">
                {step.options.map((opt, i) => {
                    const isCorrect = i === step.answerIndex;
                    const isSelected = selected === i;
                    const phonetic =
                        step.type === "listen"
                            ? step?.phoneticAnswers?.[opt]
                            : null;

                    let style =
                        "border-border bg-background hover:bg-muted";
                    if (checked && isCorrect) {
                        style =
                            "border-primary bg-accent text-accent-foreground";
                    } else if (checked && isSelected && !isCorrect) {
                        style =
                            "border-border bg-muted text-muted-foreground opacity-70";
                    } else if (isSelected) {
                        style = "border-primary bg-accent text-primary";
                    }

                    return (
                        <li key={opt}>
                            <button
                                type="button"
                                disabled={evaluation !== "idle" || checked}
                                onClick={() => {
                                    sound.playPebbleTap(true);
                                    onSelect(i);
                                    setSelectedOption(opt);
                                    speak(opt, currentLanguage?.voice);
                                }}
                                className={cn(
                                    "w-full rounded-2xl border-2 px-4 py-3 text-left transition-all",
                                    style,
                                )}
                            >
                                <div className="text-base font-medium">
                                    {opt}
                                </div>
                                {phonetic && (
                                    <div className="mt-0.5 text-xs text-muted-foreground">
                                        {phonetic}
                                    </div>
                                )}
                            </button>
                        </li>
                    );
                })}
            </ul>
            {checked && step?.explanation ? (
                <p className="rounded-xl border border-border/60 bg-background/50 px-3.5 py-2.5 text-sm text-muted-foreground">
                    {step.explanation}
                </p>
            ) : null}
        </div>
    );
}
