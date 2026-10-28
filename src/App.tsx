import { sampleRecipes } from './data/sampleRecipes'
import {
  countFavourites,
  filterByCategory,
  formatIngredient,
  getTotalTime,
} from './utils/recipeUtils'

// Temporary check of the Step 2 types, data and utilities. Replaced in Step 3.
function App() {
  const firstRecipe = sampleRecipes[0]
  const dinnerTitles = filterByCategory(sampleRecipes, 'dinner')
    .map((recipe) => recipe.title)
    .join(', ')

  return (
    <div>
      <h1>Recipe Box</h1>
      <p>Total recipes: {sampleRecipes.length}</p>
      <p>Favourites: {countFavourites(sampleRecipes)}</p>
      <p>
        Total time of "{firstRecipe.title}": {getTotalTime(firstRecipe)} min
      </p>
      <p>Dinner recipes: {dinnerTitles}</p>
      <ul>
        {firstRecipe.ingredients.map((ingredient) => (
          <li key={ingredient.id}>{formatIngredient(ingredient)}</li>
        ))}
      </ul>
    </div>
  )
}

export default App
