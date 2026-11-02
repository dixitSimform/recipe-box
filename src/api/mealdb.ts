export const MEALDB_BASE_URL = 'https://www.themealdb.com/api/json/v1/1'

export type MealDbMeal = {
  idMeal: string
  strMeal: string
  strCategory: string
  strArea: string
  strInstructions: string
  strMealThumb: string
  // strIngredient1…20 and strMeasure1…20 are numbered fields, so they use an index signature
  [key: string]: string | null
}

export type MealDbSearchResponse = {
  // The API sends `null` (not an empty array) when nothing matches
  meals: MealDbMeal[] | null
}

export const searchMealsUrl = (query: string): string =>
  `${MEALDB_BASE_URL}/search.php?s=${encodeURIComponent(query)}`
