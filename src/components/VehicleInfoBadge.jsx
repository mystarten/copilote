import React from 'react'
import { CheckCircle, Zap, Fuel, Calendar } from 'lucide-react'

export default function VehicleInfoBadge({ info }) {
  if (!info?.marque) return null
  return (
    <div style={{
      padding: '10px 12px', borderRadius: 10,
      background: 'linear-gradient(135deg, #f0fdf4, #eff6ff)',
      border: '1.5px solid #bbf7d0',
      display: 'flex', flexDirection: 'column', gap: 6,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <CheckCircle size={13} style={{ color: '#16a34a' }} />
        <span style={{ fontSize: 13, fontWeight: 800, color: '#15803d' }}>
          {info.marque} {info.modele}
        </span>
        {info.annee && <span style={{ fontSize: 12, color: '#94a3b8' }}>· {info.annee}</span>}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {info.carburant && (
          <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: '#dbeafe', color: '#1e40af', fontWeight: 600 }}>
            ⛽ {info.carburant}
          </span>
        )}
        {info.puissance_ch && (
          <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: '#fef3c7', color: '#92400e', fontWeight: 600 }}>
            ⚡ {info.puissance_ch}
          </span>
        )}
        {info.carrosserie && (
          <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: '#f3f4f6', color: '#374151', fontWeight: 600 }}>
            🚗 {info.carrosserie}
          </span>
        )}
        {info.co2 && (
          <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: '#dcfce7', color: '#166534', fontWeight: 600 }}>
            🌱 {info.co2}g CO₂
          </span>
        )}
        {info.via && (
          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: '#f1f5f9', color: '#94a3b8' }}>
            via {info.via === 'SIV' ? 'SIV ANTS' : info.via === 'VIN' ? 'VIN Decoder' : info.via}
          </span>
        )}
      </div>
    </div>
  )
}
