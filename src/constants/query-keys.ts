/** Central query-key factories (CLAUDE.md §2.1). */
export const meKeys = {
  all: ["me"] as const,
  profile: (userId: string) => ["me", userId, "profile"] as const,
  bookings: (userId: string) => ["me", userId, "bookings"] as const,
}
