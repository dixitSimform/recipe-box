import { useState } from 'react'
import type { ChangeEvent, FormEvent, ReactElement } from 'react'
import { CATEGORIES } from '../constants/categories'
import type { Category, NewRecipe } from '../types/recipe'
import { Button } from './Button'

export type RecipeFormProps = {
  onSubmit: (data: NewRecipe) => void
  onCancel: () => void
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

const initialValues: RecipeFormValues = {
  title: '',
  category: 'dinner',
  prepMinutes: '0',
  cookMinutes: '0',
  servings: '4',
  steps: '',
  notes: '',
}

// Returns the number for "0", "15"... or null for "", "-1", "2.5", "abc"
const parseWholeNumber = (value: string): number | null =>
  /^\d+$/.test(value.trim()) ? Number(value) : null

export const RecipeForm = ({
  onSubmit,
  onCancel,
}: RecipeFormProps): ReactElement => {
  const [values, setValues] = useState<RecipeFormValues>(initialValues)
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
      ingredients: [],
      steps,
      isFavourite: false,
      source: 'mine',
      // Leave `notes` out completely when it is empty
      ...(notes !== '' ? { notes } : {}),
    })
  }

  return (
    <form className="recipe-form" onSubmit={handleSubmit} noValidate>
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
