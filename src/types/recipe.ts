export type Category = 'breakfast' | 'lunch' | 'dinner' | 'dessert' | 'snack'

export interface Ingredient {
  id: string
  name: string
  quantity: number
  unit?: string
}

export interface Recipe {
  id: string
  title: string
  category: Category
  prepMinutes: number
  cookMinutes: number
  servings: number
  ingredients: Ingredient[]
  steps: string[]
  isFavourite: boolean
  notes?: string
  source: 'mine' | 'mealdb'
  createdAt: string // ISO date
}

// A recipe before it has been given an id and a creation date
export type NewRecipe = Omit<Recipe, 'id' | 'createdAt'>
