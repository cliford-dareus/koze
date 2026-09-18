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
    const [searchQuery, setSearchQuery] = useState('');

    const nativeRef = useRef<HTMLDivElement>(null);
    const learningRef = useRef<HTMLDivElement>(null);

    // Find currently selected native language
    const currentNativeCode = nativeLanguage || 'en';
    const currentNative =
        LANGUAGES.find((l) => l.value === currentNativeCode) || LANGUAGES[0];

    // Find currently selected learning language
    const currentLearning =
        LANGUAGES.find((l) => l.value === learningLanguage) ||
        LANGUAGES[0];

    // Close dropdowns on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (nativeRef.current && !nativeRef.current.contains(e.target as Node)) {
                setNativeDropdownOpen(false);
            }
            if (learningRef.current && !learningRef.current.contains(e.target as Node)) {
                setLearningDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const persist = () => {
        const updated: ProgressState = {
            ...progress,
            nativeLanguage,
            learningLanguage,
            lessonDirection: `${currentNativeCode}-${learningLanguage}` as LessonDirection,
        };
        // setProgress(updated);
        saveProgress(updated);
        setIsNativeLanguage(updated.nativeLanguage);
    };

    // Filter native languages by search query
    const filteredNatives = LANGUAGES.filter(
        (lang) =>
            lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lang?.nativeName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelectNative = (lang) => {
        sound.playPebbleTap(progress.soundEnabled);
        setNativeLanguage(lang.value);
        setNativeDropdownOpen(false);
        setSearchQuery('');
    };

    const handleSelectLearning = (lang) => {
        sound.playPebbleTap(progress.soundEnabled);
        setLearningLanguage(lang.value);
        setLearningDropdownOpen(false);
    };

    const onContinue = () => {
        persist()
    };

    return (
        <Drawer open={!isNativeLanguage}>
            <DrawerContent className="min-h-[100%]">
                <div className="min-h-screen bg-background text-foreground flex flex-col justify-between items-center py-6 px-4 selection:bg-[#2C332A] selection:text-[#F3F2EE]">
                    <div className="w-full max-w-[430px] mx-auto flex flex-col">
                        {/* Top subtle grab pill indicator */}
                        <div className="pt-2 pb-5 flex justify-center">
                            <div
                                id="top-drag-handle"
                                className="w-12 h-1 bg-[#2C2D2A] rounded-full"
                                aria-hidden="true"
                            />
                        </div>

                        {/* Elegant Serif Title */}
                        <h1
                            id="welcome-title"
                            className="font-serif text-[34px] sm:text-[37px] font-normal tracking-tight text-[#F3F2EE] text-center"
                        >
                            Welcome
                        </h1>

                        {/* Muted Sage / Olive Subtitle Paragraph */}
                        <p
                            id="welcome-subtitle"
                            className="text-[15px] sm:text-[16px] text-[#70756F] leading-[1.65] text-left mt-5 mb-7 px-1"
                        >
                            Begin your journey with peaceful greetings, humble bows, and basic gratitude. Please set your native language to start.
                        </p>

                        {/* Card 1: I speak */}
                        <div
                            id="card-i-speak"
                            ref={nativeRef}
                            className="relative bg-[#1C1D1B] border border-[#2A2C29] rounded-[26px] p-5 sm:p-6 mb-3.5 shadow-xs transition-colors"
                        >
                            <h2 className="text-[16px] font-medium text-[#ECEBE6] mb-3">
                                I speak
                            </h2>

                            {/* Native Language Pill Selector */}
                            <button
                                id="native-lang-selector"
                                type="button"
                                onClick={() => {
                                    sound.playPebbleTap(progress.soundEnabled);
                                    setNativeDropdownOpen((prev) => !prev);
                                    setLearningDropdownOpen(false);
                                }}
                                className="w-full bg-[#161715] border border-[#272825] hover:border-[#3A3C38] focus:border-[#4A4D47] rounded-full h-12 px-4 flex items-center justify-between text-sm text-[#E2E1DC] transition-all cursor-pointer outline-none"
                            >
                                <div className="flex items-center gap-2.5 overflow-hidden">
                                    <span className="text-base leading-none">{currentNative.flag}</span>
                                    <span className="font-normal truncate">{currentNative.name}</span>
                                    {currentNative.nativeName !== currentNative.name && (
                                        <span className="text-xs text-[#70756F]">({currentNative.nativeName})</span>
                                    )}
                                </div>
                                <ChevronDown
                                    className={`w-4 h-4 text-[#757973] transition-transform duration-200 ${nativeDropdownOpen ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>

                            {/* Native Language Dropdown Menu */}
                            {nativeDropdownOpen && (
                                <div
                                    id="native-dropdown-menu"
                                    className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 bg-[#1A1B19] border border-[#2E302D] rounded-2xl shadow-2xl p-3 max-h-72 overflow-hidden flex flex-col backdrop-blur-md"
                                >
                                    <div className="relative mb-2">
                                        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#70756F]" />
                                        <input
                                            id="search-native-language"
                                            type="text"
                                            placeholder="Search languages..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full bg-card border border-border focus:border-[#4D524A] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#ECEBE6] placeholder-[#646862] outline-none"
                                            autoFocus
                                        />
                                    </div>

                                    <div className="overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                                        {filteredNatives.map((lang) => {
                                            const isSelected = lang.value === currentNative.value;
                                            return (
                                                <button
                                                    key={lang.value}
                                                    id={`select-native-${lang.value}`}
                                                    type="button"
                                                    onClick={() => handleSelectNative(lang)}
                                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${isSelected
                                                        ? 'bg-[#262824] text-[#F3F2EE] font-medium'
                                                        : 'hover:bg-[#222320] text-[#B5B9B2]'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span>{lang.flag}</span>
                                                        <span>{lang.name}</span>
                                                        <span className="text-[11px] text-[#70756F]">{lang.nativeName}</span>
                                                    </div>
                                                    {isSelected && <Check className="w-3.5 h-3.5 text-[#A5C9B1]" />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Card 2: I am learning */}
                        <div
                            id="card-i-am-learning"
                            ref={learningRef}
                            className="relative bg-card border border-border rounded-[26px] p-5 sm:p-6 shadow-xs transition-colors"
                        >
                            <h2 className="text-[16px] font-medium text-[#ECEBE6] mb-3">
                                I am learning
                            </h2>

                            {/* Selector matching the screenshot with round button */}
                            <div className="flex items-center gap-3">
                                {/* Round pill chevron button matching the screenshot */}
                                <button
                                    id="learning-lang-circle-btn"
                                    type="button"
                                    onClick={() => {
                                        sound.playPebbleTap(progress.soundEnabled);
                                        setLearningDropdownOpen((prev) => !prev);
                                        setNativeDropdownOpen(false);
                                    }}
                                    title="Choose language to learn"
                                    className="w-9 h-9 rounded-full bg-[#EAE8E0] hover:bg-[#FAF9F5] text-[#1D1E1B] flex items-center justify-center transition-all shadow-xs active:scale-95 cursor-pointer shrink-0"
                                >
                                    <ChevronDown
                                        className={`w-4 h-4 text-[#1C1D1B] stroke-[2.5] transition-transform duration-200 ${learningDropdownOpen ? 'rotate-180' : ''
                                            }`}
                                    />
                                </button>

                                {/* Subtle selected language tag */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        sound.playPebbleTap(progress.soundEnabled);
                                        setLearningDropdownOpen((prev) => !prev);
                                        setNativeDropdownOpen(false);
                                    }}
                                    className="text-xs text-[#8E948B] hover:text-[#ECEBE6] transition-colors cursor-pointer flex items-center gap-1.5"
                                >
                                    <span>{currentLearning.flag}</span>
                                    <span className="font-medium text-[#D8DED5]">{currentLearning.name}</span>
                                    <span className="text-[#646861]">({currentLearning.nativeName})</span>
                                </button>
                            </div>

                            {/* Learning Language Dropdown / Modal */}
                            {learningDropdownOpen && (
                                <div
                                    id="learning-dropdown-menu"
                                    className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 bg-[#1A1B19] border border-[#2E302D] rounded-2xl shadow-2xl p-3 flex flex-col backdrop-blur-md space-y-1.5"
                                >
                                    <div className="text-[11px] uppercase tracking-wider text-[#70756F] font-semibold px-2 py-1">
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
                                                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all cursor-pointer ${isSelected
                                                    ? 'bg-[#262824] border border-[#3A3D36] text-[#F3F2EE]'
                                                    : 'hover:bg-[#222320] text-[#B5B9B2] border border-transparent'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-lg">{lang.flag}</span>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-semibold text-[#ECEBE6]">
                                                                {lang.name}
                                                            </span>
                                                            <span className="text-[11px] text-[#70756F]">
                                                                {lang.nativeName}
                                                            </span>
                                                        </div>
                                                        <p className="text-[11px] text-[#757A73] line-clamp-1">
                                                            {lang.description}
                                                        </p>
                                                    </div>
                                                </div>
                                                {isSelected ? (
                                                    <Check className="w-4 h-4 text-[#A5C9B1] shrink-0" />
                                                ) : (
                                                    <span className="text-[11px] text-[#555953]">Select</span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Serene Action Button */}
                        <div className="mt-8 space-y-3">
                            <button
                                id="begin-journey-btn"
                                type="button"
                                onClick={() => {
                                    sound.playPebbleTap(progress.soundEnabled);
                                    onContinue();
                                }}
                                className="w-full h-12 rounded-full bg-[#EAE8E0] hover:bg-[#FAF9F5] active:scale-[0.99] text-[#161715] font-semibold text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <span>Begin Learning {currentLearning.name}</span>
                                <ArrowRight className="w-4 h-4 text-[#161715]" />
                            </button>

                            <p className="text-center text-[12px] text-[#5A5E59]">
                                {/*{currentCourse.units[0]?.lessons.length || 3} mindful stepping stones ready in Unit 1*/}
                            </p>
                        </div>
                    </div>

                    {/* Gentle bottom note */}
                    <div className="text-center pt-8 pb-2 text-[11px] text-[#4A4E48]">
                        A calm language learning space designed for peace and presence.
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
