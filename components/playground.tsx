"use client"

import { useState } from "react"
import { ComponentSandbox } from "@/components/component-sandbox"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { ChatAssistant } from "@/components/chat-assistant"
import { ComponentProvider } from "@/context/component-context"
import { ThemeProvider } from "@/context/theme-context"

export function Playground() {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <ThemeProvider>
      <ComponentProvider>
        <div className="flex h-screen flex-col">
          <Header />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-4">
              <ComponentSandbox />
            </main>
            <ChatAssistant isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
          </div>
          <button
            onClick={() => setIsChatOpen(true)}
            className="fixed bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
            aria-label="Open chat assistant"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-message-square"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        </div>
      </ComponentProvider>
    </ThemeProvider>
  )
}
