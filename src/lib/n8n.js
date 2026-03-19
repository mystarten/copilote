// ── Intégration N8N — webhook central de génération de documents ──────────────
// Toutes les demandes de génération PDF passent par ici.
// N8N traite et rappelle l'app avec l'URL du document généré.

const N8N_WEBHOOK_URL =
  import.meta.env.VITE_N8N_WEBHOOK_URL ||
  (import.meta.env.DEV
    ? '/n8n/webhook-test/313e4fa8-d8ed-4752-aade-316226fc2cb4'   // proxy Vite → pas de CORS
    : 'https://n8n.srv1104296.hstgr.cloud/webhook/313e4fa8-d8ed-4752-aade-316226fc2cb4'
  )

/**
 * Envoie une demande au webhook N8N.
 * @param {string} action  - Type de document : 'generate_pvoi' | 'generate_bon_commande' | ...
 * @param {object} payload - Données du dossier (client, véhicule, vente, etc.)
 * @returns {Promise<object>} Réponse N8N (ex: { url: '...', status: 'ok' })
 */
export async function callN8N(action, payload) {
  const res = await fetch(N8N_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, payload, timestamp: new Date().toISOString() }),
  })

  if (!res.ok) {
    throw new Error(`N8N error ${res.status}: ${await res.text()}`)
  }

  const contentType = res.headers.get('content-type') || ''

  // Réponse JSON (tableau de docs { html, ref } ou objet)
  if (contentType.includes('application/json')) {
    return res.json()
  }

  // Réponse binaire PDF (N8N "Respond with Binary File")
  if (contentType.includes('pdf') || contentType.includes('octet-stream') || contentType.includes('binary')) {
    const blob = await res.blob()
    return { _blob: blob, _ext: 'pdf' }
  }

  // Réponse ZIP (plusieurs PDFs)
  if (contentType.includes('zip')) {
    const blob = await res.blob()
    return { _blob: blob, _ext: 'zip' }
  }

  // Fallback : texte brut ou content-type absent → tente JSON, sinon blob
  const text = await res.text()
  try {
    return JSON.parse(text)
  } catch {
    // C'est du binaire avec un content-type non reconnu
    const blob = new Blob([text], { type: 'application/pdf' })
    return { _blob: blob, _ext: 'pdf' }
  }
}

// ── Actions disponibles ───────────────────────────────────────────────────────
// Utilise ces constantes dans les composants pour éviter les fautes de frappe.

export const N8N_ACTIONS = {
  GENERATE_PVOI:          'generate_pvoi',
  GENERATE_BON_COMMANDE:  'generate_bon_commande',
  GENERATE_MANDAT:        'generate_mandat',
  GENERATE_ORDRE_REPARATION: 'generate_ordre_reparation',
  SEND_EMAIL:             'send_email',
}
