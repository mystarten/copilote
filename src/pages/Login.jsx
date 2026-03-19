import React, { useState } from 'react'
import { Shield, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { supabase, authError } from '../lib/supabase'

const PILLS = [
  'PVOI en 4 minutes',
  'Livre de Police conforme',
  'Ventes France · Export · Import',
  'Documents officiels horodatés',
  'Base clients intégrée',
  '100% conforme CNPA',
]

// ── Logo ──────────────────────────────────────────────────────────────────────
function Logo({ dark = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: dark ? '#2563EB' : 'rgba(255,255,255,0.15)',
        border: dark ? 'none' : '1px solid rgba(255,255,255,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Shield size={18} color="#fff" />
      </div>
      <div>
        <div style={{ fontWeight: 900, fontSize: 15, letterSpacing: '0.08em', lineHeight: 1, color: dark ? '#131d2e' : '#fff' }}>
          COPILOTE
        </div>
        <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, color: dark ? '#8fa5b5' : 'rgba(255,255,255,0.55)' }}>
          Plateforme PVOI
        </div>
      </div>
    </div>
  )
}

// ── Panneau brand ─────────────────────────────────────────────────────────────
function BrandPanel({ isLogin }) {
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '3rem 2.5rem', color: '#fff', textAlign: 'center',
    }}>
      {/* Logo centré grand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Shield size={26} color="#fff" />
        </div>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontWeight: 300, fontSize: 28, letterSpacing: '0.06em', lineHeight: 1, color: 'rgba(255,255,255,0.85)' }}>COPILOTE</div>
          <div style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', opacity: 0.55, marginTop: 3 }}>
            Plateforme PVOI
          </div>
        </div>
      </div>

      {/* Titre/sous-titre mode inscription */}
      {!isLogin && (
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0, marginBottom: 8 }}>Bienvenue sur Copilote.</h2>
          <p style={{ fontSize: 14, opacity: 0.65, margin: 0 }}>
            La gestion administrative de votre garage, réinventée.
          </p>
        </div>
      )}

      {/* Pills animées */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 310 }}>
        {PILLS.map((pill, i) => (
          <div
            key={pill}
            className="fade-in"
            style={{
              padding: '9px 16px',
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              animationDelay: `${i * 90}ms`,
              animationFillMode: 'both',
            }}
          >
            {pill}
          </div>
        ))}
      </div>

      {/* Tagline */}
      <p style={{ marginTop: '2.5rem', fontSize: 12, fontStyle: 'italic', opacity: 0.65, maxWidth: 260 }}>
        La plateforme administrative des garages modernes.
      </p>
    </div>
  )
}

