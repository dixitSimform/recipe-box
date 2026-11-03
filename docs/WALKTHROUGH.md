# Code walkthrough

Three user actions, followed through the code file by file. Paths are relative to `src/`.

## The shape of the app

- `main.tsx` mounts `<App />` inside `<BrowserRouter>`.
- `app/App.tsx` calls `useRecipes()` once. The recipe list and the functions that change it are passed down to the pages as props. This is "lifting state up": every page sees the same list.
- `useRecipes` (`features/recipes/hooks/useRecipes.ts`) keeps the list in `useLocalStorage`, so it survives a refresh.
- `app/AppLayout.tsx` is a layout route: it draws the header and navigation, and its `<Outlet />` shows the page that matches the URL.

---

## 1. Adding a recipe

1. **Click "Add recipe"** in `features/recipes/pages/RecipesPage.tsx`. It is a `Link` to `/recipes/new`, so the URL changes without a page reload.
2. **Route match** in `app/App.tsx`: the path `recipes/new` renders `NewRecipePage` and gives it `onAdd={add}`. React Router ranks the static `new` above `:id`, so `new` is never read as a recipe id.
3. **`features/recipes/pages/NewRecipePage.tsx`** renders `RecipeForm` with an `onSubmit` handler (`handleSubmit`) and an `onCancel` that goes back in history.
4. **`features/recipes/components/RecipeForm.tsx`** holds the form state:
   - `values` (title, category, minutes, servings, steps, notes) is updated by `handleChange`. The input's `name` is the key in `values`, so one handler serves every field. All inputs are controlled.
   - `rows` is the list of ingredient rows. It is edited by `IngredientRows`.
   - `titleInputRef` and a `useEffect` put the cursor in the title field when the form opens.
5. **`features/recipes/components/IngredientRows.tsx`** edits the rows. `updateRow`, `removeRow` and the "Add ingredient" button each build a new array (`map`, `filter`, spread) and call `onChange`, which is `setRows` in the form. `createEmptyRow` (`features/recipes/recipeUtils.ts`) makes a new row with its own id, which is used as the React `key`.
6. **Submit**: `handleSubmit` in `RecipeForm` calls `event.preventDefault()`, then validates:
   - the title is not empty
   - prep, cook and servings are whole numbers (`parseWholeNumber`)
   - every named ingredient has a quantity above 0

   If something is wrong, `setError` shows a message and nothing is saved. Otherwise the strings are converted to numbers, empty `unit` and `notes` are left out, and `onSubmit` is called with a `NewRecipe`.
7. **Back in `NewRecipePage`**, `handleSubmit` calls `onAdd(data)`, which is `add` from `useRecipes`.
8. **`features/recipes/hooks/useRecipes.ts` → `add`** calls `createRecipe` (`features/recipes/recipeUtils.ts`) to add an `id` and `createdAt`, then `setRecipes((prev) => [recipe, ...prev])`. It returns the new recipe.
9. **`shared/hooks/useLocalStorage.ts`**: `setRecipes` is the state setter, so React re-renders. The `useEffect` in the hook sees the changed `value` and writes it to `localStorage` under the key `recipe-box:recipes`.
10. **Navigate**: `NewRecipePage` calls `navigate` with the path `/recipes/<new id>`, which opens the new recipe's detail page.

Data flow: form inputs → `values` / `rows` in `RecipeForm` → `NewRecipe` → `add` in `useRecipes` → `recipes` state and `localStorage` → every page that receives `recipes`.

---

## 2. Searching Discover and importing a meal

1. **Route**: `app/App.tsx` renders `DiscoverPage` for `/discover` and passes `recipes` and `onImport={importMeal}`.
2. **`features/discover/pages/DiscoverPage.tsx`** builds `savedExternalIds`, a `Set` of the `externalId` of every recipe that was already imported. This is derived from `recipes` on each render, not stored. It passes the set to `DiscoverView`.
3. **`features/discover/components/DiscoverView.tsx`** holds `query` in state. The input updates it on every keystroke.
4. **Debounce**: `useDebounce(query, DEBOUNCE_MS)` (`shared/hooks/useDebounce.ts`) returns the value only after 400 ms without a change. Each change clears the previous timer in the effect cleanup.
5. **Fetch**: `useFetch` (`shared/hooks/useFetch.ts`) receives `searchMealsUrl(debouncedQuery)` from `features/discover/api.ts`, or `null` when the text is shorter than 2 letters.
   - Its effect sends the request with an `AbortController`, and the cleanup aborts it if the URL changes or the page closes.
   - The result is a `FetchState`: `idle`, `loading`, `success` with `data`, or `error` with a message (type in `shared/types/fetchState.ts`).
