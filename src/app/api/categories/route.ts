/** GET /api/categories — visible service categories (public). */
import { route } from "@/lib/api"
import { absoluteUrl } from "@/lib/site-url"
import { listCategories } from "@/services/catalog.service"

export const GET = route("categories.list", async () => listCategories(absoluteUrl))
