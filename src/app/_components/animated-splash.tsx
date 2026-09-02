"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import SPLASH_IMAGE from "../../../public/splash_screen.gif";

const SESSION_KEY = "koze-splash-seen";
const HOLD_MS = 2000;

export default function AnimatedSplash() {
    // const reduceMotion = useReducedMotion();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        try {
            if (sessionStorage.getItem(SESSION_KEY) === "1") return;
        } catch {
            // private mode — still show once this mount
        }

        setVisible(true);

        const hold = HOLD_MS;
        const t = window.setTimeout(() => {
            setVisible(false);
            try {
                sessionStorage.setItem(SESSION_KEY, "1");
            } catch {
                // ignore
            }
        }, hold);

        return () => window.clearTimeout(t);
    }, []);

    return (
        <AnimatePresence>
            {visible ? (
                <motion.div
                    key="koze-splash"
                    className="fixed inset-0 z-[80] flex items-center justify-center paper-grain"
                    style={{ backgroundColor: "hsl(var(--background))" }}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    aria-hidden
                >
                    <div className="flex flex-col items-center text-center">
                        <Image
                            src={SPLASH_IMAGE}
                            alt=""
                            width={SPLASH_IMAGE.width}
                            height={SPLASH_IMAGE.height}
                        />
                    </div>
                </motion.div>
            ) : null}
        </AnimatePresence>
    );
}
