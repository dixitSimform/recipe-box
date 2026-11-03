import type { ReactElement } from 'react'
import { useNavigate } from 'react-router'
import { RecipeForm } from '../components/RecipeForm'
import type { NewRecipe, Recipe } from '../types/recipe'

export type NewRecipePageProps = {
  onAdd: (data: NewRecipe) => Recipe
}

export const NewRecipePage = ({ onAdd }: NewRecipePageProps): ReactElement => {
  // useNavigate returns a function that changes the URL from code
  const navigate = useNavigate()

  const handleSubmit = (data: NewRecipe) => {
    const recipe = onAdd(data)
    navigate(`/recipes/${recipe.id}`)
  }

  return (
    <section>
      <RecipeForm onSubmit={handleSubmit} onCancel={() => navigate(-1)} />
    </section>
  )
}
