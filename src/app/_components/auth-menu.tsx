"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { ProgressState, saveProgress, syncProgressFromCloud } from "@/lib/progress";
import { sound } from "@/lib/sound";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import ThemeToggle from "@/app/_components/theme-toggle";
import { LogIn, LogOut, Sparkles, Volume2, VolumeX, Wind } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AuthMenu({ progress }: { progress: ProgressState }) {
    const router = useRouter();
    const { data: session, status } = useSession();

    // Sound Toggle Handler
    const handleToggleSound = () => {
        const nextVal = !progress.soundEnabled;
        const updated: ProgressState = {
            ...progress,
            soundEnabled: nextVal,
        };
        saveProgress(updated);
    };

    // Ambient Hum Toggle
    const handleToggleAmbient = () => {
        const nextVal = !progress.ambientSoundEnabled;
        const updated: ProgressState = {
            ...progress,
            ambientSoundEnabled: nextVal,
        };
        saveProgress(updated);
    };

    useEffect(() => {
        if (status === "authenticated") {
            void syncProgressFromCloud();
        }
    }, [status]);

    if (status === "loading") {
        return (
            <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                …
            </span>
        );
    }

    const label = session?.user.name?.split(" ")[0] || "Account";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    id="user-profile-header-btn"
                    type="button"
                    onClick={() => {
                        sound.playPebbleTap(progress.soundEnabled);
                    }}
                    className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1  bg-card text-xs font-medium cursor-pointer p-2 rounded-full text-foreground hover:bg-secondary border border-transparent hover:border-border transition-colors"
                    title="User Profile & Settings"
                >
                    <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold">
                        {label ? label[0].toUpperCase() : 'C'}
                    </div>
                    <span className="hidden sm:inline font-medium text-xs">
                        {label || 'Profile'}
                    </span>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold">
                            {label ? label[0].toUpperCase() : 'C'}
                        </div>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-medium">{label}</span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <Sparkles />
                        Upgrade to Pro
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <button
                            id="toggle-ambient-btn"
                            type="button"
                            onClick={() => {
                                sound.playPebbleTap(progress.soundEnabled);
                                handleToggleAmbient();
                            }}
                            className={`w-full flex items-center gap-2 rounded-full transition-colors border ${progress.ambientSoundEnabled
                                ? 'bg-accent text-primary border-primary/30 px-2'
                                : 'text-foreground hover:bg-secondary border-transparent'
                                }`}
                            title={
                                progress.ambientSoundEnabled
                                    ? 'Mute ambient soundscape'
                                    : 'Enable calming ambient soundscape'
                            }
                        >
                            <Wind className="w-4 h-4" />
                            Sound
                        </button>
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                        <button
                            id="toggle-sound-btn"
                            type="button"
                            onClick={() => {
                                handleToggleSound();
                            }}
                            className={`flex items-center gap-2 rounded-full transition-colors border ${progress.soundEnabled
                                ? 'text-foreground hover:bg-secondary border-transparent'
                                : 'text-muted-foreground hover:bg-secondary border-transparent'
                                }`}
                            title={progress.soundEnabled ? 'Mute ambient sound' : 'Unmute ambient sound'}
                        >
                            {progress.soundEnabled ? (
                                <Volume2 className="w-4 h-4" />
                            ) : (
                                <VolumeX className="w-4 h-4" />
                            )}
                            Chimes
                        </button>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    {!session?.user ?
                        <button
                            type="button"
                            className="flex items-center gap-2"
                            onClick={() => router.push("/login")}
                        >
                            <LogIn />
                            Log in
                        </button>
                        :
                        <button
                            type="button"
                            className="flex items-center gap-2"
                            onClick={() => signOut({ callbackUrl: "/" })}
                        >
                            <LogOut />
                            Log out
                        </button>}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
