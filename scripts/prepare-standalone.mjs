/**
 * After `next build` with `output: "standalone"`: copy the assets the standalone server does not
 * bundle (.next/static and public/) next to server.js, then assert the output is runnable.
 * See CLAUDE.md §10.
 */
import { cpSync, existsSync } from "node:fs"
import { join } from "node:path"

const root = process.cwd()
const standalone = join(root, ".next", "standalone")

if (!existsSync(join(standalone, "server.js"))) {
  console.error("[prepare-standalone] .next/standalone/server.js is missing — is output: 'standalone' set?")
  process.exit(1)
}

cpSync(join(root, ".next", "static"), join(standalone, ".next", "static"), { recursive: true })
if (existsSync(join(root, "public"))) cpSync(join(root, "public"), join(standalone, "public"), { recursive: true })

console.log("[prepare-standalone] copied .next/static and public/ into .next/standalone")
