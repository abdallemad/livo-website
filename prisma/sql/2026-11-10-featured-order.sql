-- 2026-11-10 — order of the featured services on the home page (the storefront now reads the
-- catalogue from the database). Additive and idempotent. The seed sets the design's order.
ALTER TABLE "livo"."Service" ADD COLUMN IF NOT EXISTS "featuredOrder" INTEGER NOT NULL DEFAULT 0;
