export type IconName = "grid" | "calendar" | "pot" | "cart" | "sliders" | "arrow" | "arrowLeft" | "chevronUp" | "chevronDown" | "user" | "leaf" | "check" | "book" | "clock" | "trash" | "swap" | "sunrise" | "sun" | "moon" | "apple";

const paths: Record<IconName, string> = {
  grid: "M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z",
  calendar: "M4 5h16v16H4z M4 10h16 M8 3v4 M16 3v4 M8 14h2 M14 14h2 M8 17h2",
  pot: "M5 10h14v7a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z M2 11h3 M19 11h3 M4 7h16 M9 4h6 M12 4v3",
  cart: "M2 3h3l3 12h11l3-9H6 M9 20h.01 M18 20h.01 M8 15l-1 3h13",
  sliders: "M4 5h16 M4 12h16 M4 19h16 M9 3v4 M15 10v4 M8 17v4",
  arrow: "M5 12h14 M14 7l5 5-5 5",
  arrowLeft: "M19 12H5 M10 7l-5 5 5 5",
  chevronUp: "M6 15l6-6 6 6",
  chevronDown: "M6 9l6 6 6-6",
  user: "M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8 M4 21v-2a8 6 0 0 1 16 0v2",
  leaf: "M20 3C8 2 3 7 4 14c1 7 9 8 13 3 3-4 3-9 3-14z M5 19L16 8",
  check: "M5 12l4 4L19 6",
  book: "M12 6C8 3 4 3 2 4v16c3-1 7-1 10 1 3-2 7-2 10-1V4c-3-1-7-1-10 2z M12 6v15",
  clock: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18 M12 7v5l3 2",
  trash: "M3 6h18 M9 6V3h6v3 M5 6l1 15h12l1-15 M10 10v7 M14 10v7",
  swap: "M4 7h16 M16 3l4 4-4 4 M20 17H4 M8 13l-4 4 4 4",
  sunrise: "M2 18h20 M4 21h16 M7 15a5 5 0 0 1 10 0 M12 2v4 M4 7l2 2 M20 7l-2 2 M2 14h2 M20 14h2",
  sun: "M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10 M12 2v2 M12 20v2 M2 12h2 M20 12h2 M5 5l1.5 1.5 M17.5 17.5L19 19 M5 19l1.5-1.5 M17.5 6.5L19 5",
  moon: "M20 15.5A9 9 0 0 1 8.5 4 9 9 0 1 0 20 15.5Z",
  apple: "M12 7c-4-4-10-1-9 5s4 10 9 8c5 2 8-2 9-8s-5-9-9-5 M12 7V3 M12 4c1-3 4-3 6-2-1 3-4 4-6 2",
};

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>;
}
