import type { ReactElement } from 'react'
import type { MealDbMeal } from '../api'
import { DiscoverView } from '../components/DiscoverView'
import type { Recipe } from '../../recipes/types'

export type DiscoverPageProps = {
  recipes: Recipe[]
  onImport: (meal: MealDbMeal) => void
}

export const DiscoverPage = ({
  recipes,
  onImport,
}: DiscoverPageProps): ReactElement => {
  // Derived: which TheMealDB meals are already in my recipes (flatMap skips recipes without an externalId)
  const savedExternalIds = new Set(
    recipes.flatMap((recipe) =>
      recipe.externalId === undefined ? [] : [recipe.externalId],
    ),
  )

  return <DiscoverView savedExternalIds={savedExternalIds} onImport={onImport} />
}
