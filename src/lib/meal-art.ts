import type { Meal } from "./domain/models";

export function getMealArt(meal: Pick<Meal, "title" | "ingredients" | "batch" | "type">) {
  const foods = meal.ingredients.map((item) => item.name).join(" ").toLowerCase();
  const title = meal.title.toLowerCase();
  const has = (pattern: RegExp) => pattern.test(foods);
  const form = !meal.batch && !title.startsWith("lower-cost") ? title : "";
  const kind = /pancake/.test(form) ? "pancakes" :
    /wrap|burrito/.test(form) && has(/wrap/) ? "wrap" :
    /soup|stew/.test(form) ? "soup" :
    /toast|bread|sandwich/.test(form) && has(/\b(bread|roll)\b/) ? "toast" :
    /salad/.test(form) ? "salad" :
    has(/pasta|noodle/) ? "pasta" :
    has(/\b(bread|roll)\b/) && meal.type === "Breakfast" ? "toast" :
    has(/yogurt|skyr/) && meal.type === "Breakfast" ? "yogurt" :
    has(/oats/) && meal.type === "Breakfast" ? "porridge" :
    meal.type === "Snack" && has(/apple|banana|berr|orange|pear/) ? "fruit" : "bowl";
  return {
    kind,
    base: has(/potato/) ? "potatoes" : has(/pasta|noodle/) ? "pasta" : has(/rice/) ? "rice" : "grains",
    protein: has(/chicken|turkey/) ? "chicken" : has(/beef|pork|ham/) ? "meat" :
      has(/tuna|salmon|fish|sardine/) ? "fish" : has(/egg/) ? "eggs" :
      has(/chickpea|hummus/) ? "chickpeas" : has(/lentil/) ? "lentils" :
      has(/black beans/) ? "black-beans" : has(/beans/) ? "beans" : "none",
    vegetables: has(/spinach|leafy|lettuce/) ? "leaves" :
      has(/frozen mixed|vegetable/) ? "mixed" : has(/carrot|green beans/) ? "carrots" : "none",
    fruit: has(/berr/) ? "berries" : has(/banana/) ? "banana" : has(/apple|pear/) ? "apple" : "none",
    tomato: has(/tomato|salsa/),
    jam: has(/jam/),
  } as const;
}
