"use client"

/**
 * Opens the booking chat from anywhere.
 *
 * Server-rendered markup opts in declaratively with `data-chat` (empty = ask for the service,
 * a service id = preselect it, "any" = free-text request, "free-inspection"), exactly like the
 * prototype — so buttons inside Server Components need no client code. Client code can call
 * `useChat().openChat(preset)` directly.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { BookingChat, type ChatPreset } from "@/components/chat/BookingChat"

interface ChatContextValue {
  openChat: (preset?: ChatPreset) => void
  closeChat: () => void
}

const ChatContext = createContext<ChatContextValue | null>(null)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<{ id: number; preset: ChatPreset } | null>(null)
  const seq = useRef(0)

  const openChat = useCallback((preset: ChatPreset = "") => setSession({ id: ++seq.current, preset }), [])
  const closeChat = useCallback(() => setSession(null), [])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element).closest?.<HTMLElement>("[data-chat]")
      if (!el) return
      e.preventDefault()
      openChat(el.dataset.chat ?? "")
    }
    // service cards and marquee items are focusable "buttons"
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter") return
      const el = (e.target as Element).closest?.<HTMLElement>(".sc,.mq-i")
      if (el && e.target === el) openChat(el.dataset.chat ?? "")
    }
    document.addEventListener("click", onClick)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("click", onClick)
      document.removeEventListener("keydown", onKey)
    }
  }, [openChat])

  const value = useMemo(() => ({ openChat, closeChat }), [openChat, closeChat])
  return (
    <ChatContext.Provider value={value}>
      {children}
      <BookingChat session={session} onClose={closeChat} />
    </ChatContext.Provider>
  )
}

export function useChat(): ChatContextValue {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error("useChat must be used inside <ChatProvider>")
  return ctx
}
