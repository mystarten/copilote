// ── Plaque d'immatriculation française (AB-123-CD) ────────────────
export function formatPlaque(val) {
  const clean = val.toUpperCase().replace(/[^A-Z0-9]/g, '')
  if (clean.length <= 2) return clean
  if (clean.length <= 5) return clean.slice(0, 2) + '-' + clean.slice(2)
  return clean.slice(0, 2) + '-' + clean.slice(2, 5) + '-' + clean.slice(5, 7)
}

export function validatePlaque(val) {
  return /^[A-Z]{2}-\d{3}-[A-Z]{2}$/.test(val)
}

// ── SIRET (123 456 789 00010) ─────────────────────────────────────
export function formatSiret(val) {
  const clean = val.replace(/\D/g, '').slice(0, 14)
  return clean
    .replace(/(\d{3})(\d)/, '$1 $2')
    .replace(/(\d{3} \d{3})(\d)/, '$1 $2')
    .replace(/(\d{3} \d{3} \d{3})(\d)/, '$1 $2')
}

export function validateSiret(val) {
  return /^\d{3} \d{3} \d{3} \d{5}$/.test(val)
}

// ── Téléphone français (06 12 34 56 78) ──────────────────────────
export function formatTelephone(val) {
  const clean = val.replace(/\D/g, '').slice(0, 10)
  return clean.replace(/(\d{2})(?=\d)/g, '$1 ').trim()
}

// ── Code postal ───────────────────────────────────────────────────
export function formatCodePostal(val) {
  return val.replace(/\D/g, '').slice(0, 5)
}
