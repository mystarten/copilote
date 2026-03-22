/**
 * Auto Ways Network API
 * Base: https://app.auto-ways.net/api/
 * Doc:  https://app.swaggerhub.com/apis-docs/autowaysnetwork/AUTO-NOW/1.0.0
 */

const BASE = 'https://app.auto-ways.net/api'
const token = () => import.meta.env.VITE_AUTOWAYS_KEY

/* ── Mapping champs API → champs form Copilote ── */
function mapToForm(data) {
  return {
    marque:       data.marque        || data.make         || '',
    modele:       data.modele        || data.model        || '',
    annee:        String(data.annee  || data.year         || data.date_mise_en_circulation?.slice(0, 4) || ''),
    vin:          data.vin           || data.numero_serie || '',
    carburant:    mapCarburant(data.carburant || data.energie || data.fuel || ''),
    puissance:    data.puissance_ch  || data.puissance    || data.power_ch
                    ? String(data.puissance_ch || data.puissance || data.power_ch) + (String(data.puissance_ch || '').includes('ch') ? '' : ' ch')
                    : '',
    cylindree:    data.cylindree     || data.displacement || '',
    carrosserie:  data.carrosserie   || data.body_type    || '',
    couleur:      data.couleur       || data.color        || '',
    transmission: mapTransmission(data.transmission || data.boite || ''),
    co2:          data.co2           ? String(data.co2)  : '',
  }
}

function mapCarburant(raw) {
  const r = (raw || '').toLowerCase()
  if (r.includes('essence') || r.includes('gasoline') || r.includes('petrol') || r.includes('sp')) return 'Essence'
  if (r.includes('diesel') || r.includes('gazole') || r.includes('go'))  return 'Diesel'
  if (r.includes('electr') || r.includes('bev'))  return 'Électrique'
  if (r.includes('hybride') || r.includes('hybrid')) return 'Hybride'
  if (r.includes('gpl') || r.includes('lpg'))     return 'GPL'
  if (r.includes('gnv') || r.includes('cng'))     return 'GNV'
  return raw
}

function mapTransmission(raw) {
  const r = (raw || '').toLowerCase()
  if (r.includes('auto') || r.includes('cvt') || r.includes('dsg')) return 'Automatique'
  if (r.includes('man') || r.includes('mec'))  return 'Manuelle'
  return raw
}

/* ── Lookup par plaque FR ── */
export async function lookupByPlaque(plaque, pays = 'FR') {
  const key = token()
  if (!key) throw new Error('Clé API AutoWays manquante')

  const route = pays === 'ES' ? 'es' : pays === 'UK' ? 'uk' : 'fr'
  const url = `${BASE}/v1/${route}?plaque=${encodeURIComponent(plaque)}&token=${key}`

  const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
  if (res.status === 404) throw new Error('Véhicule non trouvé')
  if (res.status === 403) throw new Error('Token AutoWays invalide')
  if (!res.ok) throw new Error(`Erreur API (${res.status})`)

  const data = await res.json()
  return mapToForm(data)
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

  const data = await res.json()
  return mapToForm(data)
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
