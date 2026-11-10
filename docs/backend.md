# Backend — database, API, auth, storage

The web app and the mobile app share one backend: **Route Handlers under `src/app/api/`**
(instead of the Server Actions CLAUDE.md describes). Below them the layers are exactly CLAUDE.md §2:

```
UI / mobile app → /api route (authorise → validate → delegate) → service → repository → Prisma → Postgres
```

| Layer | Where |
|---|---|
| Routes | `src/app/api/**/route.ts`, `src/app/auth-callback/route.ts` — wrapped by `route()` from `lib/api.ts` |
| Validation | `src/schemas/*.schema.ts` (Zod v4, accept JSON **and** multipart form fields) |
| Services | `src/services/*.service.ts` — business rules, DTOs, throw `AppError`s (`lib/errors.ts`) |
| Repositories | `src/repositories/*.repository.ts` — the only Prisma callers |
| Infra | `lib/db.ts` (one PrismaClient), `lib/database-url.ts` (pool settings), `lib/r2.provider.ts`, `lib/api.ts` |
| Browser side | `lib/api-client.ts` (`apiFetch`, `ApiError`), `hooks/use-session.ts` (TanStack Query) |

## Response envelope

Every route answers `{ "success": true, "data": … }` or
`{ "success": false, "error": "…", "code": "VALIDATION", "fieldErrors": { "phone": ["…"] } }` with the
matching status (401 / 403 / 404 / 409 / 413 / 422; 500 = generic message, cause logged server-side).
Non-GET requests from a browser on another site are refused (Origin check); native apps send no Origin.

## Endpoints

Auth: **web** = Clerk session cookie, **mobile** = `Authorization: Bearer <Clerk session token>`
(both resolved by `clerkMiddleware` in `src/proxy.ts`).

| Method & path | Auth | What |
|---|---|---|
| `GET /api/categories` | – | visible categories (`{ id, emoji, name{en,fr,de}, colors, banner }`) |
| `GET /api/services?category=&featured=1` | – | visible services (same shape as `src/data/services.ts` + `icon`, `image` URLs) |
| `GET /api/services/:slug` | – | one service |
| `GET /api/slides` · `GET /api/towns` | – | home slides · towns for the address step |
| `POST /api/bookings` | optional | **create a booking — call it when the customer confirms the summary**. Fields: `service` (slug) or `customService`, `date` (`YYYY-MM-DD` / `ASAP`), `time`, `name`, `address`, `phone`, `contact` (whatsapp/phone/email), `email`, `locale`, files `photos` (≤ 12 images). → `201 { ref: "LV-4821", status, … }` |
| `POST /api/provider-requests` | optional | **"become a provider"** — `first`, `last`, `phone`, `email`, `service`, address fields, `langs[]`, `experience`, `about`, `has_car`, `id_type`, `licence_type`, `authorized`, documents `id_front`, `id_back`, `passport_page`, `authorization_front/back`, `licence_front/back`, `cv`. A signed-in caller is linked and becomes `PRO`. |
| `POST /api/contact` | optional | contact form (`topic` general/inquiry/complaint, `name`, `email`, `message`, `consent`, file `file`) |
| `POST /api/reviews` | optional | `rating` 1–5, `details` (JSON), `recommend`, `tags[]`, `comment`, `publish`, `ref`, `service`, files `photos` |
| `GET /api/me` · `PATCH /api/me` · `DELETE /api/me` | required | profile · update "My details" (only the keys sent) · delete account + bookings + Clerk user |
| `POST /api/me/photo` | required | multipart `photo` → new avatar |
| `GET /api/me/bookings` | required | my bookings, newest first |
| `POST /api/auth/sync` | required | mobile: create/complete the DB user after sign-in (body `{ locale }`) |
| `/api/admin/*` | **admin** | dashboard writes (bookings, provider requests, users, reviews, messages, catalogue) and private file viewing — see [docs/admin.md](admin.md) |
| `GET /api/images/<key>` | – | streams **public** R2 objects only (`static/…`, `avatars/…`) |
| `GET /auth-callback?next=/fr` | session | web: Clerk redirects here after sign-in/up → DB sync → redirect |

## Data model (`prisma/schema.prisma`)

