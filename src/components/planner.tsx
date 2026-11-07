"use client";

import { useMemo, useState } from "react";
import { countries, formatMoney, getCountry } from "@/lib/domain/countryPricing";
import { buildShoppingEstimate, formatShoppingQuantity, getShoppingCategory } from "@/lib/domain/groceryEstimate";
import { getMenuMealGroupKey } from "@/lib/domain/menuGrouping";
import type { Meal } from "@/lib/domain/models";
import { getDailyCalories, getDailyProtein, getMealsInDisplayOrder } from "@/lib/domain/sampleData";
import { addDays, buildPlan, dateLabel, localDate } from "@/lib/plan";
import { updatePlanner, usePlannerStore } from "@/lib/store";
import { defaultState } from "@/lib/storage";
import { BowlArt, Icon, type IconName } from "./icons";
import { MealDialog } from "./meal-dialog";
import { Preferences } from "./preferences";

const navigation: { id: string; label: string; icon: IconName }[] = [
  { id: "overview", label: "Overview", icon: "grid" },
  { id: "planner", label: "Meal planner", icon: "calendar" },
  { id: "prep", label: "Prep sessions", icon: "pot" },
  { id: "groceries", label: "Shopping list", icon: "cart" },
  { id: "recipes", label: "Your menu", icon: "book" },
  { id: "preferences", label: "Preferences", icon: "sliders" },
];

export function Planner() {
  const snapshot = usePlannerStore();
  if (!snapshot.ready) return <div className="loading"><div className="brand"><Icon name="leaf" size={28} />Batch & Budget</div><p>Getting your kitchen ready...</p></div>;
  return <Workspace snapshot={snapshot} />;
}

