import { messageTranslations } from "./messages";
import { translateFood } from "./food";

export const languages = [
  { code: "en", name: "English", region: "GB" },
  { code: "fr", name: "Français", region: "FR" },
  { code: "de", name: "Deutsch", region: "DE" },
  { code: "es", name: "Español", region: "ES" },
  { code: "it", name: "Italiano", region: "IT" },
  { code: "nl", name: "Nederlands", region: "NL" },
  { code: "ru", name: "Русский", region: "RU" },
  { code: "pl", name: "Polski", region: "PL" },
  { code: "uk", name: "Українська", region: "UA" },
  { code: "no", name: "Norsk", region: "NO" },
] as const;

export type Language = typeof languages[number]["code"];
export type Theme = "light" | "dark";

export function isLanguage(value: unknown): value is Language {
  return languages.some((language) => language.code === value);
}

export function browserLanguage(locales: readonly string[]): Language {
  for (const locale of locales) {
    const language = locale.split("-")[0].toLowerCase();
    if (language === "nb" || language === "nn") return "no";
    if (isLanguage(language)) return language;
  }
  return "en";
}

export function languageLocale(language: Language): string {
  const option = languages.find((option) => option.code === language)!;
  return `${language === "no" ? "nb" : language}-${option.region}`;
}

const messages = Object.fromEntries(Object.entries(messageTranslations).map(([key, values]) =>
  [key.trim(), values.map((value) => value.trim())]));
const fragments = Object.keys(messages).sort((a, b) => b.length - a.length);
const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const fragmentPattern = new RegExp(`(?<![\\p{L}])(?:${fragments.map(escape).join("|")})(?![\\p{L}])`, "gu");

const countForms: Record<string, Record<string, readonly [string, string, string]>> = {
  fr: { days: ["jour", "jours", "jours"], meals: ["repas", "repas", "repas"], occurrences: ["occurrence", "occurrences", "occurrences"], portions: ["portion", "portions", "portions"] },
  de: { days: ["Tag", "Tage", "Tage"], meals: ["Mahlzeit", "Mahlzeiten", "Mahlzeiten"], occurrences: ["Termin", "Termine", "Termine"], portions: ["Portion", "Portionen", "Portionen"] },
  es: { days: ["día", "días", "días"], meals: ["comida", "comidas", "comidas"], occurrences: ["fecha", "fechas", "fechas"], portions: ["ración", "raciones", "raciones"] },
  it: { days: ["giorno", "giorni", "giorni"], meals: ["pasto", "pasti", "pasti"], occurrences: ["occorrenza", "occorrenze", "occorrenze"], portions: ["porzione", "porzioni", "porzioni"] },
  nl: { days: ["dag", "dagen", "dagen"], meals: ["maaltijd", "maaltijden", "maaltijden"], occurrences: ["datum", "datums", "datums"], portions: ["portie", "porties", "porties"] },
  ru: { days: ["день", "дня", "дней"], meals: ["блюдо", "блюда", "блюд"], occurrences: ["дата", "даты", "дат"], portions: ["порция", "порции", "порций"] },
  pl: { days: ["dzień", "dni", "dni"], meals: ["posiłek", "posiłki", "posiłków"], occurrences: ["termin", "terminy", "terminów"], portions: ["porcja", "porcje", "porcji"] },
  uk: { days: ["день", "дні", "днів"], meals: ["страва", "страви", "страв"], occurrences: ["дата", "дати", "дат"], portions: ["порція", "порції", "порцій"] },
  no: { days: ["dag", "dager", "dager"], meals: ["måltid", "måltider", "måltider"], occurrences: ["dato", "datoer", "datoer"], portions: ["porsjon", "porsjoner", "porsjoner"] },
};

export function translate(text: string, language: Language): string {
  if (language === "en" || !text.trim() || text.trim() === "Batch & Budget") return text;
  const index = languages.findIndex((option) => option.code === language) - 1;
  const trimmed = text.trim();
  const exact = messages[trimmed]?.[index];
  if (exact !== undefined) return text.replace(trimmed, exact);
  text = text.replace(/\b(\d+) (days|meals|occurrences|portions)\b/g, (_, count: string, noun: string) => {
    const plural = new Intl.PluralRules(languageLocale(language)).select(Number(count));
    const forms = countForms[language][noun];
    return `${count} ${forms[plural === "one" ? 0 : plural === "few" ? 1 : 2]}`;
  });
  // Translate each original fragment once, never retranslate localized output.
  const parts: string[] = [];
  let cursor = 0;
  for (const match of text.matchAll(fragmentPattern)) {
    parts.push(translateFood(text.slice(cursor, match.index), index) ?? text.slice(cursor, match.index));
    parts.push(messages[match[0]][index]);
    cursor = match.index + match[0].length;
  }
  parts.push(translateFood(text.slice(cursor), index) ?? text.slice(cursor));
  return parts.join("");
}
