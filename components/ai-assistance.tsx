"use client"

import { useState } from "react"
import { useComponent } from "@/context/component-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { trpc } from "@/lib/trpc"

export function AIAssistance() {
  const { activeComponent } = useComponent()
  const [activeTab, setActiveTab] = useState("guidelines")

  const { data: aiSuggestions, isLoading } = trpc.ai.getComponentSuggestions.useQuery(
    { componentId: activeComponent?.id || "" },
    { enabled: !!activeComponent },
  )

  if (!activeComponent) return null

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>AI Assistance</CardTitle>
      </CardHeader>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mx-4 mb-2">
          <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
          <TabsTrigger value="tokens">Design Tokens</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
        </TabsList>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-24rem)]">
            <div className="p-4">
              <TabsContent value="guidelines" className="mt-0">
                {isLoading ? (
                  <div className="flex h-40 items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Accessibility Guidelines</h3>
                    <ul className="space-y-2">
                      {aiSuggestions?.guidelines.map((guideline, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="mt-0.5 text-green-500">✓</span>
                          <span>{guideline}</span>
                        </li>
                      ))}
                    </ul>
                    <h3 className="text-lg font-medium">Best Practices</h3>
                    <ul className="space-y-2">
                      {aiSuggestions?.bestPractices.map((practice, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="mt-0.5 text-blue-500">ℹ</span>
                          <span>{practice}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="tokens" className="mt-0">
                {isLoading ? (
                  <div className="flex h-40 items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Recommended Tokens</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {aiSuggestions?.tokens.map((token, index) => (
                        <Badge key={index} variant="outline" className="justify-between">
                          <span>{token.name}</span>
                          <span className="ml-2 text-muted-foreground">{token.value}</span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="examples" className="mt-0">
                {isLoading ? (
                  <div className="flex h-40 items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Usage Examples</h3>
                    {aiSuggestions?.examples.map((example, index) => (
                      <div key={index} className="rounded-md border p-4">
                        <h4 className="mb-2 font-medium">{example.title}</h4>
                        <p className="text-sm text-muted-foreground">{example.description}</p>
                        <pre className="mt-2 overflow-x-auto rounded-md bg-muted p-2 text-xs">
                          <code>{example.code}</code>
                        </pre>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </div>
          </ScrollArea>
        </CardContent>
      </Tabs>
    </Card>
  )
}
