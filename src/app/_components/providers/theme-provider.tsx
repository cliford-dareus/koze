"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  applyDocumentTheme,
  readStoredTheme,
  resolveTheme,
  writeStoredTheme,
  type ThemeMode,
} from "@/lib/theme";

type ThemeContextValue = {
  mode: ThemeMode;
  resolved: "light" | "dark";
  setMode: (mode: ThemeMode) => void;
  cycleMode: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const CYCLE: ThemeMode[] = ["system", "light", "dark"];

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("system");
  const [resolved, setResolved] = useState<"light" | "dark">("light");
  const [ready, setReady] = useState(false);

  const apply = useCallback((nextMode: ThemeMode) => {
    const nextResolved = resolveTheme(nextMode);
    setModeState(nextMode);
    setResolved(nextResolved);
    applyDocumentTheme(nextResolved);
    writeStoredTheme(nextMode);
  }, []);

  useEffect(() => {
    const stored = readStoredTheme();
    apply(stored);
    setReady(true);

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const current = readStoredTheme();
      if (current === "system") {
        apply("system");
      }
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [apply]);

  const setMode = useCallback(
    (next: ThemeMode) => {
      apply(next);
    },
    [apply],
  );

  const cycleMode = useCallback(() => {
    const idx = CYCLE.indexOf(mode);
    const next = CYCLE[(idx + 1) % CYCLE.length]!;
    apply(next);
  }, [apply, mode]);

  const value = useMemo(
    () => ({ mode, resolved, setMode, cycleMode }),
    [mode, resolved, setMode, cycleMode],
  );

  // Avoid flashing wrong theme labels before hydration
  if (!ready) {
    return (
      <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
