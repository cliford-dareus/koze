"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import {
    ProgressState,
    saveProgress,
    syncProgressFromCloud,
} from "@/lib/progress";
import { sound } from "@/lib/sound";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
    BookOpen,
    GraduationCap,
    LogIn,
    LogOut,
    Monitor,
    Moon,
    Sun,
    UserRound,
    Volume2,
    Wind,
} from "lucide-react";
import { useTheme } from "@/app/_components/providers/theme-provider";

export default function AuthMenu({ progress }: { progress: ProgressState }) {
    const { data: session, status } = useSession();
    const { mode, cycleMode, resolved } = useTheme();

    const isAuthed = status === "authenticated" && Boolean(session?.user);
    const displayName =
        session?.user?.name?.trim() ||
        (isAuthed ? "Learner" : "Guest");
    const firstName = displayName.split(" ")[0] || "Guest";
    const initial = firstName.charAt(0).toUpperCase() || "K";
    const email = session?.user?.email || null;

    const soundOn = progress.soundEnabled !== false;
    const ambientOn = Boolean(progress.ambientSoundEnabled);

    // Cloud sync when signed in
    useEffect(() => {
        if (status === "authenticated") {
            void syncProgressFromCloud();
        }
    }, [status]);

    // Keep ambient engine in sync with stored preference
    useEffect(() => {
        sound.toggleAmbient(ambientOn);
        return () => {
            sound.toggleAmbient(false);
        };
    }, [ambientOn]);

    const persist = (patch: Partial<ProgressState>) => {
        saveProgress({ ...progress, ...patch });
    };

    const handleToggleSound = (next: boolean) => {
        persist({ soundEnabled: next });
        if (next) sound.playPebbleTap(true);
    };

    const handleToggleAmbient = (next: boolean) => {
        persist({ ambientSoundEnabled: next });
        sound.toggleAmbient(next);
        sound.playPebbleTap(soundOn);
    };

    if (status === "loading") {
        return (
            <span
                className="inline-flex size-8 items-center justify-center rounded-full border border-border bg-card text-xs text-muted-foreground"
                aria-hidden
            >
                …
            </span>
        );
    }

    const ThemeIcon =
        mode === "system" ? Monitor : resolved === "dark" ? Moon : Sun;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    id="user-profile-header-btn"
                    type="button"
                    onClick={() => sound.playPebbleTap(soundOn)}
                    className="flex items-center gap-1.5 rounded-full border border-transparent bg-card py-1 pl-1 pr-2 text-xs font-medium text-foreground transition-colors hover:border-border hover:bg-secondary"
                    title="Account & settings"
                    aria-label="Account menu"
                >
                    <span className="flex size-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                        {initial}
                    </span>
                    <span className="hidden max-w-[5.5rem] truncate sm:inline">
                        {firstName}
                    </span>
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 min-w-[14rem]">
                <DropdownMenuLabel className="font-normal">
                    <div className="flex items-center gap-2.5 px-0.5 py-0.5">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                            {initial}
                        </span>
                        <div className="min-w-0 flex-1 leading-tight">
                            <p className="truncate text-sm font-medium text-foreground">
                                {displayName}
                            </p>
                            <p className="truncate text-[11px] text-muted-foreground">
                                {email || "Practicing on this device"}
                            </p>
                        </div>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link
                            href="/profile"
                            className="cursor-pointer"
                            onClick={() => sound.playPebbleTap(soundOn)}
                        >
                            <UserRound />
                            Profile
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link
                            href="/lessons"
                            className="cursor-pointer"
                            onClick={() => sound.playPebbleTap(soundOn)}
                        >
                            <GraduationCap />
                            Lessons
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link
                            href="/reading"
                            className="cursor-pointer"
                            onClick={() => sound.playPebbleTap(soundOn)}
                        >
                            <BookOpen />
                            Reading shelf
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <DropdownMenuItem
                        onSelect={(e) => {
                            e.preventDefault();
                            cycleMode();
                            sound.playPebbleTap(soundOn);
                        }}
                    >
                        <ThemeIcon />
                        Theme
                        <span className="ml-auto text-[11px] capitalize text-muted-foreground">
                            {mode}
                        </span>
                    </DropdownMenuItem>

                    <DropdownMenuCheckboxItem
                        checked={soundOn}
                        onCheckedChange={(v) => handleToggleSound(Boolean(v))}
                        onSelect={(e) => e.preventDefault()}
                    >
                        <Volume2 />
                        Soft sounds
                    </DropdownMenuCheckboxItem>

                    <DropdownMenuCheckboxItem
                        checked={ambientOn}
                        onCheckedChange={(v) => handleToggleAmbient(Boolean(v))}
                        onSelect={(e) => e.preventDefault()}
                    >
                        <Wind />
                        Ambient soundscape
                    </DropdownMenuCheckboxItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                {!isAuthed ? (
                    <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                            <Link
                                href="/login"
                                className="cursor-pointer"
                                onClick={() => sound.playPebbleTap(soundOn)}
                            >
                                <LogIn />
                                Sign in
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link
                                href="/register"
                                className="cursor-pointer"
                                onClick={() => sound.playPebbleTap(soundOn)}
                            >
                                <UserRound />
                                Create account
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                ) : (
                    <DropdownMenuItem
                        variant="destructive"
                        onSelect={() => {
                            sound.playPebbleTap(soundOn);
                            void signOut({ callbackUrl: "/" });
                        }}
                    >
                        <LogOut />
                        Sign out
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
