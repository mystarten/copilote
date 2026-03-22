/**
 * Rappels de sécurité via l'API NHTSA Recalls
 * Gratuit, sans clé, mondial (basé sur make/model/year)
 * https://api.nhtsa.gov/recalls/recallsByVehicle
 */
export async function getRecalls(make, model, year) {
  if (!make || !model || !year) return []
  try {
    const url = `https://api.nhtsa.gov/recalls/recallsByVehicle?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&modelYear=${year}`
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) })
    if (!res.ok) return []
    const data = await res.json()
    return (data.results || []).map(r => ({
      id:          r.NHTSACampaignNumber,
      date:        r.ReportReceivedDate ? r.ReportReceivedDate.split('T')[0] : '',
      composant:   r.Component         || '',
      resume:      r.Summary           || '',
      consequence: r.Consequence       || '',
      remede:      r.Remedy            || '',
      gravite:     detectGravite(r.Consequence || r.Summary || ''),
    }))
  } catch {
    return []
  }
}

function detectGravite(text) {
  const t = text.toLowerCase()
  if (t.includes('fire') || t.includes('incendi') || t.includes('crash') || t.includes('accident') || t.includes('bless') || t.includes('injur') || t.includes('fatal') || t.includes('mort')) return 'critical'
  if (t.includes('loss of control') || t.includes('perte de contrôle') || t.includes('brake') || t.includes('frein') || t.includes('steering') || t.includes('direction')) return 'high'
  return 'medium'
}
