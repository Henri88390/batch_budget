import { setBatchCalendar } from "./domain/batchCooking";
import { getBudgetPlan } from "./domain/budgetPlan";
import { type CountryCode } from "./domain/countryPricing";
import { getBatchPrep, getCalendarDayPlans } from "./domain/groceryEstimate";
import { getPlanningDates, formatDateKey } from "./domain/sampleData";
import type { MealPreferences } from "./domain/models";

export function localDate(key: string): Date {
  const [year, month, day] = key.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(key) || formatDateKey(date) !== key) {
    throw new RangeError("Please choose a valid calendar date.");
  }
  return date;
}

export function addDays(key: string, count: number): string {
  const date = localDate(key);
  date.setDate(date.getDate() + count);
  return formatDateKey(date);
}

export function dateLabel(key: string, options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" }, locale = "en-GB"): string {
  return localDate(key).toLocaleDateString(locale, options);
}

export function buildPlan(today: string, preferences: MealPreferences, goals: Record<string, number>, country: CountryCode) {
  const dates = getPlanningDates(localDate(today));
  setBatchCalendar(dates[0], dates[dates.length - 1]);
  const budget = getBudgetPlan(dates[0], { ...preferences, planStyle: "batchCooking" }, goals, country);
  const dayMeals = getCalendarDayPlans(dates[0], dates[dates.length - 1], budget.preferences, goals, country);
  const days = dates.map((date, index) => ({ key: formatDateKey(date), meals: dayMeals[index] }));
  const starts = [...new Set(days.flatMap((day) => day.meals.flatMap((meal) => meal.batch ? [meal.batch.startDate] : [])))];
  const batches = starts.map((key) => {
    const prep = getBatchPrep(localDate(key), budget.preferences, goals, country, dates[0], dates[dates.length - 1]);
    const meals = days.filter((day) => day.meals.some((meal) => meal.batch?.startDate === key)).flatMap((day) => day.meals.filter((meal) => meal.batch));
    return prep ? { ...prep, portions: meals.length, cost: meals.reduce((total, meal) => total + meal.estimatedCostCents, 0) } : null;
  }).filter((batch) => batch !== null);
  return { dates, days, budget, batches };
}
