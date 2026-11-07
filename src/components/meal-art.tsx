"use client";

import type { Meal } from "@/lib/domain/models";
import { getMealArt } from "@/lib/meal-art";
import { useI18n } from "./display-settings";

export function MealArt({ meal }: { meal: Meal }) {
  const { t } = useI18n();
  const art = getMealArt(meal);
  const plate = ["pancakes", "toast", "wrap", "fruit"].includes(art.kind);
  return <svg viewBox="0 0 320 190" className="bowl-art" role="img" aria-label={t(`Illustration of ${meal.title}`)} data-meal-art={art.kind} data-base={art.base} data-protein={art.protein}>
    <ellipse cx="160" cy="157" rx="100" ry="13" fill="#343a2714" />
    {!plate && <path d="M48 86h224c-5 60-49 81-112 81S56 146 48 86" fill="#f8f5e9" />}
    <ellipse cx="160" cy={plate ? 112 : 86} rx="112" ry={plate ? 43 : 55} fill="#fffdf5" />
    <ellipse cx="160" cy={plate ? 112 : 86} rx="98" ry={plate ? 33 : 44} fill={plate ? "#eee9d9" : art.kind === "soup" ? "#d69559" : art.kind === "yogurt" ? "#f3eedf" : art.kind === "salad" ? "#a8bc85" : "#e8d5a5"} />
    {art.kind === "pancakes" ? <>
      {[121, 109, 97].map((y) => <g key={y}><ellipse cx="156" cy={y + 6} rx="68" ry="26" fill="#bc8951" /><ellipse cx="156" cy={y} rx="68" ry="26" fill="#dfb675" /></g>)}
      <path d="M128 83c13-7 40-4 48 4s-8 11-13 14c-9 4-2 17-11 18s-9-19-17-20c-14-1-18-10-7-16" fill="#aa6d3e" opacity=".8" />
      <path d="m145 78 20 3-5 13-20-4Z" fill="#f6df9e" />
      <Fruit kind={art.fruit} plate />
    </> : art.kind === "toast" ? <>
      {[0, 1].map((i) => <g key={i} transform={`translate(${i * 64 - 29} ${i * 7}) rotate(${i ? 12 : -12} 145 100)`}><path d="M112 137V88c-16-26 69-40 73-8l-3 58Z" fill="#b8804d" /><path d="M119 130V90c-12-18 59-32 59-8l-3 48Z" fill="#e4be83" />
        {art.jam ? <path d="M124 100c5-15 41-16 45-2l-1 25-42 2Z" fill="#b66863" /> : art.protein === "eggs" ? <><path d="M127 100c-7-13 12-24 24-14 18-5 31 13 17 25-12 14-37 4-41-11" fill="#faf5e4" /><circle cx="149" cy="101" r="11" fill="#e3b751" /></> : <path d="M125 105c4-14 36-15 43-3l-3 20-38 3Z" fill={art.tomato ? "#bd7655" : "#b4be84"} />}
      </g>)}
    </> : art.kind === "wrap" ? <>
      <g transform="rotate(-20 160 105)"><path d="m94 82 130 6-4 45-132-5Z" fill="#ddc494" /><ellipse cx="220" cy="111" rx="17" ry="23" fill="#adbd7c" /><path d="m105 75 93 12-3 54-94-15Z" fill="#eddab2" /><path d="m113 89 78 14M111 105l75 14" stroke="#d5bc8d" strokeWidth="3" /><ellipse cx="221" cy="110" rx="9" ry="17" fill={art.protein === "chicken" ? "#bd885d" : "#b88c5b"} /><circle cx="226" cy="103" r="5" fill="#ce7957" /></g>
    </> : art.kind === "fruit" ? <Fruit kind={art.fruit} plate /> :
      art.kind === "porridge" || art.kind === "yogurt" ? <>
        {Array.from({ length: 18 }, (_, i) => <ellipse key={i} cx={98 + i % 6 * 22} cy={65 + Math.floor(i / 6) * 17} rx="7" ry="3" fill={art.kind === "porridge" ? "#c7ac7a" : "#d9bf8f"} transform={`rotate(${i * 29} ${98 + i % 6 * 22} ${65 + Math.floor(i / 6) * 17})`} />)}
        <Fruit kind={art.fruit} />
      </> : <>
        {art.kind === "soup" ? <>
          <path d="M91 88c26-32 81 29 126-2" fill="none" stroke="#efba77" strokeWidth="4" />
          {Array.from({ length: 9 }, (_, i) => <rect key={i} x={105 + i % 4 * 25} y={67 + Math.floor(i / 4) * 17} width="11" height="8" rx="3" fill={i % 2 ? "#b4b77b" : "#e5ba79"} />)}
        </> : <Base kind={art.base} />}
        <Protein kind={art.protein} />
        <Vegetables kind={art.vegetables} />
        {art.tomato && <><circle cx="109" cy="74" r="9" fill="#d77853" /><circle cx="89" cy="99" r="8" fill="#d77853" /><path d="m107 68 3 6 6-3" fill="none" stroke="#8c9a64" strokeWidth="2" /></>}
      </>}
    {!plate && <><path d="M241 120l36-69" stroke="#a89879" strokeWidth="6" strokeLinecap="round" /><ellipse cx="241" cy="119" rx="8" ry="13" transform="rotate(28 241 119)" fill="#b6a889" /><path d="M96 133c25 20 75 24 106 8" fill="none" stroke="#e8e4d4" strokeWidth="4" /></>}
  </svg>;
}

