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
const { languages, browserLanguage, languageLocale, translate } = require(path.join(root, "i18n", "index.ts"));
const { messageTranslations } = require(path.join(root, "i18n", "messages.ts"));
const { foodTranslations } = require(path.join(root, "i18n", "food.ts"));
const { defaultState } = require(path.join(root, "storage.ts"));
const { buildPlan } = require(path.join(root, "plan.ts"));

test("all ten languages have complete interface and food dictionaries", () => {
  assert.equal(languages.length, 10);
  for (const dictionary of [messageTranslations, foodTranslations]) {
    for (const [key, values] of Object.entries(dictionary)) {
      assert.equal(values.length, 9, key);
      assert.ok(values.every((value) => typeof value === "string" && value.trim()), key);
    }
  }
  for (const language of languages) {
    assert.doesNotThrow(() => new Intl.DateTimeFormat(languageLocale(language.code)));
    for (const text of ["Meal calendar", "Meal list", "Preferences", "Seasonings", "Switch to dark mode", "Switch to light mode"]) {
      const localized = translate(text, language.code);
      assert.ok(localized);
      if (language.code !== "en") assert.notEqual(localized, text, `${language.code}: ${text}`);
    }
  }
});

test("browser language detection supports regions and Norwegian variants", () => {
  assert.equal(browserLanguage(["fr-FR", "en-US"]), "fr");
  assert.equal(browserLanguage(["zh-CN", "uk-UA"]), "uk");
  assert.equal(browserLanguage(["nb-NO"]), "no");
  assert.equal(browserLanguage(["nn-NO"]), "no");
  assert.equal(browserLanguage(["zz"]), "en");
});

test("localization preserves whitespace, brand names, units and numeric parameters", () => {
  assert.equal(translate("Batch & Budget", "fr"), "Batch & Budget");
  assert.equal(translate(" days ", "fr"), " jours ");
  assert.equal(translate("6 days / 12 meal portions", "fr").includes("days"), false);
  assert.match(translate("Estimated total cost for all 6 meals", "fr"), /6/);
  assert.equal(translate("500 kcal", "fr"), "500 kcal");
  assert.equal(translate("3 days", "ru"), "3 дня");
  assert.equal(translate("6 meals", "pl"), "6 posiłków");
});

test("language changes only presentation, never recipe identities, quantities or costs", () => {
  const state = defaultState(["fr-FR"]);
  const plan = buildPlan("2026-11-07", state.preferences, {}, state.country);
  const original = JSON.stringify(plan);
  for (const language of languages) {
    for (const day of plan.days) for (const meal of day.meals) {
      assert.ok(translate(meal.title, language.code));
      assert.ok(translate(meal.description, language.code));
      for (const item of meal.ingredients) assert.ok(translate(item.name, language.code));
    }
  }
  assert.equal(JSON.stringify(plan), original);
});
