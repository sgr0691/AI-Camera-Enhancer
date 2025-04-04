"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wand2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BrushTool } from "./brush-tool"

interface EnhanceControlsProps {
  onEnhance: (prompt: string) => void
  isLoading: boolean
}

const PRESET_PROMPTS = [
  { id: "moonshot", label: "Moon Shot", value: "Enhance this moon photo to show more detail and reduce overexposure" },
  {
    id: "night",
    label: "Night Scene",
    value: "Brighten this night scene while preserving the ambiance and reducing noise",
  },
  { id: "fireworks", label: "Fireworks", value: "Make the colors of these fireworks more vibrant and clear" },
  { id: "landmark", label: "Landmark", value: "Enhance this landmark photo to look more professional and well-lit" },
]

export function EnhanceControls({ onEnhance, isLoading }: EnhanceControlsProps) {
  const [prompt, setPrompt] = useState("")
  const [brushActive, setBrushActive] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState("")

  const handlePresetChange = (value: string) => {
    setSelectedPreset(value)
    const preset = PRESET_PROMPTS.find((p) => p.id === value)
    if (preset) {
      setPrompt(preset.value)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim()) {
      onEnhance(prompt)
    }
  }

  return (
    <Card className="h-full border-primary/20 shadow-md overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b">
        <CardTitle className="text-primary">Enhancement Controls</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="prompt" className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-none bg-muted/50">
            <TabsTrigger
              value="prompt"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/20 data-[state=active]:to-secondary/20 rounded-none"
            >
              AI Prompt
            </TabsTrigger>
            <TabsTrigger
              value="brush"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-secondary/20 data-[state=active]:to-primary/20 rounded-none"
            >
              Brush Tool
            </TabsTrigger>
          </TabsList>

          <TabsContent value="prompt" className="space-y-4 p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="preset" className="text-sm font-medium">
                  Quick Presets
                </Label>
                <Select value={selectedPreset} onValueChange={handlePresetChange}>
                  <SelectTrigger id="preset" className="border-primary/20 focus:ring-primary/30">
                    <SelectValue placeholder="Select a preset..." />
                  </SelectTrigger>
                  <SelectContent>
                    {PRESET_PROMPTS.map((preset) => (
                      <SelectItem key={preset.id} value={preset.id}>
                        {preset.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prompt" className="text-sm font-medium">
                  Describe the enhancement
                </Label>
                <Textarea
                  id="prompt"
                  placeholder="e.g., Make the moon brighter and show more details"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  className="resize-none border-primary/20 focus-visible:ring-primary/30"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
                disabled={!prompt.trim() || isLoading}
              >
                {isLoading ? "Enhancing..." : "Enhance Image"}
                {!isLoading && <Wand2 className="ml-2 h-4 w-4" />}
              </Button>
            </form>

            <div className="pt-4 bg-muted/30 p-3 rounded-lg">
              <h4 className="text-sm font-medium mb-2 text-primary">Tips for better results:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Be specific about what you want to enhance</li>
                <li>• Mention problem areas (too dark, blurry, etc.)</li>
                <li>• Describe the desired outcome</li>
                <li>• For night shots, mention if you want to preserve the mood</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="brush" className="p-4">
            <BrushTool />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

