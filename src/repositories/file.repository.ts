import "server-only"
import type { Prisma } from "@prisma/client"
import { db } from "@/lib/db"

class FileRepository {
  create(data: Prisma.FileUncheckedCreateInput) {
    return db.file.create({ data })
  }

  findById(id: string) {
    return db.file.findUnique({ where: { id } })
  }

  findByKey(key: string) {
    return db.file.findUnique({ where: { key } })
  }

  delete(id: string) {
    return db.file.delete({ where: { id } })
  }

  /** keys of the avatar and the booking photos of an account (removed with it) */
  async keysOwnedBy(userId: string, photoId: string | null): Promise<string[]> {
    const rows = await db.file.findMany({
      where: { OR: [...(photoId ? [{ id: photoId }] : []), { booking: { userId } }] },
      select: { key: true },
    })
    return rows.map((r) => r.key)
  }

  /** link uploaded files to the row they belong to */
  attach(ids: string[], data: Prisma.FileUncheckedUpdateManyInput) {
    return db.file.updateMany({ where: { id: { in: ids } }, data })
  }
}

export const fileRepository = new FileRepository()
