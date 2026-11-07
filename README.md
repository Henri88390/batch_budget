# Batch & Budget

A standalone Next.js / React / TypeScript web app inspired by the Expo app in
`..\diet`. It runs entirely without a backend. The original app is unchanged.
`backend` is an empty placeholder for a future NestJS service.

## Run

```powershell
npm install
npm run dev
```

Open http://localhost:3000. For production, run `npm run build`, then
`npm start`. No environment variables, accounts, database, or API are needed.

## Included

- Responsive overview, 31-day meal planner, grouped menu, batch-prep sessions,
  shopping list, and preferences.
- Batch cooking is the only planning style. Lunches and dinners reuse cooked
  components in deterministic 3-4 day batches. Short calendar-edge batches are
  merged and re-split where possible.
- Weekly budget fitting retains the original compromise ladder (cheaper foods,
  less fruit/meat/dairy, relaxed protein floors, breakfast, then variety).
  Compromises and unattainable budgets are explicitly shown. Calories are never
  reduced to claim a budget fits.
- Two to five meals per day, meat/fish and dairy frequencies, fruit preferences,
  repeating preset or custom breakfasts, ingredient/category exclusions.
- Breakfast recipe replacements for one date or all occurrences, recipe bans,
  and restoration. Batch lunches/dinners are not individually replaceable;
  their ingredients support automatic substitution only. Generated snacks
  cannot be replaced. Ingredient choices for non-batch recipes can skip an
  ingredient or choose a suitable specific substitute.
- Global or per-date calorie portions, modeled protein, country/currency
  estimates, combined ingredient quantities, and exact summed portion costs.
- Shopping ranges within the next 90 days, checklists, text download, and print.
  The calendar covers 31 days; grocery dates beyond it use the engine's
  deterministic calendar-week batches and default 2,000 kcal portions.
- Local browser persistence for preferences, portions, exclusions, shopping
  checkmarks, and completed prep sessions. Plan-affecting changes clear prep
  and shopping checkmarks. Invalid data/storage failures are reported; reset
  requires confirmation. Local dates refresh on focus and each minute.

Country selection changes modeled prices and currency, **not** the numeric
budget target via foreign exchange. Review your target after changing country.
Browser data is device-local, not synced between tabs/devices or accounts.

## Structure

`src/lib/domain` contains the framework-independent engine copied from the
original app, with other planning styles removed. `src/lib/plan.ts` coordinates
batch boundaries, budget fitting, and calendar/prep generation.
`src/lib/storage.ts` validates versioned local data; `src/lib/store.ts` owns
browser persistence. React screens live in `src/components`; Next.js entry
points are in `src/app`. There are no React Native or Expo dependencies.

When adding NestJS later, replace local persistence and synthetic ingredient
rates with explicit API contracts. Do not make the frontend depend on backend
availability until those services exist.

## Validation

```powershell
npm test
npm run typecheck
npm run lint
npm run build
```

Tests cover actual calorie totals, batch lengths/coverage, ingredient
exclusions, budget outcomes, currency and summed costs, substitutions,
breakfasts, grocery ranges, and saved-data validation.

## Important limitations

Prices and nutrition are **illustrative sample assumptions**, not live retailer
prices, researched country data, verified recipes, or medical guidance.
Estimates represent consumed portions, not checkout totals for whole packages.
They exclude promotions, waste, and availability. This is not an allergen-safe
planner. Prep amounts are raw ingredients, not cooking instructions. Follow
appropriate safe cooking, cooling, refrigeration, and freezing guidance for
each food; rice may need shorter refrigerated storage than other batch foods.
