-- 2026-11-09 — the booking-chat request becomes a real "Booking" (created when the customer
-- confirms the summary). Rename-only: no row is lost. Idempotent: every step checks first.
-- Written by hand — `prisma migrate diff` would drop and recreate the tables instead.

DO $$
BEGIN
  -- table + its constraints and indexes
  IF to_regclass('"livo"."ServiceRequest"') IS NOT NULL AND to_regclass('"livo"."Booking"') IS NULL THEN
    ALTER TABLE "livo"."ServiceRequest" RENAME TO "Booking";
    ALTER TABLE "livo"."Booking" RENAME CONSTRAINT "ServiceRequest_pkey" TO "Booking_pkey";
    ALTER TABLE "livo"."Booking" RENAME CONSTRAINT "ServiceRequest_userId_fkey" TO "Booking_userId_fkey";
    ALTER TABLE "livo"."Booking" RENAME CONSTRAINT "ServiceRequest_serviceId_fkey" TO "Booking_serviceId_fkey";
    ALTER INDEX "livo"."ServiceRequest_ref_key" RENAME TO "Booking_ref_key";
    ALTER INDEX "livo"."ServiceRequest_userId_createdAt_idx" RENAME TO "Booking_userId_createdAt_idx";
    ALTER INDEX "livo"."ServiceRequest_email_idx" RENAME TO "Booking_email_idx";
    ALTER INDEX "livo"."ServiceRequest_status_idx" RENAME TO "Booking_status_idx";
  END IF;

  -- status enum
  IF to_regtype('"livo"."RequestStatus"') IS NOT NULL AND to_regtype('"livo"."BookingStatus"') IS NULL THEN
    ALTER TYPE "livo"."RequestStatus" RENAME TO "BookingStatus";
  END IF;

  -- file kind value
  IF EXISTS (SELECT 1 FROM pg_enum e JOIN pg_type t ON t.oid = e.enumtypid JOIN pg_namespace n ON n.oid = t.typnamespace
             WHERE n.nspname = 'livo' AND t.typname = 'FileKind' AND e.enumlabel = 'REQUEST_PHOTO') THEN
    ALTER TYPE "livo"."FileKind" RENAME VALUE 'REQUEST_PHOTO' TO 'BOOKING_PHOTO';
  END IF;

  -- File.requestId → bookingId
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'livo' AND table_name = 'File' AND column_name = 'requestId') THEN
    ALTER TABLE "livo"."File" RENAME COLUMN "requestId" TO "bookingId";
    ALTER TABLE "livo"."File" RENAME CONSTRAINT "File_requestId_fkey" TO "File_bookingId_fkey";
    ALTER INDEX "livo"."File_requestId_idx" RENAME TO "File_bookingId_idx";
  END IF;

  -- Review.requestId / requestRef → bookingId / bookingRef
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'livo' AND table_name = 'Review' AND column_name = 'requestId') THEN
    ALTER TABLE "livo"."Review" RENAME COLUMN "requestId" TO "bookingId";
    ALTER TABLE "livo"."Review" RENAME CONSTRAINT "Review_requestId_fkey" TO "Review_bookingId_fkey";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'livo' AND table_name = 'Review' AND column_name = 'requestRef') THEN
    ALTER TABLE "livo"."Review" RENAME COLUMN "requestRef" TO "bookingRef";
  END IF;
END $$;

-- when the customer confirmed (existing rows: their creation time)
ALTER TABLE "livo"."Booking" ADD COLUMN IF NOT EXISTS "confirmedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
UPDATE "livo"."Booking" SET "confirmedAt" = "createdAt" WHERE "confirmedAt" > "createdAt" + interval '1 minute';