function Base({ kind }: { kind: string }) {
  return <>{Array.from({ length: 18 }, (_, i) => {
    const x = 100 + i % 6 * 20;
    const y = 77 + Math.floor(i / 6) * 15;
    return kind === "potatoes" ? <path key={i} d={`M${x} ${y}l12-6 8 13-13 6Z`} fill={i % 2 ? "#e4c47f" : "#f0d899"} /> :
      kind === "pasta" ? <path key={i} d={`M${x} ${y}q12-11 15 2q-1 9-11 7`} fill="none" stroke={i % 2 ? "#d7ae66" : "#ebca84"} strokeWidth="5" strokeLinecap="round" /> :
      <ellipse key={i} cx={x} cy={y} rx={kind === "rice" ? 7 : 5} ry="3" fill={kind === "rice" ? "#fff0cc" : "#d7bc7e"} transform={`rotate(${i * 23} ${x} ${y})`} />;
  })}</>;
}

function Protein({ kind }: { kind: string }) {
  if (kind === "none") return null;
  if (kind === "eggs") return <g><ellipse cx="193" cy="75" rx="26" ry="17" fill="#fcf8e7" /><ellipse cx="193" cy="75" rx="12" ry="10" fill="#dfb249" /></g>;
  if (kind === "fish") return <g transform="rotate(12 186 72)"><path d="M150 60q34-15 68 6l-4 29q-34 8-62-9Z" fill="#d7a389" /><path d="m161 59 4 27m12-28 5 31m10-27 5 27" stroke="#f0c7ab" strokeWidth="3" /></g>;
  if (kind === "chicken" || kind === "meat") return <>{[0, 1, 2].map((i) => <g key={i} transform={`translate(${i * 17} ${i * 8})`}><path d="M151 54q10-10 26-1l14 18-16 11-24-11Z" fill={kind === "chicken" ? "#bd8b59" : "#986b50"} /><path d="m158 57 15 17m-5-21 14 16" stroke={kind === "chicken" ? "#e3b681" : "#bf9271"} strokeWidth="2" /></g>)}</>;
  return <>{Array.from({ length: 14 }, (_, i) => <ellipse key={i} cx={154 + i % 5 * 13} cy={60 + Math.floor(i / 5) * 12} rx={kind === "lentils" ? 4 : 7} ry={kind === "lentils" ? 3 : 5} fill={kind === "black-beans" ? "#635246" : kind === "beans" ? "#aa6955" : kind === "lentils" ? "#a49558" : "#dcc089"} transform={`rotate(${i * 17} ${154 + i % 5 * 13} ${60 + Math.floor(i / 5) * 12})`} />)}</>;
}

function Vegetables({ kind }: { kind: string }) {
  if (kind === "none") return null;
  return <>{Array.from({ length: 8 }, (_, i) => {
    const x = 80 + i % 3 * 16;
    const y = 69 + Math.floor(i / 3) * 17;
    return kind === "leaves" ? <path key={i} d={`M${x} ${y}q-10-17 9-19q17 12-9 19`} fill={i % 2 ? "#7e9d65" : "#98b07a"} /> :
      i % 2 ? <path key={i} d={`m${x} ${y} 13-9`} stroke="#819966" strokeWidth="6" strokeLinecap="round" /> :
      <circle key={i} cx={x} cy={y} r="6" fill="#d79762" />;
  })}</>;
}

function Fruit({ kind, plate = false }: { kind: string; plate?: boolean }) {
  const y = plate ? 110 : 84;
  if (kind === "none") return null;
  return <>{Array.from({ length: 6 }, (_, i) => {
    const x = 105 + i % 3 * 22;
    const cy = y + Math.floor(i / 3) * 17;
    return kind === "banana" ? <g key={i}><ellipse cx={x} cy={cy} rx="10" ry="6" fill="#f5df9d" /><ellipse cx={x} cy={cy} rx="4" ry="2" fill="#cdb576" /></g> :
      kind === "berries" ? <g key={i}><circle cx={x} cy={cy} r="7" fill={i % 2 ? "#788098" : "#aa6b74"} /><circle cx={x - 2} cy={cy - 2} r="2" fill="#ffffff33" /></g> :
      <path key={i} d={`M${x - 6} ${cy - 6}q20-7 17 14l-17-5Z`} fill="#e6c28c" stroke="#ba785c" strokeWidth="2" />;
  })}</>;
}