All tables live in the Postgres schema **`livo`**. The same Neon database also holds an older,
unrelated marketplace schema in `public` (31 tables with data) — the app never reads or changes it,
and `scripts/prebuild-db.cjs` refuses any migration that mentions `"public"`, `DROP` or `TRUNCATE`.

| Model | Purpose |
|---|---|
| `User` | id = Clerk user id; role `CUSTOMER` / `PRO` / `ADMIN`; profile fields of the account page; `photo` |
| `ServiceCategory`, `Service`, `HeroSlide`, `Town` | catalogue, seeded from `src/data/*.ts`; localised copy as JSON `{ en, fr, de }` |
| `Booking` | created only when the customer presses **Confirm booking** (`confirmedAt`); `ref` "LV-1234"; status `RECEIVED → MATCHED → SCHEDULED → DONE` / `CANCELLED`; guest bookings are attached to the account when the same verified email signs up |
| `ProviderRequest` | a user/guest asking to become a provider, with details, languages and documents; status `RECEIVED / IN_REVIEW / APPROVED / REJECTED` |
| `ContactMessage`, `Review` | inbound forms |
| `File` | every object stored in R2 (key, kind, mime, size, sha256, owner link) |

**Migrations** are SQL files in `prisma/sql/`, listed in `scripts/prebuild-db.cjs`, applied once each
(ledger table `livo._migrations`) by `npm run db:migrate` and automatically before `npm run build`.
Write renames by hand (`prisma migrate diff` turns them into drop + create). **Never run
`prisma db push` / `prisma migrate`** against this database: they would try to drop the ledger table
(and, with a wrong schema setting, the `public` tables).

## Storage (Cloudflare R2, private bucket `R2_BUCKET_NAME`)

| Prefix | Content | Served |
|---|---|---|
| `static/img/…` | the design's images (`npm run assets:upload` from `public/img`) | `/img/*` is rewritten to `/api/images/static/img/*` (next.config.mjs) — the design's paths, CSS included, are unchanged |
| `avatars/<userId>/…` | profile photos | `/api/images/avatars/…` |
| `private/bookings/…`, `private/provider-requests/…`, `private/reviews/…`, `private/contact/…` | uploads | never public |

Uploads are checked by magic bytes and size (`constants/upload.ts`) before anything is written.
`NEXT_PUBLIC_R2_PUBLIC_URL` is currently the **S3 API endpoint**, which is not public, so images are
streamed by the app. For faster images, give the bucket a public domain (r2.dev or custom) containing
only public prefixes, set it there, and `/img/*` will be proxied to it directly. `ASSETS_FROM_R2=0`
serves the local `public/img` copies instead.

## Auth (Clerk)

- `@clerk/nextjs@6` + `@clerk/elements@0.24` (Elements needs Clerk Core 2; it is deprecated in Core 3 —
  moving to Core 3 means rewriting the page with Clerk's custom-flow hooks, not a version bump).
- `/<lang>/auth` (log in) and `/<lang>/auth/signup` render the design's page with Elements
  (`components/pages/AuthView.tsx`, see the header comment). `/sign-in` and `/sign-up` redirect there.
- Sign-up extras Clerk does not store (account type, phone, address, the provider request and its
  documents) wait in IndexedDB and are sent after the account exists (`lib/pending-signup.ts`,
  `components/providers/session-sync.tsx`).
- `/auth-callback` → `syncUserWithDatabase()`: race-safe, never merges accounts by email.
- The Clerk instance currently allows **email + password** and **Google** only. The design's
  "Email or phone", the professional "Email (optional)" and the Facebook/Apple buttons need phone
  sign-in / those providers enabled in the Clerk dashboard (Facebook/Apple show a "not available yet"
  note until then). Clerk's own minimum password length applies (the hint says 8).
- Clerk test mode: in the dev instance, `anything+clerk_test@example.com` with code `424242` signs up
  without a real email.

## Scripts

| | |
|---|---|
| `npm run db:migrate` | apply pending `prisma/sql/*.sql` |
| `npm run db:seed` | upsert categories, services, slides, towns from `src/data` (links images when uploaded) |
| `npm run assets:upload` | upload `public/img` to R2 `static/img/…` + `File` rows (skips unchanged) |
