"use client"

/**
 * The visitor's session: Clerk says *who* (in the browser, so pages stay static), `/api/me`
 * and `/api/me/bookings` say *what we know about them*. Replaces the design phase's localStorage
 * demo session with a `{ user, bookings }` shape, so the components barely changed.
 */
import { useAuth, useClerk, useUser } from "@clerk/nextjs"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { meKeys } from "@/constants/query-keys"
import { apiFetch } from "@/lib/api-client"
import { cropPhoto } from "@/lib/browser-storage"
import type { BookingDto, BookingStatusDto } from "@/services/booking.service"
import type { MeDto } from "@/services/user.service"

export type SessionUser = MeDto
export type SessionBooking = BookingDto
export type BookingStatus = BookingStatusDto

export function initials(u: Pick<SessionUser, "name" | "email">): string {
  return (
    (u.name || u.email || "")
      .replace(/[0-9+()]/g, "")
      .trim()
      .split(/[\s._-]+/)
      .slice(0, 2)
      .map((w) => w.charAt(0))
      .join("")
      .toUpperCase() || "?"
  )
}

export function useSession() {
  const { isLoaded, isSignedIn, userId } = useAuth()
  const { user: clerkUser } = useUser()
  const enabled = !!isSignedIn && !!userId
  const me = useQuery({ queryKey: meKeys.profile(userId ?? ""), queryFn: () => apiFetch<MeDto>("/api/me"), enabled })
  const bookings = useQuery({ queryKey: meKeys.bookings(userId ?? ""), queryFn: () => apiFetch<BookingDto[]>("/api/me/bookings"), enabled })

  // Google & co. give the Clerk account a picture; an uploaded photo wins
  const fallbackPhoto = clerkUser?.hasImage ? clerkUser.imageUrl : null
  const user: SessionUser | null = enabled && me.data ? { ...me.data, photo: me.data.photo ?? fallbackPhoto } : null

  return {
    /** Clerk has answered (and, when signed in, the profile has loaded or failed) */
    loaded: isLoaded && (!enabled || !me.isPending),
    signedIn: !!isSignedIn,
    userId: userId ?? null,
    user,
    bookings: bookings.data ?? [],
  }
}

export function useAccountActions() {
  const qc = useQueryClient()
  const clerk = useClerk()
  const { userId } = useAuth()
  const setMe = (me: MeDto) => userId && qc.setQueryData(meKeys.profile(userId), me)

  const update = useMutation({
    mutationFn: (body: FormData | Record<string, unknown>) =>
      apiFetch<MeDto>("/api/me", body instanceof FormData ? { method: "PATCH", body } : { method: "PATCH", json: body }),
    onSuccess: setMe,
  })
  const photo = useMutation({
    mutationFn: async (file: File) => {
      const fd = new FormData()
      fd.set("photo", new File([await cropPhoto(file)], "photo.jpg", { type: "image/jpeg" }))
      return apiFetch<MeDto>("/api/me/photo", { method: "POST", body: fd })
    },
    onSuccess: setMe,
  })
  const remove = useMutation({
    mutationFn: () => apiFetch<{ deleted: true }>("/api/me", { method: "DELETE" }),
    onSuccess: async () => {
      qc.removeQueries({ queryKey: meKeys.all })
      await clerk.signOut().catch(() => {}) // the Clerk user is already gone
    },
  })

  return {
    updateProfile: update.mutateAsync,
    uploadPhoto: photo.mutateAsync,
    deleteAccount: remove.mutateAsync,
    signOut: async (redirectUrl?: string) => {
      qc.removeQueries({ queryKey: meKeys.all })
      await clerk.signOut(redirectUrl ? { redirectUrl } : undefined)
    },
    refreshBookings: () => (userId ? qc.invalidateQueries({ queryKey: meKeys.bookings(userId) }) : undefined),
    refreshProfile: () => (userId ? qc.invalidateQueries({ queryKey: meKeys.profile(userId) }) : undefined),
  }
}
