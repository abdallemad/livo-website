# Admin dashboard (`/admin`)

Built with **shadcn/ui (base-nova, on Base UI)** + Tailwind v4, in its own root layout
(`src/app/admin/layout.tsx`, styles `src/app/admin/admin.css`) — the storefront's designer CSS never
loads here and the admin CSS never loads on the storefront. LIVO navy sidebar, violet primary.

## Who can open it

`ADMIN_EMAIL` in `.env` (comma-separate several). On sign-in (`/auth-callback` → `syncUserWithDatabase`)
a user whose **Clerk-verified primary email** is in that list gets `role = ADMIN`. The editable
profile email never counts. Promotion only: removing an email from the list does not demote anyone.

To open it: sign in on the website (`/en/auth`) with that email, then go to `/admin`.
Anyone else — signed out, customer, professional — gets the site's normal **404** (never 403 or a
redirect, so the dashboard's existence is not revealed).

Three independent checks (CLAUDE.md §5):

1. `src/proxy.ts` — no session or not admin → rewrite to the localized 404.
2. `src/app/admin/layout.tsx` — `requireAdmin()` or `notFound()`.
3. Every function in `src/services/admin.service.ts` and every `/api/admin/*` route calls `requireAdmin()`.

## Structure

The sidebar mirrors the data model (`prisma/schema.prisma`); it is defined once in
`src/constants/admin-nav.ts`.

| Group | Page | Route | Model |
|---|---|---|---|
| Dashboard | Overview | `/admin` | counts + latest bookings / provider requests |
| Operations | Bookings | `/admin/operations/bookings` (+ `/[id]`) | `Booking` — filter by status, search, photos |
| | Provider requests | `/admin/operations/provider-requests` (+ `/[id]`) | `ProviderRequest` — profile, contact, documents |
| People | Users | `/admin/people/users` | `User` — filter by role |
| Feedback | Reviews | `/admin/feedback/reviews` | `Review` — to approve / approved |
| | Messages | `/admin/feedback/messages` | `ContactMessage` — topic, not handled, attachments |
| Catalogue | Services · Categories · Hero slides · Towns | `/admin/catalog/*` | `Service`, `ServiceCategory`, `HeroSlide`, `Town` (inactive rows included) |
| Storage | Media | `/admin/storage/media` | `File` — by kind, size per kind |

Private files (provider documents, booking/review photos, contact attachments) open through
`GET /api/admin/files/:id` (admin only; images and PDFs inline in a sandbox, others download).

Code map:

```
src/app/admin/                  layout, pages (Server Components; edit pages under catalog/*/[id]/edit)
src/components/admin/actions/   PatchSelect, PatchSwitch, ActionButton, ConfirmDelete, NoteEditor (client)
src/components/admin/catalog/   ServiceEditForm, CategoryEditForm, TownsManager (react-hook-form + Zod)
src/services/admin-actions.service.ts   admin writes and their rules
src/hooks/use-admin.ts          useAdminAction (useMutation → toast → router.refresh)
src/components/admin/layout/    AdminSidebar, AdminHeader (client: active link, breadcrumb)
src/components/admin/shared/    PageHeader, StatCard, StatusBadge, ListToolbar, Pagination, EmptyState, DetailList, FileLink
src/components/ui/              shadcn primitives (npx shadcn@4.23.0 add <name>)
src/services/admin.service.ts   admin reads → DTOs (each starts with requireAdmin)
src/repositories/admin.repository.ts   the Prisma queries
src/utils/admin-format.ts       dates (Europe/Luxembourg), bytes, list URLs
```

Lists keep filters, search and page in the URL (`?status=RECEIVED&q=…&page=2`) — plain links and
GET forms, no client state.

## Actions

Every control writes immediately through an `/api/admin/*` Route Handler: **authorise**
(`requireAdmin()`, before the body is read) → **validate** (`schemas/admin.schema.ts`) → **delegate**
(`services/admin-actions.service.ts`, which checks admin again). The client side is one hook,
`hooks/use-admin.ts` (TanStack `useMutation` → toast → `router.refresh()`), used by the controls in
`components/admin/actions/controls.tsx` and the forms in `components/admin/catalog/`.

| Where | Action | Route | Rules |
|---|---|---|---|
| Bookings list / detail | change status | `PATCH /api/admin/bookings/:id { status }` | MATCHED / SCHEDULED need an assigned provider |
| Booking detail | assign / unassign provider | `{ providerId \| null }` | must be a `PRO` account |
| Booking detail | internal note | `{ adminNote }` | admins only |
| Provider requests list / detail | status; Start review / Approve / Reject | `PATCH /api/admin/provider-requests/:id { status }` | approve/reject stamp `reviewedAt`; **Approve turns a linked customer account into `PRO`** (same transaction); a guest request creates no account |
| Provider request detail | internal note | `{ adminNote }` | |
| Users | change role | `PATCH /api/admin/users/:id { role }` | not your own role; never the last admin. An `ADMIN_EMAIL` user demoted here is promoted again at their next sign-in — remove the email from `.env` too |
| Reviews | approve / hide, delete | `PATCH { isApproved }`, `DELETE /api/admin/reviews/:id` | delete also removes its photos from R2 |
| Messages | handled / not handled, delete | `PATCH { isHandled }`, `DELETE /api/admin/messages/:id` | delete also removes attachments from R2 |
| Services | visible, featured, edit (emoji, category, position, name / description / sub-services in EN·FR·DE) | `PATCH /api/admin/services/:id` | English required; empty FR/DE fall back to English; the slug never changes |
| Categories | visible, edit (emoji, names, gradient, position) | `PATCH /api/admin/categories/:id` | |
| Hero slides | visible | `PATCH /api/admin/slides/:id` | |
| Towns | add, rename, visible, delete | `POST /api/admin/towns`, `PATCH` / `DELETE /api/admin/towns/:id` | names are unique |

Schema additions for these actions: `prisma/sql/2026-11-10-admin-fields.sql` (`Booking.providerId`,
`Booking.adminNote`, `ProviderRequest.adminNote`, `ProviderRequest.reviewedAt`).

### Catalogue edits and the website

Catalogue changes are live in the API (`/api/services`, `/api/categories`, `/api/slides`,
`/api/towns`) — so in the mobile app — right away. **The website pages still render the design's
data files** (`src/data/*.ts`, built statically), so they do not change yet. Making the storefront
read the catalogue from the database at build/ISR time is the next step; `revalidateStorefront()` is
already called after every catalogue write for that moment.

### Not built yet

- uploading a new service icon / image or category banner (images stay the seeded R2 ones)
- creating or deleting services and categories (edit and hide only)
- reordering by drag and drop (use the Position field)
- an activity log of admin changes
