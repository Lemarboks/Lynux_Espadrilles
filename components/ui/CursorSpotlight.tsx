'use client'

import { useEffect, useState } from 'react'

export default function CursorSpotlight() {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)
  const [isTouch, setIsTouch] = useState(true)

  useEffect(() => {
    // Detect touch device
    setIsTouch(window.matchMedia('(pointer: coarse)').matches)
  }, [])

  useEffect(() => {
    if (isTouch) return
    const handler = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', handler, { passive: true })
    return () => window.removeEventListener('mousemove', handler)
  }, [isTouch])

  if (isTouch || !pos) return null

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        left: pos.x,
        top: pos.y,
        width: 400,
        height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(200,169,126,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
        transform: 'translate(-50%, -50%)',
        zIndex: 1,
        mixBlendMode: 'normal',
        transition: 'left 0.08s ease, top 0.08s ease',
      }}
    />
  )
}
