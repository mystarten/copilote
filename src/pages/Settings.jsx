import React, { useState } from 'react'
import { Building2, User, CreditCard, Settings2, Check, Upload, X, Lock, Save } from 'lucide-react'
import { useToast } from '../components/Toast'
import { useNavigate } from 'react-router-dom'

const SECTIONS = [
  { id: 'garage',      label: 'Mon Garage',    icon: Building2  },
  { id: 'compte',      label: 'Mon Compte',    icon: User       },
  { id: 'abonnement',  label: 'Abonnement',    icon: CreditCard },
  { id: 'preferences', label: 'Préférences',   icon: Settings2  },
]

const PLAN_INFO = {
  solo:   { label: 'Solo',   price: '79€/mois',   color: '#4f6272' },
  pro:    { label: 'Pro',    price: '149€/mois',  color: '#2563EB' },
  reseau: { label: 'Réseau', price: '349€/mois',  color: '#2d3f55' },
}

const PLAN_FEATURES = {
  solo: [
    { label: '1 garage',                   ok: true  },
    { label: '30 ventes/mois',             ok: true  },
    { label: 'France uniquement',          ok: true  },
    { label: 'Livre de Police PDF/Excel',  ok: true  },
    { label: '50 clients',                 ok: true  },
    { label: 'Logo sur documents',         ok: false },
    { label: 'Statistiques avancées',      ok: false },
    { label: 'Export / Import',            ok: false },
  ],
  pro: [
    { label: '1 garage',                   ok: true },
    { label: 'Ventes illimitées',          ok: true },
    { label: 'France + Export + Import',   ok: true },
    { label: 'Livre de Police PDF/Excel',  ok: true },
    { label: 'Clients illimités',          ok: true },
    { label: 'Logo sur documents',         ok: true },
    { label: 'Statistiques avancées',      ok: true },
    { label: 'Support prioritaire 24h',    ok: true },
  ],
  reseau: [
    { label: "Jusqu'à 10 garages",         ok: true },
    { label: 'Ventes illimitées',          ok: true },
    { label: 'France + Export + Import',   ok: true },
    { label: 'Logo sur documents',         ok: true },
    { label: 'Statistiques avancées',      ok: true },
    { label: 'Support WhatsApp dédié',     ok: true },
    { label: 'Onboarding personnalisé',    ok: true },
  ],
}

