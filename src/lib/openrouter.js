const API_KEY = import.meta.env.VITE_OPENROUTER_KEY

export async function estimatePrix({ marque, modele, annee, km, carburant }) {
  if (!API_KEY) throw new Error('VITE_OPENROUTER_KEY manquante dans .env')

  const kmStr = km ? `${Number(km).toLocaleString('fr-FR')} km` : 'kilométrage non précisé'
  const anneeStr = annee ? String(annee) : null
  const ageStr = anneeStr ? ` (${new Date().getFullYear() - parseInt(anneeStr)} ans)` : ''

  const prompt = `Tu es un expert en évaluation de véhicules d'occasion en France.

Recherche la cote ACTUELLE de ce véhicule sur le marché français (LeBonCoin, LaCentrale, AutoScout24, La Centrale, Aramisauto) en ${new Date().getFullYear()} :

Véhicule :
- Marque / Modèle : ${marque} ${modele}
- Année de mise en circulation : ${anneeStr ? `${anneeStr}${ageStr}` : 'non précisée'}
- Kilométrage : ${kmStr}
- Carburant : ${carburant || 'non précisé'}

IMPORTANT : L'année est un critère majeur de dépréciation. Adapte précisément les prix en fonction de l'âge du véhicule et du kilométrage. Un véhicule de ${anneeStr || 'cette année'} avec ${kmStr} a une valeur très différente d'un modèle plus récent ou plus ancien.

Réponds UNIQUEMENT en JSON valide avec ce format exact, sans texte avant ou après :
{
  "prix_bas": 15000,
  "prix_haut": 18000,
  "prix_recommande": 16500,
  "tendance": "stable",
  "delai_vente_jours": 21,
  "sources": ["LeBonCoin", "LaCentrale"],
  "conseil": "Court conseil de 1 phrase pour maximiser la vente"
}`

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://pvoi.fr',
      'X-Title': 'PVOI Copilote',
    },
    body: JSON.stringify({
      model: 'perplexity/sonar-pro-search',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `OpenRouter ${res.status}`)
  }

  const data = await res.json()
  const raw = data.choices?.[0]?.message?.content || '{}'

  // Extraire le JSON même si le modèle ajoute du texte autour
  const match = raw.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('Réponse non parsable')
  return JSON.parse(match[0])
}
