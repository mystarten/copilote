import React, { useState } from 'react'
import { Check, Lock, Zap, FileText, Globe, Shield } from 'lucide-react'

const PLANS = [
  {
    id: 'solo',
    name: 'Solo',
    priceMonthly: 79,
    priceAnnual: 65,
    subtitle: 'Pour 1 garage indépendant',
    popular: false,
    features: [
      { label: '1 garage', ok: true },
      { label: '30 ventes/mois', ok: true },
      { label: 'France uniquement', ok: true },
      { label: 'Livre de Police — Export PDF/Excel', ok: true },
      { label: '50 clients', ok: true },
      { label: 'Documents officiels', ok: true },
      { label: 'Logo garage sur documents', ok: false },
      { label: 'Statistiques avancées', ok: false },
      { label: 'Export / Import', ok: false },
      { label: 'Support Email 72h', ok: true },
      { label: 'Onboarding autonome', ok: true },
      { label: 'Sans engagement', ok: true },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    priceMonthly: 149,
    priceAnnual: 119,
    subtitle: 'Pour les garages actifs',
    popular: true,
    features: [
      { label: '1 garage', ok: true },
      { label: 'Ventes illimitées', ok: true },
      { label: 'France + Export + Import', ok: true },
      { label: 'Livre de Police — Export PDF/Excel', ok: true },
      { label: 'Base clients illimitée', ok: true },
      { label: 'Documents officiels', ok: true },
      { label: 'Logo garage sur documents', ok: true },
      { label: 'Statistiques avancées', ok: true },
      { label: 'Export / Import', ok: true },
      { label: 'Support Email prioritaire 24h', ok: true },
      { label: 'Appel de configuration', ok: true },
      { label: 'Sans engagement', ok: true },
    ],
  },
  {
    id: 'reseau',
    name: 'Réseau',
    priceMonthly: 349,
    priceAnnual: 279,
    subtitle: 'Pour les réseaux multi-sites',
    popular: false,
    features: [
      { label: "Jusqu'à 10 garages", ok: true },
      { label: 'Ventes illimitées', ok: true },
      { label: 'France + Export + Import', ok: true },
      { label: 'Livre de Police — Export PDF/Excel', ok: true },
      { label: 'Base clients illimitée', ok: true },
      { label: 'Documents officiels', ok: true },
      { label: 'Logo garage sur documents', ok: true },
      { label: 'Statistiques avancées', ok: true },
      { label: 'Export / Import', ok: true },
      { label: 'Support WhatsApp dédié', ok: true },
      { label: 'Onboarding personnalisé', ok: true },
      { label: 'Sans engagement', ok: true },
    ],
  },
]

const COMPARISON = [
  { feature: 'Temps par dossier',  copilote: '4 min',       traditionnel: '45 min',     excel: '1h30' },
  { feature: 'Conformité légale',  copilote: '✅ Auto',      traditionnel: '⚠️ Manuel',  excel: '❌' },
  { feature: 'Livre de Police',    copilote: '✅ Intégré',   traditionnel: 'Extra payant', excel: '❌' },
  { feature: 'Prix',               copilote: '79€/mois',     traditionnel: '200€+/mois', excel: '0€ mais risque 15k€' },
]

const FAQ = [
  { q: 'Puis-je annuler à tout moment ?',              a: 'Oui, sans engagement ni frais. Vous pouvez résilier quand vous le souhaitez depuis votre espace client.' },
  { q: 'Mes documents sont-ils légalement valides ?',  a: 'Oui, tous les documents sont conformes CNPA et horodatés automatiquement.' },
  { q: 'Que se passe-t-il si je dépasse mes 30 ventes ?', a: 'Vous recevez une notification et pouvez upgrader en 1 clic depuis votre tableau de bord.' },
  { q: 'Puis-je importer mes données existantes ?',    a: 'Oui, import Excel/CSV inclus dans tous les plans pour récupérer vos données en quelques minutes.' },
  { q: "Y a-t-il une période d'essai ?",               a: '14 jours satisfait ou remboursé sur tous les plans, sans condition.' },
]

const STATS = [
  { icon: Zap,      top: '4 minutes',        bottom: 'Par dossier' },
  { icon: FileText, top: '100% conforme',     bottom: 'Obligations légales' },
  { icon: Globe,    top: 'Hébergé en France', bottom: 'Données sécurisées' },
  { icon: Shield,   top: 'RGPD',              bottom: 'Certifié' },
]

export default function Pricing() {
  const [annual, setAnnual] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div className="fade-in min-h-screen" style={{ background: '#dce4e8' }}>
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-16">

        {/* ── Hero ── */}
        <div className="text-center mb-12">
          <h1 className="text-2xl md:text-4xl font-black mb-4 leading-tight" style={{ color: '#131d2e' }}>
            Finissez avec la paperasse.<br />Pour de bon.
          </h1>
          <p className="text-base md:text-lg font-medium max-w-xl mx-auto" style={{ color: '#4f6272' }}>
            Copilote génère tous vos documents PVOI en 4 minutes.
            Conforme, horodaté, sans stress.
          </p>

          {/* Toggle */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <span className="text-sm font-semibold" style={{ color: annual ? '#8fa5b5' : '#131d2e' }}>Mensuel</span>
            <button
              onClick={() => setAnnual(v => !v)}
              className="relative w-12 h-6 rounded-full transition-all"
              style={{ background: annual ? '#2563EB' : '#8fa5b5' }}>
              <span
                className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all"
                style={{ left: annual ? '26px' : '2px' }}
              />
            </button>
            <span className="text-sm font-semibold" style={{ color: annual ? '#131d2e' : '#8fa5b5' }}>Annuel</span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg"
              style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fcd34d' }}>
              2 mois offerts
            </span>
          </div>
        </div>

        {/* ── Plans ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16 items-start">
          {PLANS.map(plan => (
            <div
              key={plan.id}
              className="rounded-2xl border flex flex-col"
              style={plan.popular ? {
                background: '#e8f4fb',
                border: '2px solid #2563EB',
                boxShadow: '0 8px 32px rgba(37,99,235,0.18)',
                transform: 'scale(1.03)',
              } : {
                background: '#eef2f5',
                border: '1px solid #c8d6de',
                boxShadow: '0 1px 4px rgba(19,29,46,0.06)',
              }}>

              {/* Badge */}
              <div className="h-8 flex items-center justify-center">
                {plan.popular && (
                  <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full text-white"
                    style={{ background: '#2563EB' }}>
                    ⭐ Le plus populaire
                  </span>
                )}
              </div>

              <div className="px-5 pb-5 md:px-7 md:pb-7">
                {/* Name + subtitle */}
                <h2 className="text-xl font-black mb-1" style={{ color: '#131d2e' }}>{plan.name}</h2>
                <p className="text-xs font-medium mb-6" style={{ color: '#8fa5b5' }}>{plan.subtitle}</p>

                {/* Price */}
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-3xl md:text-5xl font-black" style={{ color: '#131d2e' }}>
                    {annual ? plan.priceAnnual : plan.priceMonthly}€
                  </span>
                  <span className="text-sm mb-2.5 font-medium" style={{ color: '#8fa5b5' }}>/mois</span>
                </div>
                {annual && (
                  <p className="text-xs mb-5 font-medium" style={{ color: '#4f6272' }}>
                    Facturé {plan.priceAnnual * 12}€/an
                  </p>
                )}

                {/* CTA */}
                <button
                  className="w-full py-3 rounded-xl font-bold text-sm transition-all mb-7"
                  style={plan.popular
                    ? { background: '#2563EB', color: '#fff', boxShadow: '0 4px 14px rgba(37,99,235,0.3)' }
                    : { background: '#dce4e8', color: '#2d3f55', border: '1px solid #c8d6de' }}
                  onMouseEnter={e => { if (!plan.popular) { e.currentTarget.style.background = '#c8d6de' } else { e.currentTarget.style.opacity = '0.9' } }}
                  onMouseLeave={e => { if (!plan.popular) { e.currentTarget.style.background = '#dce4e8' } else { e.currentTarget.style.opacity = '1' } }}>
                  {plan.popular ? 'Commencer maintenant' : 'Choisir ce plan'}
                </button>

                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map(f => (
                    <div key={f.label} className="flex items-start gap-2.5">
                      {f.ok
                        ? <Check size={15} className="shrink-0 mt-0.5" style={{ color: '#2e7d32' }} />
                        : <Lock size={15} className="shrink-0 mt-0.5" style={{ color: '#8fa5b5' }} />
                      }
                      <span className="text-sm" style={{ color: f.ok ? '#131d2e' : '#8fa5b5' }}>
                        {f.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Stats banner ── */}
        <div className="rounded-2xl p-6 md:p-8 mb-12 md:mb-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          style={{ background: '#131d2e', border: '1px solid #1e2d42' }}>
          {STATS.map(s => (
            <div key={s.top} className="flex flex-col items-center text-center gap-2">
              <s.icon size={22} style={{ color: '#2563EB' }} />
              <span className="font-black text-white text-lg leading-tight">{s.top}</span>
              <span className="text-xs font-medium" style={{ color: '#8fa5b5' }}>{s.bottom}</span>
            </div>
          ))}
        </div>

        {/* ── Comparaison ── */}
        <div className="mb-16">
          <h2 className="text-2xl font-black text-center mb-8" style={{ color: '#131d2e' }}>
            Comparé à la concurrence
          </h2>
          <div className="sea-card overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr style={{ background: '#dce4e8', borderBottom: '1px solid #c8d6de' }}>
                  <th className="text-left px-4 md:px-6 py-3 text-xs font-bold uppercase tracking-wider" style={{ color: '#8fa5b5' }}>Critère</th>
                  <th className="px-4 md:px-6 py-3 text-xs font-bold uppercase tracking-wider text-center" style={{ color: '#2563EB' }}>Copilote</th>
                  <th className="px-4 md:px-6 py-3 text-xs font-bold uppercase tracking-wider text-center" style={{ color: '#8fa5b5' }}>Logiciel trad.</th>
                  <th className="px-4 md:px-6 py-3 text-xs font-bold uppercase tracking-wider text-center" style={{ color: '#8fa5b5' }}>Excel maison</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={row.feature}
                    style={{ borderBottom: i < COMPARISON.length - 1 ? '1px solid #c8d6de' : 'none' }}>
                    <td className="px-4 md:px-6 py-3 md:py-4 text-sm font-semibold" style={{ color: '#131d2e' }}>{row.feature}</td>
                    <td className="px-4 md:px-6 py-3 md:py-4 text-sm font-bold text-center" style={{ color: '#2563EB' }}>{row.copilote}</td>
                    <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-center" style={{ color: '#4f6272' }}>{row.traditionnel}</td>
                    <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-center" style={{ color: '#8fa5b5' }}>{row.excel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── FAQ ── */}
        <div className="mb-16">
          <h2 className="text-2xl font-black text-center mb-8" style={{ color: '#131d2e' }}>
            Questions fréquentes
          </h2>
          <div className="space-y-3 max-w-2xl mx-auto">
            {FAQ.map((item, i) => (
              <div key={i} className="sea-card overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="text-sm font-bold" style={{ color: '#131d2e' }}>{item.q}</span>
                  <span className="text-lg font-black ml-4 shrink-0 transition-transform"
                    style={{ color: '#2563EB', transform: openFaq === i ? 'rotate(45deg)' : 'none' }}>+</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 fade-in">
                    <p className="text-sm" style={{ color: '#4f6272' }}>{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA final ── */}
        <div className="text-center rounded-2xl p-6 md:p-12"
          style={{ background: '#e8f4fb', border: '2px solid #b3d4e8' }}>
          <h2 className="text-xl md:text-3xl font-black mb-3" style={{ color: '#131d2e' }}>
            Prêt à gagner 2h par semaine ?
          </h2>
          <p className="text-base mb-8 font-medium" style={{ color: '#4f6272' }}>
            14 jours satisfait ou remboursé. Sans engagement.
          </p>
          <button
            className="text-white font-black text-base px-6 md:px-10 py-3 md:py-4 rounded-xl transition-all hover:opacity-90"
            style={{ background: '#2563EB', boxShadow: '0 6px 20px rgba(37,99,235,0.35)' }}>
            Démarrer maintenant →
          </button>
        </div>

      </div>
    </div>
  )
}
