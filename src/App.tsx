import { Button } from "@/components/ui/button"

function App() {
  return (
    <main className="mx-auto flex min-h-svh max-w-xl flex-col items-center justify-center gap-6 p-6 text-center">
      <h1 className="text-4xl font-semibold tracking-tight">Recipe Box</h1>
      <p className="text-muted-foreground">
        Your recipes, all in one cozy place.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button>Add recipe</Button>
        <Button variant="secondary">Browse</Button>
        <Button variant="outline">Favorites</Button>
        <Button variant="destructive">Delete</Button>
      </div>
    </main>
  )
}

export default App
