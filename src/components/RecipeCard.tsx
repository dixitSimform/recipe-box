import { memo } from 'react'
import type { ReactElement } from 'react'
import { Link } from 'react-router'
import type { Recipe } from '../types/recipe'
import { formatIngredient, getTotalTime } from '../utils/recipeUtils'
import { Button } from './Button'
import { Card } from './Card'

export type RecipeCardProps = {
  recipe: Recipe
  onToggleFavourite: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

const PREVIEW_COUNT = 3

const RecipeCardView = ({
  recipe,
  onToggleFavourite,
  onEdit,
  onDelete,
}: RecipeCardProps): ReactElement => {
  const { id, title, category, servings, ingredients, isFavourite, source } =
    recipe
  const totalTime = getTotalTime(recipe)
  const previewIngredients = ingredients.slice(0, PREVIEW_COUNT)
  const hiddenCount = ingredients.length - previewIngredients.length

  return (
    <Card className="recipe-card">
      <div className="recipe-card-header">
        <h2>
          <Link to={`/recipes/${id}`}>{title}</Link>
        </h2>
        {isFavourite && (
          <span className="favourite-star" role="img" aria-label="Favourite">
            ★
          </span>
        )}
      </div>
      <div className="meal-badges">
        <span className="badge">{category}</span>
        {source === 'mealdb' && <span className="badge">TheMealDB</span>}
      </div>
      <p className="recipe-meta">
        {totalTime > 0 && `${totalTime} min · `}
        {servings} {servings === 1 ? 'serving' : 'servings'} ·{' '}
        {ingredients.length}{' '}
        {ingredients.length === 1 ? 'ingredient' : 'ingredients'}
      </p>
      <ul className="ingredient-preview">
        {previewIngredients.map((ingredient) => (
          <li key={ingredient.id}>{formatIngredient(ingredient)}</li>
        ))}
      </ul>
      {hiddenCount > 0 && <p className="more">+{hiddenCount} more</p>}
      <div className="recipe-card-actions">
        <Button
          variant="secondary"
          pressed={isFavourite}
          onClick={() => onToggleFavourite(id)}
        >
          {isFavourite ? '★ Favourite' : '☆ Favourite'}
        </Button>
        <Button variant="secondary" onClick={() => onEdit(id)}>
          Edit
        </Button>
        <Button variant="danger" onClick={() => onDelete(id)}>
          Delete
        </Button>
      </div>
    </Card>
  )
}

// memo skips re-rendering when none of the props changed (same recipe, same handlers)
export const RecipeCard = memo(RecipeCardView)
