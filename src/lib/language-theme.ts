import { LANGUAGES } from "@/lib/languages";

export type Hsl = { h: number; s: number; l: number };

/** Parse #RRGGBB (or #RGB) into HSL components. */
export function hexToHsl(hex: string): Hsl | null {
    const raw = hex.trim().replace("#", "");
    if (!(raw.length === 3 || raw.length === 6)) return null;

    const full =
        raw.length === 3
            ? raw
                  .split("")
                  .map((c) => c + c)
                  .join("")
            : raw;

    const n = Number.parseInt(full, 16);
    if (Number.isNaN(n)) return null;

    const r = ((n >> 16) & 255) / 255;
    const g = ((n >> 8) & 255) / 255;
    const b = (n & 255) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;
    let h = 0;
    const l = (max + min) / 2;
    const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));

    if (d !== 0) {
        switch (max) {
            case r:
                h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
                break;
            case g:
                h = ((b - r) / d + 2) * 60;
                break;
            default:
                h = ((r - g) / d + 4) * 60;
                break;
        }
    }

    return {
        h: Math.round(h),
        s: Math.round(s * 100),
        l: Math.round(l * 100),
    };
}

export function themeColorForLanguage(code: string | null | undefined): string | undefined {
    if (!code) return undefined;
    return LANGUAGES.find((l) => l.value === code)?.themeColor;
}

const OVERRIDES = [
    "--primary",
    "--ring",
    "--accent",
    "--accent-foreground",
    "--lang-theme",
    "--lang-theme-soft",
    "--lang-theme-glow",
] as const;

/** Softly map a language hex into calm primary/accent CSS variables. */
export function applyLanguageTheme(hex: string | undefined | null) {
    if (typeof document === "undefined") return;

    const root = document.documentElement;

    if (!hex) {
        for (const key of OVERRIDES) {
            root.style.removeProperty(key);
        }
        return;
    }

    const hsl = hexToHsl(hex);
    if (!hsl) return;

    const isDark = root.classList.contains("dark");
    // Keep saturation gentle so the sanctuary palette stays calm.
    const s = Math.min(Math.max(hsl.s, 18), 42);
    const primaryL = isDark
        ? Math.min(58, Math.max(hsl.l + 10, 42))
        : Math.min(34, Math.max(hsl.l - 6, 22));
    const accentL = isDark ? 16 : 90;
    const accentS = Math.max(s - 8, 10);

    root.style.setProperty("--primary", `${hsl.h} ${s}% ${primaryL}%`);
    root.style.setProperty("--ring", `${hsl.h} ${s}% ${primaryL}%`);
    root.style.setProperty("--accent", `${hsl.h} ${accentS}% ${accentL}%`);
    root.style.setProperty("--accent-foreground", `${hsl.h} ${s}% ${primaryL}%`);
    root.style.setProperty("--lang-theme", hex);
    root.style.setProperty(
        "--lang-theme-soft",
        `hsl(${hsl.h} ${s}% ${primaryL}% / ${isDark ? 0.18 : 0.12})`,
    );
    root.style.setProperty(
        "--lang-theme-glow",
        `hsl(${hsl.h} ${s}% ${primaryL}% / ${isDark ? 0.22 : 0.14})`,
    );
}

export function clearLanguageTheme() {
    applyLanguageTheme(null);
}
