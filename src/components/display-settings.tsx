"use client";

import { Children, cloneElement, createContext, isValidElement, useContext, useEffect, useSyncExternalStore, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { browserLanguage, isLanguage, languageLocale, languages, translate, type Language, type Theme } from "@/lib/i18n";
import { Dropdown } from "./dropdown";
import { Icon } from "./icons";

const key = "batch-budget:display";
type Display = { language: Language; theme: Theme; error: string | null };
const server: Display = { language: "en", theme: "light", error: null };
let snapshot = server;
let initialized = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!initialized) {
    initialized = true;
    snapshot = { language: browserLanguage(navigator.languages), theme: "light", error: null };
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const saved: unknown = JSON.parse(raw);
        if (typeof saved !== "object" || saved === null || !("language" in saved) || !isLanguage(saved.language) ||
          !("theme" in saved) || (saved.theme !== "light" && saved.theme !== "dark")) {
          throw new Error("Invalid display settings.");
        }
        snapshot = { language: saved.language, theme: saved.theme, error: null };
      }
    } catch (cause) {
      snapshot = { ...snapshot, error: `Could not restore display settings: ${cause instanceof Error ? cause.message : "browser storage is unavailable"}` };
    }
  }
  return () => { listeners.delete(listener); };
}

function updateDisplay(next: Partial<Pick<Display, "language" | "theme">>) {
  snapshot = { ...snapshot, ...next, error: null };
  try {
    localStorage.setItem(key, JSON.stringify({ language: snapshot.language, theme: snapshot.theme }));
  } catch (cause) {
    snapshot = { ...snapshot, error: `Could not save display settings: ${cause instanceof Error ? cause.message : "browser storage is unavailable"}` };
  }
  emit();
}

const Context = createContext<Display>(server);
const pageTitles: Record<string, string> = { "/": "Overview", "/meal-planner": "Meal calendar", "/menu": "Meal list", "/prep-sessions": "Prep sessions", "/shopping-list": "Shopping list", "/preferences": "Preferences" };

export function DisplayProvider({ children }: { children: ReactNode }) {
  const settings = useSyncExternalStore(subscribe, () => snapshot, () => server);
  const pathname = usePathname();
  useEffect(() => {
    document.documentElement.lang = settings.language;
    document.documentElement.dataset.theme = settings.theme;
  }, [settings.language, settings.theme]);
  return <Context.Provider value={settings}>
    {pageTitles[pathname] && <title>{`${translate(pageTitles[pathname], settings.language)} | Batch & Budget`}</title>}
    {settings.error && <p className="notice danger display-error" role="alert">{translate(settings.error, settings.language)}</p>}
    {children}
  </Context.Provider>;
}

export function useI18n() {
  const settings = useContext(Context);
  return { ...settings, locale: languageLocale(settings.language), t: (text: string) => translate(text, settings.language) };
}

// Keep canonical recipe IDs, ingredients, input values and stored preferences
// untouched; localization only transforms rendered text and descriptive labels.
export function Localize({ children }: { children: ReactNode }) {
  const { t, locale } = useI18n();
  function visitChildren(nodes: ReactNode): ReactNode[] {
    const result: ReactNode[] = [];
    let text = "";
    function flush() {
      if (text) result.push(t(text));
      text = "";
    }
    Children.toArray(nodes).forEach((node) => {
      if (typeof node === "string" || typeof node === "number") {
        text += typeof node === "number" ? node.toLocaleString(locale) : node;
      } else {
        flush();
        result.push(visit(node));
      }
    });
    flush();
    return result;
  }
  function visit(node: ReactNode): ReactNode {
    if (typeof node === "string") return t(node);
    if (typeof node === "number") return node.toLocaleString(locale);
    if (!isValidElement<{ children?: ReactNode; title?: string; placeholder?: string; "aria-label"?: string; translate?: "yes" | "no" }>(node)) return node;
    if (node.type === Localize || node.type === "script" || node.type === "style" || node.props.translate === "no") return node;
    const props = node.props;
    return cloneElement(node, {
      ...(typeof props.title === "string" ? { title: t(props.title) } : {}),
      ...(typeof props.placeholder === "string" ? { placeholder: t(props.placeholder) } : {}),
      ...(typeof props["aria-label"] === "string" ? { "aria-label": t(props["aria-label"]) } : {}),
      ...(props.children !== undefined ? { children: visitChildren(props.children) } : {}),
    });
  }
  return <>{visitChildren(children)}</>;
}

function Flag({ region }: { region: string }) {
  const stripes: Record<string, string[]> = {
    FR: ["#2449a4", "#fff", "#ed2939"], DE: ["#191919", "#dd2222", "#ffce00"],
    IT: ["#009246", "#fff", "#ce2b37"], NL: ["#ae1c28", "#fff", "#21468b"],
    RU: ["#fff", "#0039a6", "#d52b1e"], ES: ["#aa151b", "#f1bf00", "#aa151b"],
    PL: ["#fff", "#dc143c"], UA: ["#0057b7", "#ffd700"],
  };
  const colors = stripes[region];
  return <svg className="language-flag" width="22" height="16" viewBox="0 0 30 20" aria-hidden="true">
    {colors ? colors.map((color, index) => region === "FR" || region === "IT"
      ? <rect key={color} x={index * 10} width="10" height="20" fill={color} />
      : <rect key={color + index} y={index * 20 / colors.length} width="30" height={20 / colors.length} fill={color} />)
      : region === "NO" ? <><rect width="30" height="20" fill="#ba0c2f" /><path d="M10 0v20 M0 10h30" stroke="#fff" strokeWidth="6" /><path d="M10 0v20 M0 10h30" stroke="#00205b" strokeWidth="3" /></>
        : <><rect width="30" height="20" fill="#012169" /><path d="M0 0l30 20 M30 0L0 20" stroke="#fff" strokeWidth="4" /><path d="M0 0l30 20 M30 0L0 20" stroke="#c8102e" strokeWidth="1.5" /><path d="M15 0v20 M0 10h30" stroke="#fff" strokeWidth="6" /><path d="M15 0v20 M0 10h30" stroke="#c8102e" strokeWidth="3" /></>}
  </svg>;
}

export function DisplayControls() {
  const { language, theme, t } = useI18n();
  return <>
    <span className="language-select"><Dropdown label={t("Language")} value={language} onChange={(value) => {
      if (isLanguage(value)) updateDisplay({ language: value });
    }} options={languages.map((option) => ({ value: option.code, label: option.name, icon: <Flag region={option.region} /> }))} /></span>
    <button className="connect-button theme-button" type="button" aria-label={t(theme === "light" ? "Switch to dark mode" : "Switch to light mode")} title={t(theme === "light" ? "Switch to dark mode" : "Switch to light mode")} onClick={() => updateDisplay({ theme: theme === "light" ? "dark" : "light" })}>
      <Icon name={theme === "light" ? "moon" : "sun"} size={21} />
    </button>
  </>;
}
