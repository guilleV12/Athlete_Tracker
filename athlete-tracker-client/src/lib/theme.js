export const THEME_STORAGE_KEY = "athlete-tracker-theme";
export const THEME_PREFERENCES = ["system", "light", "dark"];

export function readStoredTheme() {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    if (THEME_PREFERENCES.includes(value)) return value;
  } catch {
    /* ignore */
  }
  return "system";
}

export function storeTheme(preference) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    /* ignore */
  }
}

export function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function resolveTheme(preference) {
  if (preference === "light" || preference === "dark") return preference;
  return getSystemTheme();
}

/** Aplica el tema resuelto en <html> y devuelve "light" | "dark". */
export function applyTheme(preference) {
  const resolved = resolveTheme(preference);
  const root = document.documentElement;
  root.setAttribute("data-theme", resolved);
  root.style.colorScheme = resolved;
  return resolved;
}

export function getNextTheme(current) {
  const index = THEME_PREFERENCES.indexOf(current);
  const next = index === -1 ? 0 : (index + 1) % THEME_PREFERENCES.length;
  return THEME_PREFERENCES[next];
}
