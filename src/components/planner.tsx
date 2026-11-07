"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { sectionPaths, type Section } from "@/lib/sections";
import { countries, formatMoney, getCountry } from "@/lib/domain/countryPricing";
import { buildShoppingEstimate, formatShoppingQuantity, getShoppingCategory } from "@/lib/domain/groceryEstimate";
import { getMenuMealGroupKey } from "@/lib/domain/menuGrouping";
import { getIngredientCategory } from "@/lib/domain/ingredientEstimates";
import type { Meal } from "@/lib/domain/models";
import { getDailyCalories, getDailyProtein, getMealsInDisplayOrder } from "@/lib/domain/sampleData";
import { addDays, buildPlan, dateLabel as formatDate, localDate } from "@/lib/plan";
import { updatePlanner, usePlannerStore } from "@/lib/store";
import { defaultState } from "@/lib/storage";
import { Icon, type IconName } from "./icons";
import { MealArt } from "./meal-art";
import { MealDialog } from "./meal-dialog";
import { Preferences } from "./preferences";
import { SectionHelp } from "./section-help";
import { Dropdown } from "./dropdown";
import { MealTypeIcon } from "./meal-type-icon";
import { RecipeDates } from "./recipe-dates";
import { DisplayControls, Localize, useI18n } from "./display-settings";

const navigation: { id: Section; label: string; icon: IconName }[] = [
  { id: "overview", label: "Overview", icon: "grid" },
  { id: "planner", label: "Meal calendar", icon: "calendar" },
  { id: "prep", label: "Prep sessions", icon: "pot" },
  { id: "groceries", label: "Shopping list", icon: "cart" },
  { id: "recipes", label: "Meal list", icon: "book" },
  { id: "preferences", label: "Preferences", icon: "sliders" },
];

export function Planner({ section = "overview" }: { section?: Section }) {
  const snapshot = usePlannerStore();
  if (!snapshot.ready) return <Localize><div className="loading"><div className="brand"><Icon name="leaf" size={28} />Batch & Budget</div><p>Loading planner...</p></div></Localize>;
  return <Workspace snapshot={snapshot} section={section} />;
}

