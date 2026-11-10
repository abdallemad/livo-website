/**
 * The ONLY Next config file (CLAUDE.md §4.3, §16 — never add a second next.config.*).
 * Static/ISR-first: every public page is prerendered for each locale (/en, /fr, /de).
 */

// Old prototype URLs (about.html, services.html#plumbing…) keep working: 308 to the clean path,
// then src/proxy.ts adds the visitor's locale.
const LEGACY_PAGES = "about|account|auth|contact|faq|join|privacy|refund|review|services|terms"

const r2Configured = !!(process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY && process.env.R2_BUCKET_NAME)

/** A real public host for the bucket (r2.dev / custom domain) — not the S3 API endpoint, which needs signed requests. */
function publicImageHost() {
  const raw = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.trim().replace(/\/+$/, "")
  if (!raw) return null
  try {
    return new URL(raw).hostname.endsWith(".r2.cloudflarestorage.com") ? null : raw
  } catch {
    return null
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  expireTime: 3600,
  experimental: {
    cpus: 2,
    staticGenerationMaxConcurrency: 2,
    // keep in sync with MAX_REQUEST_BODY in src/constants/upload.ts (multipart forms with documents)
    proxyClientMaxBodySize: "40mb",
  },
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: `/:page(${LEGACY_PAGES}).html`, destination: "/:page", permanent: true },
    ]
  },
  async rewrites() {
    if (!r2Configured || process.env.ASSETS_FROM_R2 === "0") return []
    // The design's image paths (components AND CSS url()s) stay `/img/...`; they are served from
    // Cloudflare R2 (`static/img/...`, uploaded by `npm run assets:upload`). beforeFiles wins over
    // the local copies in public/img, which remain only as the upload source and an offline fallback
    // (ASSETS_FROM_R2=0).
    const host = publicImageHost()
    return {
      beforeFiles: [{ source: "/img/:path*", destination: host ? `${host}/static/img/:path*` : "/api/images/static/img/:path*" }],
    }
  },
}

export default nextConfig
