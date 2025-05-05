import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export const runtime = "nodejs"

export async function GET() {
  try {
    // Simple query to check if database connection is working
    const result = await executeQuery('SELECT COUNT(*) as "count" FROM "Theme"')

    return NextResponse.json({
      status: "ok",
      message: "Database connection is working correctly",
      themeCount: result[0].count,
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Database connection is not working correctly",
        error: String(error),
      },
      { status: 500 },
    )
  }
}
