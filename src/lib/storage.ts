import { countries, type CountryCode } from "./domain/countryPricing";
import { ingredientCatalog } from "./domain/ingredientCatalog";
import { isValidPositiveIngredientQuantity } from "./domain/ingredientEstimates";
import type { MealPreferences, TypicalBreakfast } from "./domain/models";
import { formatDateKey, getRecipeCatalog, MIN_DAILY_CALORIE_GOAL, MAX_DAILY_CALORIE_GOAL } from "./domain/sampleData";
import { typicalBreakfastPresets } from "./domain/typicalBreakfast";

export const STORAGE_KEY = "batch-budget:v1";

export type SavedState = {
  version: 1;
  preferences: MealPreferences;
  country: CountryCode;
  goals: Record<string, number>;
  checked: string[];
  cooked: string[];
};

export function defaultState(): SavedState {
  return {
    version: 1,
    preferences: {
      meatPerWeek: 2, dairyPerWeek: 7, fruitPreference: "optional",
      mealsPerDay: 3, planStyle: "batchCooking", weeklyBudget: "45",
      bannedIngredients: [], bannedMeals: [], mealSubstitutes: {},
      mealOccurrenceOverrides: {}, typicalBreakfast: { mode: "none" },
    },
    country: "DE", goals: {}, checked: [], cooked: [],
  };
}

function object(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function strings(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function dateKey(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  return formatDateKey(new Date(year, month - 1, day)) === value;
}

function breakfast(value: unknown): value is TypicalBreakfast {
  if (!object(value)) return false;
  if (value.mode === "none") return true;
  if (value.mode === "preset") return typicalBreakfastPresets.some((preset) => preset.id === value.presetId);
  return value.mode === "custom" && Array.isArray(value.ingredients) && value.ingredients.length > 0 &&
    value.ingredients.every((item: unknown) => object(item) && typeof item.name === "string" &&
      item.name.trim().length > 0 && typeof item.quantity === "string" && isValidPositiveIngredientQuantity(item.quantity) &&
      typeof item.unit === "string" && item.unit.trim().length > 0);
}

export function isSavedState(value: unknown): value is SavedState {
  if (!object(value) || value.version !== 1 || !object(value.preferences)) return false;
  const p = value.preferences;
  const recipes = getRecipeCatalog();
  const validRecipe = (key: unknown) => typeof key === "string" && recipes.some((recipe) => recipe.recipeKey === key);
  const ingredientId = (id: unknown) => typeof id === "string" && ingredientCatalog.some((item) => item.id === id);
  const occurrence = (key: string) => dateKey(key.split("|")[0]) && /[|](Breakfast|Lunch|Dinner|Snack)([|].*)?$/.test(key);
  return countries.some((country) => country.code === value.country) &&
    [0, 1, 2, 3, 7].includes(Number(p.meatPerWeek)) && typeof p.meatPerWeek === "number" &&
    [0, 1, 2, 3, 7].includes(Number(p.dairyPerWeek)) && typeof p.dairyPerWeek === "number" &&
    typeof p.mealsPerDay === "number" && [2, 3, 4, 5].includes(p.mealsPerDay) &&
    ["optional", "avoid", "include"].includes(String(p.fruitPreference)) &&
    p.planStyle === "batchCooking" && typeof p.weeklyBudget === "string" &&
    (p.weeklyBudget === "" || (Number.isFinite(Number(p.weeklyBudget.replace(",", "."))) && Number(p.weeklyBudget.replace(",", ".")) > 0)) &&
    strings(p.bannedIngredients) && p.bannedIngredients.every(ingredientId) &&
    strings(p.bannedMeals) && p.bannedMeals.every(validRecipe) &&
    object(p.mealSubstitutes) && Object.entries(p.mealSubstitutes).every(([key, target]) => validRecipe(key) && validRecipe(target)) &&
    object(p.mealOccurrenceOverrides) && Object.entries(p.mealOccurrenceOverrides).every(([key, target]) => occurrence(key) && validRecipe(target)) &&
    (p.ingredientBanChoices === undefined || (object(p.ingredientBanChoices) && Object.values(p.ingredientBanChoices).every((choice) =>
      object(choice) && ingredientId(choice.ingredientId) && typeof choice.recipeKey === "string" &&
      ["skip", "replaceMeal"].includes(String(choice.action)) &&
      (choice.occurrenceKey === undefined || (typeof choice.occurrenceKey === "string" && occurrence(choice.occurrenceKey))) &&
      (choice.replacementIngredient == null || ingredientId(choice.replacementIngredient)) &&
      (choice.replacementMealKey == null || validRecipe(choice.replacementMealKey))))) &&
    breakfast(p.typicalBreakfast) && object(value.goals) &&
    Object.entries(value.goals).every(([key, goal]) => dateKey(key) && typeof goal === "number" &&
      Number.isInteger(goal) && goal >= MIN_DAILY_CALORIE_GOAL && goal <= MAX_DAILY_CALORIE_GOAL) &&
    strings(value.checked) && strings(value.cooked) && value.cooked.every(dateKey);
}

export function parseSavedState(raw: string): SavedState {
  const value: unknown = JSON.parse(raw);
  if (!isSavedState(value)) throw new Error("Saved planner data is invalid or belongs to an unsupported version.");
  return value;
}
