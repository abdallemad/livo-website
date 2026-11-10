/** GET /api/towns — towns suggested in the booking address step (public). */
import { route } from "@/lib/api"
import { listTowns } from "@/services/catalog.service"

export const GET = route("towns.list", async () => listTowns())
