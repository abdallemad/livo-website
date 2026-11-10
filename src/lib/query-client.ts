/**
 * TanStack Query client (CLAUDE.md §2.1): a new client per request on the server, one reused
 * client in the browser.
 */
import { QueryClient, isServer } from "@tanstack/react-query"

function make() {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: 30_000, gcTime: 5 * 60_000, retry: 1, refetchOnWindowFocus: false },
      mutations: { retry: 0 },
    },
  })
}

let browserClient: QueryClient | undefined

export function getQueryClient() {
  if (isServer) return make()
  return (browserClient ??= make())
}
