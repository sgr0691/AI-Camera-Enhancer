"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { ThemeEditor } from "@/components/theme-editor"
import { trpc } from "@/lib/trpc"

interface CustomTheme {
  [key: string]: string
}

interface ThemeContextType {
  activeTheme: string
  isThemeEditorOpen: boolean
  openThemeEditor: () => void
  closeThemeEditor: () => void
  themes: {
    customThemes: Record<string, CustomTheme>
    createTheme: (name: string, theme: CustomTheme) => void
    updateTheme: (name: string, theme: CustomTheme) => void
    deleteTheme: (name: string) => void
    setActiveTheme: (name: string) => void
  }
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const defaultThemes: Record<string, CustomTheme> = {
  default: {
    "--primary": "#0070f3",
    "--primary-foreground": "#ffffff",
    "--secondary": "#f5f5f5",
    "--secondary-foreground": "#111111",
    "--accent": "#f0f0f0",
    "--accent-foreground": "#111111",
    "--background": "#ffffff",
    "--foreground": "#111111",
    "--card": "#ffffff",
    "--card-foreground": "#111111",
    "--border": "#e5e5e5",
    "--input": "#ffffff",
    "--ring": "#0070f3",
  },
  dark: {
    "--primary": "#0070f3",
    "--primary-foreground": "#ffffff",
    "--secondary": "#2d2d2d",
    "--secondary-foreground": "#ffffff",
    "--accent": "#333333",
    "--accent-foreground": "#ffffff",
    "--background": "#111111",
    "--foreground": "#ffffff",
    "--card": "#1a1a1a",
    "--card-foreground": "#ffffff",
    "--border": "#333333",
    "--input": "#1a1a1a",
    "--ring": "#0070f3",
  },
  purple: {
    "--primary": "#8a2be2",
    "--primary-foreground": "#ffffff",
    "--secondary": "#f5f0ff",
    "--secondary-foreground": "#111111",
    "--accent": "#e6d6ff",
    "--accent-foreground": "#111111",
    "--background": "#ffffff",
    "--foreground": "#111111",
    "--card": "#ffffff",
    "--card-foreground": "#111111",
    "--border": "#e5e5e5",
    "--input": "#ffffff",
    "--ring": "#8a2be2",
  },
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [customThemes, setCustomThemes] = useState<Record<string, CustomTheme>>(defaultThemes)
  const [activeTheme, setActiveTheme] = useState<string>("default")
  const [isThemeEditorOpen, setIsThemeEditorOpen] = useState(false)

  const themeMutation = trpc.themes.saveTheme.useMutation()
  const { data: savedThemes } = trpc.themes.getThemes.useQuery()

  useEffect(() => {
    if (savedThemes) {
      setCustomThemes((prev) => ({ ...prev, ...savedThemes }))
    }
  }, [savedThemes])

  useEffect(() => {
    const storedTheme = localStorage.getItem("activeTheme")
    if (storedTheme && customThemes[storedTheme]) {
      setActiveTheme(storedTheme)
    }
  }, [customThemes])

  useEffect(() => {
    localStorage.setItem("activeTheme", activeTheme)

    const theme = customThemes[activeTheme]
    if (theme) {
      Object.entries(theme).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value)
      })
    }
  }, [activeTheme, customThemes])

  const createTheme = (name: string, theme: CustomTheme) => {
    setCustomThemes((prev) => ({ ...prev, [name]: theme }))
    themeMutation.mutate({ name, theme })
  }

  const updateTheme = (name: string, theme: CustomTheme) => {
    setCustomThemes((prev) => ({ ...prev, [name]: theme }))
    themeMutation.mutate({ name, theme })
  }

  const deleteTheme = (name: string) => {
    if (name === "default" || name === "dark") return

    setCustomThemes((prev) => {
      const newThemes = { ...prev }
      delete newThemes[name]
      return newThemes
    })

    if (activeTheme === name) {
      setActiveTheme("default")
    }
  }

  const openThemeEditor = () => setIsThemeEditorOpen(true)
  const closeThemeEditor = () => setIsThemeEditorOpen(false)

  return (
    <ThemeContext.Provider
      value={{
        activeTheme,
        isThemeEditorOpen,
        openThemeEditor,
        closeThemeEditor,
        themes: {
          customThemes,
          createTheme,
          updateTheme,
          deleteTheme,
          setActiveTheme,
        },
      }}
    >
      {children}
      <ThemeEditor />
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
