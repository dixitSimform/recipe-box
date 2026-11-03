import type { ReactElement } from 'react'
import { Link } from 'react-router'
import { Card } from '../components/Card'
import { List } from '../components/List'
import type { Recipe } from '../types/recipe'
import { countFavourites } from '../utils/recipeUtils'

export type HomePageProps = {
  recipes: Recipe[]
}

const LATEST_COUNT = 3

export const HomePage = ({ recipes }: HomePageProps): ReactElement => {
  const recipeCount = recipes.length
  const favouriteCount = countFavourites(recipes)
  // Copy before sorting: sort() changes the array it is called on, and props must not be mutated.
  // ISO date strings sort correctly as plain text.
  const latestRecipes = [...recipes]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, LATEST_COUNT)

  return (
    <section>
      <h2>Welcome to Recipe Box</h2>
      <p>Keep your own recipes and discover new ones from TheMealDB.</p>
      <p className="summary">
        {recipeCount} {recipeCount === 1 ? 'recipe' : 'recipes'} ·{' '}
        {favouriteCount} {favouriteCount === 1 ? 'favourite' : 'favourites'}
      </p>
      <div className="toolbar">
        <Link className="btn btn-primary" to="/recipes">
          My recipes
        </Link>
        <Link className="btn btn-secondary" to="/discover">
          Discover
        </Link>
      </div>
      <h3>Latest recipes</h3>
      <List
        items={latestRecipes}
        renderItem={(recipe) => (
          <Card>
            <h4 className="latest-title">{recipe.title}</h4>
            <span className="badge">{recipe.category}</span>
          </Card>
        )}
        getKey={(recipe) => recipe.id}
        emptyMessage="No recipes yet."
      />
    </section>
  )
}
