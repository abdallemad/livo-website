import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/** Tailwind class joiner used by the shadcn/ui primitives (admin). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
