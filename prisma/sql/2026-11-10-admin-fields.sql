-- 2026-11-10 — admin dashboard actions: assign a provider to a booking, internal notes,
-- review date of provider requests. Additive and idempotent.

ALTER TABLE "livo"."Booking" ADD COLUMN IF NOT EXISTS "providerId" TEXT;
ALTER TABLE "livo"."Booking" ADD COLUMN IF NOT EXISTS "adminNote" TEXT;
CREATE INDEX IF NOT EXISTS "Booking_providerId_idx" ON "livo"."Booking"("providerId");

DO $$ BEGIN
  ALTER TABLE "livo"."Booking" ADD CONSTRAINT "Booking_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "livo"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE "livo"."ProviderRequest" ADD COLUMN IF NOT EXISTS "adminNote" TEXT;
ALTER TABLE "livo"."ProviderRequest" ADD COLUMN IF NOT EXISTS "reviewedAt" TIMESTAMP(3);
