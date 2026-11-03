import type { Category, Ingredient, NewRecipe } from '../types/recipe'
import type { MealDbMeal } from './mealdb'

const MAX_INGREDIENTS = 20

// Matches a leading "1 1/2", "1/2" or "200" (decimals allowed) at the start of a measure
const LEADING_NUMBER = /^(?:(\d+)\s+)?(\d+)\/(\d+)|^\d+(?:\.\d+)?/

const mapCategory = (mealCategory: string): Category => {
  switch (mealCategory) {
    case 'Breakfast':
      return 'breakfast'
    case 'Dessert':
      return 'dessert'
    case 'Starter':
    case 'Side':
      return 'snack'
    default:
      return 'dinner'
  }
}

// "1/2 cup" → quantity 0.5, unit "cup". "to taste" has no number → quantity 1, unit "to taste".
const parseMeasure = (measure: string): Pick<Ingredient, 'quantity' | 'unit'> => {
  const trimmed = measure.trim()
  const match = LEADING_NUMBER.exec(trimmed)
  if (!match) return trimmed === '' ? { quantity: 1 } : { quantity: 1, unit: trimmed }

  const [matchedText, whole, numerator, denominator] = match
  const quantity =
    numerator === undefined
      ? parseFloat(matchedText)
      : Number(whole ?? 0) + Number(numerator) / Number(denominator)
  const unit = trimmed.slice(matchedText.length).trim()

  return unit === '' ? { quantity } : { quantity, unit }
}

const getIngredients = (meal: MealDbMeal): Ingredient[] => {
  const ingredients: Ingredient[] = []

  for (let i = 1; i <= MAX_INGREDIENTS; i++) {
    const name = meal[`strIngredient${i}`]?.trim()
    if (!name) continue

    ingredients.push({
      id: crypto.randomUUID(),
      name,
      ...parseMeasure(meal[`strMeasure${i}`] ?? ''),
    })
  }

  return ingredients
}

const getSteps = (instructions: string): string[] =>
  instructions
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line !== '' && !/^step\s*\d+$/i.test(line))

export const mealToRecipe = (meal: MealDbMeal): NewRecipe => ({
  title: meal.strMeal,
  category: mapCategory(meal.strCategory),
  prepMinutes: 0,
  cookMinutes: 0,
  servings: 4,
  ingredients: getIngredients(meal),
  steps: getSteps(meal.strInstructions),
  isFavourite: false,
  notes: 'Imported from TheMealDB',
  source: 'mealdb',
  externalId: meal.idMeal,
})
