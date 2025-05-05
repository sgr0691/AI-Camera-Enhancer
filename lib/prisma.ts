// This is a compatibility layer for code that still references prisma
// It redirects to our new db.ts module

import { executeQuery } from "@/lib/db"

// Create a mock Prisma client that uses our executeQuery function
export const prisma = {
  theme: {
    findMany: async () => {
      return await executeQuery('SELECT * FROM "Theme"')
    },
    count: async () => {
      const result = await executeQuery('SELECT COUNT(*) as "count" FROM "Theme"')
      return result[0].count
    },
    upsert: async ({ where, update, create }: any) => {
      const existingTheme = await executeQuery('SELECT * FROM "Theme" WHERE name = $1', [where.name])

      if (existingTheme.length > 0) {
        await executeQuery('UPDATE "Theme" SET values = $1, "updatedAt" = $2 WHERE name = $3', [
          update.values,
          new Date(),
          where.name,
        ])
        return existingTheme[0]
      } else {
        const newTheme = {
          id: `theme_${Math.random().toString(36).substring(2, 15)}`,
          name: create.name,
          values: create.values,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        await executeQuery(
          'INSERT INTO "Theme" (id, name, values, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5)',
          [newTheme.id, newTheme.name, newTheme.values, newTheme.createdAt, newTheme.updatedAt],
        )
        return newTheme
      }
    },
  },
  embedding: {
    count: async () => {
      const result = await executeQuery('SELECT COUNT(*) as "count" FROM "Embedding"')
      return result[0].count
    },
    create: async ({ data }: any) => {
      await executeQuery(
        'INSERT INTO "Embedding" (id, content, vector, category, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6)',
        [
          `emb_${Math.random().toString(36).substring(2, 15)}`,
          data.content,
          data.vector,
          data.category,
          new Date(),
          new Date(),
        ],
      )
    },
  },
  $disconnect: async () => {
    // No-op since we're not using Prisma
  },
}
