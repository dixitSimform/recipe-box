import { Layout } from './components/Layout'
import { List } from './components/List'
import { RecipeCard } from './components/RecipeCard'
import { sampleRecipes } from './data/sampleRecipes'

function App() {
  return (
    <Layout>
      <List
        items={sampleRecipes}
        renderItem={(recipe) => <RecipeCard recipe={recipe} />}
        getKey={(recipe) => recipe.id}
        emptyMessage="No recipes yet."
      />
    </Layout>
  )
}

export default App
