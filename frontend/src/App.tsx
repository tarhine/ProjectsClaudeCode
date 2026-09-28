import { Moon, Sun } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useTheme } from '@/hooks/use-theme'

function App() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-svh bg-background text-foreground">
      <div className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-16">
        <div className="flex items-center justify-between">
          <Badge variant="secondary">Fullstack starter</Badge>
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Basculer le thème">
            {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>React + Vite + TypeScript</CardTitle>
            <CardDescription>
              Composants shadcn/ui, thème clair/sombre et API .NET 8 en CQRS prêts à l'emploi.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Button>Commencer</Button>
            <Button variant="outline">Documentation</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App
