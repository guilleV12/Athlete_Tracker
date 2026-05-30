import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  applyTheme,
  getNextTheme,
  readStoredTheme,
  storeTheme,
} from "../lib/theme";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [preference, setPreference] = useState(readStoredTheme);
  const [resolved, setResolved] = useState(() => applyTheme(readStoredTheme()));

  useEffect(() => {
    setResolved(applyTheme(preference));
  }, [preference]);

  useEffect(() => {
    if (preference !== "system") return undefined;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setResolved(applyTheme("system"));

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [preference]);

  const cycleTheme = useCallback(() => {
    setPreference((current) => {
      const next = getNextTheme(current);
      storeTheme(next);
      return next;
    });
  }, []);

  const setTheme = useCallback((next) => {
    storeTheme(next);
    setPreference(next);
  }, []);

  const value = useMemo(
    () => ({ preference, resolved, cycleTheme, setTheme }),
    [preference, resolved, cycleTheme, setTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme debe usarse dentro de ThemeProvider");
  }
  return context;
}
