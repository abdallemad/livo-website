#!/usr/bin/env node
/**
 * Applies the idempotent SQL files in prisma/sql/ before `next build` (CLAUDE.md §6).
 *
 * - Uses DIRECT_URL (Neon: the non-pooler host) for schema commands, else DATABASE_URL.
 * - Refuses a DIRECT_URL that points at a different database than DATABASE_URL.
 * - Refuses any file that is not additive (DROP / TRUNCATE / anything touching "public"):
 *   the database also hosts an unrelated schema in "public" that this app must never change.
 * - Skips cleanly when no database is configured (e.g. lint-only CI jobs) unless REQUIRE_DB=1.
 *
 * - Applies each file ONCE, recorded in "livo"."_migrations" (renames cannot be re-run safely).
 *
 * Add new files to `migrationFiles` in date order. Never edit a file that already shipped.
 */
/* eslint-disable @typescript-eslint/no-require-imports -- plain CommonJS run by node before the build */
const { execFileSync } = require("node:child_process")
const fs = require("node:fs")
const path = require("node:path")

const migrationFiles = ["2026-11-09-init.sql", "2026-11-09-bookings.sql", "2026-11-09-provider-requests.sql", "2026-11-10-admin-fields.sql", "2026-11-10-featured-order.sql"]

const root = path.join(__dirname, "..")

function loadEnv() {
  for (const f of [".env", ".env.local"]) {
    const p = path.join(root, f)
    if (fs.existsSync(p)) process.loadEnvFile?.(p)
  }
}

function dbIdentity(url) {
  const u = new URL(url)
  return `${u.hostname.replace("-pooler", "")}/${u.pathname.replace(/^\//, "")}`
}

async function main() {
  loadEnv()
  const pooled = process.env.DATABASE_URL
  const direct = process.env.DIRECT_URL
  if (!pooled && !direct) {
    if (process.env.REQUIRE_DB === "1") throw new Error("[prebuild-db] DATABASE_URL is not set")
    console.log("[prebuild-db] no database configured — skipping migrations")
    return
  }
  if (pooled && direct && dbIdentity(pooled) !== dbIdentity(direct)) {
    throw new Error("[prebuild-db] DIRECT_URL and DATABASE_URL point at different databases — refusing to migrate")
  }
  const url = direct || pooled

  const { PrismaClient } = require("@prisma/client")
  const db = new PrismaClient({ datasourceUrl: url })
  try {
    await db.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "livo"`)
    await db.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "livo"."_migrations" ("name" TEXT PRIMARY KEY, "appliedAt" TIMESTAMPTZ NOT NULL DEFAULT now())`)
    const done = new Set((await db.$queryRawUnsafe(`SELECT "name" FROM "livo"."_migrations"`)).map((r) => r.name))
    for (const file of migrationFiles) {
      if (done.has(file)) continue
      apply(file, url)
      await db.$executeRawUnsafe(`INSERT INTO "livo"."_migrations" ("name") VALUES ($1) ON CONFLICT DO NOTHING`, file)
    }
  } finally {
    await db.$disconnect()
  }
  console.log("[prebuild-db] schema up to date")
}

function apply(file, url) {
  {
    const full = path.join(root, "prisma", "sql", file)
    const sql = fs.readFileSync(full, "utf8")
    const code = sql.replace(/--.*$/gm, "")
    if (/\b(DROP|TRUNCATE)\b/i.test(code) || /"public"\s*\./i.test(code)) {
      throw new Error(`[prebuild-db] ${file} is not additive or touches "public" — refusing`)
    }
    console.log(`[prebuild-db] applying ${file}`)
    try {
      // the URL goes through the environment, never argv: it holds the password and its `&`
      // would split the command on Windows shells
      execFileSync("npx", ["prisma", "db", "execute", "--file", full, "--schema", "prisma/schema.prisma"], {
        cwd: root,
        env: { ...process.env, DATABASE_URL: url },
        stdio: ["ignore", "inherit", "inherit"],
        shell: process.platform === "win32",
      })
    } catch {
      throw new Error(`[prebuild-db] ${file} failed (see the Prisma output above)`)
    }
  }
}

main().catch((e) => {
  console.error(e.message ?? e)
  process.exit(1)
})
