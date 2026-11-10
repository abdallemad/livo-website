# Design system

The storefront reproduces the designer's prototype (`LIVO-website/`, static HTML/CSS/JS) pixel for
pixel. Verified by diffing every element's box between the prototype and the app at 1440px and
375px: all 11 pages match within 1px (only animated values such as the slider progress differ).

## Where things live

| What | Where |
|---|---|
| Designer stylesheets (verbatim, only asset URLs rewritten to `/img`, `/fonts`) | `src/styles/livo/{fonts,livo,pages}.css` |
| Entry point, cascade layers, Tailwind tokens | `src/app/globals.css` |
| Fonts (Sora, DM Sans, "Sora Ghost" outline face — self-hosted, GDPR) | `public/fonts/` |
| Images (icons, service photos, category banners, slides) | `public/img/` |
| Brand identity, contact, socials | `src/constants/site.ts` |

**Do not** edit `src/styles/livo/*.css` casually — they are the source of truth for the look. A new
screen should reuse their classes (`.btn.pk.lg`, `.fcard`, `.fld`, `.sh`/`.gh`, `.pgh`, `.wrap`…);
small adjustments can use Tailwind utilities, which sit in a later cascade layer and win.

## Tokens

Defined on `:root` in `livo.css`, exposed to Tailwind in `globals.css`:

| Token | Value | Tailwind |
|---|---|---|
| `--navy` | `#04123A` | `bg-navy`, `text-navy` |
| `--navy2` | `#0A1F5C` | `*-navy-2` |
| `--violet` | `#7B2FF7` | `*-violet` |
| `--magenta` | `#C42B9B` | `*-magenta` |
| `--coral` | `#FF3D5A` | `*-coral` |
| `--silver` | `#A9AEB8` | `*-silver` |
| `--soft` | `#F3F4FB` | `*-soft` |
| `--muted` | `#4B5680` | `*-muted` |
| `--line` | `#E2E5F3` | `*-line` |
| `--grad` | violet → magenta → coral (110°) | `bg-brand` |
| `--wrap` | `1240px` | `max-w-wrap` |
| `--hh` (header height) | `72px` | `h-header`, `pt-header`… |
| fonts | DM Sans (body), Sora (headings) | `font-sans`, `font-display` |

Tailwind is loaded **without preflight**: the prototype relies on browser defaults (headings, lists,
buttons) plus its own reset, and preflight would change them.

## Component vocabulary (from the prototype)

- Buttons: `.btn` + `p` (navy) · `pk` (gradient) · `s` (secondary) · `gh` (ghost) · `ghost-nav`, sizes `sm` / `lg`
- Section heading: `.sh` with the outline word `.gh` (auto-shrunk to fit by `PageEffects`) and `.sh-in`
- Page header: `.pgh` + `.crumb`
- Cards / forms: `.fcard`, `.fm` (`.g2` two columns, `.full` spans), `.fld`, `.agree`, `.pills`, `.who`, `.fmsg.ok|.err`
- Reveal on scroll: add `.rv` to any block
- Count-up number: `<span class="num" data-n="17">`
- Open the booking chat from any markup: `data-chat=""` (ask), `data-chat="plumbing"` (preselect), `data-chat="any"` (free text), `data-chat="free-inspection"`

## Global states (classes on `<html>`)

- `authed` — signed in (set before paint by the inline boot script, then by the session store)
- `lite` — slow device detected (less motion/blur); force with `?lite=1` / `?lite=0`

## Shared components

`components/layout/` — `SiteHeader` (+ drawer, language switch), `SiteFooter`, `AnimatedBackground`,
`SiteOverlays` (WhatsApp/SOS, mascot, cookie banner, welcome offer), `PageEffects`.
`components/chat/BookingChat` — the request chat. `components/shared/` — `ServiceIcon`, `MascotSvg`, icons.
`components/forms/` — `DemoForm`, `ProFields`, `When` (conditional blocks), `PasswordInput`, `ServiceSelect`.
