"use client";

import { useEffect } from "react";
import {
    applyLanguageTheme,
    themeColorForLanguage,
} from "@/lib/language-theme";
import { loadProgress } from "@/lib/progress";

/**
 * Applies the current learning language's themeColor to document CSS variables.
 * Mount once near the app root so every page inherits the tint.
 */
export default function LanguageThemeSync() {
    useEffect(() => {
        const sync = () => {
            const progress = loadProgress();
            const hex = themeColorForLanguage(progress.learningLanguage);
            applyLanguageTheme(hex);
        };

        sync();

        const onThemeClass = () => sync();

        window.addEventListener("koze-progress", sync);
        window.addEventListener("storage", sync);

        // Re-apply when light/dark class toggles so luminance stays calm.
        const observer = new MutationObserver((mutations) => {
            for (const m of mutations) {
                if (m.attributeName === "class") onThemeClass();
            }
        });
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => {
            window.removeEventListener("koze-progress", sync);
            window.removeEventListener("storage", sync);
            observer.disconnect();
        };
    }, []);

    return null;
}
