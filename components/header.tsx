"use client"

import { useTheme } from "@/context/theme-context"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import Link from "next/link"
import { LayoutTemplate, Github } from "lucide-react"

export function Header() {
  const { activeTheme, themes } = useTheme()

  return (
    <header className="sticky top-0 z-10 border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <LayoutTemplate className="h-5 w-5" />
          <h1 className="text-xl font-semibold">Design System</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <select
              value={activeTheme}
              onChange={(e) => themes.setActiveTheme(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-1 text-sm"
            >
              {Object.keys(themes.customThemes).map((theme) => (
                <option key={theme} value={theme}>
                  {theme}
                </option>
              ))}
            </select>
            <Button variant="outline" size="sm" onClick={themes.openThemeEditor}>
              Edit Themes
            </Button>
          </div>
          <ModeToggle />
          <Link href="https://github.com/yourusername/design-system-playground" target="_blank">
            <Button variant="ghost" size="icon">
              <Github className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
