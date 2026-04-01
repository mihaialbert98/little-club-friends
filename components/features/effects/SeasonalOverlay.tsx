'use client'

import { useEffect, useRef, useState } from 'react'
import { useTheme } from '@/components/features/theme/ThemeProvider'

const PARTICLE_COUNT = 36

interface Particle {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
  drift: number
  dx: number
  dy: number
}

function generateParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 80 + 10,
    size: Math.random() * 5 + 3,
    duration: Math.random() * 4 + 4,
    delay: -(Math.random() * 6),
    drift: Math.random() * 80 - 40,
    dx: Math.random() * 60 - 30,
    dy: Math.random() * 50 + 30,
  }))
}

export default function SeasonalOverlay() {
  const theme = useTheme()
  const [visible, setVisible] = useState(true)
  const [rendered, setRendered] = useState(false)
  const particles = useRef<Particle[]>([])
  const dismissed = useRef(false)

  function dismiss() {
    if (dismissed.current) return
    dismissed.current = true
    setVisible(false)
    setTimeout(() => setRendered(false), 600)
  }

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    particles.current = generateParticles()
    setRendered(true)

    const autoTimer = setTimeout(dismiss, 4500)
    window.addEventListener('scroll', dismiss, { passive: true, once: true })

    return () => {
      clearTimeout(autoTimer)
      window.removeEventListener('scroll', dismiss)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!rendered) return null

  const isWinter = theme === 'WINTER'

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        pointerEvents: 'none',
        overflow: 'hidden',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.6s ease-out',
      }}
    >
      {particles.current.map((p) =>
        isWinter ? (
          <div
            key={p.id}
            className="particle-winter"
            style={{
              left: `${p.x}%`,
              top: `-${p.size * 2}px`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              '--duration': `${p.duration}s`,
              '--delay': `${p.delay}s`,
              '--drift': `${p.drift}px`,
            } as React.CSSProperties}
          />
        ) : (
          <div
            key={p.id}
            className="particle-summer"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              '--duration': `${p.duration}s`,
              '--delay': `${p.delay}s`,
              '--dx': `${p.dx}px`,
              '--dy': `${p.dy}px`,
            } as React.CSSProperties}
          />
        )
      )}
    </div>
  )
}
