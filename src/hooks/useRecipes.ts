import { useCallback } from 'react'
import { mealToRecipe } from '../api/mealToRecipe'
import type { MealDbMeal } from '../api/mealdb'
import { sampleRecipes } from '../data/sampleRecipes'
import type { NewRecipe, Recipe } from '../types/recipe'
import { createRecipe, toggleFavourite } from '../utils/recipeUtils'
import { useLocalStorage } from './useLocalStorage'

export type UseRecipesResult = {
  recipes: Recipe[]
  add: (data: NewRecipe) => void
  update: (id: string, data: NewRecipe) => void
  remove: (id: string) => void
  toggleFavourite: (id: string) => void
  importMeal: (meal: MealDbMeal) => void
  // Returns true when the user confirmed and the sample data was restored
  reset: () => boolean
}

export const useRecipes = (): UseRecipesResult => {
  const [recipes, setRecipes] = useLocalStorage<Recipe[]>(
    'recipe-box:recipes',
    sampleRecipes,
  )

  // useCallback keeps the same function between renders, so memo(RecipeCard) can skip re-rendering.
  // setRecipes never changes, and functional updates avoid reading `recipes`.
  const add = useCallback(
    (data: NewRecipe) => {
      setRecipes((prev) => [createRecipe(data), ...prev])
    },
    [setRecipes],
  )

  const update = useCallback(
    (id: string, data: NewRecipe) => {
      // Build from `data`, not `...recipe`, so a notes field the user cleared is really gone
      setRecipes((prev) =>
        prev.map((recipe) =>
          recipe.id === id
            ? {
                ...data,
                id: recipe.id,
                createdAt: recipe.createdAt,
                isFavourite: recipe.isFavourite,
                source: recipe.source,
              }
            : recipe,
        ),
      )
    },
    [setRecipes],
  )

  // Needs `recipes` for the title in the confirm message, so it changes when recipes change
  const remove = useCallback(
    (id: string) => {
      const recipe = recipes.find((item) => item.id === id)
      if (!recipe || !window.confirm(`Delete "${recipe.title}"?`)) return

      setRecipes((prev) => prev.filter((item) => item.id !== id))
    },
    [recipes, setRecipes],
  )

  const handleToggleFavourite = useCallback(
    (id: string) => {
      setRecipes((prev) =>
        prev.map((recipe) =>
          recipe.id === id ? toggleFavourite(recipe) : recipe,
        ),
      )
    },
    [setRecipes],
  )

  const importMeal = useCallback(
    (meal: MealDbMeal) => {
      // The check inside the updater also stops a double click from importing the same meal twice
      setRecipes((prev) =>
        prev.some((recipe) => recipe.externalId === meal.idMeal)
          ? prev
          : [createRecipe(mealToRecipe(meal)), ...prev],
      )
    },
    [setRecipes],
  )

  const reset = useCallback((): boolean => {
    if (!window.confirm('Replace all recipes with the sample data?')) {
      return false
    }

    setRecipes(sampleRecipes)
    return true
  }, [setRecipes])

  return {
    recipes,
    add,
    update,
    remove,
    toggleFavourite: handleToggleFavourite,
    importMeal,
    reset,
  }
}
