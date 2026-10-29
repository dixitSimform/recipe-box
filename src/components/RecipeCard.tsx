import type { ReactElement } from 'react'
import type { Recipe } from '../types/recipe'
import { formatIngredient, getTotalTime } from '../utils/recipeUtils'
import { Card } from './Card'

export type RecipeCardProps = {
  recipe: Recipe
}

const PREVIEW_COUNT = 3

export const RecipeCard = ({ recipe }: RecipeCardProps): ReactElement => {
  const { title, category, servings, ingredients, isFavourite } = recipe
  const previewIngredients = ingredients.slice(0, PREVIEW_COUNT)
  const hiddenCount = ingredients.length - previewIngredients.length

  return (
    <Card className="recipe-card">
      <div className="recipe-card-header">
        <h2>{title}</h2>
        {isFavourite && (
          <span className="favourite-star" role="img" aria-label="Favourite">
            ★
          </span>
        )}
      </div>
      <span className="badge">{category}</span>
      <p className="recipe-meta">
        {getTotalTime(recipe)} min · {servings}{' '}
        {servings === 1 ? 'serving' : 'servings'} · {ingredients.length}{' '}
        {ingredients.length === 1 ? 'ingredient' : 'ingredients'}
      </p>
      <ul className="ingredient-preview">
        {previewIngredients.map((ingredient) => (
          <li key={ingredient.id}>{formatIngredient(ingredient)}</li>
        ))}
      </ul>
      {hiddenCount > 0 && <p className="more">+{hiddenCount} more</p>}
    </Card>
  )
}
