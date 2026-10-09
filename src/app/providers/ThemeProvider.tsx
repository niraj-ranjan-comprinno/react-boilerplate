import { createContext, useContext, useState, useEffect, useCallback } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "theme";

function applyClass(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  /**
   * Start with "light" so React and the DOM agree during the initial render.
   * The inline script in index.html has already set the correct class on
   * <html> before JS loads, preventing a flash. A useEffect below syncs the
   * React state with whatever the script applied.
   */
  const [theme, setThemeState] = useState<Theme>("light");
  const [isDark, setIsDark] = useState(false);

  // Sync React state with the class that the no-flash inline script set
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (stored === "dark" || stored === "light" || stored === "system") {
      setThemeState(stored);
      const dark = stored === "dark" || (stored === "system" && systemDark);
      setIsDark(dark);
    } else {
      const dark = document.documentElement.classList.contains("dark");
      setThemeState(dark ? "dark" : "light");
      setIsDark(dark);
    }
  }, []);

  // Keep DOM in sync when theme state changes
  useEffect(() => {
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = theme === "dark" || (theme === "system" && systemDark);
    setIsDark(dark);
    applyClass(dark);
  }, [theme]);

  // Listen for OS preference changes in "system" mode
  useEffect(() => {
    if (theme !== "system") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      setIsDark(e.matches);
      applyClass(e.matches);
    };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(isDark ? "light" : "dark");
  }, [isDark, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, isDark, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a <ThemeProvider>");
  return ctx;
}
