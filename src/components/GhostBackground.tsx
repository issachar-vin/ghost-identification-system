import { useEffect, useRef, useState } from 'react'
import '../styles/animations.css'

// CSS filter chain: brightness(0) forces pure black, invert(1) flips to white,
// then sepia+hue-rotate+saturate+brightness shifts to the target blue tone.
// Adjust hue-rotate (175deg) to shift the hue if needed.
const GHOST_FILTER =
  'brightness(0) invert(1) sepia(1) hue-rotate(175deg) saturate(3) brightness(1.15) drop-shadow(0 0 5px rgba(79,195,247,0.7))'

const MAX_CONCURRENT = 5
const FADE_IN_MS = 350
const FADE_OUT_MS = 600
// Max angular velocity (radians/frame at 60fps) — controls how tight turns can be
const MAX_ANG_VEL = 0.022

interface GhostInstance {
  id: number
  startXPct: number    // 5–90
  startYPct: number    // 5–85
  size: number         // px
  maxOpacity: number   // 0.07–0.18
  speed: number        // px per frame at ~60fps
  turnChance: number   // probability per frame of nudging angular velocity
  flickerDuration: string
  lifetime: number     // ms
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function makeGhost(id: number): GhostInstance {
  return {
    id,
    startXPct: rand(5, 90),
    startYPct: rand(5, 85),
    size: rand(120, 320),
    maxOpacity: rand(0.07, 0.18),
    speed: rand(0.3, 1.4),
    // Higher turnChance → tighter wander, lower → straighter paths
    turnChance: rand(0.012, 0.05),
    flickerDuration: `${rand(0.5, 2.2).toFixed(2)}s`,
    lifetime: rand(1000, 10000),
  }
}

// Each silhouette manages its own rAF loop and writes directly to the DOM
// to avoid 60fps React re-renders.
function GhostSilhouette({ ghost, dying }: { ghost: GhostInstance; dying: boolean }) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  // Keep dying flag accessible inside the rAF closure without restarting it
  const dyingRef = useRef(dying)
  useEffect(() => { dyingRef.current = dying }, [dying])

  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    const container = el.parentElement
    if (!container) return

    const half = ghost.size / 2
    let x = (ghost.startXPct / 100) * (container.offsetWidth || 800)
    let y = (ghost.startYPct / 100) * (container.offsetHeight || 600)
    let heading = Math.random() * Math.PI * 2   // initial random direction
    let angularVel = 0                           // current turning rate
    let dyingStartTime: number | null = null
    let startTime: number | null = null
    let raf: number

    function tick(timestamp: number) {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime

      // Latch the moment dying begins so fade-out is timed from there
      if (dyingRef.current && dyingStartTime === null) {
        dyingStartTime = timestamp
      }

      // ── Opacity envelope ──────────────────────────────────────────────
      let opacity: number
      if (dyingStartTime !== null) {
        const t = (timestamp - dyingStartTime) / FADE_OUT_MS
        opacity = Math.max(0, ghost.maxOpacity * (1 - t))
        if (opacity <= 0) {
          cancelAnimationFrame(raf)
          return
        }
      } else if (elapsed < FADE_IN_MS) {
        opacity = ghost.maxOpacity * (elapsed / FADE_IN_MS)
      } else {
        opacity = ghost.maxOpacity
      }

      // ── Wander ────────────────────────────────────────────────────────
      // Randomly nudge angular velocity → creates smooth, organic curves
      if (Math.random() < ghost.turnChance) {
        angularVel += (Math.random() * 2 - 1) * 0.055
      }
      // Clamp to max turn rate, then dampen — turns ease out naturally
      angularVel = Math.max(-MAX_ANG_VEL, Math.min(MAX_ANG_VEL, angularVel))
      angularVel *= 0.97

      heading += angularVel
      x += Math.cos(heading) * ghost.speed
      y += Math.sin(heading) * ghost.speed

      // Wrap at container edges so ghosts re-enter from the other side
      const w = container.offsetWidth
      const h = container.offsetHeight
      if (x < -half) x = w + half
      if (x > w + half) x = -half
      if (y < -half) y = h + half
      if (y > h + half) y = -half

      // Write directly to DOM — no setState, no re-render
      el.style.transform = `translate(${x - half}px, ${y - half}px)`
      el.style.opacity = String(opacity)

      raf = requestAnimationFrame(tick)
    }

    // Initial position before first frame
    el.style.transform = `translate(${x - half}px, ${y - half}px)`
    el.style.opacity = '0'
    raf = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(raf)
  }, [ghost]) // intentionally omit `dying` — handled via dyingRef

  return (
    <div
      ref={wrapperRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: ghost.size,
        height: ghost.size,
        opacity: 0,
        pointerEvents: 'none',
        willChange: 'transform, opacity',
      }}
    >
      <img
        src="/bakemon.svg"
        alt=""
        style={{
          width: '100%',
          height: '100%',
          filter: GHOST_FILTER,
          animation: `ghostFlicker ${ghost.flickerDuration} ease-in-out infinite`,
          display: 'block',
        }}
      />
    </div>
  )
}

export function GhostBackground() {
  const [ghosts, setGhosts] = useState<GhostInstance[]>([])
  const [dyingIds, setDyingIds] = useState<Set<number>>(new Set())
  const nextId = useRef(0)
  const activeCount = useRef(0)

  useEffect(() => {
    let spawnTimer: ReturnType<typeof setTimeout>

    function spawnGhost() {
      if (activeCount.current < MAX_CONCURRENT) {
        const ghost = makeGhost(++nextId.current)
        activeCount.current++
        setGhosts((prev) => [...prev, ghost])

        setTimeout(() => {
          setDyingIds((prev) => new Set([...prev, ghost.id]))
        }, ghost.lifetime)

        setTimeout(() => {
          activeCount.current--
          setGhosts((prev) => prev.filter((g) => g.id !== ghost.id))
          setDyingIds((prev) => {
            const s = new Set(prev)
            s.delete(ghost.id)
            return s
          })
        }, ghost.lifetime + FADE_OUT_MS + 100)
      }

      spawnTimer = setTimeout(spawnGhost, rand(3000, 7000))
    }

    spawnTimer = setTimeout(spawnGhost, rand(400, 1500))
    return () => clearTimeout(spawnTimer)
  }, [])

  return (
    <div
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}
    >
      {ghosts.map((ghost) => (
        <GhostSilhouette key={ghost.id} ghost={ghost} dying={dyingIds.has(ghost.id)} />
      ))}
    </div>
  )
}
