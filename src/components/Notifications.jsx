import React, { useState, useEffect, useRef } from 'react'
import { Bell } from 'lucide-react'

const DEMO_NOTIFICATIONS = [
  {
    id: 1,
    text: '3 dossiers en attente depuis plus de 48h',
    emoji: '⚡',
    time: 'il y a 2h',
    type: 'warning',
    read: false,
  },
  {
    id: 2,
    text: 'Sophie Leclerc — Facture de vente générée',
    emoji: '📄',
    time: 'il y a 3h',
    type: 'info',
    read: false,
  },
  {
    id: 3,
    text: 'Nouveau : Export disponible — Passez au plan Pro',
    emoji: '🚀',
    time: 'il y a 1j',
    type: 'upgrade',
    read: false,
  },
  {
    id: 4,
    text: 'Martin Bernard — Dossier complété',
    emoji: '✅',
    time: 'il y a 2j',
    type: 'success',
    read: false,
  },
]

const REAL_NOTIFICATIONS = [
  {
    id: 1,
    text: 'Bienvenue sur Copilote ! Commencez par créer votre première vente.',
    emoji: '🎉',
    time: "à l'instant",
    type: 'info',
    read: false,
  },
]

function typeStyle(type) {
  switch (type) {
    case 'warning': return { dot: '#b45309', bg: '#fff8e1' }
    case 'success': return { dot: '#2e7d32', bg: '#e6f4ea' }
    case 'upgrade': return { dot: '#2563EB', bg: '#e8f4fb' }
    default:        return { dot: '#4f6272', bg: '#f0f4f8' }
  }
}

export default function Notifications({ isDemo }) {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState(
    isDemo ? DEMO_NOTIFICATIONS : REAL_NOTIFICATIONS
  )
  const ref = useRef(null)

  const unread = notifications.filter(n => !n.read).length

  const handleOpen = () => {
    setOpen(v => !v)
    if (!open) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    }
  }

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleOpen}
        className="relative flex items-center justify-center w-9 h-9 rounded-xl transition-all"
        style={{ background: '#1e2d42', border: '1px solid #2d3f55' }}
        onMouseEnter={e => e.currentTarget.style.borderColor = '#2563EB'}
        onMouseLeave={e => e.currentTarget.style.borderColor = '#2d3f55'}
        title="Notifications"
      >
        <Bell size={16} style={{ color: '#8fa5b5' }} />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-white font-black"
            style={{ background: '#ef4444', fontSize: 9, lineHeight: 1 }}>
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-[min(320px,calc(100vw-1rem))] rounded-2xl shadow-2xl overflow-hidden z-[100]"
          style={{ background: '#fff', border: '1.5px solid #c8d6de' }}>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: '1px solid #e5e7eb' }}>
            <p className="text-sm font-black" style={{ color: '#131d2e' }}>Notifications</p>
            <button
              onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
              className="text-xs font-semibold transition-colors"
              style={{ color: '#2563EB' }}>
              Tout marquer lu
            </button>
          </div>

          {/* List */}
          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-xs text-center py-6" style={{ color: '#8fa5b5' }}>Aucune notification</p>
            ) : (
              notifications.map(n => {
                const style = typeStyle(n.type)
                return (
                  <div key={n.id}
                    className="flex items-start gap-3 px-4 py-3 transition-colors"
                    style={{
                      background: n.read ? '#fff' : style.bg,
                      borderBottom: '1px solid #f1f5f9',
                    }}>
                    <span className="text-base shrink-0 mt-0.5">{n.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs leading-snug" style={{ color: '#131d2e', fontWeight: n.read ? 400 : 600 }}>
                        {n.text}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: '#8fa5b5' }}>{n.time}</p>
                    </div>
                    {!n.read && (
                      <div className="w-2 h-2 rounded-full mt-1 shrink-0" style={{ background: style.dot }} />
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
