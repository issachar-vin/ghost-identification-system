import '../styles/animations.css'

// SVG ghost silhouette path
const GHOST_PATH =
  'M12 2C7.59 2 4 5.59 4 10v10l2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2V10c0-4.41-3.59-8-8-8zm-2 11c-.83 0-1.5-.67-1.5-1.5S9.17 10 10 10s1.5.67 1.5 1.5S10.83 13 10 13zm4 0c-.83 0-1.5-.67-1.5-1.5S13.17 10 14 10s1.5.67 1.5 1.5S14.83 13 14 13z'

const ghosts: Array<{
  top: string
  left: string
  size: number
  animation: string
  delay: string
  duration: string
}> = [
  { top: '10%',  left: '15%', size: 80,  animation: 'drift-1', delay: '0s',   duration: '28s' },
  { top: '30%',  left: '70%', size: 60,  animation: 'drift-2', delay: '5s',   duration: '34s' },
  { top: '60%',  left: '40%', size: 100, animation: 'drift-3', delay: '12s',  duration: '40s' },
  { top: '80%',  left: '85%', size: 55,  animation: 'drift-1', delay: '18s',  duration: '32s' },
  { top: '50%',  left: '5%',  size: 70,  animation: 'drift-2', delay: '25s',  duration: '38s' },
  { top: '20%',  left: '50%', size: 90,  animation: 'drift-3', delay: '8s',   duration: '45s' },
]

export function GhostBackground() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      {ghosts.map((g, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          style={{
            position: 'absolute',
            top: g.top,
            left: g.left,
            width: g.size,
            height: g.size,
            fill: 'rgba(57, 255, 20, 1)',
            animation: `${g.animation} ${g.duration} ${g.delay} infinite linear`,
            willChange: 'transform, opacity',
          }}
        >
          <path d={GHOST_PATH} />
        </svg>
      ))}
    </div>
  )
}
