import { useCallback } from 'react'
import { mealToRecipe } from '../../discover/mealToRecipe'
import type { MealDbMeal } from '../../discover/api'
import { sampleRecipes } from '../../../data/sampleRecipes'
import type { NewRecipe, Recipe } from '../types'
import { createRecipe, toggleFavourite } from '../recipeUtils'
import { useLocalStorage } from '../../../shared/hooks/useLocalStorage'

export type UseRecipesResult = {
  recipes: Recipe[]
  // Returns the new recipe so the caller can navigate to it
  add: (data: NewRecipe) => Recipe
  update: (id: string, data: NewRecipe) => void
  // Returns true when the user confirmed and the recipe was deleted
  remove: (id: string) => boolean
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
    (data: NewRecipe): Recipe => {
      // Created outside the updater so the caller gets the same recipe (and id) that is stored
      const recipe = createRecipe(data)
      setRecipes((prev) => [recipe, ...prev])
      return recipe
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
    (id: string): boolean => {
      const recipe = recipes.find((item) => item.id === id)
      if (!recipe || !window.confirm(`Delete "${recipe.title}"?`)) return false

      setRecipes((prev) => prev.filter((item) => item.id !== id))
      return true
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
