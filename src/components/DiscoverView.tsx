import { useState } from 'react'
import type { ReactElement } from 'react'
import { searchMealsUrl } from '../api/mealdb'
import type { MealDbSearchResponse } from '../api/mealdb'
import { useDebounce } from '../hooks/useDebounce'
import { useFetch } from '../hooks/useFetch'
import { Button } from './Button'
import { List } from './List'
import { MealCard } from './MealCard'

const DEBOUNCE_MS = 400
const MIN_QUERY_LENGTH = 2

export const DiscoverView = (): ReactElement => {
  const [query, setQuery] = useState('')

  // The input updates on every keystroke; the request only follows the debounced value
  const debouncedQuery = useDebounce(query, DEBOUNCE_MS).trim()
  const { state, refetch } = useFetch<MealDbSearchResponse>(
    debouncedQuery.length >= MIN_QUERY_LENGTH
      ? searchMealsUrl(debouncedQuery)
      : null,
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
        <p className="empty">Type at least 2 letters to search.</p>
      )}
      {state.status === 'loading' && (
        <p className="empty" aria-live="polite">
          Searching…
        </p>
      )}
      {state.status === 'error' && (
        <div className="empty">
          <p className="form-error">{state.error}</p>
          <Button variant="secondary" onClick={refetch}>
            Try again
          </Button>
        </div>
      )}
      {state.status === 'success' && (
        <List
          items={state.data.meals ?? []}
          renderItem={(meal) => <MealCard meal={meal} />}
          getKey={(meal) => meal.idMeal}
          emptyMessage={`No meals found for "${debouncedQuery}".`}
        />
      )}
    </section>
  )
}
