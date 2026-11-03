import { useCallback, useMemo, useState } from 'react'
import type { ReactElement } from 'react'
import { Button } from '../components/Button'
import { List } from '../components/List'
import { RecipeCard } from '../components/RecipeCard'
import { RecipeFilters } from '../components/RecipeFilters'
import { RecipeForm } from '../components/RecipeForm'
import type { Category, NewRecipe, Recipe } from '../types/recipe'
import {
  countFavourites,
  filterByCategory,
  findById,
} from '../utils/recipeUtils'

export type RecipesPageProps = {
  recipes: Recipe[]
  onAdd: (data: NewRecipe) => void
  onUpdate: (id: string, data: NewRecipe) => void
  onRemove: (id: string) => void
  onToggleFavourite: (id: string) => void
  onReset: () => boolean
}

export const RecipesPage = ({
  recipes,
  onAdd,
  onUpdate,
  onRemove,
  onToggleFavourite,
  onReset,
}: RecipesPageProps): ReactElement => {
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

  // Only one form at a time: opening one closes the other
  const handleOpenAddForm = () => {
    setEditingId(null)
    setIsFormOpen(true)
  }

  // The setters never change, so memo(RecipeCard) can keep skipping re-renders
  const handleEdit = useCallback((id: string) => {
    setIsFormOpen(false)
    setEditingId(id)
  }, [])

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingId(null)
  }

  const handleAddRecipe = (data: NewRecipe) => {
    onAdd(data)
    handleCloseForm()
  }

  const handleSaveEdit = (data: NewRecipe) => {
    if (editingId === null) return

    onUpdate(editingId, data)
    handleCloseForm()
  }

  const handleReset = () => {
    // Only close the form when the user confirmed the reset
    if (onReset()) handleCloseForm()
  }

  const handleClearFilters = () => {
    setSearch('')
    setCategory('all')
    setFavouritesOnly(false)
  }

  const hasRecipes = recipeCount > 0
  const hasNoMatches = hasRecipes && visibleRecipes.length === 0

  return (
    <section>
      <p className="summary">
        {recipeCount} {recipeCount === 1 ? 'recipe' : 'recipes'} ·{' '}
        {favouriteCount} {favouriteCount === 1 ? 'favourite' : 'favourites'}
      </p>
      <div className="toolbar">
        {!isFormShown && <Button onClick={handleOpenAddForm}>Add recipe</Button>}
        <Button variant="secondary" onClick={handleReset}>
          Reset sample data
        </Button>
      </div>
      {isFormShown && (
        // The key makes React start a fresh form when you switch to another recipe
        <RecipeForm
          key={editingRecipe?.id ?? 'new'}
          initialRecipe={editingRecipe}
          onSubmit={editingRecipe ? handleSaveEdit : handleAddRecipe}
          onCancel={handleCloseForm}
        />
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
              onToggleFavourite={onToggleFavourite}
              onEdit={handleEdit}
              onDelete={onRemove}
            />
          )}
          getKey={(recipe) => recipe.id}
          emptyMessage="No recipes yet."
        />
      )}
    </section>
  )
}
