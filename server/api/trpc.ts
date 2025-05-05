import { initTRPC } from "@trpc/server"
import type { NextRequest } from "next/server"
import superjson from "superjson"

interface CreateContextOptions {
  headers: Headers
}

export const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    headers: opts.headers,
  }
}

export const createTRPCContext = async (opts: { req: NextRequest }) => {
  return createInnerTRPCContext({
    headers: opts.req.headers,
  })
}

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape
  },
})

export const createTRPCRouter = t.router
export const publicProcedure = t.procedure
