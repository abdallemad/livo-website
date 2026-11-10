/** POST /api/me/photo (multipart, field "photo") — replace the profile photo. */
import { readMultipart, route } from "@/lib/api"
import { ValidationError } from "@/lib/errors"
import { absoluteUrl } from "@/lib/site-url"
import { requireUser } from "@/services/auth.service"
import { setPhoto, toMe } from "@/services/user.service"

export const POST = route("me.photo", async (request) => {
  const user = await requireUser()
  const { files } = await readMultipart(request)
  const file = files.get("photo")?.[0]
  if (!file) throw new ValidationError("Please choose a photo.", { photo: ["Please choose a photo."] })
  return toMe(await setPhoto(user, file), absoluteUrl)
})
