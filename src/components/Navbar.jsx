import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, PlusCircle, BookOpen, Shield, LogOut, Building2, Users } from 'lucide-react'

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/clients', icon: Users, label: 'Clients' },
  { path: '/nouvelle-vente', icon: PlusCircle, label: 'Nouvelle Vente' },
  { path: '/livre-de-police', icon: BookOpen, label: 'Livre de Police' },
]

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="glass-nav fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-6 gap-4">
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', boxShadow: '0 4px 12px rgba(37,99,235,0.4)' }}>
          <Shield size={16} className="text-white" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-white font-black text-base tracking-wide">COPILOTE</span>
          <span className="text-blue-400 text-xs font-bold tracking-widest">PVOI</span>
        </div>
      </div>

      <div className="w-px h-6 mx-1 shrink-0" style={{ background: 'rgba(255,255,255,0.1)' }} />

      <div className="flex items-center gap-0.5">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink key={path} to={path}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                isActive ? 'text-blue-300' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`
            }
            style={({ isActive }) => isActive
              ? { background: 'rgba(37,99,235,0.2)', border: '1px solid rgba(96,165,250,0.3)' }
              : { border: '1px solid transparent' }
            }
          >
            <Icon size={15} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg shrink-0"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <Building2 size={14} className="text-blue-400" />
        <span className="text-white text-sm font-medium">{user?.garageName || 'Garage Pro'}</span>
      </div>

      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg shrink-0"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
          {user?.email?.[0]?.toUpperCase() || 'J'}
        </div>
        <span className="text-slate-300 text-xs hidden lg:block">{user?.email || 'jean@garage.fr'}</span>
      </div>

      <button onClick={onLogout}
        className="flex items-center gap-1.5 text-slate-500 hover:text-red-400 text-xs transition-colors shrink-0">
        <LogOut size={14} />
        <span className="hidden lg:block">Quitter</span>
      </button>
    </nav>
  )
}
