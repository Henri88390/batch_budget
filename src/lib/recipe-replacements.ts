import type { Meal, MealPreferences } from "./domain/models";
import { getRecipeAlternatives, getRecipeBaseMeal } from "./domain/sampleData";

export function getSafeRecipeAlternatives(meal: Meal, preferences: MealPreferences, sourceKeys: string[] = [meal.recipeKey]): Meal[] {
  const sourceCalories = getRecipeBaseMeal(meal.recipeKey)?.calories ?? meal.calories;
  return getRecipeAlternatives(meal.type, meal.recipeKey, preferences.bannedMeals).filter((candidate) => {
    const visited = new Set<string>();
    let key: string | undefined = candidate.recipeKey;
    while (key) {
      if (sourceKeys.includes(key) || key === meal.recipeKey || visited.has(key)) return false;
      visited.add(key);
      key = preferences.mealSubstitutes[key];
    }
    return true;
  }).sort((a, b) => Math.abs(a.calories - sourceCalories) - Math.abs(b.calories - sourceCalories) || a.recipeKey.localeCompare(b.recipeKey));
}
