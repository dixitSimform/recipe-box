import type { Category, Ingredient, NewRecipe, Recipe } from '../types/recipe'

// T can be any object type, as long as it has a string `id`
export const findById = <T extends { id: string }>(
  items: T[],
  id: string,
): T | undefined => items.find((item) => item.id === id)

export const getTotalTime = ({ prepMinutes, cookMinutes }: Recipe): number =>
  prepMinutes + cookMinutes

export const filterByCategory = (
  recipes: Recipe[],
  category: Category | 'all',
): Recipe[] =>
  category === 'all'
    ? recipes
    : recipes.filter((recipe) => recipe.category === category)

export const countFavourites = (recipes: Recipe[]): number =>
  recipes.reduce((count, recipe) => (recipe.isFavourite ? count + 1 : count), 0)

export const toggleFavourite = (recipe: Recipe): Recipe => ({
  ...recipe,
  isFavourite: !recipe.isFavourite,
})

export const createRecipe = (data: NewRecipe): Recipe => ({
  ...data,
  id: crypto.randomUUID(),
  createdAt: new Date().toISOString(),
})

export const formatIngredient = (ing: Ingredient): string =>
  [ing.quantity, ing.unit ?? '', ing.name].filter((part) => part !== '').join(' ')
