import React, { useState } from 'react'
import { TrendingUp, TrendingDown, Minus, Sparkles, AlertCircle, ChevronRight, Clock } from 'lucide-react'
import { estimatePrix } from '../lib/openrouter'

const TENDANCE = {
  hausse:  { icon: TrendingUp,   color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', label: 'En hausse' },
  stable:  { icon: Minus,        color: '#2563EB', bg: '#eff6ff', border: '#bfdbfe', label: 'Stable'    },
  baisse:  { icon: TrendingDown, color: '#dc2626', bg: '#fef2f2', border: '#fecaca', label: 'En baisse' },
}

export default function PriceEstimator({ marque, modele, annee, km, carburant }) {
  const [state, setState] = useState('idle') // idle | loading | done | error
  const [result, setResult] = useState(null)
  const [error, setError]   = useState('')

  const canEstimate = marque && modele

  const handleEstimate = async () => {
    if (!canEstimate || state === 'loading') return
    setState('loading')
    setError('')
    try {
      const data = await estimatePrix({ marque, modele, annee, km, carburant })
      setResult(data)
      setState('done')
    } catch (e) {
      setError(e.message || 'Erreur inconnue')
      setState('error')
    }
  }

  const fmt = (n) => n ? Number(n).toLocaleString('fr-FR') + ' €' : '—'

  /* ── Idle ── */
  if (state === 'idle') return (
    <button
      onClick={handleEstimate}
      disabled={!canEstimate}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', borderRadius: 12, cursor: canEstimate ? 'pointer' : 'not-allowed',
        background: canEstimate ? 'linear-gradient(135deg, #eff6ff, #f0fdf4)' : '#f1f5f9',
        border: `1.5px solid ${canEstimate ? '#bfdbfe' : '#e2e8f0'}`,
        transition: 'all 0.2s',
      }}
      onMouseEnter={e => canEstimate && (e.currentTarget.style.borderColor = '#2563EB')}
      onMouseLeave={e => canEstimate && (e.currentTarget.style.borderColor = '#bfdbfe')}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: canEstimate ? '#dbeafe' : '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Sparkles size={15} style={{ color: canEstimate ? '#2563EB' : '#94a3b8' }} />
        </div>
        <div style={{ textAlign: 'left' }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: canEstimate ? '#1e40af' : '#94a3b8' }}>
            Estimer la cote marché
          </p>
          <p style={{ margin: 0, fontSize: 11, color: '#94a3b8' }}>
            {canEstimate ? 'IA · données web en temps réel' : 'Sélectionnez un véhicule'}
          </p>
        </div>
      </div>
      {canEstimate && <ChevronRight size={15} style={{ color: '#2563EB' }} />}
    </button>
  )

  /* ── Loading ── */
  if (state === 'loading') return (
    <div style={{ borderRadius: 12, border: '1.5px solid #e2e8f0', padding: '16px', background: '#f8fafc' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Sparkles size={15} style={{ color: '#2563EB', animation: 'pulse 1.2s ease-in-out infinite' }} />
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#1e40af' }}>Analyse du marché en cours…</p>
          <p style={{ margin: 0, fontSize: 11, color: '#94a3b8' }}>Recherche sur LeBonCoin, LaCentrale, AutoScout24…</p>
        </div>
      </div>
      <div className="skeleton" style={{ height: 14, borderRadius: 8, marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 14, borderRadius: 8, width: '75%', marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 56, borderRadius: 10 }} />
    </div>
  )

  /* ── Error ── */
  if (state === 'error') return (
    <div style={{ borderRadius: 12, border: '1.5px solid #fecaca', padding: '12px 14px', background: '#fef2f2', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <AlertCircle size={16} style={{ color: '#dc2626', flexShrink: 0, marginTop: 2 }} />
      <div style={{ flex: 1 }}>
        <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 700, color: '#dc2626' }}>Erreur d'estimation</p>
        <p style={{ margin: '0 0 8px', fontSize: 12, color: '#ef4444' }}>{error}</p>
        <button onClick={() => setState('idle')} style={{ fontSize: 12, fontWeight: 600, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>
          Réessayer
        </button>
      </div>
    </div>
  )

  /* ── Result ── */
  const tendance = TENDANCE[result?.tendance] || TENDANCE.stable
  const TrendIcon = tendance.icon
  const range = result.prix_haut - result.prix_bas
  const recoPct = range > 0 ? ((result.prix_recommande - result.prix_bas) / range) * 100 : 50

  return (
    <div style={{ borderRadius: 14, border: '1.5px solid #bfdbfe', background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)', overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #dbeafe' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={14} style={{ color: '#2563EB' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#1e40af', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Cote marché estimée</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 8px', borderRadius: 20, background: tendance.bg, border: `1px solid ${tendance.border}` }}>
          <TrendIcon size={11} style={{ color: tendance.color }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: tendance.color }}>{tendance.label}</span>
        </div>
      </div>

      {/* Prix */}
      <div style={{ padding: '14px' }}>
        {/* Fourchette */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 6 }}>
          <div>
            <p style={{ margin: 0, fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>Fourchette</p>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0f172a' }}>{fmt(result.prix_bas)} — {fmt(result.prix_haut)}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>Prix conseillé</p>
            <p style={{ margin: 0, fontSize: 20, fontWeight: 900, color: '#16a34a' }}>{fmt(result.prix_recommande)}</p>
          </div>
        </div>

        {/* Barre de range */}
        <div style={{ position: 'relative', marginBottom: 14 }}>
          <div style={{ height: 8, borderRadius: 10, background: 'linear-gradient(90deg, #fde68a, #86efac, #6ee7b7)', position: 'relative' }}>
            {/* Curseur prix conseillé */}
            <div style={{
              position: 'absolute', top: '50%', transform: 'translate(-50%, -50%)',
              left: `${Math.min(Math.max(recoPct, 5), 95)}%`,
              width: 16, height: 16, borderRadius: '50%',
              background: '#fff', border: '3px solid #16a34a',
              boxShadow: '0 2px 8px rgba(22,163,74,0.4)',
              zIndex: 1,
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <span style={{ fontSize: 10, color: '#94a3b8' }}>Bas de marché</span>
            <span style={{ fontSize: 10, color: '#94a3b8' }}>Haut de marché</span>
          </div>
        </div>

        {/* Délai + conseil */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          {result.delai_vente_jours && (
            <div style={{ flex: 1, padding: '8px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.7)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Clock size={12} style={{ color: '#6366f1', flexShrink: 0 }} />
              <div>
                <p style={{ margin: 0, fontSize: 10, color: '#94a3b8' }}>Délai moyen</p>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{result.delai_vente_jours} jours</p>
              </div>
            </div>
          )}
          {result.sources?.length > 0 && (
            <div style={{ flex: 1, padding: '8px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.7)', border: '1px solid #e2e8f0' }}>
              <p style={{ margin: '0 0 2px', fontSize: 10, color: '#94a3b8' }}>Sources</p>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: '#475569' }}>{result.sources.slice(0, 2).join(', ')}</p>
            </div>
          )}
        </div>

        {result.conseil && (
          <div style={{ padding: '8px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.8)', border: '1px solid #dbeafe' }}>
            <p style={{ margin: 0, fontSize: 12, color: '#1e40af', fontStyle: 'italic' }}>💡 {result.conseil}</p>
          </div>
        )}

        <button onClick={() => setState('idle')} style={{ marginTop: 10, width: '100%', fontSize: 11, color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0' }}>
          Actualiser
        </button>
      </div>
    </div>
  )
}
