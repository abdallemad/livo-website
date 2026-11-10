import "server-only"
import type { Prisma } from "@prisma/client"
import { db } from "@/lib/db"

const withPhoto = { photo: { select: { key: true } } } satisfies Prisma.UserInclude

export type UserRow = Prisma.UserGetPayload<{ include: typeof withPhoto }>

class UserRepository {
  findById(id: string): Promise<UserRow | null> {
    return db.user.findUnique({ where: { id }, include: withPhoto })
  }

  findByEmail(email: string) {
    return db.user.findUnique({ where: { email } })
  }

  create(data: Prisma.UserUncheckedCreateInput): Promise<UserRow> {
    return db.user.create({ data, include: withPhoto })
  }

  update(id: string, data: Prisma.UserUncheckedUpdateInput): Promise<UserRow> {
    return db.user.update({ where: { id }, data, include: withPhoto })
  }

  /** the account and its booking history, in one transaction */
  deleteWithBookings(id: string) {
    return db.$transaction([db.booking.deleteMany({ where: { userId: id } }), db.user.delete({ where: { id } })])
  }
}

export const userRepository = new UserRepository()
