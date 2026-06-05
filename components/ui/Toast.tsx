'use client'

import { useState, useRef } from 'react'

interface ToastProps {
  message: string
  visible: boolean
}

export default function Toast({ message, visible }: ToastProps) {
  return (
    <div
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: 96, // above WhatsApp button (bottom-6 = 24px + 56px button = 80px, add 16px gap)
        left: '50%',
        transform: `translateX(-50%) translateY(${visible ? '0' : '12px'})`,
        background: '#C8A97E',
        color: 'white',
        padding: '10px 20px',
        borderRadius: 8,
        fontFamily: 'var(--font-dm)',
        fontSize: 13,
        fontWeight: 500,
        whiteSpace: 'nowrap',
        opacity: visible ? 1 : 0,
        transition: 'opacity 250ms ease, transform 250ms ease',
        pointerEvents: 'none',
        zIndex: 60,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      }}
    >
      {message}
    </div>
  )
}

// Hook to manage toast state
export function useToast() {
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false })
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = (message: string) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setToast({ message, visible: true })
    timerRef.current = setTimeout(() => setToast(t => ({ ...t, visible: false })), 2000)
  }

  return { toast, showToast }
}
