import { useEffect } from 'react'
import { Route, Routes } from 'react-router'
import { AppLayout } from './components/AppLayout'
import { useRecipes } from './hooks/useRecipes'
import { DiscoverPage } from './pages/DiscoverPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { RecipesPage } from './pages/RecipesPage'

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
          path="discover"
          element={<DiscoverPage recipes={recipes} onImport={importMeal} />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
