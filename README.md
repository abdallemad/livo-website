# LIVO — web app

Home & daily services in Luxembourg. Next.js 16 (App Router) storefront built pixel-for-pixel
from the designer's prototype, trilingual (EN / FR / DE), fully statically generated, with a
backend shared with the mobile app: Postgres (Neon) + Prisma, Route Handlers under `/api/*`,
Clerk auth (Elements, in the design), Cloudflare R2 storage.

## Run

```bash
npm install            # also runs prisma generate
cp .env.example .env   # fill in DB, Clerk, R2
npm run db:migrate     # create / update the "livo" schema
npm run assets:upload  # images → R2
npm run db:seed        # catalogue → DB
npm run dev            # http://localhost:3000 → redirects to /en, /fr or /de
```

| Script | |
|---|---|
| `npm run dev` | dev server |
| `npm run build` | applies pending migrations, then `next build --webpack` + standalone output |
| `npm run db:migrate` / `db:seed` / `assets:upload` | see [docs/backend.md](docs/backend.md) |
| `npm start` | run the standalone build (`node .next/standalone/server.js`) |
| `npm run lint` / `npm run typecheck` | ESLint 9 / `tsc --noEmit` |

## Docs

- [CLAUDE.md](CLAUDE.md) — architecture rules (layers, rendering, SEO, deploy)
- [docs/design-system.md](docs/design-system.md) — tokens, CSS, component vocabulary
- [docs/folder-structure.md](docs/folder-structure.md) — structure, i18n routing
- [docs/backend.md](docs/backend.md) — API endpoints, data model, auth, storage, migrations
- [docs/admin.md](docs/admin.md) — admin dashboard (`/admin`): access, sidebar, structure

## Pages

`/` · `/services` · `/about` · `/join` · `/contact` (`#general` `#inquiry` `#complaint`) · `/faq` ·
`/auth` (`#signup`) · `/account` · `/review?service=…&ref=…` · `/privacy` · `/terms` · `/refund` —
each under `/en`, `/fr`, `/de`. Admin dashboard: `/admin` (sign in with an `ADMIN_EMAIL` address).
