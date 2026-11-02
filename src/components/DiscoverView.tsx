import { useState } from 'react'
import type { ReactElement } from 'react'
import { searchMealsUrl } from '../api/mealdb'
import type { MealDbSearchResponse } from '../api/mealdb'
import { useFetch } from '../hooks/useFetch'

export const DiscoverView = (): ReactElement => {
  const [query, setQuery] = useState('')

  const trimmedQuery = query.trim()
  const state = useFetch<MealDbSearchResponse>(
    trimmedQuery === '' ? null : searchMealsUrl(trimmedQuery),
  )

  return (
    <section>
      <div className="filters">
        <div className="field">
          <label htmlFor="meal-search">Search TheMealDB</label>
          <input
            id="meal-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>
      {/* Checking `status` narrows the type, so `data` and `error` only exist in their own branch */}
      {state.status === 'idle' && (
        <p className="empty">Type a meal name to search.</p>
      )}
      {state.status === 'loading' && <p className="empty">Loading…</p>}
      {state.status === 'error' && (
        <p className="form-error">{state.error}</p>
      )}
      {state.status === 'success' && (
        <ul className="meal-list">
          {(state.data.meals ?? []).map((meal) => (
            <li key={meal.idMeal}>{meal.strMeal}</li>
          ))}
        </ul>
      )}
    </section>
  )
}
