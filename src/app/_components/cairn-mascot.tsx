"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type CairnMood = "idle" | "encourage" | "celebrate";

type CairnMascotProps = {
    className?: string;
    /** Visual mood for empty states and soft feedback */
    mood?: CairnMood;
    /** Accessible label; defaults to a short calm description */
    label?: string;
    /** When false, skip motion entirely (static SVG) */
    animate?: boolean;
};

const bodyMotion = {
    idle: {
        y: [0, -3, 0],
        rotate: 0,
        scale: 1,
        transition: {
            y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
        },
    },
    encourage: {
        y: [0, -2, 0],
        rotate: [0, -2.5, 2.5, 0],
        scale: 1,
        transition: {
            y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
        },
    },
    celebrate: {
        y: 0,
        rotate: 0,
        scale: [0.94, 1.06, 1],
        transition: {
            scale: { duration: 0.85, times: [0, 0.45, 1], ease: "easeOut" },
        },
    },
} as const;

const shadowMotion = {
    idle: {
        scaleX: [1, 0.9, 1],
        opacity: [0.35, 0.22, 0.35],
        transition: { duration: 5, repeat: Infinity, ease: "easeInOut" },
    },
    encourage: {
        scaleX: [1, 0.92, 1],
        opacity: [0.35, 0.25, 0.35],
        transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
    },
    celebrate: {
        scaleX: 1,
        opacity: 0.35,
    },
} as const;

/**
 * Chibi cairn mascot — oversized top stone with a soft face,
 * two smaller body stones. Theme-aware fills for light/dark.
 * Phase A+B: idle float, encourage sway, celebrate pop, idle blink.
 */
export default function CairnMascot({
    className,
    mood = "idle",
    label = "Cairn, your quiet practice companion",
    animate = true,
}: CairnMascotProps) {
    const reduceMotion = useReducedMotion();
    const motionOn = animate && !reduceMotion;

    const [blink, setBlink] = useState(false);

    // Soft idle blink every 4.5–7s; pause when tab hidden or mood changes
    useEffect(() => {
        if (!motionOn || mood !== "idle") {
            setBlink(false);
            return;
        }

        let timeoutId: number;
        let cancelled = false;

        const schedule = () => {
            const delay = 4500 + Math.random() * 2500;
            timeoutId = window.setTimeout(() => {
                if (cancelled || document.visibilityState === "hidden") {
                    schedule();
                    return;
                }
                setBlink(true);
                window.setTimeout(() => {
                    setBlink(false);
                    if (!cancelled) schedule();
                }, 140);
            }, delay);
        };

        schedule();
        return () => {
            cancelled = true;
            window.clearTimeout(timeoutId);
        };
    }, [motionOn, mood]);

    const smile =
        mood === "celebrate"
            ? "M36 40 Q44 48 52 40"
            : mood === "encourage"
              ? "M37 41 Q44 46 51 41"
              : "M38 41 Q44 44 50 41";

    const eyeY = mood === "celebrate" ? 30 : 31;
    const eyeRx = mood === "celebrate" ? 3.6 : 3.2;
    const eyeRyBase = mood === "celebrate" ? 4.2 : 3.8;
    const eyeRy = blink ? 0.35 : eyeRyBase;

    const body = motionOn ? bodyMotion[mood] : { y: 0, rotate: 0, scale: 1 };
    const shadow = motionOn ? shadowMotion[mood] : { scaleX: 1, opacity: 0.35 };

    return (
        <motion.div
            className={cn("inline-flex", className)}
            animate={body}
            initial={mood === "celebrate" && motionOn ? { scale: 0.94 } : false}
            style={{ transformOrigin: "50% 85%" }}
        >
            <svg
                viewBox="0 0 96 112"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-full w-full text-foreground"
                role="img"
                aria-label={label}
            >
                <title>{label}</title>

                {/* Soft ground shadow — breathes opposite to float */}
                <motion.ellipse
                    cx="48"
                    cy="106"
                    rx="26"
                    ry="3.5"
                    className="fill-muted-foreground/15"
                    animate={shadow}
                    style={{ transformOrigin: "48px 106px" }}
                />

                {/* Bottom stone */}
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
                <circle cx="36" cy="91" r="1.2" className="fill-primary/25" />
                <circle cx="58" cy="93" r="0.9" className="fill-primary/20" />

                {/* Middle stone */}
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

                {/* Top stone — chibi head */}
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

                {/* Eyes — blink by collapsing ry */}
                <ellipse
                    cx="38"
                    cy={eyeY}
                    rx={eyeRx}
                    ry={eyeRy}
                    className="fill-current transition-[ry] duration-75"
                />
                <ellipse
                    cx="58"
                    cy={eyeY}
                    rx={eyeRx}
                    ry={eyeRy}
                    className="fill-current transition-[ry] duration-75"
                />
                {!blink && (
                    <>
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
                    </>
                )}

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
                    <motion.g
                        initial={motionOn ? { opacity: 0, scale: 0.6 } : false}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                    >
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
                    </motion.g>
                )}

                {/* Encourage spark */}
                {mood === "encourage" && (
                    <motion.path
                        d="M72 20 L73 23 L76 24 L73 25 L72 28 L71 25 L68 24 L71 23 Z"
                        className="fill-primary/45"
                        animate={
                            motionOn
                                ? {
                                      opacity: [0.35, 0.9, 0.35],
                                      y: [0, -2, 0],
                                  }
                                : { opacity: 0.6 }
                        }
                        transition={{
                            duration: 2.4,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                )}
            </svg>
        </motion.div>
    );
}
