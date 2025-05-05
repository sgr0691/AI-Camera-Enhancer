"use client"

import { useState } from "react"
import { useComponent } from "@/context/component-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { trpc } from "@/lib/trpc"
import { CheckCircle2, Info, Palette, Code } from "lucide-react"

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
      <CardHeader className="pb-3">
        <CardTitle>AI Assistance</CardTitle>
      </CardHeader>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="guidelines" className="flex-1">
            Guidelines
          </TabsTrigger>
          <TabsTrigger value="tokens" className="flex-1">
            Design Tokens
          </TabsTrigger>
          <TabsTrigger value="examples" className="flex-1">
            Examples
          </TabsTrigger>
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
                  <div className="space-y-6">
                    <div>
                      <h3 className="mb-3 flex items-center gap-2 font-medium">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        Accessibility Guidelines
                      </h3>
                      <ul className="space-y-2">
                        {aiSuggestions?.guidelines.map((guideline, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            {guideline}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="mb-3 flex items-center gap-2 font-medium">
                        <Info className="h-4 w-4 text-blue-500" />
                        Best Practices
                      </h3>
                      <ul className="space-y-2">
                        {aiSuggestions?.bestPractices.map((practice, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            {practice}
                          </li>
                        ))}
                      </ul>
                    </div>
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
                    <h3 className="flex items-center gap-2 font-medium">
                      <Palette className="h-4 w-4 text-purple-500" />
                      Recommended Tokens
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      {aiSuggestions?.tokens.map((token, index) => (
                        <div key={index} className="flex items-center justify-between rounded-md border p-2">
                          <span className="text-sm font-medium">{token.name}</span>
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded-full border" style={{ backgroundColor: token.value }}></div>
                            <code className="rounded bg-muted px-1 py-0.5 text-xs">{token.value}</code>
                          </div>
                        </div>
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
                    <h3 className="flex items-center gap-2 font-medium">
                      <Code className="h-4 w-4 text-amber-500" />
                      Usage Examples
                    </h3>
                    {aiSuggestions?.examples.map((example, index) => (
                      <div key={index} className="rounded-md border">
                        <div className="border-b p-3">
                          <h4 className="font-medium">{example.title}</h4>
                          <p className="text-sm text-muted-foreground">{example.description}</p>
                        </div>
                        <pre className="overflow-x-auto rounded-b-md bg-muted p-3 text-xs">
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
