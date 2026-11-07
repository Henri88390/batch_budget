import type { MealType, WeeklyFrequency } from "./models";

export function getWeeklyAssignmentDays(frequency: WeeklyFrequency): number[] {
  const assignments: Record<WeeklyFrequency, number[]> = {
    0: [], 1: [2], 2: [1, 4], 3: [0, 2, 4], 7: [0, 1, 2, 3, 4, 5, 6]
  };
  return [...assignments[frequency]];
}

// One assigned day has one occurrence; rotate its meal slot rather than
// restricting a food category to breakfast or dinner.
export function getWeeklyFoodMealType(
  weekday: number, frequency: WeeklyFrequency, mealsPerDay: number, food: "meat" | "dairy"
): MealType | undefined {
  if (!getWeeklyAssignmentDays(frequency).includes(weekday)) return undefined;
  const slots: MealType[] = mealsPerDay === 2 ? ["Breakfast", "Dinner"] :
    food === "meat" ? ["Lunch", "Dinner", "Breakfast"] : ["Breakfast", "Lunch", "Dinner"];
  return slots[weekday % slots.length];
}
