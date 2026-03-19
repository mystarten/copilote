import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL      = 'https://fgaknciktmvywycrxtyz.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnYWtuY2lrdG12eXd5Y3J4dHl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5MTE5MzIsImV4cCI6MjA4OTQ4NzkzMn0.s3M6U11r8wE4TJeEg-XQP7v3zjr0YI2D9zwWZ0KRtsk'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Convertit un profil DB → objet user de l'app
export function dbToUser(authUser, profile) {
  return {
    id:             authUser.id,
    email:          authUser.email,
    garageName:     profile?.garage_name     || '',
    siret:          profile?.siret           || '',
    adresse:        profile?.adresse         || '',
    ville:          profile?.ville           || '',
    codePostal:     profile?.code_postal     || '',
    telephone:      profile?.telephone       || '',
    siteWeb:        profile?.site_web        || '',
    logo:           profile?.logo_url        || null,
    plan:           profile?.plan            || 'pro',
    typesVentes:    profile?.types_ventes    || ['france'],
    onboardingDone: profile?.onboarding_done || false,
  }
}

// Convertit un user app → payload DB
export function userToDb(user) {
  return {
    garage_name:     user.garageName,
    siret:           user.siret,
    adresse:         user.adresse,
    ville:           user.ville,
    code_postal:     user.codePostal,
    telephone:       user.telephone,
    site_web:        user.siteWeb,
    logo_url:        user.logo,
    plan:            user.plan,
    types_ventes:    user.typesVentes,
    onboarding_done: user.onboardingDone,
  }
}

// ── Upload fichier vers Storage ───────────────────────────────────────────────
// Retourne l'URL publique du fichier uploadé
export async function uploadFile(userId, path, file) {
  const ext  = file.name.split('.').pop()
  const fullPath = `${userId}/${path}.${ext}`

  const { error } = await supabase.storage
    .from('copilote-files')
    .upload(fullPath, file, { upsert: true })

  if (error) throw error

  const { data } = supabase.storage
    .from('copilote-files')
    .getPublicUrl(fullPath)

  return data.publicUrl
}

// Messages d'erreur Supabase → français
export function authError(msg = '') {
  if (msg.includes('Invalid login credentials'))  return 'Email ou mot de passe incorrect.'
  if (msg.includes('Email not confirmed'))         return 'Confirmez votre email avant de vous connecter.'
  if (msg.includes('User already registered'))    return 'Un compte existe déjà avec cet email.'
  if (msg.includes('Password should be'))         return 'Le mot de passe doit contenir au moins 6 caractères.'
  if (msg.includes('Unable to validate'))         return 'Lien invalide ou expiré.'
  return msg || 'Une erreur est survenue.'
}
