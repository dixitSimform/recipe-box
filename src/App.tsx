import { useEffect } from 'react'
import { Route, Routes } from 'react-router'
import { AppLayout } from './components/AppLayout'
import { useRecipes } from './hooks/useRecipes'
import { DiscoverPage } from './pages/DiscoverPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { RecipeDetailPage } from './pages/RecipeDetailPage'
import { RecipeIngredients } from './pages/RecipeIngredients'
import { RecipesPage } from './pages/RecipesPage'
import { RecipeSteps } from './pages/RecipeSteps'

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
              onAdd={add}
              onUpdate={update}
              onRemove={remove}
              onToggleFavourite={toggleFavourite}
              onReset={reset}
            />
          }
        />
        <Route
          path="recipes/:id"
          element={
            <RecipeDetailPage
              recipes={recipes}
              onToggleFavourite={toggleFavourite}
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
