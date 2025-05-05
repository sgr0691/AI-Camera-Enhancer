import { z } from "zod"
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import { prisma } from "@/server/db"

export const themesRouter = createTRPCRouter({
  getThemes: publicProcedure.query(async () => {
    try {
      const themes = await prisma.theme.findMany()

      // Convert to the expected format
      return themes.reduce(
        (acc, theme) => {
          acc[theme.name] = theme.values as Record<string, string>
          return acc
        },
        {} as Record<string, Record<string, string>>,
      )
    } catch (error) {
      console.error("Error fetching themes:", error)
      return {}
    }
  }),

  saveTheme: publicProcedure
    .input(
      z.object({
        name: z.string(),
        theme: z.record(z.string(), z.string()),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        await prisma.theme.upsert({
          where: { name: input.name },
          update: { values: input.theme },
          create: {
            name: input.name,
            values: input.theme,
          },
        })

        return { success: true }
      } catch (error) {
        console.error("Error saving theme:", error)
        return { success: false }
      }
    }),
})
