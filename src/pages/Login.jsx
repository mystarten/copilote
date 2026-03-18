import React, { useState } from 'react'
import { Shield, Eye, EyeOff, ArrowRight } from 'lucide-react'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    if (!email || !password) return
    setLoading(true)
    setTimeout(() => {
      onLogin({ email, garageName: 'Garage Dupont Auto' })
    }, 1400)
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #060D1F 0%, #0F2460 40%, #1a3a8f 60%, #060D1F 100%)' }}
    >
      {/* Blobs liquides */}
      <div className="blob absolute top-10 left-16 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.35) 0%, transparent 70%)' }} />
      <div className="blob2 absolute bottom-10 right-10 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(96,165,250,0.2) 0%, transparent 70%)' }} />
      <div className="blob3 absolute top-1/2 left-1/2 w-[300px] h-[300px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)' }} />

      {/* Card */}
      <div className="glass-card rounded-3xl p-10 w-full max-w-md mx-4 relative z-10 fade-in">

        {/* Logo */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5"
            style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)', boxShadow: '0 8px 32px rgba(37,99,235,0.4)' }}
          >
            <Shield size={30} className="text-white" />
          </div>
          <h1 className="text-5xl font-black text-white tracking-tight leading-none">COPILOTE</h1>
          <p className="text-blue-400 text-xs font-bold tracking-[0.3em] mt-2 uppercase">Plateforme Admin PVOI</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-blue-300 text-xs font-semibold uppercase tracking-widest mb-2 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="votre@garage.fr"
              className="glass-input w-full px-4 py-3.5 rounded-xl text-sm transition-all"
            />
          </div>
          <div>
            <label className="text-blue-300 text-xs font-semibold uppercase tracking-widest mb-2 block">Mot de passe</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="glass-input w-full px-4 py-3.5 pr-12 rounded-xl text-sm transition-all"
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400 hover:text-white transition-colors">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={!email || !password || loading}
            className="w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all mt-2 disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)', boxShadow: '0 4px 24px rgba(37,99,235,0.35)' }}
          >
            {loading
              ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <><span>Accéder à la plateforme</span><ArrowRight size={16} /></>
            }
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-white/10 text-center">
          <p className="text-blue-400/50 text-xs">Démo · Tous les identifiants fonctionnent</p>
        </div>
      </div>
    </div>
  )
}
