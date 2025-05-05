import { z } from "zod"
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import { executeQuery } from "@/lib/db"

export const themesRouter = createTRPCRouter({
  getThemes: publicProcedure.query(async () => {
    try {
      const themes = await executeQuery('SELECT * FROM "Theme"')

      // Convert to the expected format
      return themes.reduce(
        (acc, theme) => {
          acc[theme.name] = theme.values
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
        // Check if theme exists
        const existingTheme = await executeQuery('SELECT * FROM "Theme" WHERE name = $1', [input.name])

        if (existingTheme.length > 0) {
          // Update existing theme
          await executeQuery('UPDATE "Theme" SET values = $1, "updatedAt" = $2 WHERE name = $3', [
            input.theme,
            new Date(),
            input.name,
          ])
        } else {
          // Create new theme
          await executeQuery(
            'INSERT INTO "Theme" (id, name, values, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5)',
            [`theme_${Math.random().toString(36).substring(2, 15)}`, input.name, input.theme, new Date(), new Date()],
          )
        }

        return { success: true }
      } catch (error) {
        console.error("Error saving theme:", error)
        return { success: false }
      }
    }),
})
