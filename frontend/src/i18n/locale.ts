export const supportedLocales = ["en", "ja"] as const;

export type Locale = (typeof supportedLocales)[number];

const localeStorageKey = "minimax-music3-studio.locale";

export function parseLocale(value: unknown): Locale {
  return value === "ja" ? "ja" : "en";
}

export function readLocale(): Locale {
  if (typeof window === "undefined") return "en";
  try {
    return parseLocale(window.localStorage.getItem(localeStorageKey));
  } catch {
    return "en";
  }
}

export function writeLocale(locale: Locale) {
  try {
    window.localStorage.setItem(localeStorageKey, locale);
  } catch {
    // Keep the current-session language even when browser storage is unavailable.
  }
}
