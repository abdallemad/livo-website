"use client"

import { useSyncExternalStore } from "react"

/**
 * The current `location.hash` ("" on the server). Tabs (/contact#complaint, /auth#signup) and the
 * active nav link depend on it. Next's <Link> changes the hash with history.pushState, which fires
 * no "hashchange", so pushState/replaceState are wrapped once to notify subscribers too.
 */
const EVENT = "livo:location"
let patched = false

function patchHistory() {
  if (patched || typeof window === "undefined") return
  patched = true
  for (const method of ["pushState", "replaceState"] as const) {
    const original = history[method].bind(history)
    history[method] = (...args: Parameters<History["pushState"]>) => {
      original(...args)
      // defer: Next calls these during render commits; listeners may set state
      queueMicrotask(() => window.dispatchEvent(new Event(EVENT)))
    }
  }
}

function subscribe(cb: () => void) {
  patchHistory()
  window.addEventListener("hashchange", cb)
  window.addEventListener("popstate", cb)
  window.addEventListener(EVENT, cb)
  return () => {
    window.removeEventListener("hashchange", cb)
    window.removeEventListener("popstate", cb)
    window.removeEventListener(EVENT, cb)
  }
}

export function useLocationHash(): string {
  return useSyncExternalStore(
    subscribe,
    () => window.location.hash,
    () => "",
  )
}
