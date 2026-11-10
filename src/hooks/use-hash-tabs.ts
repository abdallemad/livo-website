"use client"

import { useCallback, useEffect, useState } from "react"
import { useLocationHash } from "./use-location-hash"

/**
 * Tabs that live in the URL hash (/contact#complaint, /auth#signup), like the prototype's
 * pages.js `tabs()`: the hash selects the tab on load and on navigation, and clicking a tab
 * replaces the hash without adding a history entry. Renders `fallback` on the server.
 */
export function useHashTabs<T extends string>(valid: readonly T[], fallback: T): [T, (t: T) => void] {
  const hash = useLocationHash().slice(1)
  const [tab, setTab] = useState<T>(fallback)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the URL hash is the source of truth
    if ((valid as readonly string[]).includes(hash)) setTab(hash as T)
  }, [hash, valid])

  const select = useCallback((t: T) => {
    setTab(t)
    history.replaceState(history.state, "", `#${t}`)
  }, [])

  return [tab, select]
}
