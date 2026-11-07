"use client";

import type { Meal } from "@/lib/domain/models";
import { useI18n } from "./display-settings";

export function MealTypeIcon({ meal }: { meal: Pick<Meal, "type" | "slot"> }) {
  const { t } = useI18n();
  const label = t(meal.slot ? `${meal.type} / ${meal.slot}` : meal.type);
  return <span className="meal-type-icon" role="img" aria-label={label} title={label}>
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      {meal.type === "Breakfast" ? <>
        <path d="M5 16a7 7 0 0 1 14 0" fill="#f6b84e" />
        <path d="M12 2v3M4 6l2 2M20 6l-2 2" stroke="#e99639" strokeWidth="2" strokeLinecap="round" />
        <path d="M2 17h20M5 21h14" stroke="#ce7957" strokeWidth="2" strokeLinecap="round" />
      </> : meal.type === "Lunch" ? <>
        <circle cx="12" cy="12" r="5" fill="#f5c451" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5" stroke="#e9a23c" strokeWidth="2" strokeLinecap="round" />
      </> : meal.type === "Dinner" ? <>
        <path d="M20 15.5A9 9 0 0 1 8.5 4 9 9 0 1 0 20 15.5Z" fill="#8f91c4" />
        <path d="m17 3 1 2 2 1-2 1-1 2-1-2-2-1 2-1Z" fill="#f2cc77" />
      </> : <>
        <path d="M12 7c-4-4-10-1-9 5s4 10 9 8c5 2 8-2 9-8s-5-9-9-5" fill="#d97b69" />
        <path d="M12 7V3" stroke="#96744f" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 4c1-3 4-3 6-2-1 3-4 4-6 2" fill="#8ca86a" />
      </>}
    </svg>
  </span>;
}
