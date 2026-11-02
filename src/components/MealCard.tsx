import type { ReactElement } from 'react'
import type { MealDbMeal } from '../api/mealdb'
import { Card } from './Card'

export type MealCardProps = {
  meal: MealDbMeal
}

export const MealCard = ({ meal }: MealCardProps): ReactElement => (
  <Card className="meal-card">
    <img
      className="meal-thumb"
      src={meal.strMealThumb}
      alt={meal.strMeal}
      loading="lazy"
    />
    <h2>{meal.strMeal}</h2>
    <div className="meal-badges">
      <span className="badge">{meal.strCategory}</span>
      <span className="badge">{meal.strArea}</span>
    </div>
  </Card>
)
