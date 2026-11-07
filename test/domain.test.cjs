const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");
const ts = require("typescript");

require.extensions[".ts"] = (module, filename) => {
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    fileName: filename,
  });
  module._compile(outputText, filename);
};
const root = path.join(__dirname, "..", "src", "lib");
const { buildPlan, addDays, localDate } = require(path.join(root, "plan.ts"));
const { defaultState, parseSavedState } = require(path.join(root, "storage.ts"));
const { countries } = require(path.join(root, "domain", "countryPricing.ts"));
const { buildShoppingEstimate, getCalendarDayPlans, getBatchPrep } = require(path.join(root, "domain", "groceryEstimate.ts"));
const { isIngredientBanned } = require(path.join(root, "domain", "ingredientCatalog.ts"));
const { getRecipeAlternatives, applyGlobalMealReplacement, getMealRevertPreferences, toggleIngredientBanPreference, removeMealBan } = require(path.join(root, "domain", "sampleData.ts"));

function scenario(overrides = {}, country = "DE", goals = {}) {
  const state = defaultState();
  const preferences = { ...state.preferences, ...overrides };
  return { preferences, plan: buildPlan("2026-11-07", preferences, goals, country), country, goals };
}

test("31-day plan has exact requested calories at every meal count", () => {
  for (const count of [2, 3, 4, 5]) {
    const goals = Object.fromEntries(Array.from({ length: 31 }, (_, i) => [addDays("2026-11-07", i), 2400]));
    const { plan } = scenario({ mealsPerDay: count }, "DE", goals);
    assert.equal(plan.days.length, 31);
    for (const day of plan.days) {
      assert.equal(day.meals.length, count);
      assert.equal(day.meals.reduce((total, meal) => total + meal.calories, 0), 2400);
      for (const meal of day.meals) {
        assert.equal(meal.ingredients.reduce((total, item) => total + item.calories, 0), meal.calories);
        if (meal.type === "Lunch" || meal.type === "Dinner") assert.ok(meal.batch);
      }
    }
  }
});

test("batch sessions cover exactly 31 days in contiguous 3-4 day segments", () => {
  const { plan } = scenario();
  let cursor = "2026-11-07";
  for (const batch of plan.batches) {
    assert.equal(batch.startDate, cursor);
    assert.ok(batch.days === 3 || batch.days === 4);
    assert.equal(batch.portions, batch.days * 2);
    assert.ok(batch.items.length > 0);
    cursor = addDays(cursor, batch.days);
  }
  assert.equal(cursor, "2026-12-08");
});

test("shopping costs exactly sum displayed calendar ingredient costs in every currency", () => {
  for (const country of countries) {
    const { plan, goals } = scenario({}, country.code);
    const estimate = buildShoppingEstimate(localDate("2026-11-07"), localDate("2026-11-13"), plan.budget.preferences, goals, country.code);
    const total = plan.days.slice(0, 7).flatMap((day) => day.meals).flatMap((meal) => meal.ingredients).reduce((sum, item) => sum + item.estimatedCost.amountMinorUnits, 0);
    assert.equal(estimate.estimatedTotal.amountMinorUnits, total);
    assert.equal(estimate.items.reduce((sum, item) => sum + item.estimatedCost.amountMinorUnits, 0), total);
    assert.equal(estimate.estimatedTotal.currencyCode, country.currencyCode);
  }
});

test("batch prep quantities match personalized calendar component quantities", () => {
  const goals = { "2026-11-07": 2600, "2026-11-08": 1800 };
  const { plan } = scenario({}, "DE", goals);
  const prep = getBatchPrep(localDate("2026-11-07"), plan.budget.preferences, goals, "DE", localDate("2026-11-07"), localDate("2026-12-07"));
  assert.deepEqual(prep.items, plan.batches[0].items);
  assert.ok(prep.items.every((item) => item.quantity > 0));
  assert.notDeepEqual(prep.items, scenario().plan.batches[0].items);
});

test("budget fitting remains batch cooking and explicitly reports impossible targets", () => {
  const affordable = scenario({ weeklyBudget: "1000" }).plan;
  assert.equal(affordable.budget.status, "ok");
  const low = scenario({ weeklyBudget: "1" }).plan;
  assert.equal(low.budget.status, "impossible");
  assert.ok(low.budget.weeklyCost > low.budget.budget);
  assert.equal(low.budget.preferences.planStyle, "batchCooking");
  assert.equal(low.days[0].meals.reduce((sum, meal) => sum + meal.calories, 0), 2000);
  const off = scenario({ weeklyBudget: "" }).plan;
  assert.equal(off.budget.status, "off");
  assert.ok(off.days.every((day) => day.meals.filter((meal) => meal.type !== "Breakfast").every((meal) => meal.batch)));
});

