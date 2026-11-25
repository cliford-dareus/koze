"use client";

import { BookOpen, Check, ChevronDown, Flame, Sparkles } from "lucide-react";
import Image from "next/image";
import KOZE_LOGO from "../../../public/koze-logo.png";
import AuthMenu from "./auth-menu";
import { useEffect, useRef, useState } from "react";
import { LanguageOption, LANGUAGES } from "../../lib/languages";
import { ProgressState, saveProgress } from "../../lib/progress";
import { sound } from "@/lib/sound";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";
import ZenGarden from "./zen-garden";
import RhythmPanel from "./rhythm-panel";
import { LessonDirection } from "@/data/lessons";
import { applyLanguageTheme } from "@/lib/language-theme";
import { directionForLearningLanguage } from "@/lib/learning-prefs";

function formatPracticeDate(isoDate: string | null | undefined) {
    if (!isoDate) return "Not yet";
    try {
        const d = new Date(`${isoDate}T12:00:00`);
        if (Number.isNaN(d.getTime())) return isoDate;
        return d.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
        });
    } catch {
        return isoDate;
    }
}

export default function MainHeader({
    progress,
    ready,
    currentLang,
}: {
    progress: ProgressState;
    ready: boolean;
    currentLang: LanguageOption;
}) {
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleSelectLanguage = (lang: LanguageOption) => {
        const native =
            progress.nativeLanguage || progress.lessonDirection?.split("-")[0] || "en";
        const direction = directionForLearningLanguage(lang.value, native);
        const updated: ProgressState = {
            ...progress,
            learningLanguage: lang.value,
            lessonDirection: direction,
        };
        saveProgress(updated);
        applyLanguageTheme(lang.themeColor);
    };

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setLangDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="mb-8 flex items-center justify-between gap-3">
            <div className="flex h-18 w-full items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4">
                    <div
                        id="brand-mark"
                        className="flex cursor-pointer select-none items-center gap-2.5"
                        onClick={() => sound.playPebbleTap(progress.soundEnabled)}
                    >
                        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl shadow-xs">
                            <Image
                                src={KOZE_LOGO}
                                width={36}
                                height={36}
                                alt="Koze"
                                className="size-9 object-cover"
                            />
                        </div>
                        <div className="hidden leading-tight sm:block">
                            <div className="font-serif text-lg font-semibold tracking-tight text-primary">
                                Komorebi
                            </div>
                            <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                                Mindful Language
                            </div>
                        </div>
                    </div>

                    <div className="relative" ref={dropdownRef}>
                        <button
                            id="language-selector-btn"
                            type="button"
                            onClick={() => {
                                sound.playPebbleTap(progress.soundEnabled);
                                setLangDropdownOpen(!langDropdownOpen);
                            }}
                            className="flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                            style={{
                                boxShadow: currentLang.themeColor
                                    ? `inset 0 0 0 1px ${currentLang.themeColor}33`
                                    : undefined,
                            }}
                        >
                            <span
                                className="h-2.5 w-2.5 shrink-0 rounded-full"
                                style={{ backgroundColor: currentLang.themeColor || "hsl(var(--primary))" }}
                                aria-hidden
                            />
                            <span className="text-base leading-none">{currentLang.flag}</span>
                            <span className="font-medium">{currentLang.name}</span>
                            <ChevronDown
                                className={`h-3.5 w-3.5 text-foreground transition-transform duration-200 ${langDropdownOpen ? "rotate-180" : ""
                                    }`}
                            />
                        </button>

                        {langDropdownOpen && (
                            <div
                                id="language-dropdown-menu"
                                className="absolute left-0 z-40 mt-2 w-60 animate-in fade-in zoom-in-95 rounded-2xl border border-border bg-card p-1.5 shadow-xl duration-150"
                            >
                                <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                    Select path
                                </div>
                                {LANGUAGES.map((lang: LanguageOption) => {
                                    const isSelected = lang.value === progress.learningLanguage;
                                    return (
                                        <button
                                            key={lang.id}
                                            id={`select-lang-${lang.id}`}
                                            type="button"
                                            onClick={() => {
                                                sound.playPebbleTap(progress.soundEnabled);
                                                handleSelectLanguage(lang);
                                                setLangDropdownOpen(false);
                                            }}
                                            className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors ${isSelected
                                                    ? "bg-accent font-semibold text-primary"
                                                    : "text-foreground hover:bg-muted"
                                                }`}
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <span
                                                    className="h-2.5 w-2.5 shrink-0 rounded-full ring-1 ring-border"
                                                    style={{
                                                        backgroundColor:
                                                            lang.themeColor || "hsl(var(--muted-foreground))",
                                                    }}
                                                    aria-hidden
                                                />
                                                <span className="text-lg">{lang.flag}</span>
                                                <div>
                                                    <div className="leading-snug">{lang.name}</div>
                                                    <div className="text-[11px] font-normal text-muted-foreground">
                                                        {lang.nativeName}
                                                    </div>
                                                </div>
                                            </div>
                                            {isSelected && <Check className="h-4 w-4 text-primary" />}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    <Drawer>
                        <DrawerTrigger asChild>
                            <button
                                id="streak-rhythm-btn"
                                type="button"
                                onClick={() => {
                                    sound.playPebbleTap(progress.soundEnabled);
                                }}
                                className="flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-secondary sm:px-3 sm:text-sm"
                                title="Mindful Daily Rhythm"
                            >
                                <Flame className="h-4 w-4 fill-destructive/30 text-destructive" />
                                <span className="font-semibold">{progress.streak || 0}</span>
                                <span className="hidden text-xs text-destructive/80 sm:inline">
                                    day rhythm
                                </span>
                            </button>
                        </DrawerTrigger>
                        <DrawerContent className="border-border bg-background">
                            <RhythmPanel progress={progress} />
                        </DrawerContent>
                    </Drawer>

                    <Drawer>
                        <DrawerTrigger asChild>
                            <button
                                id="cairn-garden-btn"
                                type="button"
                                onClick={() => {
                                    sound.playPebbleTap(progress.soundEnabled);
                                }}
                                className="flex items-center gap-1.5 rounded-full border border-border bg-secondary px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary sm:px-3 sm:text-sm"
                                title="Zen Garden Cairn"
                            >
                                <Sparkles className="h-3.5 w-3.5 text-primary" />
                                <span className="font-medium">{progress.cairnStonesCount || 0}</span>
                                <span className="hidden text-xs text-foreground sm:inline">
                                    pebbles
                                </span>
                            </button>
                        </DrawerTrigger>
                        <DrawerContent className="border-border bg-background">
                            <ZenGarden progress={progress} />
                        </DrawerContent>
                    </Drawer>

                    <button
                        id="word-garden-btn"
                        type="button"
                        onClick={() => {
                            sound.playPebbleTap(progress.soundEnabled);
                        }}
                        className="rounded-full border border-transparent p-2 text-foreground transition-colors hover:border-border hover:bg-secondary"
                        title="Word Garden & Vocabulary"
                    >
                        <BookOpen className="h-4 w-4" />
                    </button>

                    <AuthMenu progress={progress} />
                </div>
            </div>
        </header>
    );
}
