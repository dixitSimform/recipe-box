import { useState } from 'react'
import { Layout } from './components/Layout'
import { List } from './components/List'
import { RecipeCard } from './components/RecipeCard'
import { sampleRecipes } from './data/sampleRecipes'
import type { Recipe } from './types/recipe'
import { countFavourites, toggleFavourite } from './utils/recipeUtils'

function App() {
  const [recipes, setRecipes] = useState<Recipe[]>(sampleRecipes)

  // Derived values: recalculated on every render, so they never go out of sync
  const recipeCount = recipes.length
  const favouriteCount = countFavourites(recipes)

  const handleToggleFavourite = (id: string) => {
    setRecipes((prev) =>
      prev.map((recipe) => (recipe.id === id ? toggleFavourite(recipe) : recipe)),
    )
  }

  const handleDelete = (id: string) => {
    const recipe = recipes.find((item) => item.id === id)
    if (!recipe || !window.confirm(`Delete "${recipe.title}"?`)) return

    setRecipes((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <Layout>
      <p className="summary">
        {recipeCount} {recipeCount === 1 ? 'recipe' : 'recipes'} ·{' '}
        {favouriteCount} {favouriteCount === 1 ? 'favourite' : 'favourites'}
      </p>
      <List
        items={recipes}
        renderItem={(recipe) => (
          <RecipeCard
            recipe={recipe}
            onToggleFavourite={handleToggleFavourite}
            onDelete={handleDelete}
          />
        )}
        getKey={(recipe) => recipe.id}
        emptyMessage="No recipes yet."
      />
    </Layout>
  )
}

export default App
