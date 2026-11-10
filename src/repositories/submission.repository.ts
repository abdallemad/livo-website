/** Inbound forms: reviews, provider requests, contact messages (write-mostly). */
import "server-only"
import type { Prisma } from "@prisma/client"
import { db } from "@/lib/db"

class SubmissionRepository {
  createReview(data: Prisma.ReviewUncheckedCreateInput) {
    return db.review.create({ data, select: { id: true, createdAt: true } })
  }

  createProviderRequest(data: Prisma.ProviderRequestUncheckedCreateInput) {
    return db.providerRequest.create({ data, select: { id: true, createdAt: true } })
  }

  latestProviderRequestFor(userId: string) {
    return db.providerRequest.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { id: true, status: true, createdAt: true, service: { select: { slug: true } } },
    })
  }

  createContactMessage(data: Prisma.ContactMessageUncheckedCreateInput) {
    return db.contactMessage.create({ data, select: { id: true, createdAt: true } })
  }
}

export const submissionRepository = new SubmissionRepository()