function Workspace({ snapshot }: { snapshot: ReturnType<typeof usePlannerStore> }) {
  const { data, today } = snapshot;
  const [tab, setTab] = useState("overview");
  const [selectedDate, setSelectedDate] = useState(today);
  const [week, setWeek] = useState(0);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [rangeStart, setRangeStart] = useState(today);
  const [rangeEnd, setRangeEnd] = useState(addDays(today, 6));
  const [recipeSearch, setRecipeSearch] = useState("");
  const [resetOpen, setResetOpen] = useState(false);
  const [goalError, setGoalError] = useState("");
  const country = getCountry(data.country);
  const money = (amount: number) => formatMoney({ amountMinorUnits: amount, currencyCode: country.currencyCode }, "en-GB");
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
  const remaining = plan.budget.budget - weeklyCost;
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
  function toggleCooked(key: string) {
    updatePlanner((previous) => ({ ...previous, cooked: previous.cooked.includes(key) ? previous.cooked.filter((item) => item !== key) : [...previous.cooked, key] }));
  }
  function exportShopping() {
    if (!shopping) return;
    const text = [`Batch & Budget / ${shopping.startDate} - ${shopping.endDate}`, "Illustrative portion costs, not checkout prices.", "", ...shopping.items.map((item) => `${data.checked.includes(checkedKey(item.key)) ? "[x]" : "[ ]"} ${item.name}: ${formatShoppingQuantity(item.quantity, item.unit, "en-GB")} - ${money(item.estimatedCost.amountMinorUnits)}`), "", `Estimated total: ${money(shopping.estimatedTotal.amountMinorUnits)}`].join("\n");
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `batch-budget-shopping-${start}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }
  const pageTitles: Record<string, [string, string]> = {
    overview: ["A little prep. A better week.", "Good food, a calmer kitchen, and a budget that works for you."],
    planner: ["Your meals, all planned out.", "A 31-day plan built around a few shared ingredients."],
    prep: ["Cook once. Make it count.", "Your bulk ingredients and portions, organised into 3-4 day sessions."],
    groceries: ["A smarter shopping trip.", "One combined list. Just what your plan needs."],
    recipes: ["A little variety. Less effort.", "Every meal in your plan, grouped by recipe and planned dates."],
    preferences: ["Your kitchen. Your rules.", "Make the plan fit your food preferences and spending target."],
  };
  const title = pageTitles[tab];
  return <div className="app-shell">
    <aside className="sidebar">
      <a href="#" className="brand" onClick={(event) => { event.preventDefault(); setTab("overview"); }}><span className="brand-icon"><Icon name="leaf" size={25} /></span><span>Batch <span className="brand-amp">&</span> Budget<small>LESS EFFORT. MORE GOOD FOOD.</small></span></a>
      <div className="nav-caption">YOUR KITCHEN</div>
      <nav aria-label="Main navigation">{navigation.map((item) => <button key={item.id} className={`nav-item ${tab === item.id ? "active" : ""}`} aria-current={tab === item.id ? "page" : undefined} onClick={() => setTab(item.id)}><Icon name={item.icon} /><span>{item.label}</span>{item.id === "prep" && <span className="nav-count">{plan.batches.length}</span>}</button>)}</nav>
      <div className="sidebar-note"><Icon name="pot" size={26} /><h3>A small habit.<br />A big difference.</h3><p>A few ingredients, a little prep, and the next few days are sorted.</p><span className="pill">Always batch cooking</span></div>
      <div className="local-profile"><span className="profile-avatar">Y</span><div><strong>Your local kitchen</strong><small>No account needed</small></div><span className="status-dot" /></div>
    </aside>
    <div className="main-shell">
      <header className="topbar"><span><span className="breadcrumb">Your kitchen</span><span className="breadcrumb-divider">/</span>{navigation.find((item) => item.id === tab)?.label}</span><div className="topbar-right"><span className="local-tag"><span className="status-dot" />{snapshot.error ? "Storage needs attention" : "Saved on this device"}</span><label className="country-select"><span className="sr-only">Price country</span><select value={data.country} title="Changing country does not convert your numeric budget target." onChange={(event) => {
        const next = countries.find((country) => country.code === event.target.value);
        if (next) updatePlanner((previous) => ({ ...previous, country: next.code, checked: [], cooked: [] }));
      }}>{countries.map((country) => <option key={country.code} value={country.code}>{country.name} / {country.currencyCode}</option>)}</select></label></div></header>
      <main id="main-content">
        <div className="page-heading"><div><span className="eyebrow">{dateLabel(today, { weekday: "long", day: "numeric", month: "long" }).toUpperCase()}</span><h1>{title[0]}</h1><p>{title[1]}</p></div>{tab !== "preferences" && <button className="button" onClick={() => setTab("preferences")}><Icon name="sliders" size={17} />Adjust preferences</button>}</div>
        {snapshot.error && <p role="alert" className="notice danger">{snapshot.error}</p>}
        {plan.budget.status === "compromised" && <p className="notice budget-notice" role="status"><strong>Your budget needed a few adjustments.</strong> Applied compromises: {plan.budget.sacrificed.join(", ")}. Your original preferences are kept in Settings; the adjusted plan is shown below.</p>}
        {plan.budget.status === "impossible" && <p className="notice danger" role="alert"><strong>This budget cannot be met by the modeled plan.</strong> The lowest estimate found is {money(weeklyCost)} / week against {money(plan.budget.budget)}. Consider a higher budget or review preferences. Calorie targets have not been reduced.</p>}
        {plan.days.some((day) => day.meals.some((meal) => meal.banConflicts?.length)) && <p className="notice danger" role="alert">Some excluded ingredients have no suitable substitute. Open meal details to review conflicts; do not rely on this planner for allergies.</p>}
        {tab === "overview" && <>
          <section className="hero"><div className="hero-copy"><span className="hero-kicker"><span className="status-dot" />YOUR WEEK, SIMPLIFIED</span><h2>Cook once.<br />Eat well. <span>Spend less.</span></h2><p>Let a few good ingredients do more.<br />Your meals, prep sessions, and shopping list are ready.</p><button className="button primary" onClick={() => setTab("planner")}>See my meal plan <Icon name="arrow" size={18} /></button><span className="hero-footnote">One person. One plan. A lot less thinking.</span></div><div className="hero-visual"><div className="hero-circle" /><BowlArt /><span className="floating-note"><Icon name="pot" size={20} /><span><strong>Prep a little. Enjoy a lot.</strong><small>3-4 days from one session</small></span></span><span className="little-leaf"><Icon name="leaf" size={32} /></span></div></section>
          <div className="stats-grid"><Stat icon="cart" label="Weekly food estimate" value={money(weeklyCost)} note="Next 7 days / portion costs" /><Stat icon="sliders" label={plan.budget.status === "off" ? "Budget fitting" : remaining < 0 ? "Over your weekly target" : "Left in your weekly target"} value={plan.budget.status === "off" ? "Turned off" : money(Math.abs(remaining))} note={plan.budget.status === "off" ? "Set a target in Preferences" : `Target: ${money(plan.budget.budget)} / week`} warning={remaining < 0 && plan.budget.status !== "off"} /><Stat icon="pot" label="Prep sessions" value={String(plan.batches.length)} note={`${data.cooked.filter((key) => plan.batches.some((batch) => batch.startDate === key)).length} complete / 31-day plan`} /><Stat icon="leaf" label="Today's portions" value={`${getDailyCalories(plan.days[0].meals).toLocaleString("en-GB")} kcal`} note={`${getDailyProtein(plan.days[0].meals)} g modeled protein`} /></div>
          <div className="overview-grid"><section className="panel"><div className="section-heading"><div><span className="eyebrow">ON THE MENU</span><h2>Today looks delicious</h2></div><button className="text-button" onClick={() => { setSelectedDate(today); setWeek(0); setTab("planner"); }}>View plan <Icon name="arrow" size={15} /></button></div><div className="today-meals">{getMealsInDisplayOrder(plan.days[0].meals).map((meal) => <button className="today-meal" key={meal.id} onClick={() => setSelectedMeal(meal)}><span className={`meal-thumbnail ${meal.type.toLowerCase()}`}>{meal.emoji}</span><span><small>{meal.type}{meal.slot ? ` / ${meal.slot}` : ""}</small><strong>{meal.title}</strong><span className="muted small">{meal.calories} kcal {meal.batch ? "/ batch prepared" : `/ ${meal.durationMinutes} min`}</span></span><span className="today-meal-price">{money(meal.estimatedCostCents)}<Icon name="arrow" size={16} /></span></button>)}</div></section>
            <section className="panel next-prep"><span className="eyebrow">A LITTLE TIME WELL SPENT</span><h2>{nextPrep ? "Your next prep session" : "All prep sessions complete"}</h2>{nextPrep ? <><div className="prep-date"><Icon name="pot" size={30} /><div><strong>{dateLabel(nextPrep.startDate, { weekday: "long", month: "short", day: "numeric" })}</strong><span>{nextPrep.days} days / {nextPrep.portions} meal portions</span></div></div><div className="component-preview">{nextPrep.items.slice(0, 4).map((item) => <div key={item.name}><Icon name="check" size={15} />{item.name.replace(/, dry|, drained/g, "")}</div>)}</div><button className="button primary full-width" onClick={() => setTab("prep")}>See what to prep <Icon name="arrow" size={17} /></button></> : <p className="muted">Your kitchen is sorted. You can unmark a session in Prep sessions.</p>}<p className="small muted">Raw ingredient totals follow your calorie targets.</p></section></div>
        </>}
        {tab === "planner" && <>
          <section className="panel calendar-panel"><div className="section-heading"><div><span className="eyebrow">YOUR PLANNING WINDOW</span><h2>{dateLabel(visibleWeek[0].key)} - {dateLabel(visibleWeek[visibleWeek.length - 1].key)}</h2></div><div className="button-row compact"><button className="button" aria-label="Previous week" disabled={week === 0} onClick={() => { const next = week - 1; setWeek(next); setSelectedDate(plan.days[next * 7].key); }}>Previous</button><button className="button" onClick={() => { setWeek(0); setSelectedDate(today); }}>Today</button><button className="button" aria-label="Next week" disabled={(week + 1) * 7 >= plan.days.length} onClick={() => { const next = week + 1; setWeek(next); setSelectedDate(plan.days[next * 7].key); }}>Next</button></div></div>
            <div className="date-strip">{visibleWeek.map((date) => <button key={date.key} className={`date-button ${date.key === day.key ? "selected" : ""}`} aria-pressed={date.key === day.key} onClick={() => setSelectedDate(date.key)}><span>{dateLabel(date.key, { weekday: "short" })}</span><strong>{localDate(date.key).getDate()}</strong><small>{date.key === today ? "Today" : plan.batches.some((batch) => batch.startDate === date.key) ? "Prep day" : "Planned"}</small></button>)}</div></section>
          <div className="day-heading"><div><h2>{dateLabel(day.key, { weekday: "long", day: "numeric", month: "long" })}</h2><p className="muted">{getDailyCalories(day.meals)} kcal / {getDailyProtein(day.meals)} g modeled protein / {money(day.meals.reduce((sum, meal) => sum + meal.estimatedCostCents, 0))}</p></div><form className="portion-form" key={`${day.key}-${data.goals[day.key]}`} onSubmit={(event) => {
            event.preventDefault();
            const fields = new FormData(event.currentTarget);
            const goal = Number(fields.get("goal"));
            if (!Number.isInteger(goal) || goal < 500 || goal > 10000) { setGoalError("Enter a whole-number calorie target between 500 and 10000."); return; }
            updatePlanner((previous) => ({ ...previous, goals: { ...previous.goals, [day.key]: goal }, checked: [], cooked: [] }));
            setGoalError("");
          }}><label>Calories for this date<input name="goal" type="number" min="500" max="10000" required defaultValue={data.goals[day.key] ?? 2000} /></label><button className="button" type="submit">Apply</button></form></div>
          {goalError && <p className="notice danger" role="alert">{goalError}</p>}
          {prep && <div className="prep-banner"><Icon name="pot" size={24} /><div><strong>Made from your {dateLabel(prep.startDate)} batch</strong><span>{prep.days} days / {prep.portions} meal portions / shared ingredients, less work</span></div><button className="text-button" onClick={() => setTab("prep")}>View prep <Icon name="arrow" size={15} /></button></div>}
          <div className="meal-grid">{getMealsInDisplayOrder(day.meals).map((meal, index) => <MealCard key={meal.id} meal={meal} money={money} index={index} onClick={() => setSelectedMeal(meal)} />)}</div>
        </>}
        {tab === "prep" && <><div className="notice"><strong>Your prep, not a cooking tutorial.</strong> Totals are raw ingredient amounts to prepare for each batch. Follow safe cooking and cooling practices; refrigerate promptly and freeze portions that will not be eaten safely within 3-4 days. Rice may require a shorter refrigerated storage time.</div><div className="prep-grid">{plan.batches.map((batch, index) => {
          const cooked = data.cooked.includes(batch.startDate);
          return <section className={`panel batch-card ${cooked ? "cooked" : ""}`} key={batch.startDate}><div className="section-heading"><span className="session-number">SESSION {String(index + 1).padStart(2, "0")}</span><span className="pill">{batch.days} days</span></div><h2>{dateLabel(batch.startDate, { weekday: "long", month: "short", day: "numeric" })}</h2><p className="muted">{dateLabel(batch.startDate)} - {dateLabel(addDays(batch.startDate, batch.days - 1))} / {batch.portions} portions</p><div className="batch-cost"><span>Estimated batch meal cost</span><strong>{money(batch.cost)}</strong></div><h3>Cook these components in bulk</h3>{batch.items.map((item) => <div className="list-row" key={item.name}><span>{item.name}</span><strong>{formatShoppingQuantity(item.quantity, item.unit, "en-GB")}</strong></div>)}<p className="small muted">Seasonings, breakfasts, and snacks are in your shopping list; add seasonings when assembling meals.</p><button className={`button full-width ${cooked ? "" : "primary"}`} aria-pressed={cooked} onClick={() => toggleCooked(batch.startDate)}><Icon name="check" size={17} />{cooked ? "Prepped - undo" : "Mark as prepped"}</button></section>;
        })}</div></>}
        {tab === "groceries" && <>
          <section className="panel shopping-controls"><div className="form-grid"><label>Start date<input type="date" value={start} min={today} max={maxShoppingDate} onChange={(event) => setRangeStart(event.target.value)} /></label><label>End date<input type="date" value={end} min={start || today} max={maxShoppingDate} onChange={(event) => setRangeEnd(event.target.value)} /></label></div><div className="button-row"><button className="button" onClick={() => { setRangeStart(today); setRangeEnd(addDays(today, 6)); }}>Next 7 days</button><button className="button" onClick={exportShopping} disabled={!shopping}>Download list</button><button className="button" disabled={!shopping} onClick={() => window.print()}>Print</button></div></section>
          {!validRange && <p className="notice danger" role="alert">Choose an end date on or after the start date, within the next 90 days.</p>}
          {shopping && <div className="shopping-grid"><section className="panel shopping-list"><div className="section-heading"><div><span className="eyebrow">YOUR SHOPPING LIST</span><h2>{shopping.items.length} ingredients, one trip</h2></div><span className="pill">{checkedCount} / {shopping.items.length} checked</span></div>{[...new Set(shopping.items.map((item) => getShoppingCategory(item.name)))].map((category) => <div className="shopping-category" key={category}><h3>{category}</h3>{shopping.items.filter((item) => getShoppingCategory(item.name) === category).map((item) => {
            const checked = data.checked.includes(checkedKey(item.key));
            return <label className={`shopping-row ${checked ? "checked" : ""}`} key={item.key}><input type="checkbox" checked={checked} onChange={() => updatePlanner((previous) => ({ ...previous, checked: checked ? previous.checked.filter((key) => key !== checkedKey(item.key)) : [...previous.checked, checkedKey(item.key)] }))} /><span className="shopping-name">{item.name}<small>{formatShoppingQuantity(item.quantity, item.unit, "en-GB")}</small></span><strong>{money(item.estimatedCost.amountMinorUnits)}</strong></label>;
          })}</div>)}</section><aside className="panel shopping-summary"><span className="eyebrow">THE BIG PICTURE</span><h2>Your basket estimate</h2><span className="basket-total">{money(shopping.estimatedTotal.amountMinorUnits)}</span><p className="muted">{dateLabel(start)} - {dateLabel(end)}<br />{country.name} / {country.currencyCode}</p><div className="form-divider" /><div className="list-row"><span>Ingredients</span><strong>{shopping.items.length}</strong></div><div className="list-row"><span>Checked off</span><strong>{checkedCount}</strong></div><p className="notice small">These are synthetic portion costs, not the price of buying whole packages. No retailer data, offers, or live country prices are used.</p><button className="button full-width" disabled={!checkedCount} onClick={() => updatePlanner((previous) => ({ ...previous, checked: previous.checked.filter((key) => !shopping.items.some((item) => checkedKey(item.key) === key)) }))}>Uncheck this list</button></aside></div>}
        </>}
        {tab === "recipes" && <><div className="panel recipe-search"><label>Find a meal in your plan<input type="search" placeholder="Search meals or ingredients..." value={recipeSearch} onChange={(event) => setRecipeSearch(event.target.value)} /></label><span className="muted small">Breakfast recipes can be replaced for one date or all occurrences. Batch meals stay linked to their prep session.</span></div><div className="meal-grid">{groups.filter(([, group]) => `${group.meal.title} ${group.meal.description}`.toLowerCase().includes(recipeSearch.toLowerCase())).map(([key, group], index) => <div key={key}><MealCard meal={group.meal} money={money} index={index} onClick={() => setSelectedMeal(group.meal)} /><p className="recipe-dates">{group.dates.map((key) => dateLabel(key)).join(" / ")}</p></div>)}</div>{!groups.some(([, group]) => `${group.meal.title} ${group.meal.description}`.toLowerCase().includes(recipeSearch.toLowerCase())) && <p className="notice">No meals match that search.</p>}</>}
        {tab === "preferences" && <><Preferences data={data} dateKeys={plan.days.map((day) => day.key)} /><section className="panel reset-panel"><div><h3>Start fresh</h3><p className="muted small">Reset your locally saved preferences, portions, exclusions, and checklists.</p></div>{resetOpen ? <div className="button-row"><span className="small">Clear all local planner data?</span><button className="button danger-button" onClick={() => { updatePlanner(() => defaultState()); setResetOpen(false); setTab("overview"); }}>Yes, reset</button><button className="button" onClick={() => setResetOpen(false)}>Cancel</button></div> : <button className="button" onClick={() => setResetOpen(true)}>Reset planner</button>}</section></>}
        <footer className="app-footer"><span><Icon name="leaf" size={15} />Good food. Less fuss.</span><span>Sample nutrition & synthetic prices. Not medical advice or verified retailer data.</span></footer>
      </main>
    </div>
    {selectedMeal && <MealDialog key={selectedMeal.occurrenceKey ?? selectedMeal.id} meal={selectedMeal} data={data} days={plan.days} onClose={() => setSelectedMeal(null)} />}
  </div>;
}

function Stat({ icon, label, value, note, warning = false }: { icon: IconName; label: string; value: string; note: string; warning?: boolean }) {
  return <section className={`stat-card ${warning ? "warning" : ""}`}><div className="stat-label"><span>{label}</span><Icon name={icon} size={19} /></div><strong>{value}</strong><span className="small muted">{note}</span></section>;
}

function MealCard({ meal, money, index, onClick }: { meal: Meal; money: (value: number) => string; index: number; onClick: () => void }) {
  return <button className="meal-card" onClick={onClick}><div className={`meal-card-art art-${index % 3}`}><BowlArt variant={index} /><span className="meal-type">{meal.type}{meal.slot ? ` / ${meal.slot}` : ""}</span>{meal.batch && <span className="batch-tag"><Icon name="pot" size={13} />Batch</span>}</div><div className="meal-card-body"><h3>{meal.title}</h3><p>{meal.description}</p><div className="meal-card-meta"><span>{meal.calories} kcal / {meal.durationMinutes} min</span><strong>{money(meal.estimatedCostCents)}</strong></div>{meal.banConflicts?.length ? <span className="conflict-label">Ingredient conflict - review details</span> : null}</div></button>;
}
