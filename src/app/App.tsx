import { useEffect } from 'react'
import { Route, Routes } from 'react-router'
import { AppLayout } from './AppLayout'
import { useRecipes } from '../features/recipes/hooks/useRecipes'
import { DiscoverPage } from '../features/discover/pages/DiscoverPage'
import { EditRecipePage } from '../features/recipes/pages/EditRecipePage'
import { HomePage } from '../features/recipes/pages/HomePage'
import { NewRecipePage } from '../features/recipes/pages/NewRecipePage'
import { NotFoundPage } from './NotFoundPage'
import { RecipeDetailPage } from '../features/recipes/pages/RecipeDetailPage'
import { RecipeIngredients } from '../features/recipes/pages/RecipeIngredients'
import { RecipesPage } from '../features/recipes/pages/RecipesPage'
import { RecipeSteps } from '../features/recipes/pages/RecipeSteps'

function App() {
  const { recipes, add, update, remove, toggleFavourite, importMeal, reset } =
    useRecipes()
  const recipeCount = recipes.length

  // Shown in the browser tab; the effect re-runs only when the count changes
  useEffect(() => {
    document.title = `Recipe Box (${recipeCount})`
  }, [recipeCount])

  return (
    <Routes>
      {/* Layout route: AppLayout has no path, so it wraps every route inside it */}
      <Route element={<AppLayout />}>
        <Route index element={<HomePage recipes={recipes} />} />
        <Route
          path="recipes"
          element={
            <RecipesPage
              recipes={recipes}
              onRemove={remove}
              onToggleFavourite={toggleFavourite}
              onReset={reset}
            />
          }
        />
        {/* React Router ranks static segments above ":id", so "new" is never read as an id */}
        <Route path="recipes/new" element={<NewRecipePage onAdd={add} />} />
        <Route
          path="recipes/:id/edit"
          element={<EditRecipePage recipes={recipes} onUpdate={update} />}
        />
        <Route
          path="recipes/:id"
          element={
            <RecipeDetailPage
              recipes={recipes}
              onToggleFavourite={toggleFavourite}
              onRemove={remove}
            />
          }
        >
          {/* Nested routes render inside RecipeDetailPage's <Outlet /> */}
          <Route index element={<RecipeIngredients />} />
          <Route path="steps" element={<RecipeSteps />} />
        </Route>
        <Route
          path="discover"
          element={<DiscoverPage recipes={recipes} onImport={importMeal} />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
