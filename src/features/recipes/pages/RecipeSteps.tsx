import type { ReactElement } from 'react'
import { useOutletContext } from 'react-router'
import type { RecipeOutletContext } from './RecipeDetailPage'

export const RecipeSteps = (): ReactElement => {
  const { recipe } = useOutletContext<RecipeOutletContext>()

  if (recipe.steps.length === 0) {
    return <p className="empty">No steps yet.</p>
  }

  return (
    <ol className="recipe-steps">
      {recipe.steps.map((step, index) => (
        // Steps are plain strings without ids; the list never reorders here, so index + text is a stable key
        <li key={`${index}-${step}`}>{step}</li>
      ))}
    </ol>
  )
}
