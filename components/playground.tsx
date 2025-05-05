"use client"

import { useState } from "react"
import { ComponentSandbox } from "@/components/component-sandbox"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { ChatAssistant } from "@/components/chat-assistant"
import { ComponentProvider } from "@/context/component-context"
import { ThemeProvider } from "@/context/theme-context"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"

export function Playground() {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <ThemeProvider>
      <ComponentProvider>
        <div className="flex min-h-screen flex-col">
          <Header />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto bg-background">
              <div className="container mx-auto p-6">
                <ComponentSandbox />
              </div>
            </main>
            <ChatAssistant isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
          </div>
          <Button
            onClick={() => setIsChatOpen(true)}
            className="fixed bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
            size="icon"
            aria-label="Open chat assistant"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
        </div>
      </ComponentProvider>
    </ThemeProvider>
  )
}
