import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, PlusCircle, BookOpen, LogOut, Building2, Users, CreditCard, Menu, X, BarChart2, Shield, Moon, Sun } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const navItems = [
  { path: '/dashboard',       icon: LayoutDashboard, label: 'Dashboard'        },
  { path: '/clients',         icon: Users,           label: 'Clients'          },
  { path: '/nouvelle-vente',  icon: PlusCircle,      label: 'Nouvelle Vente'   },
  { path: '/livre-de-police', icon: BookOpen,        label: 'Livre de Police'  },
  { path: '/stats',           icon: BarChart2,       label: 'Statistiques'     },
  { path: '/pricing',         icon: CreditCard,      label: 'Tarifs'           },
]

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { dark, toggle } = useTheme()

  return (
    <>
      <nav className="sea-nav fixed top-0 left-0 right-0 z-50 h-[70px] flex items-center px-4 md:px-8 gap-3 md:gap-6">

        {/* Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: '#2563EB' }}>
            <Shield size={18} className="text-white" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-white font-black text-base md:text-lg tracking-wide">COPILOTE</span>
            <span className="hidden sm:block text-[10px] font-semibold tracking-[0.2em] uppercase" style={{ color: '#8fa5b5' }}>Plateforme PVOI</span>
          </div>
        </div>

        <div className="hidden md:block w-px h-7 mx-1 shrink-0" style={{ background: '#2d3f55' }} />

        {/* Nav links — masqué sur mobile */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map(({ path, icon: Icon, label }) => (
            <NavLink key={path} to={path}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 lg:px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive ? 'text-white' : 'hover:text-white'
                }`
              }
              style={({ isActive }) => isActive
                ? { background: '#2563EB', color: '#fff' }
                : { color: '#8fa5b5' }
              }>
              <Icon size={15} />
              <span className="hidden lg:block">{label}</span>
            </NavLink>
          ))}
        </div>

        <div className="flex-1" />

        {/* Garage — desktop uniquement */}
        <button onClick={() => navigate('/settings')}
          className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl shrink-0 transition-all"
          style={{ background: '#1e2d42', border: '1px solid #2d3f55' }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#2563EB'}
          onMouseLeave={e => e.currentTarget.style.borderColor = '#2d3f55'}>
          {user?.logo
            ? <img src={user.logo} alt="logo" className="w-5 h-5 object-contain rounded" />
            : <Building2 size={14} style={{ color: '#8fa5b5' }} />
          }
          <span className="text-sm font-semibold text-white max-w-[120px] truncate">
            {user?.garageName || 'Mon Garage'}
          </span>
        </button>

        {/* Avatar — desktop */}
        <button onClick={() => navigate('/settings')}
          className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl shrink-0 transition-all"
          style={{ background: '#1e2d42', border: '1px solid #2d3f55' }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#2563EB'}
          onMouseLeave={e => e.currentTarget.style.borderColor = '#2d3f55'}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-black text-xs shrink-0"
            style={{ background: '#2563EB' }}>
            {user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <span className="text-sm hidden xl:block" style={{ color: '#8fa5b5' }}>{user?.email}</span>
        </button>

        {/* Dark mode toggle */}
        <button onClick={toggle}
          className="hidden md:flex items-center justify-center w-9 h-9 rounded-xl transition-all shrink-0"
          style={{ background: '#1e2d42', border: '1px solid #2d3f55' }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#2563EB'}
          onMouseLeave={e => e.currentTarget.style.borderColor = '#2d3f55'}
          title={dark ? 'Mode clair' : 'Mode sombre'}>
          {dark ? <Sun size={15} style={{ color: '#f59e0b' }} /> : <Moon size={15} style={{ color: '#8fa5b5' }} />}
        </button>

        {/* Logout — desktop */}
        <button onClick={onLogout}
          className="hidden md:flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl transition-all shrink-0"
          style={{ color: '#8fa5b5' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#ff6b6b'; e.currentTarget.style.background = 'rgba(255,107,107,0.1)' }}
          onMouseLeave={e => { e.currentTarget.style.color = '#8fa5b5'; e.currentTarget.style.background = 'transparent' }}>
          <LogOut size={14} />
        </button>

        {/* Hamburger — mobile */}
        <button onClick={() => setMobileOpen(v => !v)}
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl transition-all"
          style={{ background: '#1e2d42', border: '1px solid #2d3f55' }}>
          {mobileOpen ? <X size={18} className="text-white" /> : <Menu size={18} className="text-white" />}
        </button>
      </nav>

      {/* ── Menu mobile overlay ── */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 pt-[70px]"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setMobileOpen(false)}>
          <div className="h-full max-w-xs w-4/5 flex flex-col p-4 gap-2 shadow-2xl"
            style={{ background: '#131d2e', borderRight: '1px solid #1e2d42' }}
            onClick={e => e.stopPropagation()}>

            {/* Profil */}
            <button onClick={() => { navigate('/settings'); setMobileOpen(false) }}
              className="flex items-center gap-3 p-3 rounded-xl mb-2"
              style={{ background: '#1e2d42', border: '1px solid #2d3f55' }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-black text-sm shrink-0"
                style={{ background: '#2563EB' }}>
                {user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="text-left overflow-hidden">
                <p className="text-white text-sm font-bold truncate">{user?.garageName || 'Mon Garage'}</p>
                <p className="text-xs truncate" style={{ color: '#8fa5b5' }}>{user?.email}</p>
              </div>
            </button>

            {/* Nav items */}
            {navItems.map(({ path, icon: Icon, label }) => (
              <NavLink key={path} to={path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all`
                }
                style={({ isActive }) => isActive
                  ? { background: '#2563EB', color: '#fff' }
                  : { color: '#8fa5b5' }
                }>
                <Icon size={17} />
                {label}
              </NavLink>
            ))}

            <div className="flex-1" />

            {/* Logout */}
            <button onClick={() => { onLogout(); setMobileOpen(false) }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
              style={{ color: '#ff6b6b', background: 'rgba(255,107,107,0.08)' }}>
              <LogOut size={17} />
              Se déconnecter
            </button>
          </div>
        </div>
      )}

    </>
  )
}
