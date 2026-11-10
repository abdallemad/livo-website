-- 2026-11-09 — initial LIVO schema (from the designer prototype).
-- Everything lives in the "livo" Postgres schema; the database also holds an unrelated
-- marketplace schema in "public" that must never be touched. Idempotent: safe to re-run.
-- Generated with `prisma migrate diff`, then made idempotent (IF NOT EXISTS / duplicate_object).

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "livo";

-- CreateEnum
DO $$ BEGIN
  CREATE TYPE "livo"."Role" AS ENUM ('CUSTOMER', 'PRO', 'ADMIN');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- CreateEnum
DO $$ BEGIN
  CREATE TYPE "livo"."ContactMethod" AS ENUM ('WHATSAPP', 'PHONE', 'EMAIL');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- CreateEnum
DO $$ BEGIN
  CREATE TYPE "livo"."FileKind" AS ENUM ('STATIC', 'AVATAR', 'REQUEST_PHOTO', 'REVIEW_PHOTO', 'APPLICATION_DOCUMENT', 'CONTACT_ATTACHMENT');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- CreateEnum
DO $$ BEGIN
  CREATE TYPE "livo"."RequestStatus" AS ENUM ('RECEIVED', 'MATCHED', 'SCHEDULED', 'DONE', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- CreateEnum
DO $$ BEGIN
  CREATE TYPE "livo"."ApplicationStatus" AS ENUM ('RECEIVED', 'IN_REVIEW', 'APPROVED', 'REJECTED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- CreateEnum
DO $$ BEGIN
  CREATE TYPE "livo"."ContactTopic" AS ENUM ('GENERAL', 'INQUIRY', 'COMPLAINT');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "livo"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "phone" TEXT,
    "role" "livo"."Role" NOT NULL DEFAULT 'CUSTOMER',
    "locale" TEXT NOT NULL DEFAULT 'en',
    "contactMethod" "livo"."ContactMethod",
    "addressBuilding" TEXT,
    "addressStreet" TEXT,
    "addressPostcode" TEXT,
    "city" TEXT,
    "photoId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "livo"."File" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "kind" "livo"."FileKind" NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "sha256" TEXT NOT NULL,
    "name" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "requestId" TEXT,
    "reviewId" TEXT,
    "applicationId" TEXT,
    "documentType" TEXT,
    "contactMessageId" TEXT,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "livo"."ServiceCategory" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "name" JSONB NOT NULL,
    "colorFrom" TEXT NOT NULL,
    "colorTo" TEXT NOT NULL,
    "bannerId" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "livo"."Service" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "name" JSONB NOT NULL,
    "description" JSONB NOT NULL,
    "subServices" JSONB NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "iconId" TEXT,
    "imageId" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "livo"."HeroSlide" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "desktopId" TEXT,
    "mobileId" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeroSlide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "livo"."Town" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Town_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "livo"."ServiceRequest" (
    "id" TEXT NOT NULL,
    "ref" TEXT NOT NULL,
    "userId" TEXT,
    "serviceId" TEXT,
    "customService" TEXT,
    "date" TEXT,
    "asap" BOOLEAN NOT NULL DEFAULT false,
    "time" TEXT,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "contactMethod" "livo"."ContactMethod",
    "email" TEXT,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "status" "livo"."RequestStatus" NOT NULL DEFAULT 'RECEIVED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "livo"."Review" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "requestId" TEXT,
    "requestRef" TEXT,
    "serviceId" TEXT,
    "rating" INTEGER NOT NULL,
    "details" JSONB,
    "recommend" TEXT,
    "tags" TEXT[],
    "comment" TEXT,
    "publish" BOOLEAN NOT NULL DEFAULT false,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "livo"."ProApplication" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "serviceId" TEXT,
    "addressBuilding" TEXT,
    "addressStreet" TEXT,
    "addressPostcode" TEXT,
    "city" TEXT,
    "languages" TEXT[],
    "experience" TEXT,
    "about" TEXT,
    "hasCar" BOOLEAN,
    "idType" TEXT,
    "licenceType" TEXT,
    "authorized" BOOLEAN,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "status" "livo"."ApplicationStatus" NOT NULL DEFAULT 'RECEIVED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "livo"."ContactMessage" (
    "id" TEXT NOT NULL,
    "topic" "livo"."ContactTopic" NOT NULL DEFAULT 'GENERAL',
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "serviceId" TEXT,
    "reference" TEXT,
    "message" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "isHandled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "livo"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "User_photoId_key" ON "livo"."User"("photoId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "File_key_key" ON "livo"."File"("key");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "File_kind_idx" ON "livo"."File"("kind");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "File_requestId_idx" ON "livo"."File"("requestId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "File_reviewId_idx" ON "livo"."File"("reviewId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "File_applicationId_idx" ON "livo"."File"("applicationId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "File_contactMessageId_idx" ON "livo"."File"("contactMessageId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "ServiceCategory_slug_key" ON "livo"."ServiceCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "ServiceCategory_bannerId_key" ON "livo"."ServiceCategory"("bannerId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Service_slug_key" ON "livo"."Service"("slug");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Service_iconId_key" ON "livo"."Service"("iconId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Service_imageId_key" ON "livo"."Service"("imageId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Service_categoryId_idx" ON "livo"."Service"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "HeroSlide_key_key" ON "livo"."HeroSlide"("key");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "HeroSlide_desktopId_key" ON "livo"."HeroSlide"("desktopId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "HeroSlide_mobileId_key" ON "livo"."HeroSlide"("mobileId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Town_name_key" ON "livo"."Town"("name");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "ServiceRequest_ref_key" ON "livo"."ServiceRequest"("ref");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ServiceRequest_userId_createdAt_idx" ON "livo"."ServiceRequest"("userId", "createdAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ServiceRequest_email_idx" ON "livo"."ServiceRequest"("email");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ServiceRequest_status_idx" ON "livo"."ServiceRequest"("status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Review_serviceId_isApproved_idx" ON "livo"."Review"("serviceId", "isApproved");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ProApplication_status_idx" ON "livo"."ProApplication"("status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ProApplication_userId_idx" ON "livo"."ProApplication"("userId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ContactMessage_topic_isHandled_idx" ON "livo"."ContactMessage"("topic", "isHandled");

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "livo"."User" ADD CONSTRAINT "User_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "livo"."File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "livo"."File" ADD CONSTRAINT "File_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "livo"."ServiceRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "livo"."File" ADD CONSTRAINT "File_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "livo"."Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "livo"."File" ADD CONSTRAINT "File_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "livo"."ProApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "livo"."File" ADD CONSTRAINT "File_contactMessageId_fkey" FOREIGN KEY ("contactMessageId") REFERENCES "livo"."ContactMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "livo"."ServiceCategory" ADD CONSTRAINT "ServiceCategory_bannerId_fkey" FOREIGN KEY ("bannerId") REFERENCES "livo"."File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "livo"."Service" ADD CONSTRAINT "Service_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "livo"."ServiceCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "livo"."Service" ADD CONSTRAINT "Service_iconId_fkey" FOREIGN KEY ("iconId") REFERENCES "livo"."File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "livo"."Service" ADD CONSTRAINT "Service_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "livo"."File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "livo"."HeroSlide" ADD CONSTRAINT "HeroSlide_desktopId_fkey" FOREIGN KEY ("desktopId") REFERENCES "livo"."File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "livo"."HeroSlide" ADD CONSTRAINT "HeroSlide_mobileId_fkey" FOREIGN KEY ("mobileId") REFERENCES "livo"."File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "livo"."ServiceRequest" ADD CONSTRAINT "ServiceRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "livo"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "livo"."ServiceRequest" ADD CONSTRAINT "ServiceRequest_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "livo"."Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "livo"."Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "livo"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "livo"."Review" ADD CONSTRAINT "Review_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "livo"."ServiceRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "livo"."Review" ADD CONSTRAINT "Review_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "livo"."Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "livo"."ProApplication" ADD CONSTRAINT "ProApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "livo"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "livo"."ProApplication" ADD CONSTRAINT "ProApplication_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "livo"."Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "livo"."ContactMessage" ADD CONSTRAINT "ContactMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "livo"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "livo"."ContactMessage" ADD CONSTRAINT "ContactMessage_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "livo"."Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

