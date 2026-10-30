# Recipe Box — build roadmap

Recipe Box lets you keep your own recipes and discover new ones from [TheMealDB](https://www.themealdb.com/api.php) (a free public API, no key needed). It is built one step at a time with Claude Code to practise every topic from Days 1–21 of the React Foundational tracker.

**How to use this file:** in Claude Code, run `/step` (or `/step 3`) to build a step, then `/review` to walk through it. Rules for Claude Code are in `CLAUDE.md`.

## Status

| Step | Title | Phase | Tracker days | Status |
|---|---|---|---|---|
| 1 | Project setup, Git, starter folders | 1 Foundation | 4, 8 | Done (2026-10-28) |
| 2 | Types, sample data and utilities | 1 Foundation | 1, 2, 4, 5, 6, 7 | Done (2026-10-28) |
| 3 | Static UI components | 1 Foundation | 7, 8, 9, 10 | Done (2026-10-29) |
| 4 | Recipes in state: favourite and delete | 2 Interactivity | 8, 11, 12 | Done (2026-10-29) |
| 5 | Search and filters | 2 Interactivity | 12, 13, 15 | Done (2026-10-30) |
| 6 | Add-recipe form | 2 Interactivity | 13, 14 | Not started |
| 7 | Ingredient rows and editing | 2 Interactivity | 1, 13, 14 | Not started |
| 8 | Custom hooks, refs and callbacks | 2 Interactivity | 7, 15, 16, 17 | Not started |
| 9 | Fetching with `useFetch` | 3 Discover | 3, 6, 7, 15, 17 | Not started |
| 10 | Debounced search and async UI states | 3 Discover | 16, 17, 18 | Not started |
| 11 | Import meals into your recipes | 3 Discover | 1, 2, 5, 12 | Not started |
| 12 | Router setup, layout route, 404 | 4 Routing | 19, 20 | Not started |
| 13 | Recipe detail page and nested routes | 4 Routing | 19 | Not started |
| 14 | Add/edit pages, navigation and URL filters | 4 Routing | 6, 20 | Not started |
| 15 | Feature-folder refactor | 5 Organise | 4, 21 | Not started |
| 16 | README and code walkthrough | 5 Organise | All | Not started |

Steps 17+ (JSON Server CRUD, validation, Context, TanStack Query, tests, deployment) will be added here when Days 22–36 are reached.

---

## Step 1 — Project setup, Git, starter folders ✅

Vite + React + TypeScript project created, template cleaned, `src/components/`, `src/data/`, `src/types/` created, first commit made.

---

## Step 2 — Types, sample data and utilities

**Practises:** Day 1 (objects, arrays, destructuring, spread) · Day 2 (arrow functions, `find`, `filter`, `reduce`, `??`) · Day 4 (named exports) · Day 5 (interfaces, type aliases, optional properties) · Day 6 (unions, narrowing) · Day 7 (generic function, `Omit`)

### Files

**`src/types/recipe.ts`** (named exports)
- `Category`: union type `'breakfast' | 'lunch' | 'dinner' | 'dessert' | 'snack'`
- `Ingredient` interface: `id: string`, `name: string`, `quantity: number`, `unit?: string`
- `Recipe` interface: `id`, `title`, `category: Category`, `prepMinutes`, `cookMinutes`, `servings` (numbers), `ingredients: Ingredient[]`, `steps: string[]`, `isFavourite: boolean`, `notes?: string`, `source: 'mine' | 'mealdb'`, `createdAt: string` (ISO date)
- `NewRecipe`: `Recipe` without `id` and `createdAt`, written with `Omit`

**`src/constants/categories.ts`**
- `export const CATEGORIES: Category[]` with all five categories

**`src/data/sampleRecipes.ts`**
- `export const sampleRecipes: Recipe[]` with 5 realistic recipes
- At least 3 different categories; exactly one favourite; one recipe has `notes`, the others leave it out
- At least one ingredient without a unit (e.g. "2 eggs")
- Fixed ids and fixed `createdAt` strings (not generated at runtime)

**`src/utils/recipeUtils.ts`** (named exports, arrow functions, explicit types)

| Function | Must use |
|---|---|
| `findById<T extends { id: string }>(items: T[], id: string): T \| undefined` | Generic + `find` |
| `getTotalTime({ prepMinutes, cookMinutes }: Recipe): number` | Destructuring in the parameter |
| `filterByCategory(recipes: Recipe[], category: Category \| 'all'): Recipe[]` | `filter`; returns all recipes for `'all'` |
| `countFavourites(recipes: Recipe[]): number` | `reduce` |
| `toggleFavourite(recipe: Recipe): Recipe` | Spread; returns a new object, never mutates |
| `createRecipe(data: NewRecipe): Recipe` | Spread + `crypto.randomUUID()` + `new Date().toISOString()` |
| `formatIngredient(ing: Ingredient): string` | `??` for a missing unit: `"2 eggs"`, `"200 g flour"`, no double spaces |

**`src/App.tsx`** (temporary check, replaced in Step 3)
- Under `<h1>Recipe Box</h1>`, render: total recipe count, favourite count, total time of the first recipe, and dinner recipe titles joined with `", "`
- A simple list of `formatIngredient` output for the first recipe's ingredients

**Cleanup:** remove `.gitkeep` from `src/types` and `src/data`.

### Verify
- `npm run build` and `npm run lint` pass.
- **Type-safety demo:** temporarily change one sample recipe's category to `'brunch'`, run `npx tsc -b`, show the exact error, then revert and confirm the build passes again.

### Commit
`feat: add recipe types, sample data and utility functions`

### Review questions
1. What's the difference between `notes?: string` and `notes: string | undefined`?
2. Why does `toggleFavourite` return a new object instead of mutating, and why will that matter once recipes are in React state?
3. What does `T extends { id: string }` allow in `findById`, and what does it prevent?

---

## Step 3 — Static UI components

**Practises:** Day 7 (generic component) · Day 8 (typing props and `children`) · Day 9 (components, JSX, expressions, styles) · Day 10 (props, composition, `children`, reusable interfaces)

### Files

**`src/components/Layout.tsx`**
- `LayoutProps`: `children: ReactNode`
- Renders a `<header>` with the app name, a `<main>` containing `children`, and a small `<footer>` ("Recipe Box · practice project")

**`src/components/Button.tsx`**
- `ButtonProps`: `children: ReactNode`, `onClick?: () => void`, `variant?: 'primary' | 'secondary' | 'danger'` (default `'primary'`), `type?: 'button' | 'submit'` (default `'button'`), `disabled?: boolean`
- Default values set with destructuring defaults; class name built from the variant (e.g. `btn btn-primary`)

**`src/components/Card.tsx`**
- `CardProps`: `children: ReactNode`, `className?: string`
- A wrapper `<article className="card ...">`

**`src/components/List.tsx`** (generic component)
- `ListProps<T>`: `items: T[]`, `renderItem: (item: T) => ReactNode`, `getKey: (item: T) => string`, `emptyMessage: string`
- Renders `<ul className="list">` with one `<li key={getKey(item)}>` per item, or `<p className="empty">{emptyMessage}</p>` when `items` is empty

**`src/components/RecipeCard.tsx`**
- `RecipeCardProps`: `recipe: Recipe`
- Uses `Card`. Shows: title, category badge, total time (via `getTotalTime`) as "25 min", servings, number of ingredients, and a ★ when `isFavourite`
- Shows the first 3 ingredients using `formatIngredient`, plus "+N more" when there are more

**`src/App.tsx`**
- Remove the Step 2 temporary output
- Render `Layout` → `List` of `sampleRecipes` with `RecipeCard`, `getKey` using the recipe id, empty message "No recipes yet."

**`src/index.css`**
- Minimal, tidy styles: page max-width and padding, header/footer, a responsive card grid (`.list` as CSS grid with `auto-fill, minmax(260px, 1fr)`), `.card`, `.badge`, `.btn` + variants, `.empty`
- Use CSS custom properties for 4–6 colours at the top of the file

### Verify
- `npm run build` and `npm run lint` pass.
- Temporarily pass an empty array to `List` to confirm the empty message logic compiles and is used, then revert.

### Commit
`feat: add layout, reusable UI components and recipe cards`

### Review questions
1. How does `List` know what `T` is when you use it with recipes?
2. Why does `List` take a `getKey` function instead of using the array index as the key?
3. What's the difference between passing content as `children` and passing it as a normal prop?

---

## Step 4 — Recipes in state: favourite and delete

**Practises:** Day 8 (typing event handler props) · Day 11 (`useState`, event handlers, state updates) · Day 12 (derived values, conditional rendering)

### Changes

**`src/App.tsx`**
- `const [recipes, setRecipes] = useState<Recipe[]>(sampleRecipes)`
- `handleToggleFavourite(id: string)`: functional update with `map` + `toggleFavourite`
- `handleDelete(id: string)`: asks `window.confirm("Delete \"<title>\"?")`, then functional update with `filter`
- Derived values (plain constants, **not** state): recipe count and favourite count (via `countFavourites`)
- Show a summary line under the header: "5 recipes · 1 favourite" (correct singular/plural)
- Render `List` from `recipes` instead of `sampleRecipes`

**`src/components/RecipeCard.tsx`**
- New props: `onToggleFavourite: (id: string) => void`, `onDelete: (id: string) => void`
- A favourite button (`aria-pressed`, label "★ Favourite" / "☆ Favourite") and a Delete button (`variant="danger"`), both using `Button`

### Verify
- `npm run build` and `npm run lint` pass.

### Commit
`feat: keep recipes in state with favourite and delete actions`

### Review questions
1. Why use `setRecipes(prev => ...)` instead of `setRecipes(recipes.map(...))`?
2. Why are the counts calculated on every render instead of being stored in their own state?
3. The click happens in `RecipeCard`, but the state lives in `App`. How does the click reach the state?

---

## Step 5 — Search and filters

**Practises:** Day 12 (derived values, conditional rendering) · Day 13 (controlled inputs, input events) · Day 15 (`useMemo`)

### Changes

**`src/components/RecipeFilters.tsx`** (new)
- `RecipeFiltersProps`: `search`, `category: Category | 'all'`, `favouritesOnly: boolean`, and one change handler per field (`onSearchChange(value: string)`, `onCategoryChange(value: Category | 'all')`, `onFavouritesOnlyChange(value: boolean)`), plus `onClear: () => void`
- Controlled text input "Search recipes", a `<select>` with "All categories" + `CATEGORIES`, a "Favourites only" checkbox, and a "Clear filters" button
- Convert the select's string value back to `Category | 'all'` safely (no `any`; narrow against `CATEGORIES`)

**`src/App.tsx`**
- Three state values: `search`, `category`, `favouritesOnly`
- `visibleRecipes` computed with `useMemo`: case-insensitive title match (trimmed search), `filterByCategory`, then favourites filter
- Show "Showing X of Y recipes"
- Conditional rendering: if there are no recipes at all → "No recipes yet."; if recipes exist but none match → "No recipes match your filters." with a "Clear filters" button

### Verify
- `npm run build` and `npm run lint` pass.

### Commit
`feat: add search, category and favourites filters`

### Review questions
1. Why is `visibleRecipes` derived instead of stored in state?
2. What's in the `useMemo` dependency array, and what happens if you forget one of them?
3. What makes an input "controlled"? What would happen if you set `value` but no `onChange`?

---

## Step 6 — Add-recipe form

**Practises:** Day 11 (state, events) · Day 13 (controlled inputs) · Day 14 (form submission, form state, input events)

### Changes

**`src/components/RecipeForm.tsx`** (new)
- `RecipeFormProps`: `onSubmit: (data: NewRecipe) => void`, `onCancel: () => void`
- One form state object `RecipeFormValues` (declared in this file): `title`, `category`, `prepMinutes`, `cookMinutes`, `servings` (number fields kept as **strings** while editing), `steps` (textarea text, one step per line), `notes`
- One shared `handleChange` for inputs, select and textarea, using the `name` attribute and a computed property key
- `handleSubmit`: `preventDefault`; simple checks (title required; minutes are whole numbers ≥ 0; servings ≥ 1). If a check fails, show one error message above the buttons and stop. (Full validation comes on Day 25.)
- On success: convert to `NewRecipe` (numbers parsed, steps split by line, trimmed, empty lines removed, empty notes → leave `notes` out, `ingredients: []`, `isFavourite: false`, `source: 'mine'`) and call `onSubmit`
- Every field has a `<label>`; "Save recipe" (`type="submit"`) and "Cancel" buttons

**`src/App.tsx`**
- `isFormOpen` state; an "Add recipe" button opens the form above the list
- On submit: `createRecipe(data)`, add it to the **start** of the list, close the form

### Verify
- `npm run build` and `npm run lint` pass.

### Commit
`feat: add recipe form with controlled inputs`

### Review questions
1. What would happen without `event.preventDefault()`?
2. Why keep the number fields as strings in form state and convert them only on submit?
3. How does one `handleChange` update the right field for every input?

---

## Step 7 — Ingredient rows and editing

**Practises:** Day 1 (spread on nested data) · Day 13 (keys in dynamic lists) · Day 14 (form state)

### Changes

**`src/components/IngredientRows.tsx`** (new)
- Props: `rows: IngredientRow[]`, `onChange: (rows: IngredientRow[]) => void`, where `IngredientRow` is `{ id: string; name: string; quantity: string; unit: string }`
- One row per ingredient with Name, Quantity and Unit inputs (each labelled) and a "Remove" button; an "Add ingredient" button below
- New rows get `crypto.randomUUID()` ids; rows use that id as `key`
- All updates immutable (`map`, `filter`, spread)

**`src/components/RecipeForm.tsx`**
- Add an ingredient section using `IngredientRows` (start with one empty row)
- On submit: ignore rows with an empty name; a row with a name needs a quantity > 0 (otherwise show the form error); empty unit → leave `unit` out
- New optional prop `initialRecipe?: Recipe`: when present, prefill every field (numbers → strings, steps joined with new lines, ingredients → rows) and show the heading "Edit recipe" instead of "Add recipe"

**`src/components/RecipeCard.tsx`**
- New prop `onEdit: (id: string) => void` and an "Edit" button (`variant="secondary"`)

**`src/App.tsx`**
- `editingId: string | null` state. Edit opens the form with that recipe; saving replaces the recipe via `map`, keeping its `id`, `createdAt`, `isFavourite` and `source`
- Only one form at a time (adding closes editing and the other way round)

### Verify
- `npm run build` and `npm run lint` pass.

### Commit
`feat: add ingredient rows and recipe editing`

### Review questions
1. What goes wrong if ingredient rows use the array index as their `key` and you remove the first row?
2. How do you update one field of one row in an array without mutating anything?
3. How does `RecipeForm` know whether it's adding or editing?

---

## Step 8 — Custom hooks, refs and callbacks

**Practises:** Day 7 (generic hook) · Day 15 (`useState` lazy initialiser, `useEffect`, `useRef`) · Day 16 (`useCallback`, custom hooks, Rules of Hooks) · Day 17 (side effects, dependency arrays)

### Changes

**`src/hooks/useLocalStorage.ts`** (new)
- `useLocalStorage<T>(key: string, initialValue: T): readonly [T, Dispatch<SetStateAction<T>>]`
- Reads once with a **lazy initialiser**; `JSON.parse` wrapped in `try/catch`, falling back to `initialValue`
- Saves with `useEffect` whenever `key` or the value changes (also wrapped in `try/catch`)

**`src/App.tsx`**
- Replace `useState` for recipes with `useLocalStorage<Recipe[]>('recipe-box:recipes', sampleRecipes)`
- A "Reset sample data" button (with `window.confirm`) that restores `sampleRecipes`
- Wrap `handleToggleFavourite`, `handleDelete` and `handleEdit` in `useCallback` (with functional updates so the dependency arrays stay small)
- `useEffect` that sets `document.title` to `Recipe Box (N)` where N is the recipe count

**`src/components/RecipeCard.tsx`**
- Export the component wrapped in `memo`, so the `useCallback` handlers have a visible purpose (rendering optimisation itself is covered properly on Day 34)

**`src/components/RecipeForm.tsx`**
- `useRef<HTMLInputElement>(null)` on the title input, focused in a `useEffect` when the form opens

### Verify
- `npm run build` and `npm run lint` pass.

### Commit
`feat: persist recipes with useLocalStorage and add refs and callbacks`

### Review questions
1. Why does `useLocalStorage` use a lazy initialiser (`useState(() => ...)`) instead of reading `localStorage` directly?
2. Why does `useCallback` only make a difference here because `RecipeCard` uses `memo`?
3. Why can't you call `useLocalStorage` inside an `if` statement?

---

## Step 9 — Fetching with `useFetch`

**Practises:** Day 3 (Promises, async/await, try/catch) · Day 6 (discriminated unions, narrowing) · Day 7 (generic hook) · Day 15 (`useEffect`) · Day 17 (side effects, cleanup)

### Changes

**`src/types/fetchState.ts`** (new)
- `FetchState<T>` = `{ status: 'idle' } | { status: 'loading' } | { status: 'success'; data: T } | { status: 'error'; error: string }`

**`src/api/mealdb.ts`** (new)
- `MEALDB_BASE_URL = 'https://www.themealdb.com/api/json/v1/1'`
- `MealDbMeal` type with `idMeal`, `strMeal`, `strCategory`, `strArea`, `strInstructions`, `strMealThumb` and an index signature for the numbered ingredient/measure fields (`string | null`)
- `MealDbSearchResponse` type: `{ meals: MealDbMeal[] | null }`
- `searchMealsUrl(query: string): string` using `encodeURIComponent`

**`src/hooks/useFetch.ts`** (new)
- `useFetch<T>(url: string | null): FetchState<T>`
- `null` url → `idle`. Otherwise: `loading`, then an `async` function inside the effect with `try/catch`: non-OK response throws an error with the status code; JSON is read as `unknown` and cast to `T` in one clearly commented place
- An `AbortController` per request; the cleanup function aborts it; abort errors are ignored (not shown as errors)
- If the React Hooks lint rules flag calling `setState` synchronously inside the effect, keep the same behaviour using the pattern the rule recommends, and explain the change in the learning summary. Do not disable the rule.

**`src/components/DiscoverView.tsx`** (new, temporary home until routing in Step 12)
- Controlled search input "Search TheMealDB" (no debounce yet, on purpose: the Network tab will show one request per keystroke, which Step 10 fixes)
- Uses `useFetch<MealDbSearchResponse>`; renders by narrowing on `status`: idle text, "Loading…", error message, or a plain list of meal names (`data.meals ?? []`)

**`src/App.tsx`**
- `view: 'mine' | 'discover'` state with two tab buttons ("My recipes", "Discover"); "My recipes" shows everything built so far

### Verify
- `npm run build` and `npm run lint` pass.
- Fetch `https://www.themealdb.com/api/json/v1/1/search.php?s=pasta` once (e.g. with `curl`) and confirm the types match the real response shape. If the network isn't available, say so and skip this check.

### Commit
`feat: add useFetch hook and TheMealDB search`

### Review questions
1. Why is `FetchState` one union type instead of separate `isLoading`, `error` and `data` states?
2. What does the cleanup function prevent when you type quickly?
3. Why can't the effect function itself be `async`?

---

## Step 10 — Debounced search and async UI states

**Practises:** Day 16 (custom hooks) · Day 17 (cleanup) · Day 18 (loading/error behaviour, common `useEffect` mistakes)

### Changes

**`src/hooks/useDebounce.ts`** (new)
- `useDebounce<T>(value: T, delay: number): T` using `setTimeout` in an effect, cleared in the cleanup

**`src/hooks/useFetch.ts`**
- Return `{ state, refetch }` where `refetch` re-runs the current request (e.g. via a reload counter in the dependency array); update the return type

**`src/components/DiscoverView.tsx`**
- Debounce the query by 400 ms; only fetch when the trimmed query has 2+ characters
- States:
  - idle: "Type at least 2 letters to search."
  - loading: "Searching…" (`aria-live="polite"`)
  - error: the message plus a "Try again" button calling `refetch`
  - empty: `No meals found for "<query>".`
  - success: a grid of `MealCard`s

**`src/components/MealCard.tsx`** (new)
- Props: `meal: MealDbMeal`. Uses `Card`: thumbnail `<img>` with `alt` = meal name and `loading="lazy"`, name, category and area badges

### Verify
- `npm run build` and `npm run lint` pass.
- In the learning summary, list the common `useEffect` mistakes this code avoids (missing dependencies, missing cleanup, out-of-order responses) and point to the exact lines.

### Commit
`feat: debounce meal search and handle loading, error and empty states`

### Review questions
1. Walk through what happens, timer by timer, when you type "pasta" quickly.
2. What bug would appear if `useDebounce` didn't clear its timeout?
3. How does `refetch` make the effect run again?

---

## Step 11 — Import meals into your recipes

**Practises:** Day 1 (spread, objects) · Day 2 (array methods, `??`, `?.`) · Day 5 (types for data transformation) · Day 12 (lifting state, derived values)

### Changes

**`src/types/recipe.ts`**
- Add `externalId?: string` to `Recipe` (the TheMealDB id, for imported recipes)

**`src/api/mealToRecipe.ts`** (new)
- `mealToRecipe(meal: MealDbMeal): NewRecipe`
- Ingredients: loop 1–20, keep entries with a non-empty `strIngredientN`; `quantity` = leading number of the measure (`parseFloat`, fractions like "1/2" → 0.5), or `1` if there isn't one; `unit` = the rest of the measure, trimmed, left out if empty
- Category mapping: `Breakfast` → `breakfast`, `Dessert` → `dessert`, `Starter`/`Side` → `snack`, anything else → `dinner`
- Steps: split instructions on line breaks, trim, drop empty lines (and lines that are only "STEP N")
- `prepMinutes: 0`, `cookMinutes: 0`, `servings: 4`, `notes: "Imported from TheMealDB"`, `source: 'mealdb'`, `externalId: meal.idMeal`, `isFavourite: false`

**`src/components/MealCard.tsx`**
- New props: `isSaved: boolean`, `onImport: (meal: MealDbMeal) => void`. Button "Add to my recipes", or a disabled "Saved ✓" when `isSaved`

**`src/components/DiscoverView.tsx`** and **`src/App.tsx`**
- `App` passes its recipes (or a set of saved external ids) and an `onImport` handler down to `DiscoverView`
- `isSaved` is derived (a recipe with that `externalId` exists), not stored
- Importing adds the recipe with `createRecipe(mealToRecipe(meal))` at the start of the list

**`src/components/RecipeCard.tsx`**
- Show a small "TheMealDB" badge for `source === 'mealdb'`; hide the time line when total time is 0

### Verify
- `npm run build` and `npm run lint` pass.
- Show in the summary the converted output of one real meal (from a `curl` response, if the network is available) to prove the transformation works.

### Commit
`feat: import meals from TheMealDB into my recipes`

### Review questions
1. Why is `isSaved` derived instead of stored as state on each meal?
2. Why does the transformation live in its own function instead of inside the component?
3. What happens to a measure like "to taste"?

---

## Step 12 — Router setup, layout route, 404

**Practises:** Day 19 (client-side routing, nested routes) · Day 20 (navigation links, not-found handling)

### Install
- The current version of React Router: `npm install react-router`. Check the installed major version and follow that version's docs. Use **declarative mode** (`BrowserRouter`, `Routes`, `Route`, `Link`, `NavLink`, `Outlet`). Don't use framework or data-loader modes.

### Changes

**`src/hooks/useRecipes.ts`** (new)
- Move the recipe state (`useLocalStorage`) and all recipe handlers out of `App` into one custom hook that returns the recipes and actions (`add`, `update`, `remove`, `toggleFavourite`, `importMeal`, `reset`)

**`src/components/AppLayout.tsx`** (new, replaces `Layout`)
- Header with the app name linking to `/` and a `NavLink` nav (Home, My recipes, Discover) with an active style; `<Outlet />` in `<main>`; footer
- Remove `Layout.tsx` and the `view` tab state

**Pages in `src/pages/`** (new)
- `HomePage`: welcome text, the summary counts, the 3 most recently created recipes, and links to "My recipes" and "Discover"
- `RecipesPage`: everything the "My recipes" view did (filters, add/edit form, list)
- `DiscoverPage`: renders `DiscoverView`
- `NotFoundPage`: "Page not found" with a link home

**`src/main.tsx`** wraps `App` in `BrowserRouter`; **`src/App.tsx`** defines the routes: `/` (index), `/recipes`, `/discover`, `*` — all inside the `AppLayout` layout route. Pages get recipes and actions through props from `App` (shared state with Context comes on Day 28).

### Verify
- `npm run build` and `npm run lint` pass.
- List manual checks: each nav link, the active style, an unknown URL like `/oops`, and a browser refresh on `/discover` (Vite's dev server handles this).

### Commit
`feat: add routing with a layout route, pages and 404`

### Review questions
1. What does `<Outlet />` do in the layout route?
2. Why use `NavLink`/`Link` instead of `<a href>`?
3. Why was it useful to move the recipe logic into `useRecipes` before adding pages?

---

## Step 13 — Recipe detail page and nested routes

**Practises:** Day 19 (route parameters, nested routes)

### Changes

**Routes**
- `/recipes/:id` → `RecipeDetailPage` (layout for its nested routes)
  - index route → `RecipeIngredients`
  - `steps` → `RecipeSteps`

**`src/pages/RecipeDetailPage.tsx`** (new)
- Reads `id` with `useParams`, finds the recipe with `findById`
- Not found → "Recipe not found" with a link back to `/recipes` (not the 404 page)
- Shows title, badges, times, servings, notes, a favourite button, and tabs as `NavLink`s ("Ingredients" → `.` with `end`, "Steps" → `steps`)
- Passes the recipe to the nested routes with `<Outlet context={...} />`

**`src/pages/RecipeIngredients.tsx`** and **`src/pages/RecipeSteps.tsx`** (new)
- Read the recipe with a typed `useOutletContext`; render the ingredient list (`formatIngredient`) or a numbered `<ol>` of steps, with an empty message when there are none

**`src/components/RecipeCard.tsx`**
- The title becomes a `Link` to `/recipes/:id`

### Verify
- `npm run build` and `npm run lint` pass.

### Commit
`feat: add recipe detail page with nested ingredients and steps routes`

### Review questions
1. Where does the value from `useParams` come from, and why is it a string?
2. How do the nested routes get the recipe without fetching or finding it again?
3. Why show "Recipe not found" on the detail page instead of the 404 page?

---

## Step 14 — Add/edit pages, navigation and URL filters

**Practises:** Day 6 (type guards / narrowing) · Day 20 (programmatic navigation, query parameters, not-found handling)

### Changes

**Routes**
- `/recipes/new` → `NewRecipePage`, `/recipes/:id/edit` → `EditRecipePage` (declared so `new` isn't treated as an `:id`)

**`src/pages/NewRecipePage.tsx`** and **`src/pages/EditRecipePage.tsx`** (new)
- Reuse `RecipeForm`. After saving, `useNavigate` to the recipe's detail page; Cancel goes back (`navigate(-1)`)
- Edit page: "Recipe not found" when the id doesn't exist

**`src/pages/RecipesPage.tsx`**
- Remove the inline form, `isFormOpen` and `editingId`. "Add recipe" becomes a link to `/recipes/new`; Edit on a card navigates to `/recipes/:id/edit`
- Move the filters into the URL with `useSearchParams`: `q`, `category`, `fav=1`. Empty values are removed from the URL; "Clear filters" clears them
- `isCategory(value: string | null): value is Category` type guard in `recipeUtils.ts`; invalid values fall back to `'all'`

**`src/pages/RecipeDetailPage.tsx`**
- Add Edit (link) and Delete buttons. After deleting, navigate to `/recipes` with `replace: true`

### Verify
- `npm run build` and `npm run lint` pass.
- Manual checks to list: filters survive a refresh and the back button; a URL like `/recipes?category=pizza` falls back to all; deleting from the detail page and pressing Back doesn't return to the deleted recipe.

### Commit
`feat: add recipe pages, navigation after save and URL filters`

### Review questions
1. Why keep filters in the URL instead of in `useState`?
2. What does `replace: true` change after a delete?
3. How does the `isCategory` type guard change what TypeScript knows about a value?

---

## Step 15 — Feature-folder refactor

**Practises:** Day 4 (modules, import/export) · Day 21 (feature-oriented organisation, shared components, utilities, constants, separating UI and logic)

### Target structure
```
src/
  app/          App.tsx (routes), AppLayout.tsx
  features/
    recipes/    components/, pages/, hooks/ (useRecipes), recipeUtils.ts, types.ts
    discover/   components/, pages/, api.ts (mealdb), mealToRecipe.ts
  shared/       components/ (Button, Card, List), hooks/ (useLocalStorage, useDebounce, useFetch), types/ (fetchState)
  constants/    categories.ts
  data/         sampleRecipes.ts
  main.tsx, index.css
```

### Changes
- Move files with `git mv` so Git keeps their history
- Update every import; `main.tsx` imports `App` from `app/App`
- No behaviour changes, no renamed components, no new features
- Delete folders left empty

### Verify
- `npm run build` and `npm run lint` pass.
- Search `src` for any import path pointing to an old location; there must be none.
- In the summary, show the final `src` tree and explain the rule used for "feature vs shared".

### Commit
`refactor: organise code into feature folders`

### Review questions
1. How did you decide whether a file belongs in a feature folder or in `shared`?
2. Which file is the clearest example of separating UI from logic, and why?
3. What would make a component move from `features/recipes` to `shared` later?

---

## Step 16 — README and code walkthrough

**Practises:** All of Days 1–21 (explaining your own implementation)

### Files
**`README.md`** (replace the Vite template README)
- What Recipe Box is; feature list; tech stack; getting started (`npm install`, `npm run dev`); scripts; folder structure
- A **coverage table**: tracker day → topic → where it's used in the code (file and function/component)
- Key decisions in 1–2 sentences each: localStorage for now, debounced search, discriminated-union fetch state, filters in the URL, feature folders

**`docs/WALKTHROUGH.md`**
- Trace three user actions through the code, file by file: (1) adding a recipe, (2) searching Discover and importing a meal, (3) filtering via the URL and opening a recipe's steps tab

### Verify
- `npm run build` and `npm run lint` pass.
- Every file path and function name in both documents exists (check them).

### Commit
`docs: add README and code walkthrough`

### Review questions
For this step, `/review` asks **8 questions** across the whole project instead of the usual 3–5: at least one each on JavaScript, TypeScript, components and props, state, hooks and effects, and routing, including two "spot the bug" questions taken from real files.
