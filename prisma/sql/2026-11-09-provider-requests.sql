-- 2026-11-09 — "ProApplication" becomes "ProviderRequest" (a user asking to become a provider).
-- Rename-only: no row is lost. Idempotent: every step checks first.

DO $$
BEGIN
  IF to_regclass('"livo"."ProApplication"') IS NOT NULL AND to_regclass('"livo"."ProviderRequest"') IS NULL THEN
    ALTER TABLE "livo"."ProApplication" RENAME TO "ProviderRequest";
    ALTER TABLE "livo"."ProviderRequest" RENAME CONSTRAINT "ProApplication_pkey" TO "ProviderRequest_pkey";
    ALTER TABLE "livo"."ProviderRequest" RENAME CONSTRAINT "ProApplication_userId_fkey" TO "ProviderRequest_userId_fkey";
    ALTER TABLE "livo"."ProviderRequest" RENAME CONSTRAINT "ProApplication_serviceId_fkey" TO "ProviderRequest_serviceId_fkey";
    ALTER INDEX "livo"."ProApplication_status_idx" RENAME TO "ProviderRequest_status_idx";
    ALTER INDEX "livo"."ProApplication_userId_idx" RENAME TO "ProviderRequest_userId_idx";
  END IF;

  IF to_regtype('"livo"."ApplicationStatus"') IS NOT NULL AND to_regtype('"livo"."ProviderRequestStatus"') IS NULL THEN
    ALTER TYPE "livo"."ApplicationStatus" RENAME TO "ProviderRequestStatus";
  END IF;

  IF EXISTS (SELECT 1 FROM pg_enum e JOIN pg_type t ON t.oid = e.enumtypid JOIN pg_namespace n ON n.oid = t.typnamespace
             WHERE n.nspname = 'livo' AND t.typname = 'FileKind' AND e.enumlabel = 'APPLICATION_DOCUMENT') THEN
    ALTER TYPE "livo"."FileKind" RENAME VALUE 'APPLICATION_DOCUMENT' TO 'PROVIDER_DOCUMENT';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'livo' AND table_name = 'File' AND column_name = 'applicationId') THEN
    ALTER TABLE "livo"."File" RENAME COLUMN "applicationId" TO "providerRequestId";
    ALTER TABLE "livo"."File" RENAME CONSTRAINT "File_applicationId_fkey" TO "File_providerRequestId_fkey";
    ALTER INDEX "livo"."File_applicationId_idx" RENAME TO "File_providerRequestId_idx";
  END IF;
END $$;
