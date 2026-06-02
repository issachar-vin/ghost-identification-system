import { useEffect, useRef, useState } from 'react'
import '../styles/animations.css'

const GHOST_PATH =
  'M12 2C7.59 2 4 5.59 4 10v10l2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2V10c0-4.41-3.59-8-8-8zm-2 11c-.83 0-1.5-.67-1.5-1.5S9.17 10 10 10s1.5.67 1.5 1.5S10.83 13 10 13zm4 0c-.83 0-1.5-.67-1.5-1.5S13.17 10 14 10s1.5.67 1.5 1.5S14.83 13 14 13z'

const MAX_CONCURRENT = 4

interface GhostInstance {
  id: number
  x: number           // % from left
  y: number           // % from top
  size: number        // px
  maxOpacity: number  // 0.02 – 0.07
  driftX: number      // px to drift over lifetime
  driftY: number      // px to drift over lifetime
  rotation: number    // deg
  flickerDuration: string
  lifetime: number    // ms
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function makeGhost(id: number): GhostInstance {
  return {
    id,
    x: rand(3, 90),
    y: rand(3, 85),
    size: rand(35, 110),
    maxOpacity: rand(0.025, 0.07),
    driftX: (Math.random() < 0.5 ? -1 : 1) * rand(30, 90),
    driftY: -rand(20, 70),
    rotation: rand(-20, 20),
    flickerDuration: `${rand(0.6, 2.4).toFixed(2)}s`,
    lifetime: rand(1000, 10000),
  }
}

// Sub-component so each ghost has its own mount-time effect for fade-in
function GhostSilhouette({ ghost, dying }: { ghost: GhostInstance; dying: boolean }) {
  const [active, setActive] = useState(false)

  useEffect(() => {
    // Double-RAF ensures the CSS transition fires after first paint
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => setActive(true))
      return () => cancelAnimationFrame(raf2)
    })
    return () => cancelAnimationFrame(raf1)
  }, [])

  const fadeDuration = dying ? '0.6s' : '0.4s'
  const targetOpacity = dying ? 0 : active ? ghost.maxOpacity : 0

  return (
    // Wrapper: controls base opacity and drift
    <div
      style={{
        position: 'absolute',
        left: `${ghost.x}%`,
        top: `${ghost.y}%`,
        width: ghost.size,
        height: ghost.size,
        opacity: targetOpacity,
        transform: active && !dying
          ? `translate(${ghost.driftX}px, ${ghost.driftY}px) rotate(${ghost.rotation}deg)`
          : 'translate(0,0) rotate(0deg)',
        transition: `opacity ${fadeDuration} ease, transform ${ghost.lifetime / 1000}s linear`,
        willChange: 'opacity, transform',
        pointerEvents: 'none',
      }}
    >
      {/* SVG: only handles the flicker animation — opacity is 0..1 relative to wrapper */}
      <svg
        viewBox="0 0 24 24"
        style={{
          width: '100%',
          height: '100%',
          fill: '#4fc3f7',
          filter: 'blur(0.4px)',
          animation: `ghostFlicker ${ghost.flickerDuration} ease-in-out infinite`,
        }}
      >
        <path d={GHOST_PATH} />
      </svg>
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

        // Begin fade-out after lifetime
        setTimeout(() => {
          setDyingIds((prev) => new Set([...prev, ghost.id]))
        }, ghost.lifetime)

        // Remove from DOM after fade-out completes
        setTimeout(() => {
          activeCount.current--
          setGhosts((prev) => prev.filter((g) => g.id !== ghost.id))
          setDyingIds((prev) => {
            const s = new Set(prev)
            s.delete(ghost.id)
            return s
          })
        }, ghost.lifetime + 650)
      }

      // Schedule next spawn: 3–7 seconds
      spawnTimer = setTimeout(spawnGhost, rand(3000, 7000))
    }

    // Stagger the first spawn slightly
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
