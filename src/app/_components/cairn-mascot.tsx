"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export type CairnMood =
    | "idle"
    | "encourage"
    | "celebrate"
    | "thinking"
    | "speaking"
    | "listening"
    | "happy"
    | "puzzled";

type CairnMascotProps = {
    className?: string;
    /** Facial + body expression */
    mood?: CairnMood;
    label?: string;
    /** When false, skip motion entirely */
    animate?: boolean;
    /** Staggered bottom → middle → top entrance */
    ceremony?: boolean;
    /** Shared layout id (e.g. hero ↔ zen garden) */
    layoutId?: string;
};

const bodyMotion: Record<
    CairnMood,
    { y: number | number[]; rotate: number | number[]; scale: number | number[]; transition?: object }
> = {
    idle: {
        y: [0, -3, 0],
        rotate: 0,
        scale: 1,
        transition: { y: { duration: 5, repeat: Infinity, ease: "easeInOut" } },
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
        transition: { scale: { duration: 0.85, times: [0, 0.45, 1], ease: "easeOut" } },
    },
    thinking: {
        y: [0, -1.5, 0],
        rotate: [0, 3, 0, -2, 0],
        scale: 1,
        transition: {
            y: { duration: 3.2, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
        },
    },
    speaking: {
        y: [0, -1, 0],
        rotate: 0,
        scale: [1, 1.02, 1],
        transition: {
            y: { duration: 0.9, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 0.55, repeat: Infinity, ease: "easeInOut" },
        },
    },
    listening: {
        y: 0,
        rotate: [0, -4, -4, 0],
        scale: 1,
        transition: {
            rotate: {
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.2, 0.8, 1],
            },
        },
    },
    happy: {
        y: [0, -4, 0],
        rotate: 0,
        scale: [1, 1.04, 1],
        transition: {
            y: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
        },
    },
    puzzled: {
        y: 0,
        rotate: [0, -6, -5, 0],
        scale: 1,
        transition: {
            rotate: { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
        },
    },
};

const shadowMotion: Record<
    CairnMood,
    { scaleX: number | number[]; opacity: number | number[]; transition?: object }
> = {
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
    celebrate: { scaleX: 1, opacity: 0.35 },
    thinking: {
        scaleX: [1, 0.95, 1],
        opacity: [0.35, 0.28, 0.35],
        transition: { duration: 3.2, repeat: Infinity, ease: "easeInOut" },
    },
    speaking: {
        scaleX: [1, 0.96, 1],
        opacity: [0.35, 0.28, 0.35],
        transition: { duration: 0.9, repeat: Infinity, ease: "easeInOut" },
    },
    listening: { scaleX: 1, opacity: 0.35 },
    happy: {
        scaleX: [1, 0.88, 1],
        opacity: [0.35, 0.2, 0.35],
        transition: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
    },
    puzzled: { scaleX: 1, opacity: 0.35 },
};

function faceFor(mood: CairnMood, mouthOpen: boolean) {
    // Smile paths + eye geometry per emotion
    switch (mood) {
        case "celebrate":
        case "happy":
            return {
                smile: "M36 40 Q44 48 52 40",
                eyeY: 30,
                eyeRx: 3.6,
                eyeRy: 4.2,
                brow: null as null | string,
            };
        case "encourage":
            return {
                smile: "M37 41 Q44 46 51 41",
                eyeY: 31,
                eyeRx: 3.2,
                eyeRy: 3.8,
                brow: null,
            };
        case "thinking":
            return {
                smile: "M40 42 Q44 41 48 42",
                eyeY: 30,
                eyeRx: 3.0,
                eyeRy: 3.4,
                brow: "M32 24 Q38 21 42 24", // slight raised brow
            };
        case "speaking":
            return {
                smile: mouthOpen
                    ? "M40 40 Q44 48 48 40" // open oval-ish via deeper curve
                    : "M39 41 Q44 44 49 41",
                eyeY: 31,
                eyeRx: 3.2,
                eyeRy: 3.6,
                brow: null,
            };
        case "listening":
            return {
                smile: "M40 42 Q44 43 48 42",
                eyeY: 31,
                eyeRx: 3.4,
                eyeRy: 4.0,
                brow: null,
            };
        case "puzzled":
            return {
                smile: "M39 43 Q44 41 49 43",
                eyeY: 30,
                eyeRx: 3.2,
                eyeRy: 3.6,
                brow: "M50 24 Q56 20 62 25", // one raised brow
            };
        default:
            return {
                smile: "M38 41 Q44 44 50 41",
                eyeY: 31,
                eyeRx: 3.2,
                eyeRy: 3.8,
                brow: null,
            };
    }
}

const stoneEnter = (delay: number, motionOn: boolean) =>
    motionOn
        ? {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              transition: {
                  delay,
                  duration: 0.45,
                  ease: [0.22, 1, 0.36, 1],
              },
          }
        : { initial: false, animate: { opacity: 1, y: 0 } };

/**
 * Chibi cairn mascot with expressive moods for practice + translate TTS.
 */
export default function CairnMascot({
    className,
    mood = "idle",
    label = "Cairn, your quiet practice companion",
    animate = true,
    ceremony = false,
    layoutId,
}: CairnMascotProps) {
    const reduceMotion = useReducedMotion();
    const motionOn = animate && !reduceMotion;
    const runCeremony = ceremony && motionOn;

    const [blink, setBlink] = useState(false);
    const [mouthOpen, setMouthOpen] = useState(false);
    const [ceremonyDone, setCeremonyDone] = useState(!runCeremony);

    useEffect(() => {
        if (!runCeremony) {
            setCeremonyDone(true);
            return;
        }
        setCeremonyDone(false);
        const t = window.setTimeout(() => setCeremonyDone(true), 900);
        return () => window.clearTimeout(t);
    }, [runCeremony]);

    // Idle blink
    useEffect(() => {
        if (!motionOn || mood !== "idle" || !ceremonyDone) {
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
    }, [motionOn, mood, ceremonyDone]);

    // Speaking: mouth flap
    useEffect(() => {
        if (!motionOn || mood !== "speaking") {
            setMouthOpen(false);
            return;
        }
        const id = window.setInterval(() => {
            setMouthOpen((o) => !o);
        }, 180);
        return () => window.clearInterval(id);
    }, [motionOn, mood]);

    const face = faceFor(mood, mouthOpen);
    const eyeRy = blink ? 0.35 : face.eyeRy;

    const body =
        motionOn && ceremonyDone
            ? bodyMotion[mood]
            : { y: 0, rotate: 0, scale: 1 };
    const shadow =
        motionOn && ceremonyDone
            ? shadowMotion[mood]
            : { scaleX: 1, opacity: 0.35 };

    const bottom = stoneEnter(0, runCeremony);
    const middle = stoneEnter(0.1, runCeremony);
    const top = stoneEnter(0.2, runCeremony);

    return (
        <motion.div
            layoutId={layoutId}
            className={cn("inline-flex", className)}
            animate={body}
            initial={
                (mood === "celebrate" || mood === "happy") && motionOn
                    ? { scale: 0.94 }
                    : false
            }
            style={{ transformOrigin: "50% 85%" }}
            transition={{
                layout: { type: "spring", stiffness: 280, damping: 28 },
            }}
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

                <motion.ellipse
                    cx="48"
                    cy="106"
                    rx="26"
                    ry="3.5"
                    className="fill-muted-foreground/15"
                    animate={shadow}
                    style={{ transformOrigin: "48px 106px" }}
                />

                <motion.g {...bottom}>
                    <ellipse
                        cx="48"
                        cy="94"
                        rx="28"
                        ry="11"
                        className="fill-muted-foreground/20 dark:fill-muted-foreground/30"
                    />
                    <ellipse cx="48" cy="92" rx="26" ry="9.5" className="fill-muted" />
                    <circle cx="36" cy="91" r="1.2" className="fill-primary/25" />
                    <circle cx="58" cy="93" r="0.9" className="fill-primary/20" />
                </motion.g>

                <motion.g {...middle}>
                    <ellipse
                        cx="48"
                        cy="78"
                        rx="20"
                        ry="9"
                        className="fill-muted-foreground/20 dark:fill-muted-foreground/30"
                    />
                    <ellipse cx="48" cy="76" rx="18.5" ry="8" className="fill-muted" />
                    <circle cx="42" cy="75" r="0.8" className="fill-primary/20" />
                </motion.g>

                <motion.g {...top}>
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

                    {face.brow && (
                        <path
                            d={face.brow}
                            className="stroke-current"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            fill="none"
                        />
                    )}

                    <ellipse
                        cx="38"
                        cy={face.eyeY}
                        rx={face.eyeRx}
                        ry={eyeRy}
                        className="fill-current transition-[ry] duration-75"
                    />
                    <ellipse
                        cx="58"
                        cy={face.eyeY}
                        rx={face.eyeRx}
                        ry={eyeRy}
                        className="fill-current transition-[ry] duration-75"
                    />
                    {!blink && (
                        <>
                            <circle
                                cx="36.5"
                                cy={face.eyeY - 1.4}
                                r="1.35"
                                className="fill-card"
                            />
                            <circle
                                cx="56.5"
                                cy={face.eyeY - 1.4}
                                r="1.35"
                                className="fill-card"
                            />
                            <circle
                                cx="39.2"
                                cy={face.eyeY + 1.2}
                                r="0.55"
                                className="fill-card/80"
                            />
                            <circle
                                cx="59.2"
                                cy={face.eyeY + 1.2}
                                r="0.55"
                                className="fill-card/80"
                            />
                        </>
                    )}

                    {/* Mouth */}
                    {mood === "speaking" && mouthOpen ? (
                        <ellipse
                            cx="44"
                            cy="44"
                            rx="5"
                            ry="3.5"
                            className="fill-current/80"
                        />
                    ) : (
                        <path
                            d={face.smile}
                            className="stroke-current"
                            strokeWidth="2"
                            strokeLinecap="round"
                            fill="none"
                        />
                    )}
                </motion.g>

                {/* Thinking dots */}
                {mood === "thinking" && (
                    <motion.g
                        animate={
                            motionOn
                                ? { opacity: [0.3, 1, 0.3] }
                                : { opacity: 0.7 }
                        }
                        transition={{ duration: 1.4, repeat: Infinity }}
                    >
                        <circle cx="72" cy="18" r="1.6" className="fill-primary/70" />
                        <circle cx="78" cy="14" r="1.3" className="fill-primary/55" />
                        <circle cx="82" cy="9" r="1" className="fill-primary/40" />
                    </motion.g>
                )}

                {/* Listening ear pulse */}
                {mood === "listening" && (
                    <motion.circle
                        cx="72"
                        cy="40"
                        r="6"
                        className="fill-none stroke-primary/40"
                        strokeWidth="1.5"
                        animate={
                            motionOn
                                ? { scale: [1, 1.35, 1], opacity: [0.5, 0.15, 0.5] }
                                : { opacity: 0.4 }
                        }
                        transition={{ duration: 1.6, repeat: Infinity }}
                        style={{ transformOrigin: "72px 40px" }}
                    />
                )}

                {(mood === "celebrate" || mood === "happy") && (
                    <motion.g
                        initial={motionOn ? { opacity: 0, scale: 0.6 } : false}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            duration: 0.5,
                            delay: runCeremony ? 0.35 : 0.15,
                        }}
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

                {mood === "encourage" && (
                    <motion.path
                        d="M72 20 L73 23 L76 24 L73 25 L72 28 L71 25 L68 24 L71 23 Z"
                        className="fill-primary/45"
                        initial={runCeremony ? { opacity: 0 } : false}
                        animate={
                            motionOn && ceremonyDone
                                ? { opacity: [0.35, 0.9, 0.35], y: [0, -2, 0] }
                                : { opacity: ceremonyDone ? 0.6 : 0 }
                        }
                        transition={{
                            duration: 2.4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: runCeremony ? 0.4 : 0,
                        }}
                    />
                )}
            </svg>
        </motion.div>
    );
}
