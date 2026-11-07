"use client";

import { useEffect, useRef, useState } from "react";
import { getCountry } from "@/lib/domain/countryPricing";
import { ingredientCatalog, ingredientCategoryOrder } from "@/lib/domain/ingredientCatalog";
import { isValidPositiveIngredientQuantity } from "@/lib/domain/ingredientEstimates";
import type { MealPreferences, TypicalBreakfastIngredient } from "@/lib/domain/models";
import { getRecipeCatalog, removeMealBan, toggleIngredientBanPreference, toggleIngredientCategoryBanPreference, MIN_DAILY_CALORIE_GOAL, MAX_DAILY_CALORIE_GOAL } from "@/lib/domain/sampleData";
import { customBreakfastIngredientOptions, typicalBreakfastPresets } from "@/lib/domain/typicalBreakfast";
import { updatePlanner } from "@/lib/store";
import type { SavedState } from "@/lib/storage";
import { Icon } from "./icons";
import { Dropdown } from "./dropdown";
import { getSafeRecipeAlternatives } from "@/lib/recipe-replacements";
import { Localize, useI18n } from "./display-settings";

function formSignature(preferences: MealPreferences, calories: string, breakfast: MealPreferences["typicalBreakfast"]) {
  return JSON.stringify({
    weeklyBudget: preferences.weeklyBudget.trim(),
    mealsPerDay: preferences.mealsPerDay,
    fruitPreference: preferences.fruitPreference,
    meatPerWeek: preferences.meatPerWeek,
    dairyPerWeek: preferences.dairyPerWeek,
    calories,
    breakfast,
  });
}