function Workspace({ snapshot, section: tab }: { snapshot: ReturnType<typeof usePlannerStore>; section: Section }) {
  const { data, today } = snapshot;
  const { t, locale } = useI18n();
  const dateLabel = (key: string, options?: Intl.DateTimeFormatOptions) => formatDate(key, options, locale);
  const router = useRouter();
  function setTab(section: Section) {
    router.push(sectionPaths[section]);
  }
  const [selectedDate, setSelectedDate] = useState(today);
  const [week, setWeek] = useState(0);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [rangeStart, setRangeStart] = useState(today);
  const [rangeEnd, setRangeEnd] = useState(addDays(today, 6));
  const [recipeSearch, setRecipeSearch] = useState("");
  const [resetOpen, setResetOpen] = useState(false);
  const [goalError, setGoalError] = useState("");
  const countryNames = new Intl.DisplayNames([locale], { type: "region" });
  const selectedCountry = getCountry(data.country);
  const country = { ...selectedCountry, name: countryNames.of(data.country) ?? selectedCountry.name };
  const money = (amount: number) => formatMoney({ amountMinorUnits: amount, currencyCode: country.currencyCode }, locale);
  const plan = useMemo(() => buildPlan(today, data.preferences, data.goals, data.country), [today, data.preferences, data.goals, data.country]);
  const day = plan.days.find((day) => day.key === selectedDate) ?? plan.days[0];
  const currentWeek = plan.days.slice(week * 7, week * 7 + 7);
  const visibleWeek = currentWeek.length ? currentWeek : plan.days.slice(0, 7);
  const start = rangeStart && rangeStart < today ? today : rangeStart;
  const end = rangeEnd && rangeEnd < today ? addDays(today, 6) : rangeEnd;
  const maxShoppingDate = addDays(today, 89);
  const validRange = Boolean(start && end && start <= end && start >= today && end <= maxShoppingDate);
  const shopping = useMemo(() => validRange ? buildShoppingEstimate(localDate(start), localDate(end), plan.budget.preferences, data.goals, data.country) : null, [validRange, start, end, plan.budget.preferences, data.goals, data.country]);
  const weekShopping = useMemo(() => buildShoppingEstimate(localDate(today), localDate(addDays(today, 6)), plan.budget.preferences, data.goals, data.country), [today, plan.budget.preferences, data.goals, data.country]);
  const weeklyCost = weekShopping.estimatedTotal.amountMinorUnits;
  const prep = plan.batches.find((batch) => day.meals.some((meal) => meal.batch?.startDate === batch.startDate));
  const nextPrep = plan.batches.find((batch) => !data.cooked.includes(batch.startDate));
  const checkedKey = (key: string) => `${start}|${end}|${data.country}|${key}`;
  const checkedCount = shopping?.items.filter((item) => data.checked.includes(checkedKey(item.key))).length ?? 0;
  const groups = useMemo(() => {
    const groups = new Map<string, { meal: Meal; dates: string[] }>();
    plan.days.forEach((day) => day.meals.forEach((meal) => {
      const key = getMenuMealGroupKey(meal);
      const entry = groups.get(key) ?? { meal, dates: [] };
      if (!entry.dates.includes(day.key)) entry.dates.push(day.key);
      groups.set(key, entry);
    }));
    return [...groups.entries()];
  }, [plan.days]);
  const matchesRecipe = (meal: Meal) =>
    `${t(meal.title)} ${t(meal.description)} ${meal.title} ${meal.description}`.toLocaleLowerCase(locale).includes(recipeSearch.toLocaleLowerCase(locale));
  function toggleCooked(key: string) {
    updatePlanner((previous) => ({ ...previous, cooked: previous.cooked.includes(key) ? previous.cooked.filter((item) => item !== key) : [...previous.cooked, key] }));
  }
  function exportShopping() {
    if (!shopping) return;
    const text = [`Batch & Budget / ${shopping.startDate} - ${shopping.endDate}`, t("Illustrative portion costs, not checkout prices."), "", ...shopping.items.map((item) => `${data.checked.includes(checkedKey(item.key)) ? "[x]" : "[ ]"} ${t(item.name)}: ${t(formatShoppingQuantity(item.quantity, item.unit, locale))} - ${money(item.estimatedCost.amountMinorUnits)}`), "", `${t("Estimated total:")} ${money(shopping.estimatedTotal.amountMinorUnits)}`].join("\n");
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `batch-budget-shopping-${start}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }
  const pageTitles: Record<string, [string, string]> = {
    overview: ["Overview", "Meal plan, upcoming prep sessions, and estimated costs."],
    planner: ["Meal calendar", "A 31-day plan using shared batch ingredients."],
    prep: ["Prep sessions", "Bulk ingredient quantities and portions for each 3-4 day batch."],
    groceries: ["Shopping list", "Combined ingredient quantities for the selected dates."],
    recipes: ["Meal list", "Planned meals grouped by recipe and date."],
    preferences: ["Preferences", "Food preferences, portion targets, and weekly budget."],
  };
  const title = pageTitles[tab];
  return <Localize><div className="app-shell">
    <aside className="sidebar">
      <Link href={sectionPaths.overview} className="brand"><span className="brand-icon"><Icon name="leaf" size={25} /></span><span translate="no">Batch <span className="brand-amp">&</span> Budget</span></Link>
      <nav aria-label="Main navigation">{navigation.map((item) => <Link key={item.id} href={sectionPaths[item.id]} className={`nav-item ${tab === item.id ? "active" : ""}`} aria-current={tab === item.id ? "page" : undefined}><Icon name={item.icon} /><span>{item.label}</span>{item.id === "prep" && <span className="nav-count">{plan.batches.length}</span>}</Link>)}</nav>
      <div className="sidebar-note"><Icon name="pot" size={26} /><h3>Batch cooking</h3><p>Lunches and dinners share prepared ingredients across 3-4 days.</p><span className="pill">31-day plan</span></div>
    </aside>
    <div className="main-shell">
      <header className="topbar"><span>{tab !== "overview" && navigation.find((item) => item.id === tab)?.label}</span><div className="topbar-right"><label className="country-select"><span className="sr-only">Price country</span><Dropdown label="Price country" value={data.country} title="Changing country does not convert your numeric budget target." onChange={(value) => {
        const next = countries.find((country) => country.code === value);
        if (next) updatePlanner((previous) => ({ ...previous, country: next.code, checked: [], cooked: [] }));
      }} options={countries.map((country) => ({ value: country.code, label: `${countryNames.of(country.code) ?? country.name} / ${country.currencyCode}` }))} /></label><DisplayControls /><button type="button" className="connect-button" aria-label="Connect" title="Connect"><Icon name="user" size={22} /></button></div></header>
      <main id="main-content">
        <div className="page-heading"><div><span className="eyebrow">{dateLabel(today, { weekday: "long", day: "numeric", month: "long" }).toUpperCase()}</span><div className="page-title-line"><h1>{title[0]}</h1>{tab === "prep" && <SectionHelp label="Preparation information"><strong>Preparation quantities only; cooking instructions are not included.</strong>{" "}Totals are raw ingredient amounts to prepare for each batch. Follow safe cooking and cooling practices; refrigerate promptly and freeze portions that will not be eaten safely within 3-4 days. Rice may require a shorter refrigerated storage time.</SectionHelp>}{tab === "planner" && <SectionHelp label="Meal planner information">{title[1]}</SectionHelp>}</div>{tab !== "planner" && tab !== "overview" && <p>{title[1]}</p>}</div>{tab !== "preferences" && <button className="button" onClick={() => setTab("preferences")}><Icon name="sliders" size={17} />Adjust preferences</button>}</div>
        {snapshot.error && <p role="alert" className="notice danger">{snapshot.error}</p>}
        {plan.budget.status === "compromised" && <p className="notice budget-notice" role="status"><strong>Your budget needed a few adjustments.</strong> Applied compromises: {plan.budget.sacrificed.join(", ")}. Your original preferences are kept in Settings; the adjusted plan is shown below.</p>}
        {plan.budget.status === "impossible" && <p className="notice danger" role="alert"><strong>This budget cannot be met by the modeled plan.</strong> The lowest estimate found is {money(weeklyCost)} / week against {money(plan.budget.budget)}. Consider a higher budget or review preferences. Calorie targets have not been reduced.</p>}
        {plan.days.some((day) => day.meals.some((meal) => meal.banConflicts?.length)) && <p className="notice danger" role="alert">Some excluded ingredients have no suitable substitute. Open meal details to review conflicts; do not rely on this planner for allergies.</p>}
        {tab === "overview" && <>
          <div className="stats-grid"><Stat section="groceries" icon="cart" label="Weekly food cost estimate" value={money(weeklyCost)} note="Next 7 days / portion costs" /><Stat section="preferences" icon="sliders" label="Weekly budget" value={plan.budget.status === "off" ? "Turned off" : money(plan.budget.budget)} note={plan.budget.status === "off" ? "Set a target in Preferences" : "Per week"} warning={weeklyCost > plan.budget.budget && plan.budget.status !== "off"} /><Stat section="prep" icon="pot" label="Prep sessions" value={String(plan.batches.length)} note={`${data.cooked.filter((key) => plan.batches.some((batch) => batch.startDate === key)).length} complete / 31-day plan`} /><Stat section="planner" icon="leaf" label="Today's portions" value={`${getDailyCalories(plan.days[0].meals).toLocaleString(locale)} kcal`} note={`${getDailyProtein(plan.days[0].meals)} g protein`} /></div>
          <div className="overview-grid"><section className="panel"><div className="section-heading"><div><span className="eyebrow">DAILY PLAN</span><h2>Today&apos;s meals</h2></div><button className="text-button" onClick={() => { setSelectedDate(today); setWeek(0); setTab("planner"); }}>View plan <Icon name="arrow" size={15} /></button></div><div className="today-meals">{getMealsInDisplayOrder(plan.days[0].meals).map((meal) => <button className="today-meal" key={meal.id} onClick={() => setSelectedMeal(meal)}><span className={`meal-thumbnail ${meal.type.toLowerCase()}`}>{meal.emoji}</span><span><small><MealTypeIcon meal={meal} /></small><strong>{meal.title}</strong><span className="muted small">{meal.calories} kcal {meal.batch ? "/ batch prepared" : ""}</span></span><span className="today-meal-price">{money(meal.estimatedCostCents)}<Icon name="arrow" size={16} /></span></button>)}</div></section>
            <section className="panel next-prep"><span className="eyebrow">PREPARATION</span><h2>{nextPrep ? "Next prep session" : "All prep sessions complete"}</h2>{nextPrep ? <><div className="prep-date"><Icon name="pot" size={30} /><div><strong>{dateLabel(nextPrep.startDate, { weekday: "long", month: "short", day: "numeric" })}</strong><span>{nextPrep.days} days / {nextPrep.portions} meal portions</span></div></div><div className="component-preview">{nextPrep.items.slice(0, 4).map((item) => <div key={item.name}><Icon name="check" size={15} />{item.name.replace(/, dry|, drained/g, "")}</div>)}</div><button className="button primary full-width" onClick={() => setTab("prep")}>View prep quantities <Icon name="arrow" size={17} /></button></> : <p className="muted">All sessions are marked as prepped. You can undo this in Prep sessions.</p>}</section></div>
        </>}
        {tab === "planner" && <>
          <section className="panel calendar-panel"><div className="section-heading"><div><h2>{dateLabel(visibleWeek[0].key)} - {dateLabel(visibleWeek[visibleWeek.length - 1].key)}</h2></div><div className="button-row compact"><button className="button" aria-label="Previous week" title="Previous week" disabled={week === 0} onClick={() => { const next = week - 1; setWeek(next); setSelectedDate(plan.days[next * 7].key); }}><Icon name="arrowLeft" size={18} /></button><button className="button" onClick={() => { setWeek(0); setSelectedDate(today); }}>Today</button><button className="button" aria-label="Next week" title="Next week" disabled={(week + 1) * 7 >= plan.days.length} onClick={() => { const next = week + 1; setWeek(next); setSelectedDate(plan.days[next * 7].key); }}><Icon name="arrow" size={18} /></button></div></div>
            <div className="date-strip">{visibleWeek.map((date) => <button key={date.key} className={`date-button ${date.key === day.key ? "selected" : ""}`} aria-pressed={date.key === day.key} onClick={() => setSelectedDate(date.key)}><span>{dateLabel(date.key, { weekday: "short" })}</span><strong>{localDate(date.key).getDate()}</strong><small>{date.key === today ? "Today" : plan.batches.some((batch) => batch.startDate === date.key) ? "Prep day" : "Planned"}</small></button>)}</div></section>
          <div className="day-heading"><div><h2>{dateLabel(day.key, { weekday: "long", day: "numeric", month: "long" })}</h2><p className="muted">{getDailyCalories(day.meals)} kcal / {getDailyProtein(day.meals)} g protein / {money(day.meals.reduce((sum, meal) => sum + meal.estimatedCostCents, 0))}</p></div><form className="portion-form" key={`${day.key}-${data.goals[day.key]}`} onSubmit={(event) => {
            event.preventDefault();
            const fields = new FormData(event.currentTarget);
            const goal = Number(fields.get("goal"));
            if (!Number.isInteger(goal) || goal < 500 || goal > 10000) { setGoalError("Enter a whole-number calorie target between 500 and 10000."); return; }
            updatePlanner((previous) => ({ ...previous, goals: { ...previous.goals, [day.key]: goal }, checked: [], cooked: [] }));
            setGoalError("");
          }}><label>Calories for this day<input name="goal" type="number" min="500" max="10000" required defaultValue={data.goals[day.key] ?? 2000} /></label><button className="button" type="submit">Apply</button></form></div>
          {goalError && <p className="notice danger" role="alert">{goalError}</p>}
          {prep && <div className="prep-banner"><Icon name="pot" size={24} /><div><strong>Batch starting {dateLabel(prep.startDate)}</strong><span>{prep.days} days / {prep.portions} meal portions / shared ingredients</span></div><button className="text-button" onClick={() => setTab("prep")}>View prep <Icon name="arrow" size={15} /></button></div>}
          <div className="meal-grid">{getMealsInDisplayOrder(day.meals).map((meal, index) => <MealCard key={meal.id} meal={meal} money={money} index={index} onClick={() => setSelectedMeal(meal)} />)}</div>
        </>}
        {tab === "prep" && <><div className="prep-grid">{plan.batches.map((batch, index) => {
          const cooked = data.cooked.includes(batch.startDate);
          const seasonings = batch.items.filter((item) => getIngredientCategory(item.name) === "seasoning");
          const ingredients = batch.items.filter((item) => getIngredientCategory(item.name) !== "seasoning");
          return <section className={`panel batch-card ${cooked ? "cooked" : ""}`} key={batch.startDate}>
            <div className="section-heading"><span className="session-number">SESSION {String(index + 1).padStart(2, "0")}</span><span className="pill">{batch.days} days</span></div>
            <h2>{dateLabel(batch.startDate, { weekday: "long", month: "short", day: "numeric" })}</h2>
            <p className="muted">{dateLabel(batch.startDate)} - {dateLabel(addDays(batch.startDate, batch.days - 1))} / {batch.portions} portions</p>
            <div className="batch-cost"><span>Estimated total cost for all {batch.portions} meals</span><strong>{money(batch.cost)}</strong></div>
            {ingredients.map((item) => <div className="list-row" key={item.name}><span>{item.name}</span><strong>{formatShoppingQuantity(item.quantity, item.unit, locale)}</strong></div>)}
            {seasonings.length > 0 && <details className="prep-seasonings"><summary>Seasonings <Icon name="chevronDown" size={16} /></summary>
              {seasonings.map((item) => <div className="list-row" key={item.name}><span>{item.name}</span><strong>{formatShoppingQuantity(item.quantity, item.unit, locale)}</strong></div>)}
            </details>}
            <button className={`button full-width ${cooked ? "" : "primary"}`} aria-pressed={cooked} onClick={() => toggleCooked(batch.startDate)}><Icon name="check" size={17} />{cooked ? "Prepped - undo" : "Mark as prepped"}</button>
          </section>;
        })}</div></>}
        {tab === "groceries" && <>
          <section className="panel shopping-controls"><div className="form-grid"><label>Start date<input type="date" value={start} min={today} max={maxShoppingDate} onChange={(event) => setRangeStart(event.target.value)} /></label><label>End date<input type="date" value={end} min={start || today} max={maxShoppingDate} onChange={(event) => setRangeEnd(event.target.value)} /></label></div><div className="button-row"><button className="button" onClick={() => { setRangeStart(today); setRangeEnd(addDays(today, 6)); }}>Next 7 days</button><button className="button" onClick={exportShopping} disabled={!shopping}>Download list</button><button className="button" disabled={!shopping} onClick={() => window.print()}>Print</button></div></section>
          {!validRange && <p className="notice danger" role="alert">Choose an end date on or after the start date, within the next 90 days.</p>}
          {shopping && <div className="shopping-grid"><section className="panel shopping-list"><div className="section-heading"><div><span className="eyebrow">SHOPPING LIST</span><h2>{shopping.items.length} ingredients</h2></div><span className="pill">{checkedCount} / {shopping.items.length} checked</span></div>{[...new Set(shopping.items.map((item) => getShoppingCategory(item.name)))].map((category) => <div className="shopping-category" key={category}><h3>{category}</h3>{shopping.items.filter((item) => getShoppingCategory(item.name) === category).map((item) => {
            const checked = data.checked.includes(checkedKey(item.key));
            return <label className={`shopping-row ${checked ? "checked" : ""}`} key={item.key}><input type="checkbox" checked={checked} onChange={() => updatePlanner((previous) => ({ ...previous, checked: checked ? previous.checked.filter((key) => key !== checkedKey(item.key)) : [...previous.checked, checkedKey(item.key)] }))} /><span className="shopping-name">{item.name}<small>{formatShoppingQuantity(item.quantity, item.unit, locale)}</small></span><strong>{money(item.estimatedCost.amountMinorUnits)}</strong></label>;
          })}</div>)}</section><aside className="panel shopping-summary"><span className="eyebrow">COST SUMMARY</span><h2>Estimated ingredient cost</h2><span className="basket-total">{money(shopping.estimatedTotal.amountMinorUnits)}</span><p className="muted">{dateLabel(start)} - {dateLabel(end)}<br />{country.name} / {country.currencyCode}</p><div className="form-divider" /><div className="list-row"><span>Ingredients</span><strong>{shopping.items.length}</strong></div><div className="list-row"><span>Checked off</span><strong>{checkedCount}</strong></div><p className="notice small">These are synthetic portion costs, not the price of buying whole packages. No retailer data, offers, or live country prices are used.</p><button className="button full-width" disabled={!checkedCount} onClick={() => updatePlanner((previous) => ({ ...previous, checked: previous.checked.filter((key) => !shopping.items.some((item) => checkedKey(item.key) === key)) }))}>Uncheck this list</button></aside></div>}
        </>}
        {tab === "recipes" && <><div className="panel recipe-search"><label>Find a meal in your plan<input type="search" placeholder="Search meals or ingredients..." value={recipeSearch} onChange={(event) => setRecipeSearch(event.target.value)} /></label></div><div className="meal-grid">{groups.filter(([, group]) => matchesRecipe(group.meal)).map(([key, group], index) => <div key={key}><MealCard meal={group.meal} money={money} index={index} onClick={() => setSelectedMeal(group.meal)} /><RecipeDates dates={group.dates} title={group.meal.title} /></div>)}</div>{!groups.some(([, group]) => matchesRecipe(group.meal)) && <p className="notice">No meals match that search.</p>}</>}
        {tab === "preferences" && <><Preferences data={data} dateKeys={plan.days.map((day) => day.key)} /><section className="panel reset-panel"><div><h3>Reset planner data</h3><p className="muted small">Reset your locally saved preferences, portions, exclusions, and checklists.</p></div>{resetOpen ? <div className="button-row"><span className="small">Clear all local planner data?</span><button className="button danger-button" onClick={() => { updatePlanner(() => defaultState(navigator.languages.length ? navigator.languages : [navigator.language])); setResetOpen(false); setTab("overview"); }}>Yes, reset</button><button className="button" onClick={() => setResetOpen(false)}>Cancel</button></div> : <button className="button" onClick={() => setResetOpen(true)}>Reset planner</button>}</section></>}
        <footer className="app-footer"><span>Batch & Budget</span><span>Sample nutrition & synthetic prices. Not medical advice or verified retailer data.</span></footer>
      </main>
    </div>
    {selectedMeal && <MealDialog key={selectedMeal.occurrenceKey ?? selectedMeal.id} meal={selectedMeal} data={data} days={plan.days} onClose={() => setSelectedMeal(null)} />}
  </div></Localize>;
}

function Stat({ section, icon, label, value, note, warning = false }: { section: Section; icon: IconName; label: string; value: string; note: string; warning?: boolean }) {
  return <Localize><Link href={sectionPaths[section]} className={`stat-card ${warning ? "warning" : ""}`}><div className="stat-label"><span>{label}</span><Icon name={icon} size={19} /></div><strong>{value}</strong><span className="small muted">{note}</span></Link></Localize>;
}

function MealCard({ meal, money, index, onClick }: { meal: Meal; money: (value: number) => string; index: number; onClick: () => void }) {
  return <Localize><button className="meal-card" onClick={onClick}><div className={`meal-card-art art-${index % 3}`}><MealArt meal={meal} /><span className="meal-type"><MealTypeIcon meal={meal} /></span>{meal.batch && <span className="batch-tag"><Icon name="pot" size={13} />Batch</span>}</div><div className="meal-card-body"><h3>{meal.title}</h3><p>{meal.description}</p><div className="meal-card-meta"><span>{meal.calories} kcal</span><strong>{money(meal.estimatedCostCents)}</strong></div>{meal.banConflicts?.length ? <span className="conflict-label">Ingredient conflict - review details</span> : null}</div></button></Localize>;
}
