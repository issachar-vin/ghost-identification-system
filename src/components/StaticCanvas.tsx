import { useEffect, useRef } from 'react'

export function StaticCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    function resize() {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    let animId: number
    let nextBurst = Date.now() + 3000 + Math.random() * 8000
    let bursting = false
    let burstEnd = 0

    function tick() {
      if (!canvas || !ctx) return
      const now = Date.now()

      if (!bursting && now >= nextBurst) {
        bursting = true
        const frames = 3 + Math.floor(Math.random() * 5)
        burstEnd = now + frames * 50
        nextBurst = now + 5000 + Math.random() * 12000
      }

      if (bursting) {
        const intensity = 0.06 + Math.random() * 0.08
        canvas.style.opacity = String(intensity * 2)
        const w = canvas.width, h = canvas.height
        const img = ctx.createImageData(w, h)
        const d = img.data
        for (let i = 0; i < d.length; i += 4) {
          const v = Math.random() < intensity ? Math.random() * 255 : 0
          d[i] = v; d[i + 1] = v; d[i + 2] = v; d[i + 3] = v > 0 ? 60 : 0
        }
        ctx.putImageData(img, 0, 0)
        if (now >= burstEnd) {
          bursting = false
          canvas.style.opacity = '0'
          ctx.clearRect(0, 0, w, h)
        }
      }

      animId = requestAnimationFrame(tick)
    }

    tick()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        opacity: 0,
        mixBlendMode: 'screen',
      }}
    />
  )
}
