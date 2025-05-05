import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

export async function GET() {
  try {
    // Simple query to check if Prisma is working
    const themeCount = await prisma.theme.count()

    return NextResponse.json({
      status: "ok",
      message: "Prisma is working correctly",
      themeCount,
    })
  } catch (error) {
    console.error("Prisma error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Prisma is not working correctly",
        error: String(error),
      },
      { status: 500 },
    )
  }
}
