import { z } from "zod"
import { contactMethod, locale, optional, optionalEmail, phone, required, serviceSlug } from "./fields"

/** Booking chat answers, sent when the customer confirms (POST /api/bookings). `date` is "YYYY-MM-DD" or "ASAP". */
export const createBookingSchema = z
  .object({
    service: serviceSlug,
    customService: optional(300),
    date: optional(10).refine((v) => !v || v === "ASAP" || /^\d{4}-\d{2}-\d{2}$/.test(v), "Please choose a date."),
    time: optional(40),
    name: required(120),
    address: required(300),
    phone,
    contact: contactMethod,
    email: optionalEmail,
    locale,
  })
  .refine((v) => v.service || v.customService, { message: "Please choose a service.", path: ["service"] })
export type CreateBookingValues = z.infer<typeof createBookingSchema>
