"use client"

/**
 * Conditional form blocks (prototype: `[data-when="field:value,value"]` in pages.js).
 * A hidden block is also disabled, otherwise its `required` fields would block the submit.
 * Nested blocks are hidden when their parent is.
 */
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react"

interface WatchValue {
  values: Record<string, string>
  visible: boolean
}

const WatchContext = createContext<WatchValue>({ values: {}, visible: true })

/**
 * Tracks the current value of the watched fields of the surrounding form.
 * Returns the provider-props and an `onChange` / `onReset` pair to put on the <form>.
 */
export function useWatchedFields(fields: string[], initial: Record<string, string> = {}) {
  const [values, setValues] = useState<Record<string, string>>(initial)
  const read = useCallback(
    (form: HTMLFormElement) => {
      const next: Record<string, string> = {}
      for (const f of fields) {
        const el = form.elements.namedItem(f) as HTMLInputElement | RadioNodeList | null
        next[f] = el && "value" in el ? el.value : ""
      }
      setValues(next)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- field list is static per form
    [],
  )
  return {
    values,
    formProps: {
      onChange: (e: React.FormEvent<HTMLFormElement>) => read(e.currentTarget),
      // the browser clears the fields only after the reset event
      onReset: (e: React.FormEvent<HTMLFormElement>) => {
        const form = e.currentTarget
        setTimeout(() => read(form), 0)
      },
    },
  }
}

export function WatchProvider({ values, children }: { values: Record<string, string>; children: ReactNode }) {
  return <WatchContext.Provider value={{ values, visible: true }}>{children}</WatchContext.Provider>
}

export function When({ field, is, className, children }: { field: string; is: string[]; className?: string; children: ReactNode }) {
  const parent = useContext(WatchContext)
  const on = parent.visible && is.includes(parent.values[field] ?? "")
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const box = ref.current
    if (!box) return
    // only this block's own fields; nested blocks manage theirs (their `on` already includes ours)
    box.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("input,select,textarea").forEach((el) => {
      if (el.closest("[data-when]") === box) el.disabled = !on
    })
  }, [on])

  return (
    <WatchContext.Provider value={{ values: parent.values, visible: on }}>
      <div ref={ref} className={className} data-when={`${field}:${is.join(",")}`} hidden={!on}>
        {children}
      </div>
    </WatchContext.Provider>
  )
}
