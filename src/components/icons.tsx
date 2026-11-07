export type IconName = "grid" | "calendar" | "pot" | "cart" | "sliders" | "arrow" | "leaf" | "check" | "book" | "clock";

const paths: Record<IconName, string> = {
  grid: "M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z",
  calendar: "M4 5h16v16H4z M4 10h16 M8 3v4 M16 3v4 M8 14h2 M14 14h2 M8 17h2",
  pot: "M5 10h14v7a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z M2 11h3 M19 11h3 M4 7h16 M9 4h6 M12 4v3",
  cart: "M2 3h3l3 12h11l3-9H6 M9 20h.01 M18 20h.01 M8 15l-1 3h13",
  sliders: "M4 5h16 M4 12h16 M4 19h16 M9 3v4 M15 10v4 M8 17v4",
  arrow: "M5 12h14 M14 7l5 5-5 5",
  leaf: "M20 3C8 2 3 7 4 14c1 7 9 8 13 3 3-4 3-9 3-14z M5 19L16 8",
  check: "M5 12l4 4L19 6",
  book: "M12 6C8 3 4 3 2 4v16c3-1 7-1 10 1 3-2 7-2 10-1V4c-3-1-7-1-10 2z M12 6v15",
  clock: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18 M12 7v5l3 2",
};

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>;
}

export function BowlArt({ variant = 0 }: { variant?: number }) {
  const colors = [["#d4df9f", "#b86d43", "#739b59"], ["#e5cc8a", "#9b5b36", "#79a173"], ["#ead2a6", "#b98848", "#638755"]][variant % 3];
  return <svg viewBox="0 0 320 190" className="bowl-art" aria-hidden="true">
    <ellipse cx="161" cy="159" rx="101" ry="15" fill="#343a2714" />
    <path d="M48 87h224c-5 61-49 82-111 82S56 148 48 87" fill="#f8f5e9" />
    <ellipse cx="160" cy="86" rx="112" ry="55" fill="#fffdf5" />
    <ellipse cx="160" cy="86" rx="98" ry="44" fill={colors[0]} />
    <path d="M67 87c16-36 57-41 74-14s-15 53-55 38z" fill={colors[2]} />
    <path d="M149 46c29-8 76 11 78 33-7 23-52 14-72 4z" fill={colors[1]} />
    {Array.from({ length: 13 }, (_, i) => <ellipse key={i} cx={145 + (i % 5) * 13} cy={93 + Math.floor(i / 5) * 9} rx="8" ry="4" fill="#fff2c9" transform={`rotate(${i * 11} ${145 + (i % 5) * 13} ${93 + Math.floor(i / 5) * 9})`} />)}
    <circle cx="109" cy="74" r="9" fill="#d77853" /><circle cx="89" cy="99" r="8" fill="#d77853" />
    <path d="M224 101l53-63 M232 108l52-62" stroke="#a89879" strokeWidth="6" strokeLinecap="round" />
    <path d="M94 132c26 20 77 26 107 8" fill="none" stroke="#e8e4d4" strokeWidth="4" />
  </svg>;
}
