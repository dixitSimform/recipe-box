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
  findById,
  toggleFavourite,
} from './utils/recipeUtils'

function App() {
  const [recipes, setRecipes] = useState<Recipe[]>(sampleRecipes)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<Category | 'all'>('all')
  const [favouritesOnly, setFavouritesOnly] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Derived values: recalculated on every render, so they never go out of sync
  const recipeCount = recipes.length
  const favouriteCount = countFavourites(recipes)
  const editingRecipe =
    editingId === null ? undefined : findById(recipes, editingId)
  const isFormShown = isFormOpen || editingRecipe !== undefined

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

  // Only one form at a time: opening one closes the other
  const handleOpenAddForm = () => {
    setEditingId(null)
    setIsFormOpen(true)
  }

  const handleEdit = (id: string) => {
    setIsFormOpen(false)
    setEditingId(id)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingId(null)
  }

  const handleAddRecipe = (data: NewRecipe) => {
    setRecipes((prev) => [createRecipe(data), ...prev])
    handleCloseForm()
  }

  const handleSaveEdit = (data: NewRecipe) => {
    if (editingId === null) return

    // Build from `data`, not `...recipe`, so a notes field the user cleared is really gone
    setRecipes((prev) =>
      prev.map((recipe) =>
        recipe.id === editingId
          ? {
              ...data,
              id: recipe.id,
              createdAt: recipe.createdAt,
              isFavourite: recipe.isFavourite,
              source: recipe.source,
            }
          : recipe,
      ),
    )
    handleCloseForm()
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
      {isFormShown ? (
        // The key makes React start a fresh form when you switch to another recipe
        <RecipeForm
          key={editingRecipe?.id ?? 'new'}
          initialRecipe={editingRecipe}
          onSubmit={editingRecipe ? handleSaveEdit : handleAddRecipe}
          onCancel={handleCloseForm}
        />
      ) : (
        <Button onClick={handleOpenAddForm}>Add recipe</Button>
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
              onEdit={handleEdit}
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
