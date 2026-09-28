import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'
import { useTheme } from '@/hooks/use-theme'
import { ProductsPage } from '@/features/products/ProductsPage'

function App() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-svh bg-background text-foreground">
      <div className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-16">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Produits</h1>
            <p className="text-sm text-muted-foreground">Gestion du catalogue produits</p>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Basculer le thème">
            {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
        </div>

        <ProductsPage />
      </div>
      <Toaster />
    </div>
  )
}

export default App
