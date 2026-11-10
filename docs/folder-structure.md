# Folder structure & decisions

Follows CLAUDE.md §3, with two project-specific decisions recorded here.

```
src/
├── proxy.ts                  # clerkMiddleware + locale routing: / → /en|/fr|/de (cookie → Accept-Language)
├── app/
│   ├── globals.css           # design system entry (see design-system.md)
│   ├── sitemap.ts robots.ts icon.png
│   ├── api/                  # Route Handlers shared with the mobile app (docs/backend.md)
│   ├── auth-callback/        # Clerk → database user sync, then redirect
│   ├── admin/                # admin dashboard — own root layout + shadcn CSS (docs/admin.md)
│   └── [lang]/               # root layout per locale (en, fr, de — all prerendered)
│       ├── layout.tsx        # <html lang>, providers, boot script — reads nothing from the request
│       ├── not-found.tsx  [...rest]/
│       ├── (marketing)/      # full shell: header, footer, floating actions — revalidate 3600
│       │   ├── page.tsx (home) services/ about/ join/ contact/ faq/
│       │   ├── auth/[[...step]]/ account/   # noindex (Clerk Elements steps live under /auth)
│       │   └── privacy/ terms/ refund/
│       └── (focus)/review/   # minimal shell (logo + language), noindex
├── components/
│   ├── layout/ chat/ home/ services/ pages/ forms/ shared/ providers/
│   ├── admin/ (layout, shared)  ui/ (shadcn primitives, admin only)
├── services/ repositories/ schemas/   # backend layers (CLAUDE.md §2)
├── data/                     # services.ts, home.ts, languages.ts — the catalogue the pages render + the DB seed
├── i18n/                     # config, translate (t / pick / localePath), server helpers
├── hooks/                    # use-session (Clerk + /api/me), use-location-hash, use-hash-tabs
├── lib/                      # db, r2, api, errors, api-client, query-client, pending-signup, site-url
├── constants/site.ts         # brand identity — the only place it lives
├── utils/                    # services lookups, seo-metadata (pure)
└── styles/livo/              # designer CSS, verbatim
```

## Decision 1 — i18n by route prefix

The prototype switched EN/FR/DE in the browser. Here each language is its own prerendered URL
(`/en/services`, `/fr/services`…): no client-side text swapping, every language indexable with
hreflang alternates, and still 100% static. Strings stay inline next to their translations —
`t("English", "Français", "Deutsch")` — exactly as the prototype kept them (`data-fr`/`data-de`),
so copy review stays local to each page. A missing translation falls back to English.

The language switch keeps the path + hash and remembers the choice in the `livo-lang` cookie.
Old prototype URLs (`about.html`, `services.html#plumbing`) 308-redirect to the clean path.

## Decision 2 — one backend for web and mobile: Route Handlers

As agreed, the backend exposes **Route Handlers under `src/app/api/`** (shared with the mobile app)
instead of Server Actions; the layers below them (services → repositories → Prisma) stay as in
CLAUDE.md §2. Everything that was preview-only in the design phase is now real:

| Design phase | Now |
|---|---|
| localStorage demo session | Clerk session + `/api/me`, `/api/me/bookings` (`hooks/use-session.ts`) |
| booking chat → event | summary + **Confirm booking** → `POST /api/bookings` (creates the `Booking`) |
| join form / pro sign-up | `POST /api/provider-requests` (creates the `ProviderRequest` + documents) |
| contact, review forms | `POST /api/contact`, `POST /api/reviews` (`components/forms/SiteForm.tsx`) |
| `data/services.ts` | still what the static pages render; also the seed of the `Service` tables the API serves |

The pages keep rendering the catalogue from `src/data` at build time (static, no DB round trip, and
identical to the design). Moving them to read the database at build/ISR time is a separate step.

## Decision 3 — the database is shared

The Neon database also contains an older marketplace schema in `public`. All LIVO tables are in the
`livo` Postgres schema (`@@schema("livo")` on every model) — see docs/backend.md.
