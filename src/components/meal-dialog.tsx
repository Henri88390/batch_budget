"use client";

import { useEffect, useRef, useState } from "react";
import { formatMoney, getCountry } from "@/lib/domain/countryPricing";
import { getIngredientCatalogId, ingredientCatalog, isIngredientBanned } from "@/lib/domain/ingredientCatalog";
import { repriceMeals } from "@/lib/domain/ingredientEstimates";
import type { Meal } from "@/lib/domain/models";
import { applyGlobalMealReplacement, getDisplayedRecipeSourceKeys, getIngredientReplacementOptions, getMealRevertPreferences, getRevertableOccurrenceKeys, scaleMealToCalories, setIngredientBanChoices, toggleIngredientBanPreference } from "@/lib/domain/sampleData";
import type { SavedState } from "@/lib/storage";
import { updatePlanner } from "@/lib/store";
import { dateLabel as formatDate } from "@/lib/plan";
import { Icon } from "./icons";
import { MealArt } from "./meal-art";
import { Dropdown } from "./dropdown";
import { getSafeRecipeAlternatives } from "@/lib/recipe-replacements";
import { IngredientConfirmation } from "./ingredient-confirmation";
import { MealTypeIcon } from "./meal-type-icon";
import { Localize, useI18n } from "./display-settings";

