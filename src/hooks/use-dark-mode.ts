import { useState, useEffect, useCallback } from "react";

type Theme = "light" | "dark" | "system";

interface UseDarkModeReturn {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  toggle: () => void;
}

const STORAGE_KEY = "theme";

/**
 * Manages the application colour scheme.
 *
 * Reads the user's stored preference from localStorage, falls back to the
 * OS preference for "system", and persists changes.  The class `.dark` is
 * toggled on `<html>` to enable Tailwind's class-based dark utilities.
 */
export function useDarkMode(): UseDarkModeReturn {
  const [theme, setThemeState] = useState<Theme>("system");
  const [isDark, setIsDark] = useState(false);

  // Read persisted preference once on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored === "light" || stored === "dark" || stored === "system") {
      setThemeState(stored);
    }
  }, []);

  // Apply the computed dark flag whenever theme changes
  useEffect(() => {
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = theme === "dark" || (theme === "system" && systemDark);
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, [theme]);

  // Listen to OS preference changes when in "system" mode
  useEffect(() => {
    if (theme !== "system") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      setIsDark(e.matches);
      document.documentElement.classList.toggle("dark", e.matches);
    };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore quota errors
    }
  }, []);

  const toggle = useCallback(() => {
    setTheme(isDark ? "light" : "dark");
  }, [isDark, setTheme]);

  return { theme, isDark, setTheme, toggle };
}
