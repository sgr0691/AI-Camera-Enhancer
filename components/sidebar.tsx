"use client"

import { useState } from "react"
import { useComponent } from "@/context/component-context"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const { components, setActiveComponent, activeComponent } = useComponent()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredComponents = components.filter((component) =>
    component.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const componentCategories = filteredComponents.reduce(
    (acc, component) => {
      if (!acc[component.category]) {
        acc[component.category] = []
      }
      acc[component.category].push(component)
      return acc
    },
    {} as Record<string, typeof components>,
  )

  return (
    <div className="w-64 border-r bg-background">
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search components..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="px-3 py-2">
          {Object.entries(componentCategories).map(([category, categoryComponents]) => (
            <div key={category} className="mb-6">
              <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {category}
              </h3>
              <div className="space-y-1">
                {categoryComponents.map((component) => (
                  <Button
                    key={component.id}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start font-normal",
                      activeComponent?.id === component.id && "bg-accent font-medium text-accent-foreground",
                    )}
                    onClick={() => setActiveComponent(component.id)}
                  >
                    {component.name}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
