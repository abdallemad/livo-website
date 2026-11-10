/**
 * The one PrismaClient (CLAUDE.md §2). Kept on globalThis in every environment — production
 * included — so separately bundled server chunks share a single pool instead of each opening one.
 * Only repositories import this.
 */
import "server-only"
import { PrismaClient } from "@prisma/client"
import { getDatabaseUrl } from "./database-url"

const globalForPrisma = globalThis as unknown as { __livoPrisma?: PrismaClient }

export const db =
  globalForPrisma.__livoPrisma ??
  new PrismaClient({
    datasourceUrl: getDatabaseUrl(),
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  })

globalForPrisma.__livoPrisma = db
