import React, { useEffect, useRef } from 'react'

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#14b8a6']

export default function Confetti({ active, onComplete }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!active) return
    const container = containerRef.current
    if (!container) return

    const particles = []
    for (let i = 0; i < 90; i++) {
      const el = document.createElement('div')
      const color = COLORS[Math.floor(Math.random() * COLORS.length)]
      const size = Math.random() * 9 + 5
      const left = Math.random() * 100
      const delay = Math.random() * 0.8
      const duration = Math.random() * 2 + 2
      const drift = (Math.random() - 0.5) * 300
      const rotation = Math.random() * 720 - 360
      const isCircle = Math.random() > 0.4

      el.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${isCircle ? size : size * 0.5}px;
        background: ${color};
        border-radius: ${isCircle ? '50%' : '2px'};
        left: ${left}%;
        top: -20px;
        opacity: 1;
        animation: confettiFall ${duration}s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}s forwards;
        --drift: ${drift}px;
        --rotation: ${rotation}deg;
      `
      container.appendChild(el)
      particles.push(el)
    }

    const timer = setTimeout(() => {
      particles.forEach(p => p.remove())
      onComplete?.()
    }, 4000)

    return () => {
      clearTimeout(timer)
      particles.forEach(p => p.remove())
    }
  }, [active])

  if (!active) return null

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        overflow: 'hidden',
      }}
    />
  )
}