6. **Render by status**: `DiscoverView` checks `state.status`. TypeScript narrows the type in each branch: a hint when idle, "Searching…" while loading, the message and a "Try again" button (`refetch`) on error, and a `List` of `MealCard`s on success. The API sends `meals: null` for no results, so `state.data.meals ?? []` is used and the `List` shows its empty message.
7. **`features/discover/components/MealCard.tsx`** shows the picture, name and badges. If `isSaved` is true, the button says "Saved ✓" and is disabled. Otherwise "Add to my recipes" calls `onImport(meal)`.
8. **`features/recipes/hooks/useRecipes.ts` → `importMeal`** calls `mealToRecipe(meal)` and `createRecipe(...)`, then adds the recipe to the front of the list. It first checks (inside the state updater) that no recipe has the same `externalId`, so a quick double click cannot import a meal twice.
9. **`features/discover/mealToRecipe.ts`** converts the API shape into a `NewRecipe`:
   - `mapCategory` maps the TheMealDB category to one of ours
   - `getIngredients` reads the numbered fields `strIngredient1…20` and `strMeasure1…20`, and `parseMeasure` splits "1/2 cup" into `quantity: 0.5, unit: "cup"`
   - `getSteps` splits the instructions text into lines
10. **After the save**: `recipes` changed, so `DiscoverPage` builds a new `savedExternalIds` and the `MealCard` button changes to "Saved ✓". The new recipe is also saved to `localStorage` by `useLocalStorage`.

Data flow: input → `query` → `debouncedQuery` → URL → `useFetch` state → `MealCard` → `importMeal` → `mealToRecipe` → `recipes` state → `savedExternalIds` → `MealCard` button.

---

## 3. Filtering through the URL and opening a recipe's steps tab

### Filtering

1. **Open** `/recipes?category=dessert&fav=1` (by typing it, by a bookmark, or by using the filters).
2. **`features/recipes/pages/RecipesPage.tsx`** reads the URL with `useSearchParams`:
   - `q` gives `search`
   - `category` goes through the `isCategory` type guard (`features/recipes/recipeUtils.ts`), so an invalid value falls back to `'all'`
   - `fav === '1'` gives `favouritesOnly`
3. **`visibleRecipes`** is calculated with `useMemo` from `recipes` and the three filters, using `filterByCategory`. It is derived data, not state, so it cannot go out of sync.
4. **Changing a filter**: `features/recipes/components/RecipeFilters.tsx` shows controlled inputs and calls `onSearchChange`, `onCategoryChange` or `onFavouritesOnlyChange`. In `RecipesPage` these call `updateParam`, which copies the current `URLSearchParams`, sets or deletes one key and calls `setSearchParams`. A change of the URL re-renders the page with the new filters.
   - Typing uses `replace: true`, so one search does not add one back-button stop per letter.
   - "Clear filters" calls `setSearchParams({})`.
5. **Cards**: each result is a `RecipeCard` (`features/recipes/components/RecipeCard.tsx`) inside `List`. `memo` and `useCallback` (`handleEdit`, and the functions from `useRecipes`) let cards skip re-rendering while the user types.

### Opening the steps tab

6. **Click the title** on a card. It is a `Link` to `/recipes/<id>`.
7. **Route match** in `app/App.tsx`: `recipes/:id` renders `RecipeDetailPage`, with two nested routes: the index route (`RecipeIngredients`) and `steps` (`RecipeSteps`).
8. **`features/recipes/pages/RecipeDetailPage.tsx`** reads `id` with `useParams` and looks the recipe up with `findById`. If there is no such recipe it shows "Recipe not found" (not the 404 page). Otherwise it shows the header, badges and the tab links, and renders `<Outlet context={{ recipe }} />`.
9. **Click "Steps"**: the `NavLink to="steps"` changes the URL to `/recipes/<id>/steps`. The parent page stays on screen and only the `Outlet` content changes. The "Ingredients" link uses `to="."` with `end`, so it is not active on the steps tab.
10. **`features/recipes/pages/RecipeSteps.tsx`** gets the recipe with `useOutletContext<RecipeOutletContext>()` (the type is exported by `RecipeDetailPage`) and renders the steps as an ordered list, or "No steps yet."

Data flow: URL query → `useSearchParams` → filters → `visibleRecipes` → `RecipeCard`; then URL path → `useParams` → `findById` → `recipe` → `Outlet` context → `RecipeSteps`.