export function Preferences({ data, dateKeys }: { data: SavedState; dateKeys: string[] }) {
  const { t } = useI18n();
  const [draft, setDraft] = useState(data.preferences);
  const [calories, setCalories] = useState(String(data.goals[dateKeys[0]] ?? 2000));
  const [breakfastMode, setBreakfastMode] = useState(data.preferences.typicalBreakfast.mode === "preset" ? data.preferences.typicalBreakfast.presetId : data.preferences.typicalBreakfast.mode);
  const [custom, setCustom] = useState<TypicalBreakfastIngredient[]>(data.preferences.typicalBreakfast.mode === "custom" ? data.preferences.typicalBreakfast.ingredients : []);
  const [search, setSearch] = useState("");
  const [recipeSearch, setRecipeSearch] = useState("");
  const [recipeError, setRecipeError] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [appliedSignature, setAppliedSignature] = useState(() =>
    formSignature(data.preferences, String(data.goals[dateKeys[0]] ?? 2000), data.preferences.typicalBreakfast));
  const typicalBreakfast: MealPreferences["typicalBreakfast"] = breakfastMode === "none" ? { mode: "none" } :
    breakfastMode === "custom" ? { mode: "custom", ingredients: custom } : { mode: "preset", presetId: breakfastMode };
  const currentSignature = formSignature(draft, calories, typicalBreakfast);
  const hasChanges = currentSignature !== appliedSignature;
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (savedTimer.current !== null) clearTimeout(savedTimer.current);
  }, []);
  const country = getCountry(data.country);
  function field<K extends keyof MealPreferences>(key: K, value: MealPreferences[K]) {
    setDraft((previous) => ({ ...previous, [key]: value }));
    setSaved(false);
  }
  function adjustBudget(direction: 1 | -1) {
    const value = Number(draft.weeklyBudget.replace(",", "."));
    if (!Number.isFinite(value) || value < 0) {
      setError("Enter a positive weekly budget, or leave it blank to turn budget fitting off.");
      return;
    }
    const next = Math.round((value + direction) * 100) / 100;
    if (next <= 0) return;
    field("weeklyBudget", String(next));
    setError("");
  }
  function adjustCalories(direction: 1 | -1) {
    const value = Number(calories);
    if (!calories.trim() || !Number.isInteger(value) || value < MIN_DAILY_CALORIE_GOAL || value > MAX_DAILY_CALORIE_GOAL) {
      setError(`Enter a whole-number calorie target between ${MIN_DAILY_CALORIE_GOAL} and ${MAX_DAILY_CALORIE_GOAL}.`);
      return;
    }
    setCalories(String(Math.max(MIN_DAILY_CALORIE_GOAL, Math.min(MAX_DAILY_CALORIE_GOAL, value + direction * 100))));
    setSaved(false);
    setError("");
  }
  function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!hasChanges) return;
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
    setAppliedSignature(currentSignature);
    setSaved(true);
    if (savedTimer.current !== null) clearTimeout(savedTimer.current);
    savedTimer.current = setTimeout(() => {
      setSaved(false);
      savedTimer.current = null;
    }, 3000);
  }
  const catalog = getRecipeCatalog();
  const recipeMatches = catalog.filter((meal) => meal.type === "Breakfast" &&
    `${t(meal.title)} ${t(meal.description)} ${meal.title} ${meal.description}`.toLowerCase().includes(recipeSearch.trim().toLowerCase()));
  return <Localize><div className="preferences-grid">
    <form className="panel" onSubmit={save}>
      <div className="section-heading"><div><h2>Planning preferences</h2></div><Icon name="sliders" /></div>
      <div className="form-grid">
        <label>Weekly budget ({country.currencyCode})<span className="number-field">
          <input aria-label={`Weekly budget (${country.currencyCode})`} name="budget" inputMode="decimal" value={draft.weeklyBudget} placeholder="No budget limit" onChange={(event) => field("weeklyBudget", event.target.value)} onKeyDown={(event) => {
            if (event.key === "ArrowUp" || event.key === "ArrowDown") { event.preventDefault(); adjustBudget(event.key === "ArrowUp" ? 1 : -1); }
          }} />
          <span className="number-field-controls">
            <button type="button" aria-label="Increase weekly budget by 1" onClick={() => adjustBudget(1)}><Icon name="chevronUp" size={14} /></button>
            <button type="button" aria-label="Decrease weekly budget by 1" disabled={Number(draft.weeklyBudget.replace(",", ".")) <= 1} onClick={() => adjustBudget(-1)}><Icon name="chevronDown" size={14} /></button>
          </span>
        </span></label>
        <label>Daily calorie target<span className="number-field">
          <input aria-label="Daily calorie target" name="calories" type="number" min={MIN_DAILY_CALORIE_GOAL} max={MAX_DAILY_CALORIE_GOAL} step="1" required value={calories} onChange={(event) => { setCalories(event.target.value); setSaved(false); }} onKeyDown={(event) => {
            if (event.key === "ArrowUp" || event.key === "ArrowDown") { event.preventDefault(); adjustCalories(event.key === "ArrowUp" ? 1 : -1); }
          }} />
          <span className="number-field-controls">
            <button type="button" aria-label="Increase daily calorie target by 100 kcal" disabled={Number(calories) >= MAX_DAILY_CALORIE_GOAL} onClick={() => adjustCalories(1)}><Icon name="chevronUp" size={14} /></button>
            <button type="button" aria-label="Decrease daily calorie target by 100 kcal" disabled={Number(calories) <= MIN_DAILY_CALORIE_GOAL} onClick={() => adjustCalories(-1)}><Icon name="chevronDown" size={14} /></button>
          </span>
        </span><small>Applied across the full 31-day plan.</small></label>
        <label>Meals per day<Dropdown label="Meals per day" value={draft.mealsPerDay} onChange={(selected) => {
          const value = Number(selected);
          if (value === 2 || value === 3 || value === 4 || value === 5) field("mealsPerDay", value);
        }} options={[{ value: "2", label: "2 - breakfast & dinner" }, { value: "3", label: "3 - breakfast, lunch & dinner" }, { value: "4", label: "4 - plus one snack" }, { value: "5", label: "5 - plus two snacks" }]} /></label>
        <label>Fruit preference<Dropdown label="Fruit preference" value={draft.fruitPreference} onChange={(value) => {
          if (value === "optional" || value === "include" || value === "avoid") field("fruitPreference", value);
        }} options={[{ value: "optional", label: "Keep the recipe defaults" }, { value: "include", label: "Include fruit" }, { value: "avoid", label: "Avoid fruit" }]} /></label>
        {(["meatPerWeek", "dairyPerWeek"] as const).map((key) => <label key={key}>{key === "meatPerWeek" ? "Meals with meat / fish per week" : "Meals with dairy per week"}<Dropdown label={key === "meatPerWeek" ? "Meals with meat / fish per week" : "Meals with dairy per week"} value={draft[key]} onChange={(selected) => {
          const value = Number(selected);
          if (value === 0 || value === 1 || value === 2 || value === 3 || value === 7) field(key, value);
        }} options={[0, 1, 2, 3, 7].map((value) => ({ value: String(value), label: value === 0 ? "None" : `${value} meals per week` }))} /></label>)}
      </div>
      <div className="form-divider" />
      <label>Typical breakfast<Dropdown label="Typical breakfast" value={breakfastMode} onChange={(value) => { setBreakfastMode(value); setSaved(false); }} options={[{ value: "none", label: "A different breakfast each day" }, ...typicalBreakfastPresets.map((preset) => ({ value: preset.id, label: preset.label })), { value: "custom", label: "Build my own breakfast" }]} /></label>
      {breakfastMode === "custom" && <div className="custom-breakfast">
        {custom.map((item, index) => <div className="custom-row" key={item.name}><span>{item.name}</span><input aria-label={`${item.name} quantity`} value={item.quantity} onChange={(event) => setCustom((items) => items.map((current, i) => i === index ? { ...current, quantity: event.target.value } : current))} /><span>{item.unit}</span><button type="button" className="text-button" aria-label={`Remove ${item.name}`} onClick={() => setCustom((items) => items.filter((_, i) => i !== index))}>Remove</button></div>)}
        <label>Add an ingredient<Dropdown label="Add an ingredient" value="" onChange={(value) => {
          const option = customBreakfastIngredientOptions.find((item) => item.key === value);
          if (option) setCustom((items) => [...items, { name: option.name, quantity: option.quantity, unit: option.unit }]);
        }} options={[{ value: "", label: "Choose an ingredient" }, ...customBreakfastIngredientOptions.filter((item) => !custom.some((selected) => selected.name === item.name)).map((item) => ({ value: item.key, label: item.name }))]} /></label>
      </div>}
      {error && <p className="notice danger" role="alert">{error}</p>}
      {saved && <p className="notice preferences-saved" role="status">Preferences applied. Your meals, prep amounts, and groceries have been updated.</p>}
      <button className="button primary apply-preferences" type="submit" disabled={!hasChanges}>Apply preferences <Icon name="arrow" size={17} /></button>
    </form>
    <div className="stack">
      <section className="panel">
        <h2>Excluded ingredients</h2>
        <input type="search" aria-label="Search ingredients" placeholder="Search ingredients..." value={search} onChange={(event) => setSearch(event.target.value)} />
        <div className="exclusions">
          {ingredientCategoryOrder.map((category) => {
            const items = ingredientCatalog.filter((item) => item.category === category && `${t(item.name)} ${item.name}`.toLowerCase().includes(search.toLowerCase()));
            if (!items.length) return null;
            const all = ingredientCatalog.filter((item) => item.category === category).every((item) => data.preferences.bannedIngredients.includes(item.id));
            return <div key={category}><div className="category-heading"><h3>{category}</h3><button type="button" className="text-button" aria-label={`${all ? "Restore" : "Exclude"} ${category} category`} title={all ? "Restore category" : "Exclude category"} onClick={() => updatePlanner((previous) => ({ ...previous, preferences: toggleIngredientCategoryBanPreference(previous.preferences, category), checked: [], cooked: [] }))}>{all ? "Restore category" : <Icon name="trash" size={17} />}</button></div>
              <div className="chip-list">{items.map((item) => <button type="button" className={`chip ${data.preferences.bannedIngredients.includes(item.id) ? "excluded" : ""}`} aria-pressed={data.preferences.bannedIngredients.includes(item.id)} key={item.id} onClick={() => updatePlanner((previous) => ({ ...previous, preferences: toggleIngredientBanPreference(previous.preferences, item.id), checked: [], cooked: [] }))}>{item.name}{data.preferences.bannedIngredients.includes(item.id) ? " - excluded" : ""}</button>)}</div>
            </div>;
          })}
          {!ingredientCatalog.some((item) => `${t(item.name)} ${item.name}`.toLowerCase().includes(search.toLowerCase())) && <p className="muted">No matching ingredients.</p>}
        </div>
      </section>
      <section className="panel"><h2>Excluded recipes</h2><p className="muted small">Search breakfast recipes to exclude them from the plan. Batch lunches and dinners are managed by their shared ingredients. Repeating breakfasts are managed above.</p>
        <input type="search" aria-label="Search recipes to exclude" placeholder="Search recipes..." value={recipeSearch} onChange={(event) => setRecipeSearch(event.target.value)} />
        <div className="recipe-exclusion-results">
          {recipeMatches.filter((meal) => !data.preferences.bannedMeals.includes(meal.recipeKey)).map((meal) => <div className="list-row" key={meal.recipeKey}><span>{meal.title}</span><button type="button" className="button danger-button recipe-exclude-button" aria-label={`Exclude ${meal.title}`} onClick={() => {
            if (!getSafeRecipeAlternatives(meal, data.preferences).length) {
              setRecipeError("No suitable replacement remains. Restore an excluded recipe before excluding this one.");
              return;
            }
            updatePlanner((previous) => ({ ...previous, preferences: { ...previous.preferences, bannedMeals: [...new Set([...previous.preferences.bannedMeals, meal.recipeKey])] }, checked: [], cooked: [] }));
            setRecipeError("");
          }}><Icon name="trash" size={15} />Exclude</button></div>)}
          {!recipeMatches.some((meal) => !data.preferences.bannedMeals.includes(meal.recipeKey)) && <p className="empty-inline">No matching available recipes.</p>}
        </div>
        {recipeError && <p className="notice danger" role="alert">{recipeError}</p>}
        <h3 className="excluded-recipes-heading">Currently excluded</h3>
        {!data.preferences.bannedMeals.length && <p className="empty-inline">No excluded recipes.</p>}
        {data.preferences.bannedMeals.map((key) => <div className="list-row" key={key}><span>{catalog.find((meal) => meal.recipeKey === key)?.title ?? key}</span><button className="text-button" onClick={() => updatePlanner((previous) => ({ ...previous, preferences: removeMealBan(previous.preferences, key), checked: [], cooked: [] }))}>Restore</button></div>)}
      </section>
    </div>
  </div></Localize>;
}
