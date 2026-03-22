import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { getDefaultVehiclePhoto } from '../lib/vehiclePhoto'
import { Shield, Phone, MapPin, Fuel, Gauge, Calendar, Palette, Settings2, Hash, ExternalLink } from 'lucide-react'

export default function VehiclePublic() {
  const { id } = useParams()
  const [vehicle, setVehicle] = useState(null)
  const [garage, setGarage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    async function load() {
      // 1. Essai lecture depuis les données encodées dans l'URL (fonctionne sans policy DB)
      try {
        const params = new URLSearchParams(window.location.search)
        const encoded = params.get('d')
        if (encoded) {
          const meta = JSON.parse(decodeURIComponent(atob(encoded)))
          setVehicle({
            marque:      meta.m  || '',
            modele:      meta.mo || '',
            annee:       meta.a  || null,
            km:          meta.k  || null,
            carburant:   meta.c  || null,
            puissance:   meta.p  || null,
            carrosserie: meta.ca || null,
            couleur:     meta.co || null,
            plaque:      meta.pl || '',
            statut:      meta.s  || 'stock',
            prix_achat:  meta.pa || null,
            photos:      meta.ph ? [meta.ph] : [],
          })
        }
      } catch { /* ignore */ }

      // 2. Essai lecture depuis Supabase (si policy publique activée → données complètes + garage)
      try {
        const { data: v } = await supabase
          .from('livre_de_police')
          .select('*')
          .eq('id', id)
          .single()

        if (v) {
          setVehicle(v)
          const { data: p } = await supabase
            .from('profiles')
            .select('garage_name, telephone, adresse, ville, logo_url, site_web')
            .eq('user_id', v.user_id)
            .single()
          if (p) setGarage(p)
        }
      } catch { /* noop — fonctionne sans policy */ }

      setLoading(false)
    }
    load()
  }, [id])

  const photo = (!imgError && vehicle?.photos?.[0])
    ? vehicle.photos[0]
    : getDefaultVehiclePhoto(vehicle?.marque, vehicle?.modele)

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#060D1F' }}>
      <div style={{ width: 40, height: 40, border: '3px solid rgba(255,255,255,0.15)', borderTopColor: '#2563EB', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )

  if (!vehicle) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#060D1F', gap: 16, padding: 24 }}>
      <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Shield size={26} color="#fff" />
      </div>
      <p style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>Véhicule introuvable</p>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, textAlign: 'center' }}>Ce lien est peut-être expiré ou le véhicule a été retiré.</p>
    </div>
  )

  const prix = vehicle.prix_achat ? `${Number(vehicle.prix_achat).toLocaleString('fr-FR')} €` : null
  const km   = vehicle.km ? `${Number(vehicle.km).toLocaleString('fr-FR')} km` : null

  const specs = [
    vehicle.annee      && { icon: Calendar,  label: 'Année',        value: vehicle.annee },
    km                 && { icon: Gauge,      label: 'Kilométrage',  value: km },
    vehicle.carburant  && { icon: Fuel,       label: 'Carburant',    value: vehicle.carburant },
    vehicle.puissance  && { icon: Settings2,  label: 'Puissance',    value: `${vehicle.puissance} ch` },
    vehicle.carrosserie&& { icon: Shield,     label: 'Carrosserie',  value: vehicle.carrosserie },
    vehicle.couleur    && { icon: Palette,    label: 'Couleur',      value: vehicle.couleur },
    vehicle.transmission && { icon: Settings2, label: 'Transmission', value: vehicle.transmission },
    vehicle.vin        && { icon: Hash,       label: 'VIN',          value: vehicle.vin },
  ].filter(Boolean)

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* Navbar garage */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {garage?.logo_url
            ? <img src={garage.logo_url} alt="Logo" style={{ height: 32, width: 32, objectFit: 'contain', borderRadius: 6 }} />
            : <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield size={16} color="#fff" />
              </div>
          }
          <span style={{ fontWeight: 800, color: '#131d2e', fontSize: 15 }}>
            {garage?.garage_name || 'Garage'}
          </span>
        </div>
        {garage?.telephone && (
          <a href={`tel:${garage.telephone}`}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#2563EB', color: '#fff', padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
            <Phone size={13} /> {garage.telephone}
          </a>
        )}
      </div>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '24px 16px 60px' }}>

        {/* Photo principale */}
        <div style={{ borderRadius: 20, overflow: 'hidden', height: 340, background: '#e2e8f0', position: 'relative', marginBottom: 20 }}>
          <img
            src={photo}
            alt={`${vehicle.marque} ${vehicle.modele}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={() => setImgError(true)}
          />
          {/* Galerie miniatures si plusieurs photos */}
          {vehicle.photos?.length > 1 && (
            <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
              {vehicle.photos.slice(0, 5).map((_, i) => (
                <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i === 0 ? '#fff' : 'rgba(255,255,255,0.5)' }} />
              ))}
            </div>
          )}
          {/* Badge statut */}
          <div style={{ position: 'absolute', top: 14, right: 14 }}>
            <span style={{
              background: vehicle.statut === 'vendu' ? '#fee2e2' : '#dcfce7',
              color: vehicle.statut === 'vendu' ? '#dc2626' : '#16a34a',
              border: `1px solid ${vehicle.statut === 'vendu' ? '#fca5a5' : '#86efac'}`,
              fontWeight: 800, fontSize: 12, padding: '5px 12px', borderRadius: 20
            }}>
              {vehicle.statut === 'vendu' ? '✗ Vendu' : '✓ Disponible'}
            </span>
          </div>
        </div>

        {/* Galerie miniatures si plusieurs photos */}
        {vehicle.photos?.length > 1 && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto' }}>
            {vehicle.photos.map((url, i) => (
              <img key={i} src={url} alt={`Photo ${i+1}`}
                style={{ width: 72, height: 54, objectFit: 'cover', borderRadius: 10, flexShrink: 0, border: '2px solid #e2e8f0', cursor: 'pointer' }}
              />
            ))}
          </div>
        )}

        {/* Titre + Prix */}
        <div style={{ background: '#fff', borderRadius: 20, padding: 24, marginBottom: 16, border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: '#131d2e', lineHeight: 1.1 }}>
                {vehicle.marque} {vehicle.modele}
              </h1>
              {vehicle.annee && (
                <p style={{ margin: '4px 0 0', fontSize: 14, color: '#8fa5b5', fontWeight: 600 }}>Millésime {vehicle.annee}</p>
              )}
            </div>
            {prix && (
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <p style={{ margin: 0, fontSize: 28, fontWeight: 900, color: '#2563EB' }}>{prix}</p>
                <p style={{ margin: '2px 0 0', fontSize: 11, color: '#8fa5b5' }}>Prix de cession</p>
              </div>
            )}
          </div>

          {vehicle.plaque && (
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
              <span style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 800, padding: '4px 12px', borderRadius: 8, background: '#eff6ff', color: '#2563EB', border: '1px solid #bfdbfe' }}>
                {vehicle.plaque}
              </span>
            </div>
          )}
        </div>

        {/* Caractéristiques techniques */}
        {specs.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 20, padding: 24, marginBottom: 16, border: '1px solid #e2e8f0' }}>
            <p style={{ margin: '0 0 16px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8fa5b5' }}>
              Caractéristiques
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {specs.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <s.icon size={15} color="#4f6272" />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 10, color: '#8fa5b5', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
                    <p style={{ margin: 0, fontSize: 13, color: '#131d2e', fontWeight: 700 }}>{s.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact garage */}
        {garage && (
          <div style={{ background: 'linear-gradient(135deg, #1e3a6e, #2563EB)', borderRadius: 20, padding: 24, color: '#fff' }}>
            <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 700, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Vendu par
            </p>
            <p style={{ margin: '0 0 16px', fontSize: 20, fontWeight: 900 }}>{garage.garage_name}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {garage.telephone && (
                <a href={`tel:${garage.telephone}`}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
                  <Phone size={15} style={{ opacity: 0.7 }} /> {garage.telephone}
                </a>
              )}
              {(garage.adresse || garage.ville) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, opacity: 0.8 }}>
                  <MapPin size={15} style={{ opacity: 0.7 }} />
                  {[garage.adresse, garage.ville].filter(Boolean).join(', ')}
                </div>
              )}
              {garage.site_web && (
                <a href={garage.site_web} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#93c5fd', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
                  <ExternalLink size={14} /> {garage.site_web}
                </a>
              )}
            </div>
            {garage.telephone && (
              <a href={`tel:${garage.telephone}`}
                style={{ display: 'block', marginTop: 20, background: '#fff', color: '#2563EB', textAlign: 'center', padding: '14px', borderRadius: 12, fontWeight: 800, fontSize: 15, textDecoration: 'none' }}>
                📞 Nous contacter
              </a>
            )}
          </div>
        )}

        {/* Footer Copilote */}
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: '#b0bec5' }}>
            Fiche générée par{' '}
            <span style={{ fontWeight: 700, color: '#2563EB' }}>Copilote</span>
            {' '}— Gestion de parc automobile
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
