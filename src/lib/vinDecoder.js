/**
 * Décodeur VIN — stratégie en 2 niveaux
 * 1. NHTSA vPIC (US gov, gratuit, sans clé, mondial)
 * 2. Fallback IA — Gemini Flash via OpenRouter (couvre tous les VINs EU)
 */

const FUEL_MAP = {
  'Gasoline': 'Essence', 'Petrol': 'Essence', 'Gas': 'Essence',
  'Diesel': 'Diesel', 'Gasoline/Diesel': 'Diesel',
  'Electric': 'Électrique', 'BEV': 'Électrique',
  'Hybrid': 'Hybride', 'HEV': 'Hybride',
  'Plug-in Hybrid': 'Hybride rechargeable', 'PHEV': 'Hybride rechargeable',
  'Natural Gas': 'GNV', 'Flex Fuel': 'Flex', 'Hydrogen': 'Hydrogène',
}

const BODY_MAP = {
  'Sedan/Saloon': 'Berline', 'Hatchback': 'Berline', 'Sedan': 'Berline',
  'SUV': 'SUV', 'Sport Utility Vehicle (SUV)': 'SUV',
  'Convertible/Cabriolet': 'Cabriolet', 'Coupe': 'Coupé',
  'Van': 'Utilitaire', 'Pickup': 'Pick-up', 'Wagon': 'Break',
  'Crossover': 'SUV', 'Minivan': 'Monospace',
}

/* ── Tier 1 : NHTSA vPIC (gratuit, sans clé) ──────────────── */
async function decodeViaNHTSA(vin) {
  const res = await fetch(
    `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${encodeURIComponent(vin)}?format=json`,
    { signal: AbortSignal.timeout(7000) }
  )
  if (!res.ok) return null
  const data = await res.json()
  const r = data.Results?.[0]
  if (!r) return null

  const marque = r.Make?.trim()
  const modele = r.Model?.trim()
  if (!marque || !modele) return null

  return {
    marque,
    modele,
    annee:       r.ModelYear?.trim()          || '',
    carburant:   FUEL_MAP[r.FuelTypePrimary]   || r.FuelTypePrimary?.trim() || '',
    carrosserie: BODY_MAP[r.BodyClass]         || r.BodyClass?.trim() || '',
    transmission: r.TransmissionStyle?.trim()  || '',
    cylindree:   r.DisplacementL
      ? `${parseFloat(r.DisplacementL).toFixed(1)}L` : '',
    chevaux_kw:  r.EnginePower_kW
      ? `${Math.round(Number(r.EnginePower_kW))} kW` : '',
    pays_fabrication: r.PlantCountry?.trim()   || '',
    serie:       r.Series?.trim()              || '',
    source: 'NHTSA',
  }
}

/* ── Tier 2 : IA Gemini Flash (fallback, VINs EU) ─────────── */
async function decodeViaAI(vin) {
  const apiKey = import.meta.env.VITE_OPENROUTER_KEY
  if (!apiKey) return null

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://pvoi.fr',
      'X-Title': 'PVOI Copilote',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.0-flash-001',
      messages: [{
        role: 'user',
        content: `You are a vehicle identification expert. Decode VIN: ${vin}

The WMI (first 3 chars: ${vin.slice(0, 3)}) identifies the manufacturer country and brand.
The model year is encoded in position 10 (${vin[9]}).

Return ONLY valid JSON, no other text:
{
  "marque": "BMW",
  "modele": "Série 3 320d",
  "annee": "2019",
  "carburant": "Diesel",
  "carrosserie": "Berline",
  "transmission": "Automatique",
  "cylindree": "2.0L",
  "pays_fabrication": "Allemagne"
}

carburant must be in French: Essence, Diesel, Électrique, Hybride, Hybride rechargeable, or "".
If you cannot identify, return empty strings for unknown fields but always include all keys.`,
      }],
      temperature: 0,
    }),
    signal: AbortSignal.timeout(12000),
  })

  if (!res.ok) return null
  const data = await res.json()
  const raw = data.choices?.[0]?.message?.content || ''
  const match = raw.match(/\{[\s\S]*\}/)
  if (!match) return null
  const info = JSON.parse(match[0])
  if (!info.marque) return null
  return { ...info, source: 'IA' }
}

/* ── Export principal ──────────────────────────────────────── */
export async function decodeVin(vin) {
  if (!vin || vin.length !== 17) throw new Error('VIN invalide (17 caractères requis)')

  const nhtsa = await decodeViaNHTSA(vin).catch(() => null)
  if (nhtsa) return nhtsa

  const ai = await decodeViaAI(vin).catch(() => null)
  if (ai) return ai

  throw new Error('VIN non reconnu')
}

/**
 * Lookup principal via N8N → Auto-Ways SIV
 * Fallback vers NHTSA + Gemini si N8N indisponible
 * @param {Object} params - { plaque?, vin?, pays? }
 */
export async function lookupVehicle({ plaque, vin, pays = 'FR' }) {
  const webhookUrl = import.meta.env.VITE_N8N_VEHICLE_LOOKUP_URL

  // Tenter N8N d'abord (SIV Auto-Ways)
  if (webhookUrl) {
    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plaque, vin, pays }),
        signal: AbortSignal.timeout(10000),
      })
      if (res.ok) {
        const data = await res.json()
        // N8N might return array
        const d = Array.isArray(data) ? data[0] : data
        if (d?.marque) return { ...d, via: 'SIV' }
      }
    } catch { /* fall through */ }
  }

  // Fallback: VIN via NHTSA + AI
  if (vin && vin.length === 17) {
    const decoded = await decodeVin(vin)
    return { ...decoded, via: 'VIN' }
  }

  throw new Error('Impossible de trouver le véhicule')
}
