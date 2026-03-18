import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, PlusCircle, BookOpen, Shield, LogOut, User } from 'lucide-react'

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
  { path: '/nouvelle-vente', icon: PlusCircle, label: 'Nouvelle Vente' },
  { path: '/livre-de-police', icon: BookOpen, label: 'Livre de Police' },
]

export default function Sidebar() {
  return (
    <div className="w-60 min-h-screen bg-[#0F172A] flex flex-col shrink-0">
      <div className="p-5 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield size={18} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm">Copilote PVOI</p>
            <p className="text-slate-400 text-xs">Admin Auto</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink key={path} to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                isActive
                  ? 'bg-blue-600/20 text-blue-400 border-l-2 border-blue-400 pl-[10px]'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }>
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
            <User size={14} className="text-slate-300" />
          </div>
          <div>
            <p className="text-white text-xs font-medium">Jean Dupont</p>
            <p className="text-slate-500 text-xs">Garage Pro Auto</p>
          </div>
        </div>
        <button className="flex items-center gap-2 text-slate-500 text-xs hover:text-red-400 transition-colors">
          <LogOut size={14} /> Déconnexion
        </button>
      </div>
    </div>
  )
}
