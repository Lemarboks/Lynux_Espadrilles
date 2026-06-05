'use client'

import { useEffect, useState } from 'react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

const stats = [
  { value: 11,   suffix: '',  label: 'Styles Available' },
  { value: 12,   suffix: '+', label: 'Colours Per Style' },
  { value: 100,  suffix: '%', label: 'Handcrafted'       },
  { value: 2023, suffix: '',  label: 'Founded'           },
]

function AnimatedCounter({ value, suffix, delay, label }: { value: number; suffix: string; delay: number; label: string }) {
  const startFrom = value > 1000 ? Math.floor(value / 100) * 100 : 0
  const [count, setCount] = useState(startFrom)
  const { ref, isVisible } = useScrollAnimation(0.3)

  useEffect(() => {
    if (!isVisible) return
    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(value)
      return
    }
    setCount(startFrom)
    const timeout = setTimeout(() => {
      const start = Date.now()
      const duration = 2000
      const animate = () => {
        const elapsed = Date.now() - start
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setCount(Math.round(startFrom + eased * (value - startFrom)))
        if (progress < 1) requestAnimationFrame(animate)
      }
      requestAnimationFrame(animate)
    }, delay)
    return () => clearTimeout(timeout)
  }, [isVisible, value, delay])

  return (
    <div ref={ref} className="flex flex-col items-center text-center px-6 py-2">
      <span
        className="font-cormorant font-semibold leading-none mb-3"
        style={{ fontSize: 'clamp(40px, 5vw, 56px)', color: '#C8A97E' }}
      >
        {count}{suffix}
      </span>
      <span className="font-dm text-sm uppercase tracking-[0.15em]" style={{ color: '#8A847C' }}>
        {label}
      </span>
    </div>
  )
}

export default function StatsStrip() {
  return (
    <section style={{ background: '#1C1A17' }} className="py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0">
          {stats.map(({ value, suffix, label }, i) => (
            <div
              key={label}
              className={`${i < stats.length - 1 ? 'border-r border-white/10' : ''} ${i >= 2 ? '' : 'border-b lg:border-b-0 border-white/10'}`}
            >
              <AnimatedCounter value={value} suffix={suffix} delay={i * 200} label={label} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
