import type { ReactElement } from 'react'
import { useOutletContext } from 'react-router'
import { formatIngredient } from '../recipeUtils'
import type { RecipeOutletContext } from './RecipeDetailPage'

export const RecipeIngredients = (): ReactElement => {
  // The generic tells TypeScript the shape of the context the parent route passes down
  const { recipe } = useOutletContext<RecipeOutletContext>()

  if (recipe.ingredients.length === 0) {
    return <p className="empty">No ingredients yet.</p>
  }

  return (
    <ul className="recipe-ingredients">
      {recipe.ingredients.map((ingredient) => (
        <li key={ingredient.id}>{formatIngredient(ingredient)}</li>
      ))}
    </ul>
  )
}