export function MealDialog({ meal, data, days, onClose }: { meal: Meal; data: SavedState; days: { key: string; meals: Meal[] }[]; onClose: () => void }) {
  const { locale } = useI18n();
  const dateLabel = (key: string) => formatDate(key, undefined, locale);
  const ref = useRef<HTMLDialogElement>(null);
  const [mode, setMode] = useState<"details" | "replace" | "ban">("details");
  const [scope, setScope] = useState<"one" | "all">("one");
  const [ingredient, setIngredient] = useState<string | null>(null);
  const [ingredientAction, setIngredientAction] = useState("automatic");
  const [replacement, setReplacement] = useState("automatic");
  const [error, setError] = useState("");
  useEffect(() => { ref.current?.showModal(); }, []);
  const country = getCountry(data.country);
  const editable = !meal.batch && meal.type !== "Snack" && !meal.isTypicalBreakfast;
  const allMeals = days.flatMap((day) => day.meals);
  const occurrences = allMeals.filter((item) => item.recipeKey === meal.recipeKey);
  const revert = getMealRevertPreferences(data.preferences, meal);
  const alternatives = getSafeRecipeAlternatives(meal, data.preferences, getDisplayedRecipeSourceKeys(days.map((day) => day.meals), meal.recipeKey));
  function replace() {
    const target = replacement === "automatic" ? alternatives[0]?.recipeKey : replacement;
    if (!target || !alternatives.some((candidate) => candidate.recipeKey === target)) {
      setError("No suitable replacement remains. Restore an excluded recipe first.");
      return;
    }
    if (mode === "replace" && scope === "one" && !meal.occurrenceKey) {
      setError("This meal has no calendar occurrence to replace. Choose all occurrences instead.");
      return;
    }
    updatePlanner((previous) => {
      let preferences = previous.preferences;
      if (mode === "ban") preferences = { ...preferences, bannedMeals: [...new Set([...preferences.bannedMeals, meal.recipeKey])] };
      if (scope === "all" || mode === "ban") {
        preferences = applyGlobalMealReplacement(preferences, getDisplayedRecipeSourceKeys(days.map((day) => day.meals), meal.recipeKey), meal.recipeKey, target, occurrences.flatMap((item) => item.occurrenceKey ? [item.occurrenceKey] : []));
      } else if (meal.occurrenceKey) {
        preferences = { ...preferences, mealOccurrenceOverrides: { ...preferences.mealOccurrenceOverrides, [meal.occurrenceKey]: target } };
      }
      return { ...previous, preferences, checked: [], cooked: [] };
    });
    onClose();
  }
  function excludeIngredient() {
    if (!ingredient) return;
    updatePlanner((previous) => {
      let preferences = previous.preferences.bannedIngredients.includes(ingredient) ? previous.preferences : toggleIngredientBanPreference(previous.preferences, ingredient);
      if (!meal.batch && ingredientAction !== "automatic") {
        const existing = Object.values(preferences.ingredientBanChoices ?? {}).filter((choice) => choice.ingredientId === ingredient);
        preferences = setIngredientBanChoices(preferences, ingredient, [...existing, {
          ingredientId: ingredient, recipeKey: meal.recipeKey,
          occurrenceKey: scope === "one" ? meal.occurrenceKey : undefined,
          action: "skip", replacementIngredient: ingredientAction === "skip" ? null : ingredientAction,
          fallbackToAutomatic: true,
        }], allMeals);
      }
      return { ...previous, preferences, checked: [], cooked: [] };
    });
    onClose();
  }
  return <Localize><dialog ref={ref} className="meal-dialog" onCancel={onClose} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="dialog-top"><span className="eyebrow"><MealTypeIcon meal={meal} /></span><button className="close-button" aria-label="Close meal details" onClick={onClose}>X</button></div>
    <div className="dialog-art"><MealArt meal={meal} /></div>
    <h2>{meal.title}</h2><p className="muted">{meal.description}</p>
    <div className="meal-facts"><span>{meal.calories} kcal</span><span>{meal.proteinGrams} g protein</span><strong>{formatMoney(meal.estimatedCost ?? { amountMinorUnits: meal.estimatedCostCents, currencyCode: country.currencyCode }, locale)}</strong></div>
    {meal.batch && <p className="notice">From the {dateLabel(meal.batch.startDate)} prep session, covering {meal.batch.days} days. Batch meals keep automatic ingredient substitutions to preserve shared prep.</p>}
    {meal.banConflicts?.length ? <p className="notice danger" role="alert">No suitable substitute for: {meal.banConflicts.join(", ")}. Review exclusions before using this plan.</p> : null}
    {mode === "details" ? <>
      <h3>Ingredients for this portion</h3>
      {meal.ingredients.map((item) => {
        const id = getIngredientCatalogId(item.name);
        return <div className="list-row" key={item.name}><div><strong>{item.name}</strong><span className="small muted">{item.quantity} {item.unit}</span></div><div className="ingredient-actions"><span className="small">{formatMoney(item.estimatedCost ?? { amountMinorUnits: item.estimatedCostCents, currencyCode: country.currencyCode }, locale)}</span>{id && !isIngredientBanned(item.name, data.preferences.bannedIngredients) && <button type="button" className="ingredient-trash-button" aria-label={`Exclude ${item.name}`} title={`Exclude ${item.name}`} onClick={() => { setIngredient(id); setIngredientAction("automatic"); setScope("one"); }}><Icon name="trash" size={17} /></button>}</div></div>;
      })}
      {meal.removedBannedIngredients?.map((removed) => <p className="small muted" key={removed.ingredientId}>{removed.name}: {removed.replacement ? `automatically replaced with ${removed.replacement}` : "left out"}.</p>)}
      {editable && <div className="button-row recipe-actions"><button className="button recipe-replace-button" onClick={() => { setMode("replace"); setReplacement("automatic"); setError(""); }}><Icon name="swap" size={18} />Replace recipe</button><button className="button danger-button" onClick={() => { setMode("ban"); setScope("all"); setReplacement("automatic"); setError(""); }}><Icon name="trash" size={18} />Exclude recipe</button></div>}
      {editable && revert && <div className="button-row"><button className="text-button" onClick={() => { updatePlanner((previous) => ({ ...previous, preferences: revert, checked: [], cooked: [] })); onClose(); }}>Restore original for this date</button><button className="text-button" onClick={() => {
        const restored = getMealRevertPreferences(data.preferences, meal, getRevertableOccurrenceKeys(data.preferences, meal, allMeals));
        if (restored) { updatePlanner((previous) => ({ ...previous, preferences: restored, checked: [], cooked: [] })); onClose(); }
      }}>Restore all replaced dates</button></div>}
      {meal.isTypicalBreakfast && <p className="small muted">Change your repeating breakfast in Preferences.</p>}
    </> : <>
      <div className="section-heading"><h3>{mode === "ban" ? "Exclude & choose a replacement" : "Choose a replacement"}</h3><button className="text-button" onClick={() => setMode("details")}>Back</button></div>
      {mode === "replace" && <Scope scope={scope} setScope={setScope} count={occurrences.length} />}
      {!alternatives.length && <p className="notice danger">No suitable replacement recipes remain. Restore some excluded recipes first.</p>}
      <fieldset className="replacement-options"><legend className="sr-only">Replacement recipe</legend>
      <label className={`alternative automatic-replacement ${replacement === "automatic" ? "selected" : ""}`}><input type="radio" name="replacement" value="automatic" checked={replacement === "automatic"} onChange={() => setReplacement("automatic")} /><Icon name="swap" size={18} /><span><strong>Automatic replacement <span className="pill">Default</span></strong><small>{alternatives[0] ? `Closest-calorie available recipe: ${alternatives[0].title}` : "No replacement available"}</small></span></label>
      <div className="alternatives">{alternatives.map((candidate) => {
        const priced = repriceMeals([scaleMealToCalories(candidate, meal.calories)], data.country)[0];
        return <label className={`alternative ${replacement === candidate.recipeKey ? "selected" : ""}`} key={candidate.recipeKey}><input type="radio" name="replacement" value={candidate.recipeKey} checked={replacement === candidate.recipeKey} onChange={() => setReplacement(candidate.recipeKey)} /><span><strong>{candidate.title}</strong><small>{priced.calories} kcal / modeled base recipe; preferences still apply</small></span><span>{formatMoney(priced.estimatedCost!, locale)}</span></label>;
      })}</div></fieldset>
      <button className="button primary full-width" disabled={!alternatives.length} onClick={replace}><Icon name={mode === "ban" ? "trash" : "swap"} size={17} />{mode === "ban" ? "Exclude and replace recipe" : "Apply replacement"}</button>
    </>}
    {error && <p className="notice danger" role="alert">{error}</p>}
    {ingredient && <IngredientConfirmation name={ingredientCatalog.find((item) => item.id === ingredient)!.name} onConfirm={excludeIngredient} onCancel={() => setIngredient(null)}>
      {!meal.batch && <><label>Action for this recipe<Dropdown label="Action for this recipe" value={ingredientAction} onChange={setIngredientAction} options={[{ value: "automatic", label: "Automatic substitution" }, { value: "skip", label: "Leave it out" }, ...getIngredientReplacementOptions(meal, ingredient, data.preferences).map((item) => ({ value: item.id, label: `Use ${item.name}` }))]} /></label><Scope scope={scope} setScope={setScope} count={occurrences.length} /></>}
    </IngredientConfirmation>}
  </dialog></Localize>;
}

function Scope({ scope, setScope, count }: { scope: "one" | "all"; setScope: (scope: "one" | "all") => void; count: number }) {
  return <fieldset className="scope"><legend>Apply recipe choice to</legend><label><input type="radio" name="scope" checked={scope === "one"} onChange={() => setScope("one")} />This date</label><label><input type="radio" name="scope" checked={scope === "all"} disabled={count <= 1} onChange={() => setScope("all")} />All {count} occurrences</label></fieldset>;
}
