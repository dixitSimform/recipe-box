import { useMemo, useState } from 'react'
import { Button } from './components/Button'
import { Layout } from './components/Layout'
import { List } from './components/List'
import { RecipeCard } from './components/RecipeCard'
import { RecipeFilters } from './components/RecipeFilters'
import { RecipeForm } from './components/RecipeForm'
import { sampleRecipes } from './data/sampleRecipes'
import type { Category, NewRecipe, Recipe } from './types/recipe'
import {
  countFavourites,
  createRecipe,
  filterByCategory,
  toggleFavourite,
} from './utils/recipeUtils'

function App() {
  const [recipes, setRecipes] = useState<Recipe[]>(sampleRecipes)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<Category | 'all'>('all')
  const [favouritesOnly, setFavouritesOnly] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)

  // Derived values: recalculated on every render, so they never go out of sync
  const recipeCount = recipes.length
  const favouriteCount = countFavourites(recipes)

  // Derived, not state: only recomputed when recipes or a filter changes
  const visibleRecipes = useMemo(() => {
    const query = search.trim().toLowerCase()
    const matchingTitle = recipes.filter((recipe) =>
      recipe.title.toLowerCase().includes(query),
    )
    const inCategory = filterByCategory(matchingTitle, category)
    return favouritesOnly
      ? inCategory.filter((recipe) => recipe.isFavourite)
      : inCategory
  }, [recipes, search, category, favouritesOnly])

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

  const handleAddRecipe = (data: NewRecipe) => {
    setRecipes((prev) => [createRecipe(data), ...prev])
    setIsFormOpen(false)
  }

  const handleClearFilters = () => {
    setSearch('')
    setCategory('all')
    setFavouritesOnly(false)
  }

  const hasRecipes = recipeCount > 0
  const hasNoMatches = hasRecipes && visibleRecipes.length === 0

  return (
    <Layout>
      <p className="summary">
        {recipeCount} {recipeCount === 1 ? 'recipe' : 'recipes'} ·{' '}
        {favouriteCount} {favouriteCount === 1 ? 'favourite' : 'favourites'}
      </p>
      {isFormOpen ? (
        <RecipeForm
          onSubmit={handleAddRecipe}
          onCancel={() => setIsFormOpen(false)}
        />
      ) : (
        <Button onClick={() => setIsFormOpen(true)}>Add recipe</Button>
      )}
      <RecipeFilters
        search={search}
        category={category}
        favouritesOnly={favouritesOnly}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
        onFavouritesOnlyChange={setFavouritesOnly}
        onClear={handleClearFilters}
      />
      <p className="summary">
        Showing {visibleRecipes.length} of {recipeCount}{' '}
        {recipeCount === 1 ? 'recipe' : 'recipes'}
      </p>
      {hasNoMatches ? (
        <div className="empty">
          <p>No recipes match your filters.</p>
          <Button variant="secondary" onClick={handleClearFilters}>
            Clear filters
          </Button>
        </div>
      ) : (
        <List
          items={visibleRecipes}
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
      )}
    </Layout>
  )
}

export default App
