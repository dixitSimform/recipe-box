import type { ReactElement } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { RecipeForm } from '../components/RecipeForm'
import type { NewRecipe, Recipe } from '../types'
import { findById } from '../recipeUtils'

export type EditRecipePageProps = {
  recipes: Recipe[]
  onUpdate: (id: string, data: NewRecipe) => void
}

export const EditRecipePage = ({
  recipes,
  onUpdate,
}: EditRecipePageProps): ReactElement => {
  const { id } = useParams()
  const navigate = useNavigate()
  const recipe = id === undefined ? undefined : findById(recipes, id)

  if (recipe === undefined) {
    return (
      <section className="empty">
        <h2>Recipe not found</h2>
        <p>There is no recipe with this id.</p>
        <Link to="/recipes">Back to my recipes</Link>
      </section>
    )
  }

  const handleSubmit = (data: NewRecipe) => {
    onUpdate(recipe.id, data)
    navigate(`/recipes/${recipe.id}`)
  }

  return (
    <section>
      {/* The key starts a fresh form if the URL changes to another recipe's edit page */}
      <RecipeForm
        key={recipe.id}
        initialRecipe={recipe}
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
      />
    </section>
  )
}
