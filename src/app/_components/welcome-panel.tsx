"use client";

import { Drawer, DrawerContent } from "./ui/drawer";
import { LanguageOption, LANGUAGES } from "@/lib/languages";
import { sound } from "@/lib/sound";
import { ArrowRight, Check, ChevronDown, Search } from "lucide-react";
import { LessonDirection } from "@/data/lessons";
import { useEffect, useRef, useState } from "react";
import { ProgressState, saveProgress } from "@/lib/progress";

export function WelcomePanel({ progress }: { progress: ProgressState }) {
    const [isNativeLanguage, setIsNativeLanguage] = useState(progress.nativeLanguage);
    const [learningLanguage, setLearningLanguage] = useState(progress.learningLanguage);
    const [nativeLanguage, setNativeLanguage] = useState(progress.nativeLanguage);
    const [nativeDropdownOpen, setNativeDropdownOpen] = useState(false);
    const [learningDropdownOpen, setLearningDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const nativeRef = useRef<HTMLDivElement>(null);
    const learningRef = useRef<HTMLDivElement>(null);

    const currentNativeCode = nativeLanguage || "en";
    const currentNative =
        LANGUAGES.find((l) => l.value === currentNativeCode) || LANGUAGES[0];

    const currentLearning =
        LANGUAGES.find((l) => l.value === learningLanguage) || LANGUAGES[0];

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (nativeRef.current && !nativeRef.current.contains(e.target as Node)) {
                setNativeDropdownOpen(false);
            }
            if (learningRef.current && !learningRef.current.contains(e.target as Node)) {
                setLearningDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const persist = () => {
        const updated: ProgressState = {
            ...progress,
            nativeLanguage,
            learningLanguage,
            lessonDirection: `${currentNativeCode}-${learningLanguage}` as LessonDirection,
        };
        saveProgress(updated);
        setIsNativeLanguage(updated.nativeLanguage);
    };

    const filteredNatives = LANGUAGES.filter(
        (lang) =>
            lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lang?.nativeName?.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const handleSelectNative = (lang: LanguageOption) => {
        sound.playPebbleTap(progress.soundEnabled);
        setNativeLanguage(lang.value);
        setNativeDropdownOpen(false);
        setSearchQuery("");
    };

    const handleSelectLearning = (lang: LanguageOption) => {
        sound.playPebbleTap(progress.soundEnabled);
        setLearningLanguage(lang.value);
        setLearningDropdownOpen(false);
    };

    return (
        <Drawer open={!isNativeLanguage}>
            <DrawerContent className="min-h-[100%]">
                <div className="flex min-h-screen flex-col items-center justify-between bg-background px-4 py-6 text-foreground selection:bg-primary/20">
                    <div className="mx-auto flex w-full max-w-[430px] flex-col">
                        <div className="flex justify-center pb-5 pt-2">
                            <div
                                id="top-drag-handle"
                                className="h-1 w-12 rounded-full bg-muted-foreground/40"
                                aria-hidden="true"
                            />
                        </div>

                        <h1
                            id="welcome-title"
                            className="text-center font-serif text-[34px] font-normal tracking-tight text-foreground sm:text-[37px]"
                        >
                            Welcome
                        </h1>

                        <p
                            id="welcome-subtitle"
                            className="mb-7 mt-5 px-1 text-left text-[15px] leading-[1.65] text-muted-foreground sm:text-[16px]"
                        >
                            Begin your journey with peaceful greetings, humble bows, and basic
                            gratitude. Please set your native language to start.
                        </p>

                        <div
                            id="card-i-speak"
                            ref={nativeRef}
                            className="relative mb-3.5 rounded-[26px] border border-border bg-card p-5 shadow-xs transition-colors sm:p-6"
                        >
                            <h2 className="mb-3 text-[16px] font-medium text-foreground">
                                I speak
                            </h2>

                            <button
                                id="native-lang-selector"
                                type="button"
                                onClick={() => {
                                    sound.playPebbleTap(progress.soundEnabled);
                                    setNativeDropdownOpen((prev) => !prev);
                                    setLearningDropdownOpen(false);
                                }}
                                className="flex h-12 w-full cursor-pointer items-center justify-between rounded-full border border-border bg-background px-4 text-sm text-foreground outline-none transition-all hover:border-primary/40 focus:border-primary"
                            >
                                <div className="flex items-center gap-2.5 overflow-hidden">
                                    <span className="text-base leading-none">
                                        {currentNative.flag}
                                    </span>
                                    <span className="truncate font-normal">
                                        {currentNative.name}
                                    </span>
                                    {currentNative.nativeName !== currentNative.name && (
                                        <span className="text-xs text-muted-foreground">
                                            ({currentNative.nativeName})
                                        </span>
                                    )}
                                </div>
                                <ChevronDown
                                    className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                                        nativeDropdownOpen ? "rotate-180" : ""
                                    }`}
                                />
                            </button>

                            {nativeDropdownOpen && (
                                <div
                                    id="native-dropdown-menu"
                                    className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 flex max-h-72 flex-col overflow-hidden rounded-2xl border border-border bg-card p-3 shadow-2xl backdrop-blur-md"
                                >
                                    <div className="relative mb-2">
                                        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                                        <input
                                            id="search-native-language"
                                            type="text"
                                            placeholder="Search languages..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full rounded-xl border border-border bg-background py-1.5 pl-8 pr-3 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
                                            autoFocus
                                        />
                                    </div>

                                    <div className="custom-scrollbar space-y-1 overflow-y-auto pr-1">
                                        {filteredNatives.map((lang) => {
                                            const isSelected =
                                                lang.value === currentNative.value;
                                            return (
                                                <button
                                                    key={lang.value}
                                                    id={`select-native-${lang.value}`}
                                                    type="button"
                                                    onClick={() => handleSelectNative(lang)}
                                                    className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-colors ${
                                                        isSelected
                                                            ? "bg-accent font-medium text-primary"
                                                            : "text-foreground hover:bg-muted"
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span>{lang.flag}</span>
                                                        <span>{lang.name}</span>
                                                        <span className="text-[11px] text-muted-foreground">
                                                            {lang.nativeName}
                                                        </span>
                                                    </div>
                                                    {isSelected && (
                                                        <Check className="h-3.5 w-3.5 text-primary" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div
                            id="card-i-am-learning"
                            ref={learningRef}
                            className="relative rounded-[26px] border border-border bg-card p-5 shadow-xs transition-colors sm:p-6"
                        >
                            <h2 className="mb-3 text-[16px] font-medium text-foreground">
                                I am learning
                            </h2>

                            <div className="flex items-center gap-3">
                                <button
                                    id="learning-lang-circle-btn"
                                    type="button"
                                    onClick={() => {
                                        sound.playPebbleTap(progress.soundEnabled);
                                        setLearningDropdownOpen((prev) => !prev);
                                        setNativeDropdownOpen(false);
                                    }}
                                    title="Choose language to learn"
                                    className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-secondary text-foreground shadow-xs transition-all hover:bg-muted active:scale-95"
                                >
                                    <ChevronDown
                                        className={`h-4 w-4 stroke-[2.5] text-foreground transition-transform duration-200 ${
                                            learningDropdownOpen ? "rotate-180" : ""
                                        }`}
                                    />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        sound.playPebbleTap(progress.soundEnabled);
                                        setLearningDropdownOpen((prev) => !prev);
                                        setNativeDropdownOpen(false);
                                    }}
                                    className="flex cursor-pointer items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    <span>{currentLearning.flag}</span>
                                    <span className="font-medium text-foreground">
                                        {currentLearning.name}
                                    </span>
                                    <span className="text-muted-foreground">
                                        ({currentLearning.nativeName})
                                    </span>
                                </button>
                            </div>

                            {learningDropdownOpen && (
                                <div
                                    id="learning-dropdown-menu"
                                    className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 flex flex-col space-y-1.5 rounded-2xl border border-border bg-card p-3 shadow-2xl backdrop-blur-md"
                                >
                                    <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                        Select Language Path
                                    </div>

                                    {LANGUAGES.map((lang) => {
                                        const isSelected = lang.id === currentLearning.id;
                                        return (
                                            <button
                                                key={lang.id}
                                                id={`select-learning-${lang.id}`}
                                                type="button"
                                                onClick={() => handleSelectLearning(lang)}
                                                className={`flex w-full cursor-pointer items-center justify-between rounded-xl border p-2.5 text-left transition-all ${
                                                    isSelected
                                                        ? "border-border bg-accent text-primary"
                                                        : "border-transparent text-foreground hover:bg-muted"
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-lg">{lang.flag}</span>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-semibold">
                                                                {lang.name}
                                                            </span>
                                                            <span className="text-[11px] text-muted-foreground">
                                                                {lang.nativeName}
                                                            </span>
                                                        </div>
                                                        <p className="line-clamp-1 text-[11px] text-muted-foreground">
                                                            {lang.description}
                                                        </p>
                                                    </div>
                                                </div>
                                                {isSelected ? (
                                                    <Check className="h-4 w-4 shrink-0 text-primary" />
                                                ) : (
                                                    <span className="text-[11px] text-muted-foreground">
                                                        Select
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <div className="mt-8 space-y-3">
                            <button
                                id="begin-journey-btn"
                                type="button"
                                onClick={() => {
                                    sound.playPebbleTap(progress.soundEnabled);
                                    persist();
                                }}
                                className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-xs transition-all hover:bg-primary/90 active:scale-[0.99]"
                            >
                                <span>Begin Learning {currentLearning.name}</span>
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div className="pb-2 pt-8 text-center text-[11px] text-muted-foreground">
                        A calm language learning space designed for peace and presence.
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
