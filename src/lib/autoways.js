/**
 * Auto Ways Network API
 * Base: https://app.auto-ways.net/api/
 * Réponse: { data: { AWN_marque, AWN_modele, AWN_energie, ... } }
 */

const BASE = 'https://app.auto-ways.net/api'
const token = () => import.meta.env.VITE_AUTOWAYS_KEY

/* ── Mapping AWN_ → champs form Copilote ── */
function mapToForm(d) {
  return {
    marque:       d.AWN_marque        || '',
    modele:       d.AWN_modele        || d.AWN_version || '',
    annee:        String(d.AWN_millesime || d.AWN_date_mise_circulation?.slice(0, 4) || ''),
    vin:          d.AWN_VIN           || '',
    carburant:    mapCarburant(d.AWN_energie || ''),
    puissance:    d.AWN_puissance_chevaux
                    ? `${d.AWN_puissance_chevaux} ch`
                    : d.AWN_puissance_KW
                    ? `${d.AWN_puissance_KW} kW`
                    : '',
    cylindree:    d.AWN_cylindree_liters
                    ? `${d.AWN_cylindree_liters}L`
                    : '',
    carrosserie:  d.AWN_carrosserie   || '',
    couleur:      d.AWN_couleur       || '',
    transmission: mapTransmission(d.AWN_type_boite_vites || ''),
    co2:          d.AWN_co2           ? String(d.AWN_co2) : '',
  }
}

function mapCarburant(raw) {
  const r = (raw || '').toLowerCase()
  if (r.includes('essence') || r.includes('sp') || r.includes('petrol') || r.includes('gasoline')) return 'Essence'
  if (r.includes('diesel') || r.includes('gazole') || r.includes('go')) return 'Diesel'
  if (r.includes('electr') || r.includes('bev'))  return 'Électrique'
  if (r.includes('hybride') || r.includes('hybrid')) return 'Hybride'
  if (r.includes('gpl') || r.includes('lpg'))     return 'GPL'
  if (r.includes('gnv') || r.includes('cng'))     return 'GNV'
  return raw
}

function mapTransmission(raw) {
  const r = (raw || '').toLowerCase()
  if (r.includes('auto') || r.includes('cvt') || r.includes('dsg') || r === 'a') return 'Automatique'
  if (r.includes('man') || r.includes('mec') || r === 'm') return 'Manuelle'
  return raw
}

/* ── Lookup par plaque FR/ES/UK ── */
export async function lookupByPlaque(plaque, pays = 'FR') {
  const key = token()
  if (!key) throw new Error('Clé API AutoWays manquante')

  const route = pays === 'ES' ? 'es' : pays === 'UK' ? 'uk' : 'fr'
  const url = `${BASE}/v1/${route}?plaque=${encodeURIComponent(plaque)}&token=${key}`

  const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
  if (res.status === 404) throw new Error('Véhicule non trouvé')
  if (res.status === 403) throw new Error('Token AutoWays invalide')
  if (!res.ok) throw new Error(`Erreur API (${res.status})`)

  const json = await res.json()
  if (json.error) throw new Error(json.message || 'Véhicule non trouvé')

  const d = json.data || json
  return mapToForm(d)
}

/* ── Lookup par VIN ── */
export async function lookupByVin(vin) {
  const key = token()
  if (!key) throw new Error('Clé API AutoWays manquante')

  const url = `${BASE}/v1/vin?vin=${encodeURIComponent(vin)}&token=${key}`

  const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
  if (res.status === 404) throw new Error('VIN non trouvé')
  if (res.status === 403) throw new Error('Token AutoWays invalide')
  if (!res.ok) throw new Error(`Erreur API (${res.status})`)

  const json = await res.json()
  if (json.error) throw new Error(json.message || 'VIN non trouvé')

  const d = json.data || json
  return mapToForm(d)
}

/* ── Calcul prix carte grise ── */
export async function calcPrixCG(plaque, departement, demarche = 'particulier') {
  const key = token()
  if (!key) throw new Error('Clé API AutoWays manquante')

  const url = `${BASE}/v1/prixcg/calc?plaque=${encodeURIComponent(plaque)}&departement=${encodeURIComponent(departement)}&demarche=${demarche}&token=${key}`

  const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
  if (!res.ok) throw new Error(`Erreur calcul CG (${res.status})`)
  return res.json()
}
