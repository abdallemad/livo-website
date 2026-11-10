"use client"

/**
 * Decorative page behaviours from the prototype (app.js), re-run after every navigation:
 *  - `.rv` reveal-on-scroll and `.num[data-n]` count-up
 *  - `.sh .gh` outline words shrink to fit their box
 *  - SMIL scene in the "Why" section pauses off-screen / for reduced motion
 *  - `.pz` pauses non-composited motion (.flow, .joinb, .mas) while off-screen
 *  - performance guard: on a slow device switch to `html.lite` (same page, less motion/blur)
 *  - `img.ico` that failed to load is replaced by its emoji (`data-em`)
 * These only toggle classes/styles on server-rendered markup, so they live in one effect island
 * instead of turning every section into a Client Component.
 */
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { useLang } from "@/components/providers/lang-provider"

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
const isLite = () => document.documentElement.classList.contains("lite")

function initReveal(): () => void {
  const cleanups: (() => void)[] = []
  const items = Array.from(document.querySelectorAll<HTMLElement>(".rv"))
  if (reducedMotion() || !("IntersectionObserver" in window)) {
    items.forEach((e) => e.classList.remove("rv"))
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          const el = e.target as HTMLElement
          el.classList.add("in")
          io.unobserve(el)
          setTimeout(() => {
            el.classList.remove("rv", "in")
            el.style.removeProperty("--d")
          }, 1500)
        })
      },
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" },
    )
    items.forEach((el) => {
      el.style.setProperty("--d", String(Math.min(Array.prototype.indexOf.call(el.parentNode!.children, el), 6)))
      io.observe(el)
    })
    cleanups.push(() => io.disconnect())
  }
  document.querySelectorAll<HTMLElement>(".num[data-n]").forEach((n) => {
    const target = Number(n.dataset.n)
    if (reducedMotion() || !("IntersectionObserver" in window)) {
      n.textContent = String(target)
      return
    }
    n.textContent = "0"
    const o = new IntersectionObserver((es) => {
      if (!es[0].isIntersecting) return
      o.disconnect()
      const t0 = performance.now()
      const f = (now: number) => {
        const p = Math.min((now - t0) / 1400, 1)
        n.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))))
        if (p < 1) requestAnimationFrame(f)
      }
      requestAnimationFrame(f)
    })
    o.observe(n)
    cleanups.push(() => o.disconnect())
  })
  return () => cleanups.forEach((c) => c())
}

function fitGhosts() {
  document.querySelectorAll<HTMLElement>(".sh .gh").forEach((g) => {
    const box = g.parentElement!
    g.style.fontSize = ""
    const w = g.getBoundingClientRect().width
    const max = box.clientWidth - 16
    if (w > max) g.style.fontSize = ((parseFloat(getComputedStyle(g).fontSize) * max) / w).toFixed(1) + "px"
  })
}

function initScenes(): () => void {
  const cleanups: (() => void)[] = []
  const svgs = Array.from(document.querySelectorAll<SVGSVGElement>(".why-ph svg"))
  if (svgs.length && "pauseAnimations" in svgs[0]) {
    const still = () => reducedMotion() || isLite()
    svgs.forEach((s) => {
      if (still()) {
        s.pauseAnimations()
        s.setCurrentTime(6.2) // still frame: route drawn, pro arrived
      }
      if (!("IntersectionObserver" in window)) return
      const io = new IntersectionObserver(
        (es) => es.forEach((e) => {
          if (still()) return
          if (e.isIntersecting) s.unpauseAnimations()
          else s.pauseAnimations()
        }),
        { threshold: 0.05 },
      )
      io.observe(s)
      const onLite = () => {
        s.pauseAnimations()
        s.setCurrentTime(6.2)
      }
      document.addEventListener("livo:lite", onLite)
      cleanups.push(() => {
        io.disconnect()
        document.removeEventListener("livo:lite", onLite)
      })
    })
  }
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle("pz", !e.isIntersecting)), { rootMargin: "80px" })
    document.querySelectorAll(".flow, .joinb, .mas").forEach((el) => io.observe(el))
    cleanups.push(() => io.disconnect())
  }
  return () => cleanups.forEach((c) => c())
}

/** Measures real frame times once per visit; on a slow device switches to `html.lite` and remembers it. */
function initPerf() {
  const root = document.documentElement
  const KEY = "livo-lite"
  const save = (v: string) => { try { localStorage.setItem(KEY, v) } catch { /* ignore */ } }
  const setLite = (on: boolean) => {
    if (root.classList.contains("lite") === on) return
    root.classList.toggle("lite", on)
    document.dispatchEvent(new CustomEvent("livo:lite", { detail: on }))
  }
  const forced = /[?&]lite=([01])/.exec(location.search)
  if (forced) {
    save(forced[1])
    setLite(forced[1] === "1")
    if (forced[1] === "0") return
  }
  let saved: string | null = null
  try { saved = localStorage.getItem(KEY) } catch { /* ignore */ }
  if (saved === "0" || root.classList.contains("lite")) return
  let samples: number[] = []
  let bad = 0
  let good = 0
  let last = 0
  let scrollUntil = 0
  let done = false
  const t0 = performance.now()
  const judge = () => {
    const s = samples.slice().sort((a, b) => a - b)
    const med = s[s.length >> 1]
    samples = []
    if (med > 28) { good = 0; bad++ } else { bad = 0; good++ } // median frame > 28 ms ≈ under 35 fps
    if (bad >= 2) { done = true; save("1"); setLite(true) } else if (good >= 5) done = true
  }
  const loop = (t: number) => {
    if (done) return
    const scrolling = t < scrollUntil
    const startup = t - t0 > 1500 && t - t0 < 9000
    if (scrolling || startup) {
      if (last && t - last < 400) {
        samples.push(t - last)
        if (samples.length >= 30) judge()
      }
      last = t
    } else last = 0
    requestAnimationFrame(loop)
  }
  addEventListener("scroll", () => { scrollUntil = performance.now() + 700 }, { passive: true })
  requestAnimationFrame(loop)
}

function fixBrokenIcons() {
  const swap = (el: HTMLImageElement) => el.replaceWith(document.createTextNode(el.dataset.em ?? ""))
  document.querySelectorAll<HTMLImageElement>("img.ico").forEach((img) => {
    if (img.complete && img.naturalWidth === 0) swap(img)
  })
}

export function PageEffects() {
  const pathname = usePathname()
  const { lang } = useLang()

  // once per visit
  useEffect(() => {
    initPerf()
    const onError = (e: Event) => {
      const el = e.target as HTMLElement
      if (el?.tagName === "IMG" && el.classList.contains("ico")) el.replaceWith(document.createTextNode(el.dataset.em ?? ""))
    }
    document.addEventListener("error", onError, true)
    window.addEventListener("resize", fitGhosts)
    return () => {
      document.removeEventListener("error", onError, true)
      window.removeEventListener("resize", fitGhosts)
    }
  }, [])

  // per page (and per language: text widths change)
  useEffect(() => {
    const stopReveal = initReveal()
    const stopScenes = initScenes()
    fitGhosts()
    document.fonts?.ready.then(fitGhosts)
    fixBrokenIcons()
    return () => {
      stopReveal()
      stopScenes()
    }
  }, [pathname, lang])

  return null
}
