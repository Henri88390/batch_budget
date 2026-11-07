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
const { countries, DEFAULT_COUNTRY, getCountry, getLocaleCountry } = require(path.join(root, "domain", "countryPricing.ts"));
const { buildShoppingEstimate, getCalendarDayPlans, getBatchPrep, toShoppingUnit } = require(path.join(root, "domain", "groceryEstimate.ts"));
const { getIngredientAggregationAmount } = require(path.join(root, "domain", "ingredientEstimates.ts"));
const { isIngredientBanned } = require(path.join(root, "domain", "ingredientCatalog.ts"));
const { getRecipeAlternatives, applyGlobalMealReplacement, getMealRevertPreferences, toggleIngredientBanPreference, removeMealBan } = require(path.join(root, "domain", "sampleData.ts"));

function scenario(overrides = {}, country = "DE", goals = {}) {
  const state = defaultState();
  const preferences = { ...state.preferences, ...overrides };
  return { preferences, plan: buildPlan("2026-11-07", preferences, goals, country), country, goals };
}

test("new planners and default ingredient pricing use France and euros", () => {
  assert.equal(DEFAULT_COUNTRY, "FR");
  assert.equal(defaultState().country, "FR");
  assert.equal(getCountry(DEFAULT_COUNTRY).currencyCode, "EUR");
});

test("browser locales choose supported countries and currencies with France fallback", () => {
  for (const [locales, country, currency] of [
    [["fr-FR"], "FR", "EUR"], [["en-US"], "US", "USD"],
    [["en-GB"], "GB", "GBP"], [["pl-PL"], "PL", "PLN"],
    [["en-AU"], "AU", "AUD"], [["fr-BE"], "BE", "EUR"],
    [["fr", "en-US"], "US", "USD"], [["de"], "DE", "EUR"],
    [["fr-CA"], "FR", "EUR"], [["zh-Hant-TW"], "FR", "EUR"],
    [["en-US-u-ca-gregory"], "US", "USD"], [[], "FR", "EUR"],
  ]) {
    assert.equal(getLocaleCountry(locales), country);
    assert.equal(defaultState(locales).country, country);
    assert.equal(getCountry(country).currencyCode, currency);
  }
  const saved = { ...defaultState(["fr-FR"]), country: "US" };
  assert.equal(parseSavedState(JSON.stringify(saved)).country, "US");
});

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

test("whole batch costs sum every portion and seasoning in the selected currency", () => {
  for (const country of countries) {
    for (const mealsPerDay of [2, 3]) {
      const { plan } = scenario({ mealsPerDay }, country.code, { "2026-11-07": 2600, "2026-11-08": 1800 });
      for (const batch of plan.batches) {
        const meals = plan.days.flatMap((day) => day.meals).filter((meal) => meal.batch?.startDate === batch.startDate);
        const total = meals.flatMap((meal) => meal.ingredients)
          .reduce((sum, ingredient) => sum + ingredient.estimatedCost.amountMinorUnits, 0);
        assert.equal(batch.portions, meals.length);
        assert.equal(batch.cost, total);
        assert.equal(batch.cost, meals.reduce((sum, meal) => sum + meal.estimatedCostCents, 0));
      }
    }
  }
});

test("prep sessions include exact seasoning totals without double-counting oil", () => {
  const { plan } = scenario({}, "FR", { "2026-11-07": 2600, "2026-11-08": 1800 });
  for (const batch of plan.batches) {
    const totals = new Map();
    const meals = plan.days.flatMap((day) => day.meals).filter((meal) => meal.batch?.startDate === batch.startDate);
    for (const ingredient of meals.flatMap((meal) => meal.ingredients).filter((item) => item.category === "seasoning")) {
      const amount = getIngredientAggregationAmount(ingredient.name, ingredient.quantity, ingredient.unit);
      const key = `${ingredient.name}|${amount.unit}`;
      const current = totals.get(key) ?? { name: ingredient.name, quantity: 0, unit: amount.unit };
      current.quantity += amount.quantity;
      totals.set(key, current);
    }
    assert.ok(totals.size > 0);
    for (const total of totals.values()) {
      const expected = toShoppingUnit(total.quantity, total.unit);
      const items = batch.items.filter((item) => item.name === total.name && item.unit === expected.unit);
      assert.equal(items.length, 1);
      assert.ok(Math.abs(items[0].quantity - expected.quantity) < 0.000001, total.name);
    }
  }
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
    const { plan } = scenario({ weeklyBudget: "1000", meatPerWeek: 0, dairyPerWeek: 0, typicalBreakfast });
    assert.ok(plan.days.every((day) => day.meals[0].isTypicalBreakfast));
    assert.equal(new Set(plan.days.map((day) => day.meals[0].title)).size, 1);
  }
});

