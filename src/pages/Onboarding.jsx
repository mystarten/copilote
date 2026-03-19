import React, { useState } from 'react'
import { Shield, ArrowRight, ArrowLeft, Check, Building2, X, Upload } from 'lucide-react'
import { supabase } from '../lib/supabase'

const STEPS = [
  { id: 1, label: 'Votre garage',    desc: 'Nom légal et SIRET' },
  { id: 2, label: 'Coordonnées',     desc: 'Adresse & contact' },
  { id: 3, label: 'Personnalisation',desc: 'Logo & types de ventes' },
  { id: 4, label: "C'est parti !",   desc: 'Récapitulatif' },
]

export default function Onboarding({ user, onComplete }) {
  const [step, setStep]       = useState(1)
  const [saving, setSaving]   = useState(false)
  const [form, setForm]       = useState({
    garageName:  user.garageName || '',
    siret:       '',
    adresse:     '',
    ville:       '',
    codePostal:  '',
    telephone:   '',
    siteWeb:     '',
    logo:        null,
    typesVentes: ['france'],
  })

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const toggleType = (type) => setForm(f => ({
    ...f,
    typesVentes: f.typesVentes.includes(type)
      ? f.typesVentes.filter(t => t !== type)
      : [...f.typesVentes, type],
  }))

  const handleLogo = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 500_000) { alert('Image trop lourde (max 500 KB)'); return }
    const reader = new FileReader()
    reader.onload = (ev) => set('logo', ev.target.result)
    reader.readAsDataURL(file)
  }

  const canNext = () => {
    if (step === 1) return form.garageName.trim().length > 0
    if (step === 2) return form.adresse.trim().length > 0 && form.telephone.trim().length > 0
    return true
  }

  const handleComplete = async () => {
    setSaving(true)
    const updatedUser = { ...user, ...form, onboardingDone: true }

    const { error } = await supabase
      .from('profiles')
      .update({
        garage_name:     form.garageName,
        siret:           form.siret,
        adresse:         form.adresse,
        ville:           form.ville,
        code_postal:     form.codePostal,
        telephone:       form.telephone,
        site_web:        form.siteWeb,
        logo_url:        form.logo,
        types_ventes:    form.typesVentes,
        onboarding_done: true,
      })
      .eq('user_id', user.id)

    if (error) console.error('Erreur onboarding :', error.message)

    setSaving(false)
    onComplete(updatedUser)
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #060D1F 0%, #0F2460 40%, #1a3a8f 60%, #060D1F 100%)' }}>

      <div className="blob absolute top-10 left-16 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.35) 0%, transparent 70%)' }} />
      <div className="blob2 absolute bottom-10 right-10 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(96,165,250,0.2) 0%, transparent 70%)' }} />

      <div className="w-full max-w-lg mx-4 relative z-10">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', boxShadow: '0 4px 16px rgba(37,99,235,0.4)' }}>
              <Shield size={20} className="text-white" />
            </div>
            <span className="text-white font-black text-2xl tracking-wide">COPILOTE</span>
          </div>
          <p className="text-blue-400 text-xs font-bold tracking-[0.25em] uppercase">Configuration de votre compte</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-8 px-1">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.id}>
              <div className="flex flex-col items-center gap-1.5 min-w-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all`}
                  style={
                    step > s.id  ? { background: '#3b82f6', color: '#fff' } :
                    step === s.id ? { background: '#3b82f6', color: '#fff', boxShadow: '0 0 0 4px rgba(59,130,246,0.25)' } :
                    { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.3)' }
                  }>
                  {step > s.id ? <Check size={14} /> : s.id}
                </div>
                <span className="text-[10px] font-semibold text-center leading-tight"
                  style={{ color: step >= s.id ? '#93c5fd' : 'rgba(255,255,255,0.25)' }}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-px mx-2 mb-4 transition-all"
                  style={{ background: step > s.id ? '#3b82f6' : 'rgba(255,255,255,0.1)' }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Card */}
        <div className="glass-card rounded-3xl p-8 fade-in" key={step}>
          <h2 className="text-xl font-black text-white mb-0.5">{STEPS[step - 1].label}</h2>
          <p className="text-sm mb-6" style={{ color: 'rgba(147,197,253,0.6)' }}>{STEPS[step - 1].desc}</p>

          {/* ── Étape 1 — Garage ── */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-blue-300 text-xs font-semibold uppercase tracking-widest mb-2 block">Nom du garage *</label>
                <input className="glass-input" placeholder="Garage Dupont Auto"
                  value={form.garageName} onChange={e => set('garageName', e.target.value)} />
              </div>
              <div>
                <label className="text-blue-300 text-xs font-semibold uppercase tracking-widest mb-2 block">SIRET</label>
                <input className="glass-input" placeholder="123 456 789 00010"
                  value={form.siret} onChange={e => set('siret', e.target.value)} />
              </div>
              <div className="p-3 rounded-xl text-xs"
                style={{ background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.25)', color: 'rgba(147,197,253,0.8)' }}>
                💡 Ces informations apparaîtront sur vos documents officiels PVOI.
              </div>
            </div>
          )}

          {/* ── Étape 2 — Coordonnées ── */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="text-blue-300 text-xs font-semibold uppercase tracking-widest mb-2 block">Adresse *</label>
                <input className="glass-input" placeholder="12 rue de la Mécanique"
                  value={form.adresse} onChange={e => set('adresse', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-blue-300 text-xs font-semibold uppercase tracking-widest mb-2 block">Code postal</label>
                  <input className="glass-input" placeholder="75001"
                    value={form.codePostal} onChange={e => set('codePostal', e.target.value)} />
                </div>
                <div>
                  <label className="text-blue-300 text-xs font-semibold uppercase tracking-widest mb-2 block">Ville</label>
                  <input className="glass-input" placeholder="Paris"
                    value={form.ville} onChange={e => set('ville', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="text-blue-300 text-xs font-semibold uppercase tracking-widest mb-2 block">Téléphone *</label>
                <input className="glass-input" placeholder="01 23 45 67 89"
                  value={form.telephone} onChange={e => set('telephone', e.target.value)} />
              </div>
              <div>
                <label className="text-blue-300 text-xs font-semibold uppercase tracking-widest mb-2 block">Site web</label>
                <input className="glass-input" placeholder="www.mongarage.fr"
                  value={form.siteWeb} onChange={e => set('siteWeb', e.target.value)} />
              </div>
            </div>
          )}

          {/* ── Étape 3 — Logo + types de ventes ── */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <label className="text-blue-300 text-xs font-semibold uppercase tracking-widest mb-2 block">Logo du garage</label>
                {form.logo ? (
                  <div className="flex items-center gap-3">
                    <img src={form.logo} alt="logo" className="w-16 h-16 object-contain rounded-xl"
                      style={{ border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)' }} />
                    <div>
                      <p className="text-white text-sm font-semibold mb-1">Logo chargé ✓</p>
                      <button onClick={() => set('logo', null)}
                        className="text-xs flex items-center gap-1 text-red-400 hover:text-red-300">
                        <X size={11} /> Supprimer
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl cursor-pointer transition-all"
                    style={{ border: '2px dashed rgba(255,255,255,0.15)' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(59,130,246,0.5)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}>
                    <Upload size={20} style={{ color: 'rgba(147,197,253,0.5)' }} />
                    <span className="text-sm text-white/50">Cliquer pour uploader</span>
                    <span className="text-xs text-white/30">PNG ou JPG · max 500 KB</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleLogo} />
                  </label>
                )}
              </div>

              <div>
                <label className="text-blue-300 text-xs font-semibold uppercase tracking-widest mb-3 block">Types de ventes pratiqués</label>
                <div className="space-y-2">
                  {[
                    { id: 'france', label: 'France',  desc: 'Ventes sur le territoire français' },
                    { id: 'export', label: 'Export',  desc: "Ventes vers l'étranger" },
                    { id: 'import', label: 'Import',  desc: "Achats depuis l'étranger" },
                  ].map(t => (
                    <button key={t.id} onClick={() => toggleType(t.id)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all"
                      style={form.typesVentes.includes(t.id)
                        ? { background: 'rgba(37,99,235,0.2)', border: '1px solid rgba(59,130,246,0.5)' }
                        : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <div className="w-5 h-5 rounded flex items-center justify-center shrink-0 transition-all"
                        style={{ background: form.typesVentes.includes(t.id) ? '#3b82f6' : 'rgba(255,255,255,0.1)' }}>
                        {form.typesVentes.includes(t.id) && <Check size={12} className="text-white" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{t.label}</p>
                        <p className="text-xs text-white/40">{t.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Étape 4 — Récap ── */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="flex items-center gap-3 mb-4">
                  {form.logo
                    ? <img src={form.logo} alt="logo" className="w-12 h-12 object-contain rounded-xl" style={{ background: 'rgba(255,255,255,0.1)' }} />
                    : <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(37,99,235,0.2)' }}>
                        <Building2 size={20} style={{ color: '#60a5fa' }} />
                      </div>
                  }
                  <div>
                    <p className="text-white font-black text-base">{form.garageName || '—'}</p>
                    {form.siret && <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>SIRET : {form.siret}</p>}
                  </div>
                </div>
                <div className="space-y-1.5 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  {(form.adresse || form.ville) && (
                    <p>📍 {[form.adresse, form.codePostal, form.ville].filter(Boolean).join(', ')}</p>
                  )}
                  {form.telephone && <p>📞 {form.telephone}</p>}
                  {form.siteWeb   && <p>🌐 {form.siteWeb}</p>}
                  <p>🔧 Ventes : {form.typesVentes.join(', ')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl"
                style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)' }}>
                <Check size={15} className="text-green-400 shrink-0" />
                <p className="text-green-400 text-sm font-medium">Tout est prêt. Bienvenue sur Copilote !</p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            {step > 1
              ? <button onClick={() => setStep(s => s - 1)}
                  className="flex items-center gap-2 text-sm px-3 py-2 rounded-xl transition-colors"
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}>
                  <ArrowLeft size={15} /> Retour
                </button>
              : <div />
            }

            {step < 4
              ? <button onClick={() => canNext() && setStep(s => s + 1)} disabled={!canNext()}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-30"
                  style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', boxShadow: '0 4px 16px rgba(37,99,235,0.35)' }}>
                  Continuer <ArrowRight size={15} />
                </button>
              : <button onClick={handleComplete} disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #059669, #047857)', boxShadow: '0 4px 16px rgba(5,150,105,0.35)' }}>
                  {saving
                    ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <><span>Démarrer Copilote</span><ArrowRight size={15} /></>
                  }
                </button>
            }
          </div>
        </div>

        {step < 4 && (
          <div className="text-center mt-4">
            <button onClick={handleComplete} disabled={saving}
              className="text-xs transition-colors"
              style={{ color: 'rgba(255,255,255,0.25)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}>
              Passer et configurer plus tard →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
