import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Shield } from 'lucide-react'
import { supabase, dbToUser, userToDb } from './lib/supabase'
import { UserProvider } from './context/UserContext'
import Tour from './components/Tour'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import NewSale from './pages/NewSale'
import LivreDePolice from './pages/LivreDePolice'
import Clients from './pages/Clients'
import Pricing from './pages/Pricing'
import Settings from './pages/Settings'
import Stats from './pages/Stats'
import Login from './pages/Login'
import Onboarding from './pages/Onboarding'
import { ToastProvider } from './components/Toast'
import { ClientsProvider } from './context/ClientsContext'
import { LivreDePoliceProvider } from './context/LivreDePoliceContext'

// Compte démo — voit les données pré-remplies
const DEMO_EMAIL = 'demo@copilote.fr'

// ── Écran de chargement ──────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-5"
      style={{ background: 'linear-gradient(135deg, #060D1F 0%, #0F2460 40%, #1a3a8f 60%, #060D1F 100%)' }}>
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', boxShadow: '0 8px 32px rgba(37,99,235,0.4)' }}>
        <Shield size={26} className="text-white" />
      </div>
      <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
    </div>
  )
}

// ── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [showTour, setShowTour] = useState(false)

  const loadProfile = async (authUser) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', authUser.id)
        .single()

      setUser({
        ...dbToUser(authUser, profile),
        isDemo: authUser.email === DEMO_EMAIL,
      })
    } catch (err) {
      console.warn('Profil non trouvé, profil vide chargé :', err?.message)
      // Même sans profil BDD on laisse entrer l'utilisateur
      setUser({
        ...dbToUser(authUser, null),
        isDemo: authUser.email === DEMO_EMAIL,
      })
    }
  }

  useEffect(() => {
    // Listener toujours actif — capte login, logout, refresh token
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        loadProfile(session.user).finally(() => setLoading(false))
        return
      }
      if (event === 'SIGNED_OUT') {
        setUser(null)
        setLoading(false)
      }
    })

    // Vérifie si une session existe déjà (rechargement de page)
    const stored = Object.keys(localStorage).find(
      k => k.startsWith('sb-') && k.endsWith('-auth-token')
    )

    if (!stored) {
      // Pas de session → login immédiat
      setLoading(false)
    } else {
      // Session stockée → la valider (max 5s)
      const failsafe = setTimeout(() => setLoading(false), 5000)
      supabase.auth.getSession()
        .then(async ({ data: { session } }) => {
          if (session?.user) await loadProfile(session.user)
        })
        .catch(() => {})
        .finally(() => { clearTimeout(failsafe); setLoading(false) })
    }

    return () => subscription.unsubscribe()
  }, [])

  // Logout immédiat côté UI — Supabase nettoie la session en arrière-plan
  const handleLogout = () => {
    setUser(null)
    supabase.auth.signOut()
  }

  // Lance le tour une seule fois après l'onboarding
  const handleOnboardingComplete = (updatedUser) => {
    handleUpdateUser(updatedUser)
    const tourKey = `copilote_tour_${updatedUser.id}`
    if (!localStorage.getItem(tourKey)) setShowTour(true)
  }

  const handleTourComplete = () => {
    if (user?.id) localStorage.setItem(`copilote_tour_${user.id}`, 'done')
    setShowTour(false)
  }

  const handleUpdateUser = async (updatedUser) => {
    setUser(updatedUser)
    const { error } = await supabase
      .from('profiles')
      .update(userToDb(updatedUser))
      .eq('user_id', updatedUser.id)
    if (error) console.error('Erreur sauvegarde profil :', error.message)
  }

  // ── Rendu ────────────────────────────────────────────────────────────────
  if (loading)              return <LoadingScreen />

  if (!user)                return (
    <ToastProvider><Login /></ToastProvider>
  )

  if (!user.onboardingDone) return (
    <ToastProvider>
      <Onboarding user={user} onComplete={handleOnboardingComplete} />
    </ToastProvider>
  )

  return (
    <ToastProvider>
      <UserProvider value={user}>
        <ClientsProvider isDemo={user.isDemo}>
          <LivreDePoliceProvider isDemo={user.isDemo}>
          {showTour && <Tour user={user} onComplete={handleTourComplete} />}
          <Layout user={user} onLogout={handleLogout}>
            <Routes>
              <Route path="/"                element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard"       element={<Dashboard />} />
              <Route path="/clients"         element={<Clients />} />
              <Route path="/nouvelle-vente"  element={<NewSale />} />
              <Route path="/livre-de-police" element={<LivreDePolice />} />
              <Route path="/pricing"         element={<Pricing />} />
              <Route path="/stats"           element={<Stats />} />
              <Route path="/settings"        element={<Settings user={user} onUpdateUser={handleUpdateUser} />} />
            </Routes>
          </Layout>
          </LivreDePoliceProvider>
        </ClientsProvider>
      </UserProvider>
    </ToastProvider>
  )
}