test("weekly food frequencies count meals across slots, including repeating breakfasts", () => {
  const meat = /\b(chicken|beef|pork|turkey|lamb|ham|bacon|sausage|fish|tuna|salmon|sardines?)\b/i;
  const dairy = /\b(yogurt|milk|cheese|cheddar|parmesan|mozzarella|skyr|butter|cream)\b/i;
  const contains = (meal, pattern) => meal.ingredients.some((item) =>
    !/\b(soy yogurt|soy drink|oat drink|peanut butter)\b/i.test(item.name) && pattern.test(item.name));
  for (const mealsPerDay of [2, 3, 4, 5]) {
    for (const frequency of [0, 1, 2, 3, 7]) {
      const { plan } = scenario({
        weeklyBudget: "", mealsPerDay, meatPerWeek: frequency, dairyPerWeek: frequency,
        typicalBreakfast: { mode: "preset", presetId: "oatmeal-milk" },
      });
      for (const monday of ["2026-11-09", "2026-11-16", "2026-11-23", "2026-11-30"]) {
        const week = plan.days.filter((day) => day.key >= monday && day.key < addDays(monday, 7));
        assert.equal(week.length, 7);
        const meals = week.flatMap((day) => day.meals);
        assert.equal(meals.filter((meal) => contains(meal, meat)).length, frequency, `meat ${mealsPerDay}/${frequency}`);
        assert.equal(meals.filter((meal) => contains(meal, dairy)).length, frequency, `dairy ${mealsPerDay}/${frequency}`);
        if (frequency === 7) {
          assert.ok(meals.some((meal) => meal.type === "Breakfast" && contains(meal, meat)));
          assert.ok(meals.some((meal) => meal.type === "Dinner" && contains(meal, dairy)));
          if (mealsPerDay > 2) {
            assert.ok(meals.some((meal) => meal.type === "Lunch" && contains(meal, meat)));
            assert.ok(meals.some((meal) => meal.type === "Lunch" && contains(meal, dairy)));
          }
        }
      }
    }
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
  assert.equal(state.country, "FR");
  assert.equal(countries.find((country) => country.code === state.country).currencyCode, "EUR");
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

test("meal illustrations follow dish types and actual substituted ingredients", () => {
  const { getMealArt } = require(path.join(root, "meal-art.ts"));
  const { getRecipeCatalog } = require(path.join(root, "domain", "sampleData.ts"));
  const catalog = getRecipeCatalog();
  for (const [key, kind] of [
    ["monday-b", "yogurt"], ["tuesday-b", "toast"],
    ["tuesday-l", "wrap"], ["tuesday-d", "soup"],
    ["wednesday-l", "salad"], ["friday-d", "pasta"],
    ["saturday-b", "pancakes"],
  ]) {
    const meal = catalog.find((meal) => meal.recipeKey === key);
    assert.ok(meal, key);
    assert.equal(getMealArt(meal).kind, kind, meal.title);
  }
  const { plan } = scenario();
  for (const day of plan.days) for (const meal of day.meals) {
    const art = getMealArt(meal);
    assert.ok(art.kind);
    if (meal.batch) {
      assert.equal(art.kind, meal.ingredients.some((item) => /pasta/.test(item.name.toLowerCase())) ? "pasta" : "bowl");
      if (meal.ingredients.some((item) => /potato/i.test(item.name))) assert.equal(art.base, "potatoes");
    }
  }
  const plantPlan = scenario({ meatPerWeek: 0, weeklyBudget: "1000" }).plan;
  for (const day of plantPlan.days) for (const meal of day.meals.filter((meal) => meal.batch)) {
    assert.ok(!["chicken", "meat", "fish"].includes(getMealArt(meal).protein));
  }
});

test("automatic replacements exclude bans and substitution cycles and preserve calorie ordering", () => {
  const { getSafeRecipeAlternatives } = require(path.join(root, "recipe-replacements.ts"));
  const { getRecipeCatalog } = require(path.join(root, "domain", "sampleData.ts"));
  const meal = getRecipeCatalog("Breakfast")[0];
  const preferences = defaultState().preferences;
  const options = getSafeRecipeAlternatives(meal, preferences);
  assert.ok(options.length > 1);
  const distance = Math.abs(options[0].calories - meal.calories);
  assert.ok(options.every((candidate) => Math.abs(candidate.calories - meal.calories) >= distance));
  const banned = { ...preferences, bannedMeals: [meal.recipeKey, options[0].recipeKey] };
  assert.ok(!getSafeRecipeAlternatives(meal, banned).some((candidate) => banned.bannedMeals.includes(candidate.recipeKey)));
  const cyclic = { ...preferences, mealSubstitutes: { [options[0].recipeKey]: meal.recipeKey } };
  assert.ok(!getSafeRecipeAlternatives(meal, cyclic).some((candidate) => candidate.recipeKey === options[0].recipeKey));
  const allBanned = { ...preferences, bannedMeals: getRecipeCatalog("Breakfast").map((candidate) => candidate.recipeKey) };
  assert.equal(getSafeRecipeAlternatives(meal, allBanned).length, 0);
  const plan = buildPlan("2026-11-07", { ...preferences, bannedMeals: [meal.recipeKey] }, {}, "FR");
  assert.ok(!plan.days.flatMap((day) => day.meals).some((candidate) => candidate.recipeKey === meal.recipeKey));
});
