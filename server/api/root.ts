import { createTRPCRouter } from "@/server/api/trpc"
import { aiRouter } from "@/server/api/routers/ai"
import { themesRouter } from "@/server/api/routers/themes"

export const appRouter = createTRPCRouter({
  ai: aiRouter,
  themes: themesRouter,
})

export type AppRouter = typeof appRouter
