import type { ReactElement } from 'react'
import type { MealDbMeal } from '../api/mealdb'
import { Button } from './Button'
import { Card } from './Card'

export type MealCardProps = {
  meal: MealDbMeal
  isSaved: boolean
  onImport: (meal: MealDbMeal) => void
}

export const MealCard = ({
  meal,
  isSaved,
  onImport,
}: MealCardProps): ReactElement => (
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
    {isSaved ? (
      <Button variant="secondary" disabled>
        Saved ✓
      </Button>
    ) : (
      <Button onClick={() => onImport(meal)}>Add to my recipes</Button>
    )}
  </Card>
)
