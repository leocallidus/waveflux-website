import en from "./en.json";
import ruJson from "./ru.json";

export const locales = ["en", "ru"] as const;
export type Locale = (typeof locales)[number];
export type Dictionary = typeof en;

const ru: Dictionary = ruJson;

export const dictionaries: Record<Locale, Dictionary> = { en, ru };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export function getLocalePath(locale: Locale): string {
  const base = import.meta.env.BASE_URL;
  return locale === "ru" ? `${base}ru/` : base;
}

export function interpolate(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    Object.hasOwn(values, key) ? String(values[key]) : match,
  );
}
