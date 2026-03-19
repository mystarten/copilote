import React, { useRef, useState } from 'react'

// ── LogoShield — reproduit fidèlement le logo Copilote ────────────────────────
// Animations disponibles :
//   float     : bob vertical continu
//   tilt      : tilt 3D interactif qui suit la souris
//   glow      : halo bleu qui respire
export default function LogoShield({
  size = 48,
  float = false,
  tilt = false,
  glow = false,
  className = '',
  style = {},
}) {
  const ref = useRef(null)
  const [rotate, setRotate] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  const handleMouseMove = (e) => {
    if (!tilt || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2)
    const y = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2)
    setRotate({ x: y * -11, y: x * 11 })
  }
  const handleMouseLeave = () => { setRotate({ x: 0, y: 0 }); setHovered(false) }
  const handleMouseEnter = () => setHovered(true)

  const wrapStyle = {
    display: 'inline-block',
    width: size,
    height: size,
    perspective: 400,
    ...style,
  }

  const innerStyle = {
    width: size,
    height: size,
    display: 'block',
    transition: tilt
      ? 'transform 0.12s ease-out, filter 0.3s ease'
      : 'filter 0.3s ease',
    transform: tilt
      ? `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(${hovered ? 1.04 : 1})`
      : undefined,
    filter: glow
      ? `drop-shadow(0 0 ${hovered ? 18 : 10}px rgba(59,130,246,${hovered ? 0.75 : 0.45}))`
      : undefined,
    animation: float ? 'logoFloat 3.8s ease-in-out infinite' : undefined,
    willChange: 'transform',
  }

  return (
    <div
      ref={ref}
      style={wrapStyle}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <svg
        style={innerStyle}
        viewBox="0 0 120 120"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Fond de l'icône */}
          <radialGradient id="ls-bg" cx="50%" cy="40%" r="70%">
            <stop offset="0%"   stopColor="#0e1527" />
            <stop offset="100%" stopColor="#060a14" />
          </radialGradient>

          {/* Gradient shield — moitié gauche (plus sombre) */}
          <linearGradient id="ls-left" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#1b3fa8" />
            <stop offset="100%" stopColor="#0f2470" />
          </linearGradient>

          {/* Gradient shield — moitié droite (plus claire) */}
          <linearGradient id="ls-right" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#4a90f5" />
            <stop offset="60%"  stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1a50d4" />
          </linearGradient>

          {/* Reflet spéculaire haut-droite */}
          <radialGradient id="ls-spec" cx="68%" cy="18%" r="42%">
            <stop offset="0%"   stopColor="rgba(255,255,255,0.38)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>

          {/* Bord verre */}
          <linearGradient id="ls-border" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="rgba(255,255,255,0.18)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.04)" />
          </linearGradient>

          {/* Clip pour le fond */}
          <clipPath id="ls-clip">
            <rect x="2" y="2" width="116" height="116" rx="24" />
          </clipPath>
        </defs>

        {/* ── Fond app-icon ─────────────────────────────────── */}
        <rect x="0" y="0" width="120" height="120" rx="26"
          fill="url(#ls-bg)" />

        {/* Bordure glassmorphism */}
        <rect x="0.75" y="0.75" width="118.5" height="118.5" rx="25.5"
          fill="none" stroke="url(#ls-border)" strokeWidth="1.5" />

        {/* ── Bouclier ──────────────────────────────────────── */}
        {/* Ombre portée sous le bouclier */}
        <ellipse cx="60" cy="97" rx="26" ry="5"
          fill="rgba(0,0,0,0.35)" />

        {/* Moitié gauche du bouclier */}
        <path
          d="M60 16 L20 30 L20 62 Q20 84 60 98 L60 16 Z"
          fill="url(#ls-left)"
        />

        {/* Moitié droite du bouclier */}
        <path
          d="M60 16 L100 30 L100 62 Q100 84 60 98 L60 16 Z"
          fill="url(#ls-right)"
        />

        {/* Ligne centrale (arête 3D) */}
        <line x1="60" y1="16" x2="60" y2="98"
          stroke="rgba(0,0,0,0.2)" strokeWidth="1.2" />

        {/* Reflet spéculaire */}
        <path
          d="M60 16 L100 30 L100 62 Q100 84 60 98 Q20 84 20 62 L20 30 Z"
          fill="url(#ls-spec)"
        />

        {/* Bordure du bouclier — fine ligne lumineuse */}
        <path
          d="M60 16 L100 30 L100 62 Q100 84 60 98 Q20 84 20 62 L20 30 Z"
          fill="none"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* ── Visage ────────────────────────────────────────── */}
        {/* Yeux */}
        <circle cx="46.5" cy="56" r="5.2" fill="white" opacity="0.95" />
        <circle cx="73.5" cy="56" r="5.2" fill="white" opacity="0.95" />
        {/* Petits reflets sur les yeux */}
        <circle cx="45"   cy="54.5" r="1.6" fill="rgba(200,220,255,0.7)" />
        <circle cx="72"   cy="54.5" r="1.6" fill="rgba(200,220,255,0.7)" />

        {/* Sourire */}
        <path
          d="M45 69 Q60 80 75 69"
          stroke="white" strokeWidth="3" fill="none"
          strokeLinecap="round" opacity="0.88"
        />
      </svg>
    </div>
  )
}
