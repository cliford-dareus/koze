export type ThemeMode = "light" | "dark" | "system";

export const THEME_STORAGE_KEY = "koze-theme-v1";

export function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function resolveTheme(mode: ThemeMode): "light" | "dark" {
  if (mode === "system") return getSystemTheme();
  return mode;
}

export function readStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return "system";
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (raw === "light" || raw === "dark" || raw === "system") return raw;
  } catch {
    // ignore
  }
  return "system";
}

export function writeStoredTheme(mode: ThemeMode) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    // ignore
  }
}

/** Apply resolved class on <html> and update theme-color meta when present. */
export function applyDocumentTheme(resolved: "light" | "dark") {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("dark", resolved === "dark");
  root.style.colorScheme = resolved;

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute(
      "content",
      resolved === "dark" ? "#161412" : "#F4F1EB",
    );
  }
}
