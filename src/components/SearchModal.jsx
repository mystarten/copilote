import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, LayoutDashboard, PlusCircle, BookOpen, Users, CreditCard, Settings, BarChart2, Car, User } from 'lucide-react'

const STATIC_ITEMS = [
  { id: 'dashboard',       label: 'Dashboard',        category: 'Page',   icon: LayoutDashboard, path: '/dashboard'       },
  { id: 'nouvelle-vente',  label: 'Nouvelle Vente',   category: 'Page',   icon: PlusCircle,      path: '/nouvelle-vente'  },
  { id: 'livre-de-police', label: 'Livre de Police',  category: 'Page',   icon: BookOpen,        path: '/livre-de-police' },
  { id: 'clients',         label: 'Clients',          category: 'Page',   icon: Users,           path: '/clients'         },
  { id: 'stats',           label: 'Statistiques',     category: 'Page',   icon: BarChart2,       path: '/stats'           },
  { id: 'pricing',         label: 'Tarifs',           category: 'Page',   icon: CreditCard,      path: '/pricing'         },
  { id: 'settings',        label: 'Paramètres',       category: 'Page',   icon: Settings,        path: '/settings'        },
  // Mock clients
  { id: 'c1', label: 'Martin Bernard',   category: 'Client',   icon: User, path: '/clients' },
  { id: 'c2', label: 'Sophie Leclerc',   category: 'Client',   icon: User, path: '/clients' },
  { id: 'c3', label: 'Jean-Pierre Vidal',category: 'Client',   icon: User, path: '/clients' },
  { id: 'c4', label: 'Isabelle Moreau',  category: 'Client',   icon: User, path: '/clients' },
  // Mock vehicles
  { id: 'v1', label: 'BMW Série 3 · AB-123-CD',    category: 'Véhicule', icon: Car, path: '/livre-de-police' },
  { id: 'v2', label: 'Mercedes GLC · EF-456-GH',   category: 'Véhicule', icon: Car, path: '/livre-de-police' },
  { id: 'v3', label: 'Audi Q5 · IJ-789-KL',        category: 'Véhicule', icon: Car, path: '/livre-de-police' },
  { id: 'v4', label: 'Volkswagen Tiguan · MN-012-OP',category: 'Véhicule',icon: Car, path: '/livre-de-police' },
]

const QUICK_ACTIONS = [
  { id: 'dashboard',       label: 'Dashboard',       icon: LayoutDashboard, path: '/dashboard'       },
  { id: 'nouvelle-vente',  label: 'Nouvelle Vente',  icon: PlusCircle,      path: '/nouvelle-vente'  },
  { id: 'livre-de-police', label: 'Livre de Police', icon: BookOpen,        path: '/livre-de-police' },
  { id: 'clients',         label: 'Clients',         icon: Users,           path: '/clients'         },
  { id: 'settings',        label: 'Paramètres',      icon: Settings,        path: '/settings'        },
  { id: 'pricing',         label: 'Tarifs',          icon: CreditCard,      path: '/pricing'         },
]

function categoryColor(cat) {
  switch (cat) {
    case 'Page':    return { bg: '#e8f4fb', color: '#2563EB' }
    case 'Client':  return { bg: '#e6f4ea', color: '#2e7d32' }
    case 'Véhicule':return { bg: '#fff8e1', color: '#b45309' }
    default:        return { bg: '#f0f4f8', color: '#4f6272' }
  }
}

export default function SearchModal({ open, onClose }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef(null)

  const results = query.trim().length > 0
    ? STATIC_ITEMS.filter(item =>
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      )
    : []

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
    if (!open) setQuery('')
  }, [open])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  useEffect(() => {
    const handler = (e) => {
      if (!open) return
      if (e.key === 'Escape') {
        onClose()
        return
      }
      const list = query ? results : QUICK_ACTIONS
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex(i => Math.min(i + 1, list.length - 1))
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex(i => Math.max(i - 1, 0))
      }
      if (e.key === 'Enter') {
        const item = list[activeIndex]
        if (item) {
          navigate(item.path)
          onClose()
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, query, results, activeIndex, navigate, onClose])

  if (!open) return null

  const goTo = (path) => { navigate(path); onClose() }

  return (
    <div className="fixed inset-0 z-[300] flex items-start justify-center pt-20 px-4"
      style={{ background: 'rgba(10,18,40,0.8)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: '#fff', border: '1.5px solid #c8d6de' }}
        onClick={e => e.stopPropagation()}>

        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid #e5e7eb' }}>
          <Search size={16} style={{ color: '#8fa5b5', shrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Rechercher un client, véhicule, page..."
            className="flex-1 text-sm outline-none bg-transparent"
            style={{ color: '#131d2e' }}
          />
          <kbd className="hidden sm:flex items-center gap-0.5 text-xs px-2 py-1 rounded-lg font-mono"
            style={{ background: '#f0f4f8', color: '#8fa5b5', border: '1px solid #e5e7eb' }}>
            Esc
          </kbd>
        </div>

        {/* Content */}
        <div className="max-h-80 overflow-y-auto">
          {query.trim() === '' ? (
            <div className="p-4">
              <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: '#8fa5b5' }}>
                Actions rapides
              </p>
              <div className="space-y-1">
                {QUICK_ACTIONS.map((item, i) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => goTo(item.path)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all"
                      style={{
                        background: activeIndex === i ? '#e8f4fb' : 'transparent',
                        color: activeIndex === i ? '#2563EB' : '#131d2e',
                      }}
                      onMouseEnter={() => setActiveIndex(i)}>
                      <Icon size={15} style={{ color: activeIndex === i ? '#2563EB' : '#8fa5b5' }} />
                      <span className="text-sm font-semibold">{item.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm" style={{ color: '#8fa5b5' }}>Aucun résultat pour « {query} »</p>
            </div>
          ) : (
            <div className="p-3">
              {results.map((item, i) => {
                const Icon = item.icon
                const cat = categoryColor(item.category)
                return (
                  <button
                    key={item.id}
                    onClick={() => goTo(item.path)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all"
                    style={{ background: activeIndex === i ? '#e8f4fb' : 'transparent' }}
                    onMouseEnter={() => setActiveIndex(i)}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: activeIndex === i ? '#e8f4fb' : '#f0f4f8' }}>
                      <Icon size={13} style={{ color: activeIndex === i ? '#2563EB' : '#4f6272' }} />
                    </div>
                    <span className="flex-1 text-sm font-semibold" style={{ color: '#131d2e' }}>{item.label}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-lg"
                      style={{ background: cat.bg, color: cat.color }}>
                      {item.category}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2.5 flex items-center gap-3 text-xs" style={{ borderTop: '1px solid #e5e7eb', color: '#8fa5b5' }}>
          <span><kbd className="font-mono">↑↓</kbd> naviguer</span>
          <span><kbd className="font-mono">↵</kbd> ouvrir</span>
          <span><kbd className="font-mono">Esc</kbd> fermer</span>
        </div>
      </div>
    </div>
  )
}
