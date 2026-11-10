/**
 * What the sign-up form collects beyond Clerk's own fields (account type, phone, address, and —
 * for professionals — the provider request with its documents). Clerk creates the account; these
 * extras are kept in IndexedDB (files included) until the visitor is signed in, then
 * `SessionSync` sends them to PATCH /api/me and POST /api/provider-requests. IndexedDB survives the
 * full-page hop through /auth-callback, which memory and sessionStorage (no files) would not.
 */
const DB = "livo"
const STORE = "pending"
const KEY = "signup"

export interface PendingSignup {
  fields: Record<string, string | string[]>
  files: [field: string, file: File][]
  at: number
}

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1)
    req.onupgradeneeded = () => req.result.createObjectStore(STORE)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function tx<T>(mode: IDBTransactionMode, run: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await open()
  return new Promise<T>((resolve, reject) => {
    const req = run(db.transaction(STORE, mode).objectStore(STORE))
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  }).finally(() => db.close())
}

export async function savePendingSignup(form: HTMLFormElement, skip: string[]) {
  const fields: PendingSignup["fields"] = {}
  const files: PendingSignup["files"] = []
  new FormData(form).forEach((v, k) => {
    if (skip.includes(k)) return
    if (typeof v === "string") fields[k] = k in fields ? ([] as string[]).concat(fields[k], v) : v
    else if (v.size) files.push([k, v])
  })
  try {
    await tx("readwrite", (s) => s.put({ fields, files, at: Date.now() } satisfies PendingSignup, KEY))
  } catch {
    /* storage blocked: the account still gets created, the extras are lost */
  }
}

/** Read and remove (one shot). Ignores entries older than a day. */
export async function takePendingSignup(): Promise<PendingSignup | null> {
  try {
    const v = await tx<PendingSignup | undefined>("readonly", (s) => s.get(KEY))
    if (!v) return null
    await tx("readwrite", (s) => s.delete(KEY))
    return Date.now() - v.at < 86_400_000 ? v : null
  } catch {
    return null
  }
}
