/** GET /api/slides — home hero slides (public). */
import { route } from "@/lib/api"
import { absoluteUrl } from "@/lib/site-url"
import { listSlides } from "@/services/catalog.service"

export const GET = route("slides.list", async () => listSlides(absoluteUrl))
