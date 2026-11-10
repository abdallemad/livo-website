"use client"

/**
 * Fixed decorative background (prototype: .bg + app.js initBg / scroll parallax).
 * Discs and waves are server-rendered; the rising squares are random, so they are created only
 * after mount (no hydration mismatch), and the mouse glow only on hover-capable devices.
 * `html.lite` (slow device, see PageEffects) turns the motion down via CSS.
 */
import { useEffect, useRef, useState } from "react"

function wavePaths(parity: 0 | 1) {
  return Array.from({ length: 14 }, (_, i) =>
    i % 2 === parity ? (
      <path
        key={i}
        d={`M0 ${130 + i * 7} C 250 ${40 + i * 9}, 450 ${250 - i * 5}, 700 ${140 + i * 6} S 1050 ${60 + i * 8}, 1200 ${150 + i * 5}`}
      />
    ) : null,
  )
}

interface Square {
  left: number
  size: number
  duration: number
  delay: number
  color: string
}

const COLORS = ["#04123A", "#7B2FF7", "#FF3D5A"]

export function AnimatedBackground() {
  const rootRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const [squares, setSquares] = useState<Square[]>([])
  const [glow, setGlow] = useState(false)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    // random layout must not be part of the server HTML
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSquares(
      Array.from({ length: 14 }, (_, i) => ({
        left: Math.random() * 100,
        size: 18 + Math.random() * 34,
        duration: 24 + Math.random() * 28,
        delay: Math.random() * 40,
        color: COLORS[i % 3],
      })),
    )
    setGlow(window.matchMedia("(hover:hover)").matches)
  }, [])

  // gentle parallax of the discs: only their own (composited) translate changes
  useEffect(() => {
    const orbs = rootRef.current ? Array.from(rootRef.current.querySelectorAll<HTMLElement>(".orb")) : []
    let tick = false
    let lastY = -1
    const frame = () => {
      tick = false
      const y = window.scrollY
      if (y === lastY) return
      const v = document.documentElement.classList.contains("lite") ? "" : `0 ${(-y * 0.12).toFixed(1)}px`
      orbs.forEach((o) => (o.style.translate = v))
      lastY = y
    }
    const onScroll = () => {
      if (!tick) {
        tick = true
        requestAnimationFrame(frame)
      }
    }
    const onLite = () => {
      lastY = -1
      onScroll()
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    document.addEventListener("livo:lite", onLite)
    onScroll()
    return () => {
      window.removeEventListener("scroll", onScroll)
      document.removeEventListener("livo:lite", onLite)
    }
  }, [])

  // soft glow follows the pointer, then stops its loop once settled
  useEffect(() => {
    const g = glowRef.current
    if (!glow || !g) return
    let gx = innerWidth / 2
    let gy = innerHeight / 3
    let tx = gx
    let ty = gy
    let run = false
    g.style.transform = `translate3d(${gx - 280}px,${gy - 280}px,0)`
    const loop = () => {
      if (document.documentElement.classList.contains("lite")) {
        run = false
        return
      }
      gx += (tx - gx) * 0.08
      gy += (ty - gy) * 0.08
      g.style.transform = `translate3d(${(gx - 280).toFixed(1)}px,${(gy - 280).toFixed(1)}px,0)`
      if (Math.abs(tx - gx) > 0.5 || Math.abs(ty - gy) > 0.5) requestAnimationFrame(loop)
      else run = false
    }
    const onMove = (e: PointerEvent) => {
      tx = e.clientX
      ty = e.clientY
      if (!run) {
        run = true
        requestAnimationFrame(loop)
      }
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    return () => window.removeEventListener("pointermove", onMove)
  }, [glow])

  return (
    <div className="bg" aria-hidden="true" ref={rootRef}>
      <div className="orb o1" />
      <div className="orb o2" />
      <div className="orb o3" />
      <svg className="waves" viewBox="0 0 1200 300" preserveAspectRatio="none">
        {wavePaths(0)}
      </svg>
      <svg className="waves w2" viewBox="0 0 1200 300" preserveAspectRatio="none">
        {wavePaths(1)}
      </svg>
      {squares.map((q, i) => (
        <i
          key={i}
          className="sq"
          style={{
            left: `${q.left}%`,
            width: `${q.size}px`,
            height: `${q.size}px`,
            animationDuration: `${q.duration}s`,
            animationDelay: `-${q.delay}s`,
            background: q.color,
          }}
        />
      ))}
      {glow && <div className="glow" ref={glowRef} />}
    </div>
  )
}
