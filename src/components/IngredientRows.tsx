import type { ChangeEvent, ReactElement } from 'react'
import { createEmptyRow } from '../utils/recipeUtils'
import { Button } from './Button'

// Quantity stays a string while editing, like the number fields in RecipeForm
export type IngredientRow = {
  id: string
  name: string
  quantity: string
  unit: string
}

export type IngredientRowsProps = {
  rows: IngredientRow[]
  onChange: (rows: IngredientRow[]) => void
}

export const IngredientRows = ({
  rows,
  onChange,
}: IngredientRowsProps): ReactElement => {
  // Copy the array with `map` and copy only the row that matches; nothing is mutated
  const updateRow = (id: string, field: keyof IngredientRow, value: string) => {
    onChange(rows.map((row) => (row.id === id ? { ...row, [field]: value } : row)))
  }

  const handleFieldChange =
    (id: string, field: keyof IngredientRow) =>
    (event: ChangeEvent<HTMLInputElement>) =>
      updateRow(id, field, event.target.value)

  const removeRow = (id: string) => {
    onChange(rows.filter((row) => row.id !== id))
  }

  return (
    <div className="ingredient-rows">
      {rows.map((row) => (
        // The row's own id is the key, so React keeps each row's inputs when another row is removed
        <div className="ingredient-row" key={row.id}>
          <div className="field">
            <label htmlFor={`ingredient-name-${row.id}`}>Name</label>
            <input
              id={`ingredient-name-${row.id}`}
              type="text"
              value={row.name}
              onChange={handleFieldChange(row.id, 'name')}
            />
          </div>
          <div className="field">
            <label htmlFor={`ingredient-quantity-${row.id}`}>Quantity</label>
            <input
              id={`ingredient-quantity-${row.id}`}
              type="number"
              min="0"
              step="any"
              value={row.quantity}
              onChange={handleFieldChange(row.id, 'quantity')}
            />
          </div>
          <div className="field">
            <label htmlFor={`ingredient-unit-${row.id}`}>Unit</label>
            <input
              id={`ingredient-unit-${row.id}`}
              type="text"
              value={row.unit}
              onChange={handleFieldChange(row.id, 'unit')}
            />
          </div>
          <Button variant="danger" onClick={() => removeRow(row.id)}>
            Remove
          </Button>
        </div>
      ))}
      <div>
        <Button
          variant="secondary"
          onClick={() => onChange([...rows, createEmptyRow()])}
        >
          Add ingredient
        </Button>
      </div>
    </div>
  )
}
