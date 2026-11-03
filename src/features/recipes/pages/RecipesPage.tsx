import { useCallback, useMemo } from 'react'
import type { ReactElement } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { Button } from '../../../shared/components/Button'
import { List } from '../../../shared/components/List'
import { RecipeCard } from '../components/RecipeCard'
import { RecipeFilters } from '../components/RecipeFilters'
import type { Category, Recipe } from '../types'
import {
  countFavourites,
  filterByCategory,
  isCategory,
} from '../recipeUtils'

export type RecipesPageProps = {
  recipes: Recipe[]
  onRemove: (id: string) => void
  onToggleFavourite: (id: string) => void
  onReset: () => boolean
}

export const RecipesPage = ({
  recipes,
  onRemove,
  onToggleFavourite,
  onReset,
}: RecipesPageProps): ReactElement => {
  const navigate = useNavigate()
  // The filters live in the URL (?q=...&category=...&fav=1), so they survive a refresh,
  // can be bookmarked, and work with the back button
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('q') ?? ''
  const categoryParam = searchParams.get('category')
  // The guard narrows the string to a Category; an invalid value falls back to 'all'
  const category: Category | 'all' = isCategory(categoryParam)
    ? categoryParam
    : 'all'
  const favouritesOnly = searchParams.get('fav') === '1'

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

  // Sets one URL parameter and removes it when the value is empty. Typing replaces the
  // history entry, so one search does not create one back-button stop per letter.
  const updateParam = (key: string, value: string, replace = false) => {
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous)
        if (value === '') {
          next.delete(key)
        } else {
          next.set(key, value)
        }
        return next
      },
      { replace },
    )
  }

  const handleSearchChange = (value: string) => updateParam('q', value, true)

  const handleCategoryChange = (value: Category | 'all') =>
    updateParam('category', value === 'all' ? '' : value)

  const handleFavouritesOnlyChange = (value: boolean) =>
    updateParam('fav', value ? '1' : '')

  const handleClearFilters = () => setSearchParams({})

  // navigate only changes when the path changes, so while filtering memo(RecipeCard) keeps skipping re-renders
  const handleEdit = useCallback(
    (id: string) => navigate(`/recipes/${id}/edit`),
    [navigate],
  )

  const hasRecipes = recipeCount > 0
  const hasNoMatches = hasRecipes && visibleRecipes.length === 0

  return (
    <section>
      <p className="summary">
        {recipeCount} {recipeCount === 1 ? 'recipe' : 'recipes'} ·{' '}
        {favouriteCount} {favouriteCount === 1 ? 'favourite' : 'favourites'}
      </p>
      <div className="toolbar">
        <Link className="btn btn-primary" to="/recipes/new">
          Add recipe
        </Link>
        <Button variant="secondary" onClick={onReset}>
          Reset sample data
        </Button>
      </div>
      <RecipeFilters
        search={search}
        category={category}
        favouritesOnly={favouritesOnly}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onFavouritesOnlyChange={handleFavouritesOnlyChange}
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