test("ingredient exclusions are honored through budget fitting and batch generation", () => {
  const bannedIngredients = ["chicken-breast", "chicken-thigh", "frozen-beef-mince", "milk", "basmati-rice"];
  const { plan } = scenario({ bannedIngredients });
  for (const day of plan.days) for (const meal of day.meals) for (const item of meal.ingredients) {
    assert.equal(isIngredientBanned(item.name, bannedIngredients), false, item.name);
  }
});

test("preset and custom breakfasts repeat, with exclusions still applied", () => {
  for (const typicalBreakfast of [
    { mode: "preset", presetId: "oatmeal-milk" },
    { mode: "custom", ingredients: [{ name: "Rolled oats", quantity: "80", unit: "g" }] },
  ]) {
    const { plan } = scenario({ weeklyBudget: "1000", typicalBreakfast });
    assert.ok(plan.days.every((day) => day.meals[0].isTypicalBreakfast));
    assert.equal(new Set(plan.days.map((day) => day.meals[0].title)).size, 1);
  }
});

test("breakfast replacement, bans, and per-date restoration remain wired", () => {
  const { plan, preferences } = scenario({ weeklyBudget: "1000" });
  const first = plan.days[0].meals[0];
  const replacement = getRecipeAlternatives("Breakfast", first.recipeKey, [])[0];
  const replaced = applyGlobalMealReplacement(preferences, [first.sourceRecipeKey], first.recipeKey, replacement.recipeKey);
  const next = buildPlan("2026-11-07", replaced, {}, "DE");
  assert.equal(next.days[0].meals[0].recipeKey, replacement.recipeKey);
  const restored = getMealRevertPreferences(replaced, next.days[0].meals[0]);
  assert.ok(restored);
  assert.equal(buildPlan("2026-11-07", restored, {}, "DE").days[0].meals[0].recipeKey, first.recipeKey);
  const banned = { ...replaced, bannedMeals: [first.recipeKey] };
  assert.ok(!buildPlan("2026-11-07", banned, {}, "DE").days.flatMap((day) => day.meals).some((meal) => meal.recipeKey === first.recipeKey));
  assert.equal(removeMealBan(banned, first.recipeKey).bannedMeals.length, 0);
  assert.equal(toggleIngredientBanPreference(toggleIngredientBanPreference(preferences, "milk"), "milk").bannedIngredients.length, 0);
});

test("local-date helpers and inclusive grocery ranges reject invalid input", () => {
  assert.equal(addDays("2026-03-28", 2), "2026-03-30");
  assert.throws(() => localDate("2026-02-30"), RangeError);
  const { preferences } = scenario();
  assert.equal(getCalendarDayPlans(localDate("2026-03-28"), localDate("2026-03-30"), preferences, {}, "DE").length, 3);
  assert.throws(() => getCalendarDayPlans(localDate("2026-11-07"), localDate("2027-02-07"), preferences, {}, "DE"), RangeError);
  assert.throws(() => getCalendarDayPlans(localDate("2026-11-08"), localDate("2026-11-07"), preferences, {}, "DE"), RangeError);
});

test("saved state round trips and rejects malformed preferences and unsupported styles", () => {
  const state = defaultState();
  assert.deepEqual(parseSavedState(JSON.stringify(state)), state);
  for (const change of [
    { version: 2 }, { country: "XX" }, { goals: { "2026-02-30": 2000 } },
    { preferences: { ...state.preferences, mealsPerDay: 9 } },
    { preferences: { ...state.preferences, planStyle: "highProtein" } },
    { preferences: { ...state.preferences, bannedIngredients: ["made-up"] } },
  ]) assert.throws(() => parseSavedState(JSON.stringify({ ...state, ...change })));
  const changed = { ...state, preferences: { ...state.preferences, mealOccurrenceOverrides: { "2026-11-07|Breakfast": "monday-b" } } };
  assert.deepEqual(parseSavedState(JSON.stringify(changed)), changed);
});
