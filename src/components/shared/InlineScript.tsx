"use client"

/**
 * A script that runs while the HTML is parsed (before first paint) on hard navigations only.
 * A Client Component on purpose: on the client it renders as inert `text/plain`, so React does
 * not warn about rendering a <script> (e.g. when the locale changes and the root layout re-renders).
 * See node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md.
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
