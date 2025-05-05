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
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Welcome to the Design System Playground</h2>
          <p className="mt-2 text-muted-foreground">Select a component from the sidebar to get started</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid h-full grid-cols-3 gap-4">
      <div className="col-span-2 space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
          <Card className="mt-2">
            <CardContent className="p-6">
              <TabsContent value="preview" className="mt-0">
                <div className="flex min-h-[300px] items-center justify-center rounded-md border border-dashed p-4">
                  {activeComponent.component}
                </div>
              </TabsContent>
              <TabsContent value="code" className="mt-0">
                <CodeViewer code={activeComponent.code} />
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
        <PropertyEditor />
      </div>
      <div className="space-y-4">
        <AIAssistance />
      </div>
    </div>
  )
}
