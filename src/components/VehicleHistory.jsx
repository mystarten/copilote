import React, { useState } from 'react'
import { ShieldCheck, ExternalLink, Info, ChevronDown, ChevronUp, FileText } from 'lucide-react'
import { PAYS_CONFIG } from '../lib/pays'

/**
 * VehicleHistory — Historique véhicule adapté par pays
 *
 * Props:
 *   vin   {string}  — numéro VIN (prioritaire)
 *   plaque {string} — plaque d'immatriculation
 *   pays  {string}  — code pays ISO (FR, DE, ES…) — défaut FR
 */
export default function VehicleHistory({ vin, plaque, pays = 'FR' }) {
  const [open, setOpen] = useState(false)

  const config = PAYS_CONFIG[pays] || PAYS_CONFIG.FR
  const hasVin    = vin   && vin.trim().length >= 5
  const hasPlaque = plaque && plaque.trim().length >= 3
  const canCheck  = hasVin || hasPlaque

  const histoUrl = config.historiqueUrl(hasVin ? vin.trim().toUpperCase() : null)
  const isImport = pays !== 'FR'

  return (
    <div style={{
      borderRadius: 12,
      border: `1.5px solid ${open ? '#ddd6fe' : '#e2e8f0'}`,
      background: open ? 'linear-gradient(135deg, #faf5ff, #f8fafc)' : '#f8fafc',
      overflow: 'hidden',
      transition: 'border-color 0.2s, background 0.2s',
    }}>
      {/* Header cliquable */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '12px 14px',
          background: 'none', border: 'none', cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: canCheck ? '#ede9fe' : '#f1f5f9',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ShieldCheck size={15} style={{ color: canCheck ? '#7c3aed' : '#94a3b8' }} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: canCheck ? '#5b21b6' : '#94a3b8' }}>
                Historique véhicule
              </p>
              <span style={{ fontSize: 14 }}>{config.flag}</span>
              {isImport && (
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 20,
                  background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a',
                }}>
                  Import {config.nom}
                </span>
              )}
            </div>
            <p style={{ margin: 0, fontSize: 11, color: '#94a3b8' }}>
              {canCheck
                ? (hasVin ? `VIN : ${vin.trim().toUpperCase()}` : `${config.plaqueLabel} : ${plaque}`)
                : 'Renseignez le VIN ou la plaque'}
            </p>
          </div>
        </div>
        {open
          ? <ChevronUp size={15} style={{ color: '#94a3b8' }} />
          : <ChevronDown size={15} style={{ color: '#94a3b8' }} />}
      </button>

      {/* Contenu déplié */}
      {open && (
        <div style={{ borderTop: '1px solid #ede9fe', padding: '14px' }}>

          {/* Lien historique officiel du pays */}
          <div style={{
            padding: '12px 14px', borderRadius: 10,
            background: 'linear-gradient(135deg, #ede9fe, #f5f3ff)',
            border: '1.5px solid #ddd6fe', marginBottom: 10,
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <ShieldCheck size={18} style={{ color: '#7c3aed', flexShrink: 0, marginTop: 1 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#5b21b6' }}>
                    {config.historiqueLabel}
                  </p>
                  <span style={{ fontSize: 13 }}>{config.flag}</span>
                </div>
                <p style={{ margin: '0 0 10px', fontSize: 12, color: '#6d28d9' }}>
                  {pays === 'FR'
                    ? 'Historique officiel : contrôles techniques, sinistres, changements de propriétaire.'
                    : `Historique officiel ${config.nom} — CT, sinistres, immatriculation.`}
                </p>
                {canCheck ? (
                  <a
                    href={histoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '8px 14px', borderRadius: 8,
                      background: '#7c3aed', color: '#fff',
                      fontSize: 12, fontWeight: 700,
                      textDecoration: 'none',
                      boxShadow: '0 2px 8px rgba(124,58,237,0.35)',
                    }}
                  >
                    <ExternalLink size={12} />
                    Vérifier sur {config.historiqueLabel}
                  </a>
                ) : (
                  <p style={{ margin: 0, fontSize: 12, color: '#7c3aed', fontStyle: 'italic' }}>
                    Ajoutez le VIN pour accéder directement au rapport.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Points vérifiés */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 10 }}>
            {[
              'Contrôles techniques',
              'Sinistres assurance',
              'Changements de proprio',
              'Situation administrative',
            ].map(item => (
              <div key={item} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 10px', borderRadius: 8,
                background: 'rgba(255,255,255,0.7)', border: '1px solid #e2e8f0',
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#7c3aed', flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: '#475569', fontWeight: 600 }}>{item}</span>
              </div>
            ))}
          </div>

          {/* Docs requis pour import étranger */}
          {isImport && config.docsImport.length > 0 && (
            <div style={{
              padding: '10px 12px', borderRadius: 8,
              background: '#fefce8', border: '1px solid #fde68a',
              marginBottom: 10,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <FileText size={13} style={{ color: '#92400e' }} />
                <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Documents requis (import {config.nom})
                </p>
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {config.docsImport.map(doc => (
                  <li key={doc} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#d97706', flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: '#78350f' }}>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Note gratuit / officiel */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 8,
            padding: '8px 10px', borderRadius: 8,
            background: '#f0fdf4', border: '1px solid #bbf7d0',
          }}>
            <Info size={13} style={{ color: '#16a34a', flexShrink: 0, marginTop: 1 }} />
            <p style={{ margin: 0, fontSize: 11, color: '#15803d' }}>
              {pays === 'FR'
                ? 'Service gratuit du Ministère de l\'Intérieur — aucune inscription requise.'
                : `Vérification via le VIN — valable pour tout véhicule ${config.nom}, gratuit.`}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
