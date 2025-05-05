"use client"

import { useState } from "react"
import { useComponent } from "@/context/component-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { PropertyEditor } from "@/components/property-editor"
import { CodeViewer } from "@/components/code-viewer"
import { AIAssistance } from "@/components/ai-assistance"

export function ComponentSandbox() {
  const { activeComponent } = useComponent()
  const [activeTab, setActiveTab] = useState("preview")

  if (!activeComponent) {
    return (
      <div className="flex h-[70vh] items-center justify-center rounded-lg border-2 border-dashed border-border">
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-bold">Welcome to the Design System</h2>
          <p className="mt-2 text-muted-foreground">
            Select a component from the sidebar to explore its properties, code, and usage guidelines.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{activeComponent.name}</h1>
        <p className="mt-1 text-muted-foreground">
          Explore, customize, and learn how to use the {activeComponent.name.toLowerCase()} component.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex items-center justify-between border-b px-4">
                <TabsList className="h-14">
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="code">Code</TabsTrigger>
                </TabsList>
              </div>
              <CardContent className="p-6">
                <TabsContent value="preview" className="mt-0 rounded-md border">
                  <div className="flex min-h-[350px] items-center justify-center bg-background p-10">
                    {activeComponent.component}
                  </div>
                </TabsContent>
                <TabsContent value="code" className="mt-0">
                  <CodeViewer code={activeComponent.code} />
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>

          <PropertyEditor />
        </div>

        <div>
          <AIAssistance />
        </div>
      </div>
    </div>
  )
}
