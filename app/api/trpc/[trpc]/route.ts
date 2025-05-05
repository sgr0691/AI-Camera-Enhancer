import { fetchRequestHandler } from "@trpc/server/adapters/fetch"
import { appRouter } from "@/server/api/root"
import { createTRPCContext } from "@/server/api/trpc"

export const runtime = "nodejs"

export async function GET(req: Request) {
  return handleRequest(req)
}

export async function POST(req: Request) {
  return handleRequest(req)
}

async function handleRequest(req: Request) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createTRPCContext({ req: req as unknown as NextRequest }),
  })
}

import type { NextRequest } from "next/server"
