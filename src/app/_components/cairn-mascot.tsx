"use client";

import { cn } from "@/lib/utils";

type CairnMascotProps = {
    className?: string;
    /** Visual mood for empty states and soft feedback */
    mood?: "idle" | "encourage" | "celebrate";
    /** Accessible label; defaults to a short calm description */
    label?: string;
};

/**
 * Chibi cairn mascot — oversized top stone with a soft face,
 * two smaller body stones. Theme-aware fills for light/dark.
 */
export default function CairnMascot({
    className,
    mood = "idle",
    label = "Cairn, your quiet practice companion",
}: CairnMascotProps) {
    // Chibi face sits on the big top stone (center ~ cy 34)
    const smile =
        mood === "celebrate"
            ? "M36 40 Q44 48 52 40"
            : mood === "encourage"
              ? "M37 41 Q44 46 51 41"
              : "M38 41 Q44 44 50 41";

    const eyeY = mood === "celebrate" ? 30 : 31;
    const eyeRx = mood === "celebrate" ? 3.6 : 3.2;
    const eyeRy = mood === "celebrate" ? 4.2 : 3.8;

    return (
        <svg
            viewBox="0 0 96 112"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn("text-foreground", className)}
            role="img"
            aria-label={label}
        >
            <title>{label}</title>

            {/* Soft ground shadow */}
            <ellipse
                cx="48"
                cy="106"
                rx="26"
                ry="3.5"
                className="fill-muted-foreground/15"
            />

            {/* Bottom stone — wide, short (chibi body) */}
            <ellipse
                cx="48"
                cy="94"
                rx="28"
                ry="11"
                className="fill-muted-foreground/20 dark:fill-muted-foreground/30"
            />
            <ellipse
                cx="48"
                cy="92"
                rx="26"
                ry="9.5"
                className="fill-muted"
            />
            {/* Tiny moss speckles */}
            <circle cx="36" cy="91" r="1.2" className="fill-primary/25" />
            <circle cx="58" cy="93" r="0.9" className="fill-primary/20" />

            {/* Middle stone — smaller */}
            <ellipse
                cx="48"
                cy="78"
                rx="20"
                ry="9"
                className="fill-muted-foreground/20 dark:fill-muted-foreground/30"
            />
            <ellipse
                cx="48"
                cy="76"
                rx="18.5"
                ry="8"
                className="fill-muted"
            />
            <circle cx="42" cy="75" r="0.8" className="fill-primary/20" />

            {/* Top stone — oversized chibi head */}
            <ellipse
                cx="48"
                cy="48"
                rx="30"
                ry="28"
                className="fill-muted-foreground/25 dark:fill-muted-foreground/35"
            />
            <ellipse
                cx="48"
                cy="46"
                rx="28"
                ry="26"
                className="fill-card stroke-border"
                strokeWidth="1.25"
            />

            {/* Soft cheek blush */}
            <ellipse
                cx="32"
                cy="40"
                rx="5"
                ry="3"
                className="fill-rose-300/50 dark:fill-rose-400/30"
            />
            <ellipse
                cx="64"
                cy="40"
                rx="5"
                ry="3"
                className="fill-rose-300/50 dark:fill-rose-400/30"
            />

            {/* Big chibi eyes */}
            <ellipse
                cx="38"
                cy={eyeY}
                rx={eyeRx}
                ry={eyeRy}
                className="fill-current"
            />
            <ellipse
                cx="58"
                cy={eyeY}
                rx={eyeRx}
                ry={eyeRy}
                className="fill-current"
            />
            {/* Eye highlights */}
            <circle
                cx="36.5"
                cy={eyeY - 1.4}
                r="1.35"
                className="fill-card"
            />
            <circle
                cx="56.5"
                cy={eyeY - 1.4}
                r="1.35"
                className="fill-card"
            />
            <circle
                cx="39.2"
                cy={eyeY + 1.2}
                r="0.55"
                className="fill-card/80"
            />
            <circle
                cx="59.2"
                cy={eyeY + 1.2}
                r="0.55"
                className="fill-card/80"
            />

            {/* Smile */}
            <path
                d={smile}
                className="stroke-current"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
            />

            {/* Celebrate sparkles */}
            {mood === "celebrate" && (
                <>
                    <path
                        d="M18 28 L19.5 31.5 L23 33 L19.5 34.5 L18 38 L16.5 34.5 L13 33 L16.5 31.5 Z"
                        className="fill-primary/70"
                    />
                    <path
                        d="M76 22 L77.2 24.8 L80 26 L77.2 27.2 L76 30 L74.8 27.2 L72 26 L74.8 24.8 Z"
                        className="fill-primary/60"
                    />
                    <circle cx="70" cy="40" r="1.4" className="fill-primary/50" />
                    <circle cx="24" cy="18" r="1.1" className="fill-primary/40" />
                </>
            )}

            {/* Encourage: tiny upward spark */}
            {mood === "encourage" && (
                <path
                    d="M72 20 L73 23 L76 24 L73 25 L72 28 L71 25 L68 24 L71 23 Z"
                    className="fill-primary/45"
                />
            )}
        </svg>
    );
}
