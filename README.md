# Recipe Box

Recipe Box lets you keep your own recipes and discover new ones from [TheMealDB](https://www.themealdb.com/api.php), a free public recipe API that needs no key. It is a learning project, built one step at a time to practise every topic from Days 1–21 of the React Foundational tracker. A guided tour of the code is in [docs/WALKTHROUGH.md](docs/WALKTHROUGH.md).

## Features

- Browse your recipes as cards, with a favourite star, edit and delete
- Add and edit recipes with a form: dynamic ingredient rows, steps, notes and validation
- Search by title, filter by category and show favourites only; the filters live in the URL
- Open a recipe on its own page, with Ingredients and Steps tabs
- Discover meals from TheMealDB with a debounced search, loading and error states, and a retry button
- Import a meal into your recipes (a meal that is already saved cannot be imported twice)
- Recipes are saved in the browser (`localStorage`); "Reset sample data" restores the starter recipes
- Home page with recipe and favourite counts and the latest recipes; a 404 page for unknown addresses

## Tech stack

- [React](https://react.dev) 19 and [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vite.dev) 8 with [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react)
- [React Router](https://reactrouter.com) 7 for routing
- Plain CSS in `src/index.css` (no CSS framework) with the [Geist](https://vercel.com/font) font via `@fontsource-variable/geist`
- [Oxlint](https://oxc.rs/docs/guide/usage/linter) for linting

## Getting started

Requires Node.js 20.19+ or 22.12+ (needed by Vite 8).

```bash
npm install
npm run dev
```

Then open the local URL that Vite prints (usually http://localhost:5173).

## Scripts

| Command           | Description                                 |
| ----------------- | ------------------------------------------- |
| `npm run dev`     | Start the dev server with hot module reload |
| `npm run build`   | Type-check with `tsc` and build to `dist/`  |
| `npm run lint`    | Lint the project with Oxlint                |
| `npm run preview` | Serve the production build locally          |

## Folder structure

```
src/
  app/                    App.tsx (routes), AppLayout.tsx, NotFoundPage.tsx
  features/
    recipes/              Everything about the user's own recipes
      components/         RecipeCard, RecipeFilters, RecipeForm, IngredientRows
      pages/              HomePage, RecipesPage, RecipeDetailPage (+ RecipeIngredients,
                          RecipeSteps), NewRecipePage, EditRecipePage
      hooks/              useRecipes
      recipeUtils.ts      Pure helper functions
      types.ts            Recipe, Ingredient, Category, NewRecipe
    discover/             Browsing and importing TheMealDB meals
      components/         DiscoverView, MealCard
      pages/              DiscoverPage
      api.ts              API URL and response types
      mealToRecipe.ts     Converts a TheMealDB meal into a NewRecipe
  shared/                 Used by more than one feature
    components/           Button, Card, List
    hooks/                useLocalStorage, useDebounce, useFetch
    types/                fetchState.ts
  constants/              categories.ts
  data/                   sampleRecipes.ts
  main.tsx                Mounts the app inside BrowserRouter
  index.css               All styles
```

**Feature or shared?** Code that only makes sense for one feature lives in that feature's folder. Code that knows nothing about recipes or meals (a button, a generic list, a fetch hook) lives in `shared`.

## Routes

| Path | Page |
|---|---|
| `/` | `HomePage` |
| `/recipes` | `RecipesPage` (filters in the URL: `?q=...&category=...&fav=1`) |
| `/recipes/new` | `NewRecipePage` |
| `/recipes/:id` | `RecipeDetailPage`, with `RecipeIngredients` (index) |
| `/recipes/:id/steps` | `RecipeDetailPage`, with `RecipeSteps` |
| `/recipes/:id/edit` | `EditRecipePage` |
| `/discover` | `DiscoverPage` |
| anything else | `NotFoundPage` |

## Coverage: tracker day → topic → where it is used

| Day | Topic | Where it is used |
|---|---|---|
| 1 | Objects, arrays, destructuring, spread | `sampleRecipes` in `data/sampleRecipes.ts`; destructuring in `RecipeCard`; spread in `toggleFavourite` (`recipeUtils.ts`) and `update` (`useRecipes.ts`); nested spread in `updateRow` (`IngredientRows.tsx`) |
| 2 | Arrow functions, `find`, `filter`, `reduce`, `??`, `?.` | `findById`, `filterByCategory`, `countFavourites`, `formatIngredient` in `recipeUtils.ts`; `?.` and `??` in `getIngredients` and `parseMeasure` in `mealToRecipe.ts` |
| 3 | Promises, `async`/`await`, `try`/`catch` | `load` inside the effect in `useFetch.ts` |
| 4 | Modules, named exports | Every file has named exports; `App` in `app/App.tsx` is the one default export, imported by `main.tsx` |
| 5 | Interfaces, type aliases, optional properties | `Recipe`, `Ingredient` (optional `unit`) in `features/recipes/types.ts`; `MealDbMeal` in `features/discover/api.ts`; the `*Props` types next to each component |
| 6 | Unions, narrowing, type guards | `Category` union; `isCategory` type guard in `recipeUtils.ts`; `FetchState` in `shared/types/fetchState.ts`, narrowed by `state.status` in `DiscoverView` |
| 7 | Generics, `Omit` | `findById<T>`; `List<T>` component; `useLocalStorage<T>`, `useDebounce<T>`, `useFetch<T>`; `NewRecipe = Omit<Recipe, ...>` |
| 8 | Typing props, `children` and event-handler props | `ButtonProps`, `CardProps` (`children: ReactNode`); `RecipeCardProps` (`onToggleFavourite`, `onEdit`, `onDelete`); `ChangeEvent` in `RecipeFilters` and `IngredientRows` |
| 9 | Components, JSX, expressions, styles | `AppLayout`, `MealCard`, `RecipeCard`; class names styled in `src/index.css` |
| 10 | Props, composition, `children` | `Card` wraps `RecipeCard`, `MealCard` and the home page cards; `List` takes `renderItem` |
| 11 | `useState`, events, state updates | `query` in `DiscoverView`; `values`, `rows` and `error` in `RecipeForm`; `useRecipes` updates state with functional updates |
| 12 | Derived values, conditional rendering, lifting state | `visibleRecipes` and counts in `RecipesPage`; `savedExternalIds` in `DiscoverPage`; recipe state lifted into `App` through `useRecipes` |
| 13 | Controlled inputs, keys | `RecipeFilters` and `RecipeForm` inputs; `key` in `List` and `IngredientRows` |
| 14 | Forms | `handleSubmit` and `handleChange` in `RecipeForm`; validation messages in the `error` state |
| 15 | `useMemo`, lazy `useState`, `useEffect`, `useRef`, `memo` | `useMemo` in `RecipesPage`; lazy initialisers in `useLocalStorage` and `RecipeForm`; `useEffect` in `App` (document title); `titleInputRef` in `RecipeForm`; `memo` in `RecipeCard` |
| 16 | `useCallback`, custom hooks, Rules of Hooks | `useRecipes`, `useLocalStorage`, `useDebounce`, `useFetch`; `useCallback` in `useRecipes` and `handleEdit` in `RecipesPage` |
| 17 | Side effects, dependency arrays, cleanup | `useDebounce` (clears its timer); `useFetch` (aborts the request); `useLocalStorage` (saves when `value` changes) |
| 18 | Loading and error states, `useEffect` mistakes | `idle`/`loading`/`error`/`success` branches in `DiscoverView`; `AbortError` handling and derived loading state in `useFetch` |
| 19 | Routing, route params, nested routes | `Routes` in `App.tsx`; `AppLayout` and `RecipeDetailPage` with `Outlet`; `useParams` in `RecipeDetailPage` and `EditRecipePage`; `useOutletContext` in `RecipeIngredients` and `RecipeSteps` |
| 20 | Navigation, query parameters, not-found | `Link` and `NavLink` in `AppLayout`; `useNavigate` in `NewRecipePage`; `useSearchParams` in `RecipesPage`; `NotFoundPage` |
| 21 | Feature-oriented organisation | The `features/` and `shared/` folders (see above) |

## Key decisions

- **`localStorage` for now.** Recipes are saved in the browser through `useLocalStorage`, which keeps the app simple. A real server comes in a later step.
- **Debounced search.** Discover waits 400 ms after the last keystroke (`useDebounce`) before it sends a request, so typing "chicken" makes one request instead of one per letter.
- **Discriminated-union fetch state.** `FetchState<T>` is a union keyed by `status`, so `data` only exists on success and `error` only on failure. TypeScript forces every branch to be handled correctly.
- **Filters in the URL.** The recipe filters are query parameters, so a filtered list survives a refresh, can be bookmarked and works with the back button.
- **Feature folders.** Code is grouped by what it is for (`recipes`, `discover`), not by what it is (components, hooks), so one feature's files sit together. Only truly generic code goes in `shared`.
