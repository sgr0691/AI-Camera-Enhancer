"use client"

import { useState } from "react"
import { useTheme } from "@/context/theme-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Palette } from "lucide-react"

export function ThemeEditor() {
  const { isThemeEditorOpen, closeThemeEditor, themes, activeTheme } = useTheme()
  const [newThemeName, setNewThemeName] = useState("")
  const [editingTheme, setEditingTheme] = useState<string | null>(null)
  const [themeColors, setThemeColors] = useState<Record<string, string>>({})

  const handleEditTheme = (themeName: string) => {
    setEditingTheme(themeName)
    setThemeColors({ ...themes.customThemes[themeName] })
  }

  const handleSaveTheme = () => {
    if (editingTheme) {
      themes.updateTheme(editingTheme, themeColors)
    }
    setEditingTheme(null)
  }

  const handleCreateTheme = () => {
    if (newThemeName.trim()) {
      themes.createTheme(newThemeName, { ...themes.customThemes[activeTheme] })
      setNewThemeName("")
    }
  }

  const handleColorChange = (key: string, value: string) => {
    setThemeColors((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <Dialog open={isThemeEditorOpen} onOpenChange={closeThemeEditor}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Palette className="h-5 w-5" />
            Theme Editor
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="edit" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="edit" className="flex-1">
              Edit Theme
            </TabsTrigger>
            <TabsTrigger value="create" className="flex-1">
              Create New Theme
            </TabsTrigger>
          </TabsList>
          <TabsContent value="edit" className="mt-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="theme-select">Select Theme:</Label>
                <select
                  id="theme-select"
                  value={editingTheme || ""}
                  onChange={(e) => handleEditTheme(e.target.value)}
                  className="flex-1 rounded-md border border-input bg-background px-3 py-1 text-sm"
                >
                  <option value="" disabled>
                    Select a theme
                  </option>
                  {Object.keys(themes.customThemes).map((theme) => (
                    <option key={theme} value={theme}>
                      {theme}
                    </option>
                  ))}
                </select>
              </div>
              {editingTheme && (
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(themeColors).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                      <Label htmlFor={key} className="w-40 text-sm">
                        {key}:
                      </Label>
                      <div className="flex flex-1 items-center gap-2">
                        <Input
                          id={key}
                          type="text"
                          value={value}
                          onChange={(e) => handleColorChange(key, e.target.value)}
                          className="h-8"
                        />
                        <Input
                          type="color"
                          value={value}
                          onChange={(e) => handleColorChange(key, e.target.value)}
                          className="h-8 w-8 p-0"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <DialogFooter className="mt-4">
              <Button onClick={handleSaveTheme} disabled={!editingTheme}>
                Save Changes
              </Button>
            </DialogFooter>
          </TabsContent>
          <TabsContent value="create" className="mt-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="new-theme-name">Theme Name:</Label>
                <Input
                  id="new-theme-name"
                  value={newThemeName}
                  onChange={(e) => setNewThemeName(e.target.value)}
                  placeholder="Enter theme name"
                  className="flex-1"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                The new theme will be based on the currently active theme.
              </p>
            </div>
            <DialogFooter className="mt-4">
              <Button onClick={handleCreateTheme} disabled={!newThemeName.trim()}>
                Create Theme
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
