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
 * Placeholder cairn mascot — three stacked stones with a soft face on top.
 * Uses currentColor for the face so it inherits text color; stones use
 * muted fills that work in light and dark themes.
 */
export default function CairnMascot({
    className,
    mood = "idle",
    label = "Cairn, your quiet practice companion",
}: CairnMascotProps) {
    const smile =
        mood === "celebrate"
            ? "M38 30 Q44 36 50 30"
            : mood === "encourage"
              ? "M39 31 Q44 34 49 31"
              : "M40 31 Q44 33 48 31";

    return (
        <svg
            viewBox="0 0 88 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn("text-foreground", className)}
            role="img"
            aria-label={label}
        >
            <title>{label}</title>

            {/* Soft ground shadow */}
            <ellipse
                cx="44"
                cy="94"
                rx="28"
                ry="4"
                className="fill-muted-foreground/15"
            />

            {/* Bottom stone */}
            <ellipse
                cx="44"
                cy="78"
                rx="32"
                ry="16"
                className="fill-muted-foreground/25 dark:fill-muted-foreground/35"
            />
            <ellipse
                cx="44"
                cy="76"
                rx="30"
                ry="14"
                className="fill-muted"
            />

            {/* Middle stone */}
            <ellipse
                cx="44"
                cy="58"
                rx="24"
                ry="13"
                className="fill-muted-foreground/20 dark:fill-muted-foreground/30"
            />
            <ellipse
                cx="44"
                cy="56"
                rx="22"
                ry="11"
                className="fill-muted"
            />

            {/* Top stone (face) */}
            <ellipse
                cx="44"
                cy="36"
                rx="18"
                ry="15"
                className="fill-muted-foreground/25 dark:fill-muted-foreground/35"
            />
            <ellipse
                cx="44"
                cy="34"
                rx="17"
                ry="14"
                className="fill-card stroke-border"
                strokeWidth="1"
            />

            {/* Eyes */}
            <circle cx="38" cy="32" r="2.2" className="fill-current" />
            <circle cx="50" cy="32" r="2.2" className="fill-current" />

            {/* Smile */}
            <path
                d={smile}
                className="stroke-current"
                strokeWidth="1.6"
                strokeLinecap="round"
                fill="none"
            />

            {/* Celebrate glow rings */}
            {mood === "celebrate" && (
                <>
                    <circle
                        cx="44"
                        cy="48"
                        r="40"
                        className="fill-none stroke-primary/20"
                        strokeWidth="1"
                    />
                    <circle
                        cx="22"
                        cy="22"
                        r="1.5"
                        className="fill-primary/50"
                    />
                    <circle
                        cx="68"
                        cy="28"
                        r="1.2"
                        className="fill-primary/40"
                    />
                    <circle
                        cx="60"
                        cy="16"
                        r="1"
                        className="fill-primary/30"
                    />
                </>
            )}
        </svg>
    );
}
