import { neon, neonConfig } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

// Optional: Set Neon config
neonConfig.fetchConnectionCache = true

// Create SQL client
const sql = neon(process.env.DATABASE_URL!)

// Create database client
export const db = drizzle(sql)

// Helper function for raw SQL queries
export async function executeQuery(query: string, params: any[] = []) {
  try {
    return await sql(query, params)
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}
