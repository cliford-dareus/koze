"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const SESSION_KEY = "koze-splash-seen";
const HOLD_MS = 16000;

export default function AnimatedSplash() {
    const reduceMotion = useReducedMotion();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        try {
            if (sessionStorage.getItem(SESSION_KEY) === "1") return;
        } catch {
            // private mode — still show once this mount
        }

        setVisible(true);

        const hold = reduceMotion ? 400 : HOLD_MS;
        const t = window.setTimeout(() => {
            setVisible(false);
            try {
                sessionStorage.setItem(SESSION_KEY, "1");
            } catch {
                // ignore
            }
        }, hold);

        return () => window.clearTimeout(t);
    }, [reduceMotion]);

    return (
        <AnimatePresence>
            {visible ? (
                <motion.div
                    key="koze-splash"
                    className="fixed inset-0 z-[80] flex items-center justify-center paper-grain"
                    style={{ backgroundColor: "hsl(var(--background))" }}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: reduceMotion ? 0.2 : 0.45, ease: [0.22, 1, 0.36, 1] }}
                    aria-hidden
                >
                    <div className="flex flex-col items-center px-6 text-center">
                        <motion.span
                            className="flex size-16 items-center justify-center rounded-2xl bg-primary font-display text-2xl font-semibold text-primary-foreground shadow-soft"
                            initial={reduceMotion ? false : { scale: 0.72, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                        >
                            K
                        </motion.span>

                        <motion.p
                            className="mt-5 font-display text-4xl font-medium tracking-tight"
                            initial={reduceMotion ? false : { y: 12, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.18, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        >
                            Koze
                        </motion.p>

                        <motion.p
                            className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground"
                            initial={reduceMotion ? false : { opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.38, duration: 0.45 }}
                        >
                            Language studio
                        </motion.p>
                    </div>
                </motion.div>
            ) : null}
        </AnimatePresence>
    );
}
