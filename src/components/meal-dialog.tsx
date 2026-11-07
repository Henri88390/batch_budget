"use client";

import { useEffect, useRef, useState } from "react";
import { formatMoney, getCountry } from "@/lib/domain/countryPricing";
import { getIngredientCatalogId, isIngredientBanned } from "@/lib/domain/ingredientCatalog";
import { repriceMeals } from "@/lib/domain/ingredientEstimates";
import type { Meal } from "@/lib/domain/models";
import { applyGlobalMealReplacement, getDisplayedRecipeSourceKeys, getIngredientReplacementOptions, getMealRevertPreferences, getRecipeAlternatives, getRevertableOccurrenceKeys, scaleMealToCalories, setIngredientBanChoices, toggleIngredientBanPreference } from "@/lib/domain/sampleData";
import type { SavedState } from "@/lib/storage";
import { updatePlanner } from "@/lib/store";
import { dateLabel } from "@/lib/plan";
import { BowlArt, Icon } from "./icons";

export function MealDialog({ meal, data, days, onClose }: { meal: Meal; data: SavedState; days: { key: string; meals: Meal[] }[]; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [mode, setMode] = useState<"details" | "replace" | "ban">("details");
  const [scope, setScope] = useState<"one" | "all">("one");
  const [ingredient, setIngredient] = useState<string | null>(null);
  const [ingredientAction, setIngredientAction] = useState("automatic");
  const [error, setError] = useState("");
  useEffect(() => { ref.current?.showModal(); }, []);
  const country = getCountry(data.country);
  const editable = !meal.batch && meal.type !== "Snack" && !meal.isTypicalBreakfast;
  const allMeals = days.flatMap((day) => day.meals);
  const occurrences = allMeals.filter((item) => item.recipeKey === meal.recipeKey);
  const revert = getMealRevertPreferences(data.preferences, meal);
  const alternatives = getRecipeAlternatives(meal.type, meal.recipeKey, data.preferences.bannedMeals).filter((candidate) => {
    const targets = getDisplayedRecipeSourceKeys(days.map((day) => day.meals), meal.recipeKey);
    const visited = new Set<string>();
    let key: string | undefined = candidate.recipeKey;
    while (key) {
      if (targets.includes(key) || visited.has(key)) return false;
      visited.add(key);
      key = data.preferences.mealSubstitutes[key];
    }
    return true;
  });
  function replace(target: string) {
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
  return <dialog ref={ref} className="meal-dialog" onCancel={onClose} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="dialog-top"><span className="eyebrow">{meal.type}{meal.slot ? ` / ${meal.slot}` : ""}</span><button className="close-button" aria-label="Close meal details" onClick={onClose}>X</button></div>
    <div className="dialog-art"><BowlArt variant={meal.type === "Breakfast" ? 2 : meal.type === "Dinner" ? 1 : 0} /></div>
    <h2>{meal.title}</h2><p className="muted">{meal.description}</p>
    <div className="meal-facts"><span>{meal.calories} kcal</span><span>{meal.proteinGrams} g protein</span><span><Icon name="clock" size={15} />{meal.durationMinutes} min</span><strong>{formatMoney(meal.estimatedCost ?? { amountMinorUnits: meal.estimatedCostCents, currencyCode: country.currencyCode }, "en-GB")}</strong></div>
    {meal.batch && <p className="notice">From the {dateLabel(meal.batch.startDate)} prep session, covering {meal.batch.days} days. Batch meals keep automatic ingredient substitutions to preserve shared prep.</p>}
    {meal.banConflicts?.length ? <p className="notice danger" role="alert">No suitable substitute for: {meal.banConflicts.join(", ")}. Review exclusions before using this plan.</p> : null}
    {ingredient ? <section className="panel inset"><h3>Exclude this ingredient</h3><p className="small muted">This exclusion applies throughout the plan. Other meals use automatic substitutes unless you choose a recipe-specific action here.</p>
      {!meal.batch && <><label>Action for this recipe<select value={ingredientAction} onChange={(event) => setIngredientAction(event.target.value)}><option value="automatic">Automatic substitution</option><option value="skip">Leave it out</option>{getIngredientReplacementOptions(meal, ingredient, data.preferences).map((item) => <option key={item.id} value={item.id}>Use {item.name}</option>)}</select></label><Scope scope={scope} setScope={setScope} count={occurrences.length} /></>}
      <div className="button-row"><button className="button primary" onClick={excludeIngredient}>Confirm exclusion</button><button className="button" onClick={() => setIngredient(null)}>Cancel</button></div>
    </section> : mode === "details" ? <>
      <h3>Ingredients for this portion</h3>
      {meal.ingredients.map((item) => {
        const id = getIngredientCatalogId(item.name);
        return <div className="list-row" key={item.name}><div><strong>{item.name}</strong><span className="small muted">{item.quantity} {item.unit}</span></div><div className="ingredient-actions"><span className="small">{formatMoney(item.estimatedCost ?? { amountMinorUnits: item.estimatedCostCents, currencyCode: country.currencyCode }, "en-GB")}</span>{id && !isIngredientBanned(item.name, data.preferences.bannedIngredients) && <button className="text-button" onClick={() => { setIngredient(id); setIngredientAction("automatic"); }}>Exclude</button>}</div></div>;
      })}
      {meal.removedBannedIngredients?.map((removed) => <p className="small muted" key={removed.ingredientId}>{removed.name}: {removed.replacement ? `automatically replaced with ${removed.replacement}` : "left out"}.</p>)}
      {editable && <div className="button-row"><button className="button" onClick={() => setMode("replace")}>Replace recipe</button><button className="button" onClick={() => { setMode("ban"); setScope("all"); }}>Exclude recipe</button></div>}
      {editable && revert && <div className="button-row"><button className="text-button" onClick={() => { updatePlanner((previous) => ({ ...previous, preferences: revert, checked: [], cooked: [] })); onClose(); }}>Restore original for this date</button><button className="text-button" onClick={() => {
        const restored = getMealRevertPreferences(data.preferences, meal, getRevertableOccurrenceKeys(data.preferences, meal, allMeals));
        if (restored) { updatePlanner((previous) => ({ ...previous, preferences: restored, checked: [], cooked: [] })); onClose(); }
      }}>Restore all replaced dates</button></div>}
      {meal.isTypicalBreakfast && <p className="small muted">Change your repeating breakfast in Preferences.</p>}
    </> : <>
      <div className="section-heading"><h3>{mode === "ban" ? "Exclude & choose a replacement" : "Choose a replacement"}</h3><button className="text-button" onClick={() => setMode("details")}>Back</button></div>
      {mode === "replace" && <Scope scope={scope} setScope={setScope} count={occurrences.length} />}
      {!alternatives.length && <p className="notice danger">No suitable replacement recipes remain. Restore some excluded recipes first.</p>}
      <div className="alternatives">{alternatives.map((candidate) => {
        const priced = repriceMeals([scaleMealToCalories(candidate, meal.calories)], data.country)[0];
        return <button className="alternative" key={candidate.recipeKey} onClick={() => replace(candidate.recipeKey)}><span><strong>{candidate.title}</strong><small>{priced.calories} kcal / modeled base recipe; preferences still apply</small></span><span>{formatMoney(priced.estimatedCost!, "en-GB")} <Icon name="arrow" size={15} /></span></button>;
      })}</div>
    </>}
    {error && <p className="notice danger" role="alert">{error}</p>}
    <p className="small muted disclaimer">Illustrative nutrition and portion costs, not verified recipes or checkout prices.</p>
  </dialog>;
}

function Scope({ scope, setScope, count }: { scope: "one" | "all"; setScope: (scope: "one" | "all") => void; count: number }) {
  return <fieldset className="scope"><legend>Apply recipe choice to</legend><label><input type="radio" name="scope" checked={scope === "one"} onChange={() => setScope("one")} />This date</label><label><input type="radio" name="scope" checked={scope === "all"} disabled={count <= 1} onChange={() => setScope("all")} />All {count} occurrences</label></fieldset>;
}