// ── Composant principal ───────────────────────────────────────────────────────
export default function Login({ onLogin }) {
  const [mode, setMode] = useState('login')
  const [contentVisible, setContentVisible] = useState(true)

  // Connexion
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  // Inscription
  const [sGarage, setSGarage]   = useState('')
  const [sEmail, setSEmail]     = useState('')
  const [sPass, setSPass]       = useState('')
  const [sConfirm, setSConfirm] = useState('')
  const [showSPass, setShowSPass] = useState(false)
  const [sLoading, setSLoading] = useState(false)
  const [sError, setSError]     = useState('')
  const [sSuccess, setSSuccess] = useState(false)

  const isLogin = mode === 'login'

  // Bascule avec fade du contenu
  const switchMode = (newMode) => {
    setContentVisible(false)
    setError(''); setSError('')
    setTimeout(() => {
      setMode(newMode)
      setContentVisible(true)
    }, 180)
  }

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    if (onLogin) {
      try { await onLogin(email, password) }
      catch (err) { setError(authError(err.message)); setLoading(false) }
      return
    }
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) { setError(authError(err.message)); setLoading(false) }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setSError('')
    if (sPass !== sConfirm) { setSError('Les mots de passe ne correspondent pas.'); return }
    setSLoading(true)
    const { data, error: err } = await supabase.auth.signUp({
      email: sEmail,
      password: sPass,
      options: { data: { garage_name: sGarage } },
    })
    if (err) { setSError(authError(err.message)); setSLoading(false); return }
    if (!data.session) setSSuccess(true)
    setSLoading(false)
  }

  // ── Formulaire connexion ─────────────────────────────────────────────────────
  const LoginForm = () => (
    <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: 380 }}>
      <h1 style={{ fontSize: 32, fontWeight: 900, color: '#131d2e', margin: 0, marginBottom: 8 }}>
        Bon retour.
      </h1>
      <p style={{ fontSize: 14, color: '#8fa5b5', margin: 0, marginBottom: 32 }}>
        Ravi de vous revoir. Connectez-vous à votre espace.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#2d3f55', marginBottom: 8 }}>
            Email
          </label>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="votre@garage.fr" className="sea-input"
            style={{ width: '100%' }} autoComplete="email" required
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#2d3f55', marginBottom: 8 }}>
            Mot de passe
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPass ? 'text' : 'password'} value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" className="sea-input"
              style={{ width: '100%', paddingRight: '3rem' }}
              autoComplete="current-password" required
            />
            <button
              type="button" onClick={() => setShowPass(v => !v)}
              style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#8fa5b5', display: 'flex', padding: 0 }}>
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div style={{ marginTop: 16, fontSize: 13, padding: '10px 14px', borderRadius: 10, background: 'rgba(220,38,38,0.07)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.18)' }}>
          {error}
        </div>
      )}

      <button
        type="submit" disabled={!email || !password || loading}
        style={{
          width: '100%', marginTop: 24, height: 48,
          borderRadius: 12, fontWeight: 600, fontSize: 15,
          color: '#fff', background: '#2563EB', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          opacity: (!email || !password || loading) ? 0.45 : 1,
          transition: 'opacity 200ms, background 200ms',
        }}
        onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#1D4ED8' }}
        onMouseLeave={e => { e.currentTarget.style.background = '#2563EB' }}
      >
        {loading
          ? <div style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} className="animate-spin" />
          : <><span>Se connecter</span><ArrowRight size={16} /></>
        }
      </button>

      <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <button
          type="button" onClick={() => switchMode('signup')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#8fa5b5' }}>
          Pas encore de compte ?{' '}
          <span style={{ color: '#2563EB', fontWeight: 700 }}>Créer un compte</span>
        </button>
        <button
          type="button"
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#b0bec5' }}>
          Mot de passe oublié ?
        </button>
      </div>
    </form>
  )

  // ── Formulaire inscription ───────────────────────────────────────────────────
  const SignupForm = () => {
    if (sSuccess) return (
      <div style={{ width: '100%', maxWidth: 380, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📬</div>
        <h3 style={{ fontSize: 20, fontWeight: 900, color: '#131d2e', margin: 0, marginBottom: 10 }}>
          Vérifiez votre email
        </h3>
        <p style={{ fontSize: 14, color: '#8fa5b5', margin: 0, marginBottom: 6 }}>
          Un lien de confirmation a été envoyé à
        </p>
        <p style={{ fontSize: 14, fontWeight: 700, color: '#131d2e', margin: 0 }}>{sEmail}</p>
        <p style={{ fontSize: 12, color: '#b0bec5', marginTop: 12 }}>
          Cliquez sur le lien pour activer votre compte et démarrer l'onboarding.
        </p>
      </div>
    )

    return (
      <form onSubmit={handleSignup} style={{ width: '100%', maxWidth: 380 }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#131d2e', margin: 0, marginBottom: 8 }}>
          Créer votre compte.
        </h1>
        <p style={{ fontSize: 14, color: '#8fa5b5', margin: 0, marginBottom: 28 }}>
          Commencez à générer vos documents en moins de 5 minutes.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#2d3f55', marginBottom: 7 }}>
              Nom du garage *
            </label>
            <input
              value={sGarage} onChange={e => setSGarage(e.target.value)}
              placeholder="Garage Dupont Auto" className="sea-input"
              style={{ width: '100%' }} required
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#2d3f55', marginBottom: 7 }}>
              Email professionnel *
            </label>
            <input
              type="email" value={sEmail} onChange={e => setSEmail(e.target.value)}
              placeholder="votre@garage.fr" className="sea-input"
              style={{ width: '100%' }} autoComplete="email" required
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#2d3f55', marginBottom: 7 }}>
                Mot de passe *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showSPass ? 'text' : 'password'} value={sPass}
                  onChange={e => setSPass(e.target.value)}
                  placeholder="Min. 6 car." className="sea-input"
                  style={{ width: '100%', paddingRight: '2.5rem', fontSize: 13 }}
                  autoComplete="new-password" required
                />
                <button
                  type="button" onClick={() => setShowSPass(v => !v)}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#8fa5b5', display: 'flex', padding: 0 }}>
                  {showSPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#2d3f55', marginBottom: 7 }}>
                Confirmer *
              </label>
              <input
                type="password" value={sConfirm} onChange={e => setSConfirm(e.target.value)}
                placeholder="••••••••" className="sea-input"
                style={{ width: '100%' }} autoComplete="new-password" required
              />
            </div>
          </div>
        </div>

        {sError && (
          <div style={{ marginTop: 14, fontSize: 13, padding: '10px 14px', borderRadius: 10, background: 'rgba(220,38,38,0.07)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.18)' }}>
            {sError}
          </div>
        )}

        <button
          type="submit" disabled={!sEmail || !sGarage || !sPass || !sConfirm || sLoading}
          style={{
            width: '100%', marginTop: 22, height: 48,
            borderRadius: 12, fontWeight: 600, fontSize: 15,
            color: '#fff', background: '#2563EB', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            opacity: (!sEmail || !sGarage || !sPass || !sConfirm || sLoading) ? 0.45 : 1,
            transition: 'opacity 200ms, background 200ms',
          }}
          onMouseEnter={e => { if (!sLoading) e.currentTarget.style.background = '#1D4ED8' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#2563EB' }}
        >
          {sLoading
            ? <div style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} className="animate-spin" />
            : <><span>Créer mon compte</span><ArrowRight size={16} /></>
          }
        </button>

        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <button
            type="button" onClick={() => switchMode('login')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#8fa5b5' }}>
            Déjà un compte ?{' '}
            <span style={{ color: '#2563EB', fontWeight: 700 }}>Se connecter</span>
          </button>
        </div>
      </form>
    )
  }

  // ── Rendu ────────────────────────────────────────────────────────────────────
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>

      {/* ── DESKTOP (≥ 768px) : deux panneaux glissants ── */}
      <div className="hidden md:block" style={{ width: '100%', height: '100%', position: 'relative' }}>

        {/* Panneau formulaire */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: '30%',
          background: '#ffffff',
          boxShadow: isLogin ? '-20px 0 60px rgba(0,0,0,0.3)' : '20px 0 60px rgba(0,0,0,0.3)',
          transform: isLogin ? 'translateX(0)' : 'translateX(233.33%)',
          transition: 'transform 500ms ease-in-out',
          display: 'flex', flexDirection: 'column',
          zIndex: 2,
        }}>
          {/* Logo top-left */}
          <div style={{ position: 'absolute', top: '1.75rem', left: '2rem' }}>
            <Logo dark />
          </div>

          {/* Contenu centré avec fade */}
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '5rem 40px 3rem',
            opacity: contentVisible ? 1 : 0,
            transition: 'opacity 200ms ease-in-out',
          }}>
            {isLogin ? LoginForm() : SignupForm()}
          </div>
        </div>

        {/* Panneau brand */}
        <div style={{
          position: 'absolute', left: '30%', top: 0, bottom: 0, width: '70%',
          background: 'linear-gradient(135deg, #060D1F 0%, #0F2460 40%, #1a3a8f 60%, #060D1F 100%)',
          transform: isLogin ? 'translateX(0)' : 'translateX(-42.86%)',
          transition: 'transform 500ms ease-in-out',
          zIndex: 1,
        }}>
          <BrandPanel isLogin={isLogin} />
        </div>
      </div>

      {/* ── MOBILE (< 768px) : colonne, fade uniquement ── */}
      <div
        className="md:hidden"
        style={{ width: '100%', height: '100%', overflowY: 'auto', background: '#eef2f5', display: 'flex', flexDirection: 'column' }}
      >
        {/* Brand header compact */}
        <div style={{
          background: 'linear-gradient(135deg, #060D1F 0%, #0F2460 50%, #1a3a8f 100%)',
          padding: '2rem 1.5rem',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={20} color="#fff" />
            </div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 18, letterSpacing: '0.06em', color: '#fff' }}>COPILOTE</div>
              <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.55, color: '#fff' }}>Plateforme PVOI</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
            {PILLS.slice(0, 3).map(pill => (
              <span key={pill} style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#fff', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', padding: '5px 12px', borderRadius: 999 }}>
                {pill}
              </span>
            ))}
          </div>
        </div>

        {/* Formulaire */}
        <div style={{
          flex: 1, padding: '2rem 1.5rem',
          opacity: contentVisible ? 1 : 0,
          transition: 'opacity 200ms ease-in-out',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          {isLogin ? LoginForm() : SignupForm()}
        </div>
      </div>
    </div>
  )
}
