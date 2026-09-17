"use client";

import { Badge, BookOpen, Check, ChevronDown, Flame, Sparkles, Volume2, VolumeX, Wind } from "lucide-react";
import Image from "next/image";
import KOZE_LOGO from "../../../public/koze-logo.png";
import AuthMenu from "./auth-menu";
import { useEffect, useRef, useState } from "react";
import { LanguageOption, LANGUAGES } from "../../lib/languages";
import { loadProgress, ProgressState } from "../../lib/progress";
import { sound } from "@/lib/sound";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";
import ZenGarden from "./zen-garden";

export default function MainHeader({ progress, ready }: { progress: ProgressState; ready: boolean; }) {
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currentLang =
        LANGUAGES.find((l) => l.value === progress.lessonDirection.split('-')[1]) ||
        LANGUAGES[0];

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
                {/* Left: Brand & Language Switcher */}
                <div className="flex items-center gap-3 sm:gap-4">
                    <div
                        id="brand-mark"
                        className="flex items-center gap-2.5 cursor-pointer select-none"
                        onClick={() => sound.playPebbleTap(progress.soundEnabled)}
                    >
                        <div className="w-9 h-9 rounded-xl  text-white flex items-center justify-center shadow-xs">
                            <Image src={KOZE_LOGO} width={20} height={20} alt="Koze" className="size-7" />
                        </div>
                        <div className="hidden sm:block leading-tight">
                            <div className="font-serif text-lg font-semibold tracking-tight text-[#223326]">
                                Komorebi
                            </div>
                            <div className="text-[11px] text-[#717E73] font-medium tracking-wide uppercase">
                                Mindful Language
                            </div>
                        </div>
                    </div>

                    {/* Language Selector Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            id="language-selector-btn"
                            type="button"
                            onClick={() => {
                                sound.playPebbleTap(progress.soundEnabled);
                                setLangDropdownOpen(!langDropdownOpen);
                            }}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EFECE4] hover:bg-[#E6E2D8] text-[#2C332D] text-sm font-medium transition-colors border border-[#DDD8CD]"
                        >
                            <span className="text-base leading-none">{currentLang.flag}</span>
                            <span className="font-medium">{currentLang.name}</span>
                            <ChevronDown
                                className={`w-3.5 h-3.5 text-[#6D776F] transition-transform duration-200 ${langDropdownOpen ? 'rotate-180' : ''
                                    }`}
                            />
                        </button>

                        {langDropdownOpen && (
                            <div
                                id="language-dropdown-menu"
                                className="absolute left-0 mt-2 w-56 bg-[#FCFAF6] rounded-2xl shadow-xl border border-[#E5E0D4] p-1.5 z-40 animate-in fade-in zoom-in-95 duration-150"
                            >
                                <div className="px-3 py-1.5 text-[11px] font-semibold text-[#808C82] tracking-wider uppercase">
                                    Select Path
                                </div>
                                {LANGUAGES.map((lang: LanguageOption) => {
                                    const isSelected = lang.value === progress.lessonDirection.split('-')[1];
                                    return (
                                        <button
                                            key={lang.id}
                                            id={`select-lang-${lang.id}`}
                                            type="button"
                                            onClick={() => {
                                                sound.playPebbleTap(progress.soundEnabled);
                                                // onSelectLanguage(lang.id);
                                                setLangDropdownOpen(false);
                                            }}
                                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm text-left transition-colors ${isSelected
                                                ? 'bg-[#EBF2EE] text-[#2F4D3C] font-semibold'
                                                : 'text-[#3E4740] hover:bg-[#F2EFE8]'
                                                }`}
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <span className="text-lg">{lang.flag}</span>
                                                <div>
                                                    <div className="leading-snug">{lang.name}</div>
                                                    <div className="text-[11px] text-[#78857B] font-normal">
                                                        {lang.nativeName}
                                                    </div>
                                                </div>
                                            </div>
                                            {isSelected && <Check className="w-4 h-4 text-[#4D6D5A]" />}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Gamified Stats & Tranquil Toggles */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Daily Streak Rhythm */}
                    <Drawer>
                        <DrawerTrigger asChild>
                            <button
                                id="streak-rhythm-btn"
                                type="button"
                                onClick={() => {
                                    sound.playPebbleTap(progress.soundEnabled);
                                    // onOpenRhythm();
                                }}
                                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-[#FAF3EB] hover:bg-[#F4E9DC] border border-[#E8DACB] text-[#8C4A28] text-xs sm:text-sm font-medium transition-colors"
                                title="Mindful Daily Rhythm"
                            >
                                <Flame className="w-4 h-4 text-[#C26236] fill-[#C26236]/30" />
                                <span className="font-semibold">{progress.streak}</span>
                                <span className="hidden sm:inline text-[#8C4A28]/80 text-xs">day rhythm</span>
                            </button>
                        </DrawerTrigger>
                        <DrawerContent className="border-border bg-background pb-20 pt-8">

                        </DrawerContent>
                    </Drawer>

                    {/* Zen Cairn Stones (Mindful Milestone) */}
                    <Drawer>
                        <DrawerTrigger asChild>
                            <button
                                id="cairn-garden-btn"
                                type="button"
                                onClick={() => {
                                    sound.playPebbleTap(progress.soundEnabled);
                                    // onOpenZenGarden();
                                }}
                                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-[#EFECE4] hover:bg-[#E6E2D8] border border-[#DDD8CD] text-[#3E4740] text-xs sm:text-sm font-medium transition-colors"
                                title="Zen Garden Cairn"
                            >
                                <Sparkles className="w-3.5 h-3.5 text-[#5C7A68]" />
                                <span className="font-medium">{progress.cairnStonesCount}</span>
                                <span className="hidden sm:inline text-[#6C776E] text-xs">pebbles</span>
                            </button>
                        </DrawerTrigger>
                        <DrawerContent>
                            <ZenGarden progress={progress} />
                        </DrawerContent>
                    </Drawer>

                    {/* Word Garden */}
                    <button
                        id="word-garden-btn"
                        type="button"
                        onClick={() => {
                            sound.playPebbleTap(progress.soundEnabled);
                            //     onOpenWordGarden();
                        }}
                        className="p-2 rounded-full text-[#4E5950] hover:bg-[#EFECE4] border border-transparent hover:border-[#DDD8CD] transition-colors"
                        title="Word Garden & Vocabulary"
                    >
                        <BookOpen className="w-4 h-4" />
                    </button>

                    {/* Ambient Study Hum (Optional gentle focus soundscape) */}
                    <button
                        id="toggle-ambient-btn"
                        type="button"
                        onClick={() => {
                            sound.playPebbleTap(progress.soundEnabled);
                            // onToggleAmbient();
                        }}
                        className={`p-2 rounded-full transition-colors border ${progress.ambientSoundEnabled
                            ? 'bg-[#EBF2EE] text-[#3D664E] border-[#C8DBD0]'
                            : 'text-[#6C776E] hover:bg-[#EFECE4] border-transparent'
                            }`}
                        title={
                            progress.ambientSoundEnabled
                                ? 'Mute ambient soundscape'
                                : 'Enable calming ambient soundscape'
                        }
                    >
                        <Wind className="w-4 h-4" />
                    </button>

                    {/* Sound Chimes Toggle */}
                    <button
                        id="toggle-sound-btn"
                        type="button"
                        onClick={() => {
                            // onToggleSound();
                        }}
                        className={`p-2 rounded-full transition-colors border ${progress.soundEnabled
                            ? 'text-[#3E4740] hover:bg-[#EFECE4] border-transparent'
                            : 'text-[#A0A8A2] hover:bg-[#EFECE4] border-transparent'
                            }`}
                        title={progress.soundEnabled ? 'Mute sound chimes' : 'Unmute sound chimes'}
                    >
                        {progress.soundEnabled ? (
                            <Volume2 className="w-4 h-4" />
                        ) : (
                            <VolumeX className="w-4 h-4" />
                        )}
                    </button>
                </div>

            </div>
        </header>
    );
}
