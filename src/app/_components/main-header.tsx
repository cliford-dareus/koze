"use client";

import { Badge, BookOpen, Check, ChevronDown, Flame, Sparkles, Volume2, VolumeX, Wind } from "lucide-react";
import Image from "next/image";
import KOZE_LOGO from "../../../public/koze-logo.png";
import AuthMenu from "./auth-menu";
import { useEffect, useRef, useState } from "react";
import { LanguageOption, LANGUAGES } from "../../lib/languages";
import { loadProgress, ProgressState, saveProgress } from "../../lib/progress";
import { sound } from "@/lib/sound";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";
import ZenGarden from "./zen-garden";
import { LessonDirection } from "@/data/lessons";

export default function MainHeader({ progress, ready, currentLang }: { progress: ProgressState; ready: boolean; currentLang: LanguageOption; }) {
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleSelectLanguage = (langId: string) => {
        const updated: ProgressState = {
            ...progress,
            learningLanguage: langId,
            lessonDirection: `${progress.lessonDirection?.split("-")[0]}-${langId}` as LessonDirection
        };
        saveProgress(updated);
    };

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setLangDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="mb-8 flex items-center justify-between gap-3">
            <div className="w-full h-18 flex items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4">
                    <div
                        id="brand-mark"
                        className="flex items-center gap-2.5 cursor-pointer select-none"
                        onClick={() => sound.playPebbleTap(progress.soundEnabled)}
                    >
                        <div className="w-9 h-9 rounded-xl text-primary flex items-center justify-center shadow-xs">
                            <Image src={KOZE_LOGO} width={20} height={20} alt="Koze" className="size-7" />
                        </div>
                        <div className="hidden sm:block leading-tight">
                            <div className="font-serif text-lg font-semibold tracking-tight text-primary">
                                Komorebi
                            </div>
                            <div className="text-[11px] text-muted-foreground font-medium tracking-wide uppercase">
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
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary text-foreground text-sm font-medium transition-colors border border-border"
                        >
                            <span className="text-base leading-none">{currentLang.flag}</span>
                            <span className="font-medium">{currentLang.name}</span>
                            <ChevronDown
                                className={`w-3.5 h-3.5 text-foreground transition-transform duration-200 ${langDropdownOpen ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {langDropdownOpen && (
                            <div
                                id="language-dropdown-menu"
                                className="absolute left-0 mt-2 w-56 bg-card rounded-2xl shadow-xl border border-border p-1.5 z-40 animate-in fade-in zoom-in-95 duration-150"
                            >
                                <div className="px-3 py-1.5 text-[11px] font-semibold text-muted-foreground tracking-wider uppercase">
                                    Select Path
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
                                                handleSelectLanguage(lang.value);
                                                setLangDropdownOpen(false);
                                            }}
                                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm text-left transition-colors ${isSelected
                                                    ? 'bg-accent text-primary font-semibold'
                                                    : 'text-foreground hover:bg-card'
                                                }`}
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <span className="text-lg">{lang.flag}</span>
                                                <div>
                                                    <div className="leading-snug">{lang.name}</div>
                                                    <div className="text-[11px] text-muted-foreground font-normal">
                                                        {lang.nativeName}
                                                    </div>
                                                </div>
                                            </div>
                                            {isSelected && <Check className="w-4 h-4 text-primary" />}
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
                                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-card hover:bg-secondary border border-border text-destructive text-xs sm:text-sm font-medium transition-colors"
                                title="Mindful Daily Rhythm"
                            >
                                <Flame className="w-4 h-4 text-destructive fill-destructive/30" />
                                <span className="font-semibold">{progress.streak}</span>
                                <span className="hidden sm:inline text-destructive/80 text-xs">day rhythm</span>
                            </button>
                        </DrawerTrigger>
                        <DrawerContent className="border-border bg-background pb-20 pt-8" />
                    </Drawer>

                    <Drawer>
                        <DrawerTrigger asChild>
                            <button
                                id="cairn-garden-btn"
                                type="button"
                                onClick={() => {
                                    sound.playPebbleTap(progress.soundEnabled);
                                }}
                                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary border border-border text-foreground text-xs sm:text-sm font-medium transition-colors"
                                title="Zen Garden Cairn"
                            >
                                <Sparkles className="w-3.5 h-3.5 text-primary" />
                                <span className="font-medium">{progress.cairnStonesCount}</span>
                                <span className="hidden sm:inline text-foreground text-xs">pebbles</span>
                            </button>
                        </DrawerTrigger>
                        <DrawerContent className="border border-border bg-background">
                            <ZenGarden progress={progress} />
                        </DrawerContent>
                    </Drawer>

                    <button
                        id="word-garden-btn"
                        type="button"
                        onClick={() => {
                            sound.playPebbleTap(progress.soundEnabled);
                        }}
                        className="p-2 rounded-full text-foreground hover:bg-secondary border border-transparent hover:border-border transition-colors"
                        title="Word Garden & Vocabulary"
                    >
                        <BookOpen className="w-4 h-4" />
                    </button>

                  <AuthMenu progress={progress} />
                </div>
            </div>
        </header>
    );
}
