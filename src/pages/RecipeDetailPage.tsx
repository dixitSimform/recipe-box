import type { ReactElement } from 'react'
import { Link, NavLink, Outlet, useNavigate, useParams } from 'react-router'
import { Button } from '../components/Button'
import type { Recipe } from '../types/recipe'
import { findById, getTotalTime } from '../utils/recipeUtils'

export type RecipeDetailPageProps = {
  recipes: Recipe[]
  onToggleFavourite: (id: string) => void
  onRemove: (id: string) => boolean
}

// The shape of the value passed to the nested routes with <Outlet context={...} />
export type RecipeOutletContext = {
  recipe: Recipe
}

const getTabClass = ({ isActive }: { isActive: boolean }): string =>
  isActive ? 'nav-link nav-link-active' : 'nav-link'

export const RecipeDetailPage = ({
  recipes,
  onToggleFavourite,
  onRemove,
}: RecipeDetailPageProps): ReactElement => {
  // useParams reads the ":id" part of the URL; URL parts are always strings (or undefined)
  const { id } = useParams()
  const navigate = useNavigate()
  const recipe = id === undefined ? undefined : findById(recipes, id)

  // A missing recipe is a problem with this page only, so it is not the 404 page
  if (recipe === undefined) {
    return (
      <section className="empty">
        <h2>Recipe not found</h2>
        <p>There is no recipe with this id.</p>
        <Link to="/recipes">Back to my recipes</Link>
      </section>
    )
  }

  const handleDelete = () => {
    // onRemove asks for confirmation; only leave the page if the recipe was really deleted.
    // replace: true swaps this page in the history, so Back cannot return to a deleted recipe.
    if (onRemove(recipe.id)) navigate('/recipes', { replace: true })
  }

  const { title, category, servings, prepMinutes, cookMinutes, notes } = recipe
  const outletContext: RecipeOutletContext = { recipe }

  return (
    <section className="recipe-detail">
      <div className="recipe-detail-header">
        <h2>{title}</h2>
        <div className="recipe-detail-actions">
          <Button
            variant="secondary"
            pressed={recipe.isFavourite}
            onClick={() => onToggleFavourite(recipe.id)}
          >
            {recipe.isFavourite ? '★ Favourite' : '☆ Favourite'}
          </Button>
          <Link className="btn btn-secondary" to={`/recipes/${recipe.id}/edit`}>
            Edit
          </Link>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>
      <div className="meal-badges">
        <span className="badge">{category}</span>
        {recipe.source === 'mealdb' && <span className="badge">TheMealDB</span>}
      </div>
      <p className="recipe-meta">
        Prep {prepMinutes} min · Cook {cookMinutes} min · Total{' '}
        {getTotalTime(recipe)} min · {servings}{' '}
        {servings === 1 ? 'serving' : 'servings'}
      </p>
      {notes && <p className="recipe-notes">{notes}</p>}
      <nav className="recipe-tabs" aria-label="Recipe sections">
        {/* "." is this route itself; `end` keeps it from staying active on the steps tab */}
        <NavLink to="." end className={getTabClass}>
          Ingredients
        </NavLink>
        <NavLink to="steps" className={getTabClass}>
          Steps
        </NavLink>
      </nav>
      {/* The matching nested route renders here and receives the recipe through context */}
      <Outlet context={outletContext} />
    </section>
  )
}
