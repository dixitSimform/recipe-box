import { useState } from 'react'
import type { ChangeEvent, FormEvent, ReactElement } from 'react'
import { CATEGORIES } from '../constants/categories'
import type { Category, Ingredient, NewRecipe, Recipe } from '../types/recipe'
import { createEmptyRow } from '../utils/recipeUtils'
import { Button } from './Button'
import { IngredientRows } from './IngredientRows'
import type { IngredientRow } from './IngredientRows'

export type RecipeFormProps = {
  onSubmit: (data: NewRecipe) => void
  onCancel: () => void
  // When present the form edits this recipe instead of adding a new one
  initialRecipe?: Recipe
}

// Number fields stay as strings while the user types; they are parsed on submit
export type RecipeFormValues = {
  title: string
  category: Category
  prepMinutes: string
  cookMinutes: string
  servings: string
  steps: string
  notes: string
}

const emptyValues: RecipeFormValues = {
  title: '',
  category: 'dinner',
  prepMinutes: '0',
  cookMinutes: '0',
  servings: '4',
  steps: '',
  notes: '',
}

// Numbers become strings, steps are joined with new lines
const toFormValues = (recipe?: Recipe): RecipeFormValues =>
  recipe === undefined
    ? emptyValues
    : {
        title: recipe.title,
        category: recipe.category,
        prepMinutes: String(recipe.prepMinutes),
        cookMinutes: String(recipe.cookMinutes),
        servings: String(recipe.servings),
        steps: recipe.steps.join('\n'),
        notes: recipe.notes ?? '',
      }

// A new recipe starts with one empty row; an existing one gets a row per ingredient
const toRows = (recipe?: Recipe): IngredientRow[] =>
  recipe === undefined
    ? [createEmptyRow()]
    : recipe.ingredients.map((ingredient) => ({
        id: ingredient.id,
        name: ingredient.name,
        quantity: String(ingredient.quantity),
        unit: ingredient.unit ?? '',
      }))

// Returns the number for "0", "15"... or null for "", "-1", "2.5", "abc"
const parseWholeNumber = (value: string): number | null =>
  /^\d+$/.test(value.trim()) ? Number(value) : null

export const RecipeForm = ({
  onSubmit,
  onCancel,
  initialRecipe,
}: RecipeFormProps): ReactElement => {
  // Lazy initialisers: the prefill runs once, when the form first appears
  const [values, setValues] = useState<RecipeFormValues>(() =>
    toFormValues(initialRecipe),
  )
  const [rows, setRows] = useState<IngredientRow[]>(() => toRows(initialRecipe))
  const [error, setError] = useState('')

  // One handler for every field: the input's `name` matches a key of RecipeFormValues
  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const title = values.title.trim()
    const prepMinutes = parseWholeNumber(values.prepMinutes)
    const cookMinutes = parseWholeNumber(values.cookMinutes)
    const servings = parseWholeNumber(values.servings)

    if (title === '') {
      setError('Title is required.')
      return
    }
    if (prepMinutes === null || cookMinutes === null) {
      setError('Prep and cook minutes must be whole numbers, 0 or more.')
      return
    }
    if (servings === null || servings < 1) {
      setError('Servings must be a whole number, 1 or more.')
      return
    }

    // Rows with an empty name are ignored; the others need a quantity above 0
    const namedRows = rows.filter((row) => row.name.trim() !== '')
    const hasBadQuantity = namedRows.some((row) => {
      const quantity = Number(row.quantity)
      return !(Number.isFinite(quantity) && quantity > 0)
    })
    if (hasBadQuantity) {
      setError('Every ingredient needs a quantity greater than 0.')
      return
    }

    const ingredients: Ingredient[] = namedRows.map((row) => {
      const unit = row.unit.trim()
      return {
        id: row.id,
        name: row.name.trim(),
        quantity: Number(row.quantity),
        // Leave `unit` out completely when it is empty
        ...(unit !== '' ? { unit } : {}),
      }
    })

    const steps = values.steps
      .split('\n')
      .map((step) => step.trim())
      .filter((step) => step !== '')
    const notes = values.notes.trim()

    setError('')
    onSubmit({
      title,
      category: values.category,
      prepMinutes,
      cookMinutes,
      servings,
      ingredients,
      steps,
      isFavourite: false,
      source: 'mine',
      // Leave `notes` out completely when it is empty
      ...(notes !== '' ? { notes } : {}),
    })
  }

  return (
    <form className="recipe-form" onSubmit={handleSubmit} noValidate>
      <h2>{initialRecipe ? 'Edit recipe' : 'Add recipe'}</h2>
      <div className="field">
        <label htmlFor="recipe-title">Title</label>
        <input
          id="recipe-title"
          name="title"
          type="text"
          value={values.title}
          onChange={handleChange}
        />
      </div>
      <div className="field">
        <label htmlFor="recipe-form-category">Category</label>
        <select
          id="recipe-form-category"
          name="category"
          value={values.category}
          onChange={handleChange}
        >
          {CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <div className="form-row">
        <div className="field">
          <label htmlFor="recipe-prep">Prep minutes</label>
          <input
            id="recipe-prep"
            name="prepMinutes"
            type="number"
            min="0"
            value={values.prepMinutes}
            onChange={handleChange}
          />
        </div>
        <div className="field">
          <label htmlFor="recipe-cook">Cook minutes</label>
          <input
            id="recipe-cook"
            name="cookMinutes"
            type="number"
            min="0"
            value={values.cookMinutes}
            onChange={handleChange}
          />
        </div>
        <div className="field">
          <label htmlFor="recipe-servings">Servings</label>
          <input
            id="recipe-servings"
            name="servings"
            type="number"
            min="1"
            value={values.servings}
            onChange={handleChange}
          />
        </div>
      </div>
      <fieldset className="ingredients-fieldset">
        <legend>Ingredients</legend>
        <IngredientRows rows={rows} onChange={setRows} />
      </fieldset>
      <div className="field">
        <label htmlFor="recipe-steps">Steps (one per line)</label>
        <textarea
          id="recipe-steps"
          name="steps"
          rows={5}
          value={values.steps}
          onChange={handleChange}
        />
      </div>
      <div className="field">
        <label htmlFor="recipe-notes">Notes</label>
        <textarea
          id="recipe-notes"
          name="notes"
          rows={2}
          value={values.notes}
          onChange={handleChange}
        />
      </div>
      {error !== '' && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <div className="form-actions">
        <Button type="submit">Save recipe</Button>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