export default function Settings({ user, onUpdateUser }) {
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [section, setSection] = useState('garage')

  const [garage, setGarageState] = useState({
    garageName: user.garageName  || '',
    siret:      user.siret       || '',
    adresse:    user.adresse     || '',
    ville:      user.ville       || '',
    codePostal: user.codePostal  || '',
    telephone:  user.telephone   || '',
    siteWeb:    user.siteWeb     || '',
    logo:       user.logo        || null,
  })

  const [compte, setCompteState] = useState({
    email:           user.email || '',
    currentPassword: '',
    newPassword:     '',
    confirmPassword: '',
  })

  const [prefs, setPrefsState] = useState({
    typesVentes: user.typesVentes || ['france'],
  })

  const setG = (k, v) => setGarageState(f => ({ ...f, [k]: v }))
  const setC = (k, v) => setCompteState(f => ({ ...f, [k]: v }))

  const handleLogo = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setG('logo', ev.target.result)
    reader.readAsDataURL(file)
  }

  const toggleType = (type) => setPrefsState(f => ({
    ...f,
    typesVentes: f.typesVentes.includes(type)
      ? f.typesVentes.filter(t => t !== type)
      : [...f.typesVentes, type],
  }))

  const saveGarage = () => {
    onUpdateUser({ ...user, ...garage })
    showToast('Informations du garage sauvegardées', 'success')
  }

  const saveCompte = () => {
    if (compte.newPassword && compte.newPassword !== compte.confirmPassword) {
      showToast('Les mots de passe ne correspondent pas', 'error')
      return
    }
    onUpdateUser({ ...user, email: compte.email })
    showToast('Compte mis à jour', 'success')
    setCompteState(f => ({ ...f, currentPassword: '', newPassword: '', confirmPassword: '' }))
  }

  const savePrefs = () => {
    onUpdateUser({ ...user, ...prefs })
    showToast('Préférences sauvegardées', 'success')
  }

  const plan = user.plan || 'pro'
  const planInfo = PLAN_INFO[plan]
  const features = PLAN_FEATURES[plan]

  return (
    <div className="p-4 md:p-8 fade-in max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#131d2e' }}>Paramètres</h1>
        <p className="text-sm mt-0.5" style={{ color: '#4f6272' }}>Gérez votre garage et votre compte</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start">

        {/* Sidebar — horizontal tabs on mobile, vertical list on desktop */}
        <div className="w-full md:w-52 md:shrink-0 sea-card p-2">
          <div className="flex md:flex-col gap-1 overflow-x-auto pb-1 md:pb-0">
            {SECTIONS.map(s => (
              <button key={s.id} onClick={() => setSection(s.id)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all shrink-0"
                style={section === s.id
                  ? { background: '#e8f4fb', color: '#2563EB' }
                  : { color: '#4f6272' }}
                onMouseEnter={e => { if (section !== s.id) e.currentTarget.style.background = '#dce4e8' }}
                onMouseLeave={e => { if (section !== s.id) e.currentTarget.style.background = 'transparent' }}>
                <s.icon size={15} />
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 w-full sea-card p-4 md:p-7 fade-in" key={section}>

          {/* ── Mon Garage ── */}
          {section === 'garage' && (
            <div>
              <h2 className="text-lg font-bold mb-6" style={{ color: '#131d2e' }}>Informations du garage</h2>

              {/* Logo */}
              <div className="mb-6">
                <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: '#8fa5b5' }}>
                  Logo — affiché sur vos documents officiels
                </label>
                <div className="flex items-center gap-4">
                  {garage.logo
                    ? <img src={garage.logo} alt="logo"
                        className="w-16 h-16 object-contain rounded-xl"
                        style={{ border: '1px solid #c8d6de', background: '#fff' }} />
                    : <div className="w-16 h-16 rounded-xl flex items-center justify-center"
                        style={{ background: '#dce4e8', border: '1px solid #c8d6de' }}>
                        <Building2 size={22} style={{ color: '#8fa5b5' }} />
                      </div>
                  }
                  <div className="flex flex-col gap-2">
                    <label className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg cursor-pointer transition-all"
                      style={{ background: '#dce4e8', color: '#2d3f55', border: '1px solid #c8d6de' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#c8d6de'}
                      onMouseLeave={e => e.currentTarget.style.background = '#dce4e8'}>
                      <Upload size={12} /> Uploader un logo
                      <input type="file" accept="image/*" className="hidden" onChange={handleLogo} />
                    </label>
                    {garage.logo && (
                      <button onClick={() => setG('logo', null)}
                        className="flex items-center gap-1 text-xs transition-colors"
                        style={{ color: '#8fa5b5' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                        onMouseLeave={e => e.currentTarget.style.color = '#8fa5b5'}>
                        <X size={11} /> Supprimer
                      </button>
                    )}
                  </div>
                  {plan === 'solo' && (
                    <div className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg"
                      style={{ background: '#fff8e1', color: '#b45309', border: '1px solid #fcd34d' }}>
                      <Lock size={11} /> Disponible à partir du plan Pro
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider mb-1.5 block" style={{ color: '#8fa5b5' }}>Nom du garage *</label>
                  <input className="sea-input" placeholder="Garage Dupont Auto"
                    value={garage.garageName} onChange={e => setG('garageName', e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider mb-1.5 block" style={{ color: '#8fa5b5' }}>SIRET</label>
                  <input className="sea-input" placeholder="123 456 789 00010"
                    value={garage.siret} onChange={e => setG('siret', e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider mb-1.5 block" style={{ color: '#8fa5b5' }}>Téléphone</label>
                  <input className="sea-input" placeholder="01 23 45 67 89"
                    value={garage.telephone} onChange={e => setG('telephone', e.target.value)} />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider mb-1.5 block" style={{ color: '#8fa5b5' }}>Adresse</label>
                  <input className="sea-input" placeholder="12 rue de la Mécanique"
                    value={garage.adresse} onChange={e => setG('adresse', e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider mb-1.5 block" style={{ color: '#8fa5b5' }}>Code postal</label>
                  <input className="sea-input" placeholder="75001"
                    value={garage.codePostal} onChange={e => setG('codePostal', e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider mb-1.5 block" style={{ color: '#8fa5b5' }}>Ville</label>
                  <input className="sea-input" placeholder="Paris"
                    value={garage.ville} onChange={e => setG('ville', e.target.value)} />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider mb-1.5 block" style={{ color: '#8fa5b5' }}>Site web</label>
                  <input className="sea-input" placeholder="www.mongarage.fr"
                    value={garage.siteWeb} onChange={e => setG('siteWeb', e.target.value)} />
                </div>
              </div>

              <button onClick={saveGarage}
                className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                style={{ background: '#2563EB', boxShadow: '0 4px 14px rgba(37,99,235,0.25)' }}>
                <Save size={14} /> Sauvegarder
              </button>
            </div>
          )}

          {/* ── Mon Compte ── */}
          {section === 'compte' && (
            <div>
              <h2 className="text-lg font-bold mb-6" style={{ color: '#131d2e' }}>Mon Compte</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider mb-1.5 block" style={{ color: '#8fa5b5' }}>Adresse email</label>
                  <input className="sea-input" type="email"
                    value={compte.email} onChange={e => setC('email', e.target.value)} />
                </div>

                <div className="pt-5 border-t" style={{ borderColor: '#c8d6de' }}>
                  <p className="text-sm font-bold mb-4" style={{ color: '#131d2e' }}>Changer le mot de passe</p>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider mb-1.5 block" style={{ color: '#8fa5b5' }}>Mot de passe actuel</label>
                      <input className="sea-input" type="password" placeholder="••••••••"
                        value={compte.currentPassword} onChange={e => setC('currentPassword', e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider mb-1.5 block" style={{ color: '#8fa5b5' }}>Nouveau mot de passe</label>
                      <input className="sea-input" type="password" placeholder="••••••••"
                        value={compte.newPassword} onChange={e => setC('newPassword', e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider mb-1.5 block" style={{ color: '#8fa5b5' }}>Confirmer le mot de passe</label>
                      <input className="sea-input" type="password" placeholder="••••••••"
                        value={compte.confirmPassword} onChange={e => setC('confirmPassword', e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>

              <button onClick={saveCompte}
                className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                style={{ background: '#2563EB', boxShadow: '0 4px 14px rgba(37,99,235,0.25)' }}>
                <Save size={14} /> Sauvegarder
              </button>
            </div>
          )}

          {/* ── Abonnement ── */}
          {section === 'abonnement' && (
            <div>
              <h2 className="text-lg font-bold mb-6" style={{ color: '#131d2e' }}>Abonnement</h2>

              {/* Plan actuel */}
              <div className="p-5 rounded-xl mb-5"
                style={{ background: '#e8f4fb', border: '2px solid #2563EB' }}>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black uppercase tracking-widest px-2.5 py-1 rounded-lg text-white"
                      style={{ background: planInfo.color }}>
                      Plan actuel
                    </span>
                    <span className="text-xl font-black" style={{ color: '#131d2e' }}>{planInfo.label}</span>
                  </div>
                  <span className="text-2xl font-black" style={{ color: '#2563EB' }}>{planInfo.price}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {features.map(f => (
                    <div key={f.label} className="flex items-center gap-2 text-sm">
                      {f.ok
                        ? <Check size={13} style={{ color: '#2e7d32' }} />
                        : <Lock size={13} style={{ color: '#8fa5b5' }} />
                      }
                      <span style={{ color: f.ok ? '#131d2e' : '#8fa5b5' }}>{f.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Renouvellement */}
              <div className="flex items-center justify-between p-4 rounded-xl mb-6"
                style={{ background: '#dce4e8', border: '1px solid #c8d6de' }}>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: '#8fa5b5' }}>Prochain renouvellement</p>
                  <p className="font-semibold" style={{ color: '#131d2e' }}>19 Avril 2026</p>
                </div>
                <button className="text-xs font-semibold px-3 py-2 rounded-lg transition-all"
                  style={{ background: '#c8d6de', color: '#4f6272' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#b3c5cf'}
                  onMouseLeave={e => e.currentTarget.style.background = '#c8d6de'}>
                  Gérer la facturation
                </button>
              </div>

              {/* Upgrade */}
              {plan !== 'reseau' && (
                <div>
                  <p className="text-sm font-bold mb-3" style={{ color: '#131d2e' }}>Passer au niveau supérieur</p>
                  <button
                    onClick={() => navigate('/pricing')}
                    className="w-full flex items-center justify-between px-5 py-4 rounded-xl font-bold text-white transition-all hover:opacity-90"
                    style={{ background: '#2563EB', boxShadow: '0 4px 14px rgba(37,99,235,0.25)' }}>
                    <span>Upgrader vers {plan === 'solo' ? 'Pro' : 'Réseau'} →</span>
                    <span className="text-sm font-normal opacity-80">
                      {plan === 'solo' ? '149€/mois' : '349€/mois'}
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── Préférences ── */}
          {section === 'preferences' && (
            <div>
              <h2 className="text-lg font-bold mb-6" style={{ color: '#131d2e' }}>Préférences</h2>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider mb-3 block" style={{ color: '#8fa5b5' }}>
                  Types de ventes actifs
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'france', label: 'France', desc: 'Ventes sur le territoire français' },
                    { id: 'export', label: 'Export', desc: "Ventes vers l'étranger", locked: plan === 'solo' },
                    { id: 'import', label: 'Import', desc: "Achats depuis l'étranger", locked: plan === 'solo' },
                  ].map(t => (
                    <button key={t.id}
                      onClick={() => !t.locked && toggleType(t.id)}
                      disabled={t.locked}
                      className="w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all"
                      style={t.locked
                        ? { background: '#f0f4f7', border: '1px solid #c8d6de', cursor: 'not-allowed', opacity: 0.6 }
                        : prefs.typesVentes.includes(t.id)
                          ? { background: '#e8f4fb', border: '1.5px solid #2563EB' }
                          : { background: '#dce4e8', border: '1px solid #c8d6de' }}>
                      <div className="w-5 h-5 rounded flex items-center justify-center shrink-0 transition-all"
                        style={t.locked
                          ? { background: '#c8d6de' }
                          : prefs.typesVentes.includes(t.id)
                            ? { background: '#2563EB' }
                            : { background: '#c8d6de' }}>
                        {t.locked
                          ? <Lock size={10} style={{ color: '#8fa5b5' }} />
                          : prefs.typesVentes.includes(t.id) && <Check size={12} className="text-white" />
                        }
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold" style={{ color: '#131d2e' }}>{t.label}</p>
                        <p className="text-xs" style={{ color: '#8fa5b5' }}>{t.desc}</p>
                      </div>
                      {t.locked && (
                        <span className="text-xs px-2 py-0.5 rounded-lg font-semibold"
                          style={{ background: '#fff8e1', color: '#b45309' }}>Plan Pro</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={savePrefs}
                className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                style={{ background: '#2563EB', boxShadow: '0 4px 14px rgba(37,99,235,0.25)' }}>
                <Save size={14} /> Sauvegarder
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
