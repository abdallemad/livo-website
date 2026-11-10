import type { Service } from "@/data/services"
import { serviceIconSrc } from "@/utils/services"

/**
 * A service's illustrated icon (`img.ico`). If the file fails to load, PageEffects swaps it for
 * the service emoji kept in `data-em` — the prototype's fallback rule.
 */
export function ServiceIcon({ service, size = 64 }: { service: Pick<Service, "id" | "emoji">; size?: number }) {
  return (
    <img className="ico" src={serviceIconSrc(service.id)} alt="" width={size} height={size} decoding="async" data-em={service.emoji} />
  )
}
