import type { ChangeEvent, ReactElement } from 'react'
import { CATEGORIES } from '../constants/categories'
import type { Category } from '../types/recipe'
import { Button } from './Button'

export type RecipeFiltersProps = {
  search: string
  category: Category | 'all'
  favouritesOnly: boolean
  onSearchChange: (value: string) => void
  onCategoryChange: (value: Category | 'all') => void
  onFavouritesOnlyChange: (value: boolean) => void
  onClear: () => void
}

export const RecipeFilters = ({
  search,
  category,
  favouritesOnly,
  onSearchChange,
  onCategoryChange,
  onFavouritesOnlyChange,
  onClear,
}: RecipeFiltersProps): ReactElement => {
  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    // event.target.value is just a string, so check it against the real categories
    const match = CATEGORIES.find((item) => item === event.target.value)
    onCategoryChange(match ?? 'all')
  }

  return (
    <div className="filters">
      <div className="field">
        <label htmlFor="recipe-search">Search recipes</label>
        <input
          id="recipe-search"
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>
      <div className="field">
        <label htmlFor="recipe-category">Category</label>
        <select
          id="recipe-category"
          value={category}
          onChange={handleCategoryChange}
        >
          <option value="all">All categories</option>
          {CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <div className="field field-checkbox">
        <input
          id="recipe-favourites-only"
          type="checkbox"
          checked={favouritesOnly}
          onChange={(event) => onFavouritesOnlyChange(event.target.checked)}
        />
        <label htmlFor="recipe-favourites-only">Favourites only</label>
      </div>
      <Button variant="secondary" onClick={onClear}>
        Clear filters
      </Button>
    </div>
  )
}
