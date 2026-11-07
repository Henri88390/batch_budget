"use client";

import { useState } from "react";
import { getCountry } from "@/lib/domain/countryPricing";
import { ingredientCatalog, ingredientCategoryOrder } from "@/lib/domain/ingredientCatalog";
import { isValidPositiveIngredientQuantity } from "@/lib/domain/ingredientEstimates";
import type { MealPreferences, TypicalBreakfastIngredient } from "@/lib/domain/models";
import { getRecipeCatalog, removeMealBan, toggleIngredientBanPreference, toggleIngredientCategoryBanPreference, MIN_DAILY_CALORIE_GOAL, MAX_DAILY_CALORIE_GOAL } from "@/lib/domain/sampleData";
import { customBreakfastIngredientOptions, typicalBreakfastPresets } from "@/lib/domain/typicalBreakfast";
import { updatePlanner } from "@/lib/store";
import type { SavedState } from "@/lib/storage";
import { Icon } from "./icons";

export function Preferences({ data, dateKeys }: { data: SavedState; dateKeys: string[] }) {
  const [draft, setDraft] = useState(data.preferences);
  const [calories, setCalories] = useState(String(data.goals[dateKeys[0]] ?? 2000));
  const [breakfastMode, setBreakfastMode] = useState(data.preferences.typicalBreakfast.mode === "preset" ? data.preferences.typicalBreakfast.presetId : data.preferences.typicalBreakfast.mode);
  const [custom, setCustom] = useState<TypicalBreakfastIngredient[]>(data.preferences.typicalBreakfast.mode === "custom" ? data.preferences.typicalBreakfast.ingredients : []);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const country = getCountry(data.country);
  function field<K extends keyof MealPreferences>(key: K, value: MealPreferences[K]) {
    setDraft((previous) => ({ ...previous, [key]: value }));
    setSaved(false);
  }
  function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const goal = Number(calories);
    const budget = Number(draft.weeklyBudget.replace(",", "."));
    if (!Number.isInteger(goal) || goal < MIN_DAILY_CALORIE_GOAL || goal > MAX_DAILY_CALORIE_GOAL) {
      setError(`Enter a whole-number calorie target between ${MIN_DAILY_CALORIE_GOAL} and ${MAX_DAILY_CALORIE_GOAL}.`);
      return;
    }
    if (draft.weeklyBudget.trim() && (!Number.isFinite(budget) || budget <= 0)) {
      setError("Enter a positive weekly budget, or leave it blank to turn budget fitting off.");
      return;
    }
    if (breakfastMode === "custom" && (!custom.length || custom.some((item) => !isValidPositiveIngredientQuantity(item.quantity)))) {
      setError("Add at least one breakfast ingredient and enter positive quantities (fractions are supported).");
      return;
    }
    const typicalBreakfast: MealPreferences["typicalBreakfast"] = breakfastMode === "none" ? { mode: "none" } :
      breakfastMode === "custom" ? { mode: "custom", ingredients: custom } : { mode: "preset", presetId: breakfastMode };
    updatePlanner((previous) => ({
      ...previous,
      preferences: { ...previous.preferences, ...draft, planStyle: "batchCooking", weeklyBudget: draft.weeklyBudget.trim(), typicalBreakfast,
        bannedIngredients: previous.preferences.bannedIngredients, bannedMeals: previous.preferences.bannedMeals,
        mealSubstitutes: previous.preferences.mealSubstitutes, mealOccurrenceOverrides: previous.preferences.mealOccurrenceOverrides,
        ingredientBanChoices: previous.preferences.ingredientBanChoices },
      goals: { ...previous.goals, ...Object.fromEntries(dateKeys.map((key) => [key, goal])) },
      cooked: [], checked: [],
    }));
    setError("");
    setSaved(true);
  }
  const catalog = getRecipeCatalog();
  return <div className="preferences-grid">
    <form className="panel" onSubmit={save}>
      <div className="section-heading"><div><span className="eyebrow">MAKE IT YOURS</span><h2>Your planning preferences</h2></div><Icon name="sliders" /></div>
      <p className="muted">Batch cooking is always on. Choose what works for your routine.</p>
      <div className="form-grid">
        <label>Weekly budget ({country.currencyCode})<input name="budget" inputMode="decimal" value={draft.weeklyBudget} placeholder="No budget limit" onChange={(event) => field("weeklyBudget", event.target.value)} /><small>For one person, over the next 7 days.</small></label>
        <label>Daily calorie target<input name="calories" type="number" min={MIN_DAILY_CALORIE_GOAL} max={MAX_DAILY_CALORIE_GOAL} step="1" required value={calories} onChange={(event) => { setCalories(event.target.value); setSaved(false); }} /><small>Applied across the full 31-day plan.</small></label>
        <label>Meals per day<select value={draft.mealsPerDay} onChange={(event) => {
          const value = Number(event.target.value);
          if (value === 2 || value === 3 || value === 4 || value === 5) field("mealsPerDay", value);
        }}><option value="2">2 - breakfast & dinner</option><option value="3">3 - breakfast, lunch & dinner</option><option value="4">4 - plus one snack</option><option value="5">5 - plus two snacks</option></select></label>
        <label>Fruit preference<select value={draft.fruitPreference} onChange={(event) => {
          const value = event.target.value;
          if (value === "optional" || value === "include" || value === "avoid") field("fruitPreference", value);
        }}><option value="optional">Keep the recipe defaults</option><option value="include">Include fruit</option><option value="avoid">Avoid fruit</option></select></label>
        {(["meatPerWeek", "dairyPerWeek"] as const).map((key) => <label key={key}>{key === "meatPerWeek" ? "Meat / fish dinners per week" : "Dairy breakfasts per week"}<select value={draft[key]} onChange={(event) => {
          const value = Number(event.target.value);
          if (value === 0 || value === 1 || value === 2 || value === 3 || value === 7) field(key, value);
        }}>{[0, 1, 2, 3, 7].map((value) => <option key={value} value={value}>{value === 0 ? "None" : value === 7 ? "Every day" : `${value} per week`}</option>)}</select></label>)}
      </div>
      <div className="form-divider" />
      <label>Typical breakfast<select value={breakfastMode} onChange={(event) => { setBreakfastMode(event.target.value); setSaved(false); }}><option value="none">A different breakfast each day</option>{typicalBreakfastPresets.map((preset) => <option key={preset.id} value={preset.id}>{preset.label}</option>)}<option value="custom">Build my own breakfast</option></select></label>
      <p className="small muted">A repeating breakfast takes priority over fruit and dairy frequencies. Ingredient exclusions still apply; budget fitting may relax it.</p>
      {breakfastMode === "custom" && <div className="custom-breakfast">
        {custom.map((item, index) => <div className="custom-row" key={item.name}><span>{item.name}</span><input aria-label={`${item.name} quantity`} value={item.quantity} onChange={(event) => setCustom((items) => items.map((current, i) => i === index ? { ...current, quantity: event.target.value } : current))} /><span>{item.unit}</span><button type="button" className="text-button" aria-label={`Remove ${item.name}`} onClick={() => setCustom((items) => items.filter((_, i) => i !== index))}>Remove</button></div>)}
        <label>Add an ingredient<select value="" onChange={(event) => {
          const option = customBreakfastIngredientOptions.find((item) => item.key === event.target.value);
          if (option) setCustom((items) => [...items, { name: option.name, quantity: option.quantity, unit: option.unit }]);
        }}><option value="">Choose an ingredient</option>{customBreakfastIngredientOptions.filter((item) => !custom.some((selected) => selected.name === item.name)).map((item) => <option key={item.key} value={item.key}>{item.name}</option>)}</select></label>
      </div>}
      {error && <p className="notice danger" role="alert">{error}</p>}
      {saved && <p className="notice" role="status">Preferences applied. Your meals, prep amounts, and groceries have been updated.</p>}
      <button className="button primary" type="submit">Apply preferences <Icon name="arrow" size={17} /></button>
    </form>
    <div className="stack">
      <section className="panel">
        <span className="eyebrow">LEAVE IT OUT</span><h2>Ingredient exclusions</h2>
        <p className="muted small">Applied immediately. Suitable substitutes are used automatically. This is not an allergen-safe planner.</p>
        <input type="search" aria-label="Search ingredients" placeholder="Search ingredients..." value={search} onChange={(event) => setSearch(event.target.value)} />
        <div className="exclusions">
          {ingredientCategoryOrder.map((category) => {
            const items = ingredientCatalog.filter((item) => item.category === category && item.name.toLowerCase().includes(search.toLowerCase()));
            if (!items.length) return null;
            const all = ingredientCatalog.filter((item) => item.category === category).every((item) => data.preferences.bannedIngredients.includes(item.id));
            return <div key={category}><div className="category-heading"><h3>{category}</h3><button type="button" className="text-button" onClick={() => updatePlanner((previous) => ({ ...previous, preferences: toggleIngredientCategoryBanPreference(previous.preferences, category), checked: [], cooked: [] }))}>{all ? "Restore category" : "Exclude category"}</button></div>
              <div className="chip-list">{items.map((item) => <button type="button" className={`chip ${data.preferences.bannedIngredients.includes(item.id) ? "excluded" : ""}`} aria-pressed={data.preferences.bannedIngredients.includes(item.id)} key={item.id} onClick={() => updatePlanner((previous) => ({ ...previous, preferences: toggleIngredientBanPreference(previous.preferences, item.id), checked: [], cooked: [] }))}>{item.name}{data.preferences.bannedIngredients.includes(item.id) ? " - excluded" : ""}</button>)}</div>
            </div>;
          })}
          {!ingredientCatalog.some((item) => item.name.toLowerCase().includes(search.toLowerCase())) && <p className="muted">No matching ingredients.</p>}
        </div>
      </section>
      <section className="panel"><h2>Excluded recipes</h2><p className="muted small">Batch lunches and dinners are managed by their shared ingredients. Breakfast recipes can be excluded from meal details.</p>
        {!data.preferences.bannedMeals.length && <p className="empty-inline">No excluded recipes. Your options are open.</p>}
        {data.preferences.bannedMeals.map((key) => <div className="list-row" key={key}><span>{catalog.find((meal) => meal.recipeKey === key)?.title ?? key}</span><button className="text-button" onClick={() => updatePlanner((previous) => ({ ...previous, preferences: removeMealBan(previous.preferences, key), checked: [], cooked: [] }))}>Restore</button></div>)}
      </section>
    </div>
  </div>;
}
