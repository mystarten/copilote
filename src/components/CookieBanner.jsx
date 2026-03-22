import React, { useState, useEffect } from 'react'
import { Cookie, X, Check, Settings } from 'lucide-react'

const STORAGE_KEY = 'copilote_cookie_consent'

export default function CookieBanner() {
  const [visible, setVisible]   = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [prefs, setPrefs]       = useState({ necessary: true, analytics: false })

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) setVisible(true)
  }, [])

  const accept = (all = true) => {
    const consent = { necessary: true, analytics: all, date: new Date().toISOString() }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent))
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed', bottom: 16, left: 16, right: 16, zIndex: 9999,
      maxWidth: 520, margin: '0 auto',
    }}>
      <div style={{
        background: 'var(--bg-card)',
        border: '1.5px solid var(--border)',
        borderRadius: 16,
        boxShadow: 'var(--shadow-xl)',
        padding: expanded ? 20 : 16,
        transition: 'all 0.2s',
      }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: expanded ? 16 : 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Cookie size={17} style={{ color: 'var(--accent)' }} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>
              Gestion des cookies
            </p>
            <p style={{ margin: '3px 0 0', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Nous utilisons des cookies strictement nécessaires au fonctionnement. Des cookies analytiques peuvent nous aider à améliorer le service.
            </p>
          </div>
          <button onClick={() => accept(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2, flexShrink: 0 }}>
            <X size={15} />
          </button>
        </div>

        {/* Preferences détaillées */}
        {expanded && (
          <div style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { key: 'necessary', label: 'Cookies nécessaires', desc: 'Session, sécurité, préférences. Toujours actifs.', locked: true },
              { key: 'analytics', label: 'Cookies analytiques', desc: 'Mesure d\'audience anonymisée pour améliorer Copilote.', locked: false },
            ].map(item => (
              <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 10, background: 'var(--bg-input)' }}>
                <div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{item.label}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--text-secondary)' }}>{item.desc}</p>
                </div>
                <button
                  disabled={item.locked}
                  onClick={() => setPrefs(p => ({ ...p, [item.key]: !p[item.key] }))}
                  style={{
                    width: 38, height: 22, borderRadius: 11, border: 'none', cursor: item.locked ? 'default' : 'pointer',
                    background: (item.locked || prefs[item.key]) ? 'var(--accent)' : 'var(--border)',
                    position: 'relative', flexShrink: 0, transition: 'background 0.2s',
                  }}>
                  <span style={{
                    position: 'absolute', top: 2, width: 18, height: 18, borderRadius: '50%', background: '#fff',
                    left: (item.locked || prefs[item.key]) ? 18 : 2, transition: 'left 0.2s',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  }} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={() => accept(true)}
            style={{ flex: 1, minWidth: 120, padding: '9px 14px', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13, background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Check size={13} /> Tout accepter
          </button>
          {!expanded ? (
            <button onClick={() => setExpanded(true)}
              style={{ padding: '9px 14px', borderRadius: 10, border: '1.5px solid var(--border)', cursor: 'pointer', fontWeight: 600, fontSize: 13, background: 'var(--bg-input)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
              <Settings size={13} /> Personnaliser
            </button>
          ) : (
            <button onClick={() => accept(prefs.analytics)}
              style={{ padding: '9px 14px', borderRadius: 10, border: '1.5px solid var(--border)', cursor: 'pointer', fontWeight: 600, fontSize: 13, background: 'var(--bg-input)', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
              Sauvegarder
            </button>
          )}
          <button onClick={() => accept(false)}
            style={{ padding: '9px 14px', borderRadius: 10, border: '1.5px solid var(--border)', cursor: 'pointer', fontWeight: 600, fontSize: 13, background: 'none', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
            Refuser
          </button>
        </div>

        {/* Lien politique */}
        <p style={{ margin: '10px 0 0', fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>
          En savoir plus sur notre{' '}
          <a href="/legal#confidentialite" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
            politique de confidentialité
          </a>
        </p>
      </div>
    </div>
  )
}
