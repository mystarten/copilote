import React, { useState } from 'react'
import { ArrowRight, ArrowLeft, X, Check, TrendingUp, FileText, Users, BookOpen, Zap, Star, Car, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// ── Personnage mascotte ───────────────────────────────────────────────────────
function Bolt({ expression = 'happy' }) {
  const faces = {
    wave:    { ly: 38, ry: 38, mouth: 'M28 57 Q40 66 52 57', cheek: true  },
    happy:   { ly: 40, ry: 40, mouth: 'M28 58 Q40 67 52 58', cheek: false },
    think:   { ly: 42, ry: 41, mouth: 'M30 58 Q40 62 50 58', cheek: false },
    excited: { ly: 36, ry: 36, mouth: 'M26 56 Q40 70 54 56', cheek: true  },
    point:   { ly: 39, ry: 39, mouth: 'M28 57 Q40 65 52 57', cheek: false },
  }
  const f = faces[expression] || faces.happy

  return (
    <div style={{ filter: 'drop-shadow(0 10px 30px rgba(37,99,235,0.4))' }}>
      <svg width="110" height="128" viewBox="0 0 80 95">
        {/* Corps bouclier */}
        <path d="M40 4 L76 18 L76 52 Q76 79 40 93 Q4 79 4 52 L4 18 Z" fill="#2563EB" />
        <path d="M40 10 L71 22 L71 52 Q71 75 40 87 Q9 75 9 52 L9 22 Z" fill="#2480b8" opacity="0.25" />

        {/* Bras gauche (wave) */}
        {expression === 'wave' && (
          <path d="M4 30 Q-8 15 -5 8" stroke="#2563EB" strokeWidth="7" strokeLinecap="round" fill="none" />
        )}
        {/* Bras pointeur (point) */}
        {expression === 'point' && (
          <path d="M76 36 Q90 30 95 28" stroke="#2563EB" strokeWidth="7" strokeLinecap="round" fill="none" />
        )}
        {/* Bras excité */}
        {expression === 'excited' && (
          <>
            <path d="M4 30 Q-8 18 -6 10" stroke="#2563EB" strokeWidth="7" strokeLinecap="round" fill="none" />
            <path d="M76 30 Q88 18 86 10" stroke="#2563EB" strokeWidth="7" strokeLinecap="round" fill="none" />
          </>
        )}

        {/* Yeux */}
        <circle cx="28" cy={f.ly} r="6.5" fill="white" />
        <circle cx="52" cy={f.ry} r="6.5" fill="white" />
        <circle cx="29.5" cy={f.ly + 1} r="3.5" fill="#131d2e" />
        <circle cx="53.5" cy={f.ry + 1} r="3.5" fill="#131d2e" />
        {/* Reflet dans les yeux */}
        <circle cx="28.5" cy={f.ly - 1} r="1.2" fill="white" opacity="0.9" />
        <circle cx="52.5" cy={f.ry - 1} r="1.2" fill="white" opacity="0.9" />

        {/* Joues */}
        {f.cheek && (
          <>
            <circle cx="19" cy="50" r="5.5" fill="white" opacity="0.18" />
            <circle cx="61" cy="50" r="5.5" fill="white" opacity="0.18" />
          </>
        )}

        {/* Bouche */}
        <path d={f.mouth} stroke="white" strokeWidth="2.8" fill="none" strokeLinecap="round" />

        {/* Main think */}
        {expression === 'think' && (
          <ellipse cx="40" cy="75" rx="9" ry="6" fill="#2480b8" opacity="0.5" />
        )}
      </svg>
    </div>
  )
}

// ── Visuels de chaque slide ───────────────────────────────────────────────────
function DashboardVisual() {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: 'Ventes', val: '14', color: '#e8f4fb', border: '#b3d4e8', icon: TrendingUp, ic: '#2563EB' },
          { label: 'Documents', val: '87', color: '#eef3f7', border: '#c8d6de', icon: FileText, ic: '#4f6272' },
          { label: 'En attente', val: '3', color: '#f0f5f8', border: '#8fa5b5', icon: Zap, ic: '#2d3f55' },
          { label: 'Temps moyen', val: '4 min', color: '#dce4e8', border: '#8fa5b5', icon: Star, ic: '#4f6272' },
        ].map(c => (
          <div key={c.label} className="rounded-xl p-2.5 border" style={{ background: c.color, borderColor: c.border }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-medium" style={{ color: '#4f6272' }}>{c.label}</span>
              <c.icon size={11} style={{ color: c.ic }} />
            </div>
            <p className="text-lg font-black" style={{ color: '#131d2e' }}>{c.val}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl p-2.5 border" style={{ background: '#fff', borderColor: '#c8d6de' }}>
        {[
          { client: 'Martin B.', type: 'France', status: 'Généré', statusC: '#2e7d32', statusBg: '#e6f4ea' },
          { client: 'Sophie L.', type: 'Export',  status: 'Envoyé',  statusC: '#2563EB', statusBg: '#e8f4fb' },
          { client: 'Ahmed B.', type: 'Import',  status: 'En cours',statusC: '#b45309', statusBg: '#fff8e1' },
        ].map((r, i) => (
          <div key={i} className="flex items-center justify-between py-1.5 text-[10px]"
            style={{ borderBottom: i < 2 ? '1px solid #f0f4f7' : 'none' }}>
            <span className="font-semibold" style={{ color: '#131d2e' }}>{r.client}</span>
            <span style={{ color: '#8fa5b5' }}>{r.type}</span>
            <span className="px-1.5 py-0.5 rounded-md font-bold"
              style={{ background: r.statusBg, color: r.statusC }}>{r.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function StepsVisual() {
  const steps = [
    { icon: User,     label: 'Client',    color: '#e8f4fb', ic: '#2563EB' },
    { icon: Car,      label: 'Véhicule',  color: '#eef3f7', ic: '#4f6272' },
    { icon: FileText, label: 'Détails',   color: '#f0f5f8', ic: '#2d3f55' },
    { icon: Zap,      label: 'Documents', color: '#dce4e8', ic: '#131d2e' },
  ]
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1">
        {steps.map((s, i) => (
          <React.Fragment key={s.label}>
            <div className="flex-1 flex flex-col items-center gap-1.5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center border"
                style={{ background: s.color, borderColor: '#c8d6de' }}>
                <s.icon size={16} style={{ color: s.ic }} />
              </div>
              <span className="text-[10px] font-bold text-center" style={{ color: '#131d2e' }}>{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className="w-5 h-px mb-4" style={{ background: '#c8d6de' }} />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="rounded-xl p-3 text-center border" style={{ background: '#e6f4ea', borderColor: '#a5d6a7' }}>
        <p className="text-xs font-black" style={{ color: '#2e7d32' }}>✓ 8 documents générés en 4 minutes</p>
        <p className="text-[10px] mt-0.5" style={{ color: '#4f6272' }}>CERFA, certificat de cession, facture, garantie…</p>
      </div>
    </div>
  )
}

function LivreVisual() {
  const rows = [
    { marque: 'BMW Série 3', plaque: 'AB-123-CD', achat: '16 500 €', cession: '19 900 €', marge: '+3 400 €', s: 'vendu' },
    { marque: 'Peugeot 308', plaque: 'EF-456-GH', achat: '11 200 €', cession: '14 500 €', marge: '+3 300 €', s: 'vendu' },
    { marque: 'Renault Clio', plaque: 'IJ-789-KL', achat: '9 800 €',  cession: '—',        marge: '—',        s: 'stock' },
  ]
  return (
    <div className="rounded-xl overflow-hidden border" style={{ borderColor: '#c8d6de' }}>
      <div className="grid grid-cols-4 gap-2 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider"
        style={{ background: '#dce4e8', color: '#8fa5b5' }}>
        <span>Véhicule</span><span>Achat</span><span>Cession</span><span>Marge</span>
      </div>
      {rows.map((r, i) => (
        <div key={i} className="grid grid-cols-4 gap-2 px-3 py-2 text-[10px]"
          style={{ background: i % 2 === 0 ? '#fff' : '#f7f9fa', borderTop: '1px solid #f0f4f7' }}>
          <div>
            <p className="font-semibold" style={{ color: '#131d2e' }}>{r.marque}</p>
            <p style={{ color: '#8fa5b5' }}>{r.plaque}</p>
          </div>
          <span style={{ color: '#4f6272' }}>{r.achat}</span>
          <span style={{ color: '#4f6272' }}>{r.cession}</span>
          <span className="font-bold" style={{ color: r.s === 'vendu' ? '#2e7d32' : '#8fa5b5' }}>{r.marge}</span>
        </div>
      ))}
    </div>
  )
}

function ClientsVisual() {
  const clients = [
    { nom: 'Martin Bernard', email: 'martin.b@gmail.com', ventes: 3 },
    { nom: 'Sophie Leclerc', email: 'sophie.l@hotmail.fr', ventes: 1 },
    { nom: 'Ahmed Benali',   email: 'ahmed.b@gmail.com',  ventes: 2 },
  ]
  return (
    <div className="space-y-2">
      {clients.map((c, i) => (
        <div key={i} className="flex items-center justify-between p-2.5 rounded-xl border"
          style={{ background: '#fff', borderColor: '#c8d6de' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-black shrink-0"
              style={{ background: '#2d3f55' }}>
              {c.nom[0]}
            </div>
            <div>
              <p className="text-xs font-semibold" style={{ color: '#131d2e' }}>{c.nom}</p>
              <p className="text-[10px]" style={{ color: '#8fa5b5' }}>{c.email}</p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg"
            style={{ background: '#e8f4fb', color: '#2563EB' }}>
            {c.ventes} vente{c.ventes > 1 ? 's' : ''}
          </span>
        </div>
      ))}
    </div>
  )
}

// ── Quiz plan ─────────────────────────────────────────────────────────────────
const QUIZ = [
  {
    key: 'q1',
    question: 'Combien de ventes faites-vous par mois ?',
    options: [
      { value: 'low',  label: 'Moins de 30',    rec: 'solo' },
      { value: 'mid',  label: 'Entre 30 et 100', rec: 'pro'  },
      { value: 'high', label: 'Plus de 100',     rec: 'pro'  },
    ],
  },
  {
    key: 'q2',
    question: 'Faites-vous des ventes export ou import ?',
    options: [
      { value: 'no',  label: 'Non, France uniquement', rec: 'solo' },
      { value: 'yes', label: 'Oui, régulièrement',     rec: 'pro'  },
    ],
  },
  {
    key: 'q3',
    question: 'Gérez-vous plusieurs garages ?',
    options: [
      { value: 'one',   label: '1 seul garage',  rec: 'solo'   },
      { value: 'multi', label: 'Plusieurs sites', rec: 'reseau' },
    ],
  },
]

function getRecommendation(answers) {
  if (!answers.q1 || !answers.q2 || !answers.q3) return null
  if (answers.q3 === 'multi') return 'reseau'
  if (answers.q1 === 'high' || answers.q2 === 'yes') return 'pro'
  return 'solo'
}

const PLAN_DETAILS = {
  solo:   { label: 'Solo',   price: '79€/mois',  color: '#4f6272', bg: '#eef3f7', border: '#c8d6de', desc: 'Parfait pour démarrer sans contrainte.' },
  pro:    { label: 'Pro ⭐', price: '149€/mois', color: '#2563EB', bg: '#e8f4fb', border: '#2563EB', desc: 'Le choix des garages actifs qui veulent tout.' },
  reseau: { label: 'Réseau', price: '349€/mois', color: '#2d3f55', bg: '#eef3f7', border: '#2d3f55', desc: 'Multi-sites, support dédié, déploiement accompagné.' },
}

function QuizVisual({ answers, setAnswers }) {
  const rec = getRecommendation(answers)

  if (rec) {
    const plan = PLAN_DETAILS[rec]
    return (
      <div className="fade-in space-y-3">
        <p className="text-xs font-semibold text-center" style={{ color: '#8fa5b5' }}>Ma recommandation pour vous :</p>
        <div className="p-4 rounded-2xl text-center border-2" style={{ background: plan.bg, borderColor: plan.border }}>
          <p className="text-2xl font-black mb-1" style={{ color: plan.color }}>{plan.label}</p>
          <p className="text-3xl font-black mb-2" style={{ color: '#131d2e' }}>{plan.price}</p>
          <p className="text-xs font-medium" style={{ color: '#4f6272' }}>{plan.desc}</p>
        </div>
        <button onClick={() => setAnswers({})}
          className="w-full text-xs py-1.5 transition-colors" style={{ color: '#8fa5b5' }}>
          ← Recommencer le quiz
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {QUIZ.map(q => (
        <div key={q.key}>
          <p className="text-xs font-bold mb-1.5" style={{ color: '#131d2e' }}>{q.question}</p>
          <div className="flex flex-wrap gap-1.5">
            {q.options.map(opt => (
              <button key={opt.value}
                onClick={() => setAnswers(a => ({ ...a, [q.key]: opt.value }))}
                className="text-xs px-3 py-1.5 rounded-lg font-semibold border transition-all"
                style={answers[q.key] === opt.value
                  ? { background: '#2563EB', color: '#fff', borderColor: '#2563EB' }
                  : { background: '#dce4e8', color: '#4f6272', borderColor: '#c8d6de' }}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Slides ────────────────────────────────────────────────────────────────────
const SLIDES = [
  {
    id: 'welcome',
    expression: 'wave',
    title: 'Bienvenue sur Copilote !',
    text: "Je suis Bolt, votre assistant PVOI. En 2 minutes je vous montre tout ce que Copilote fait pour vous — et comment ne plus jamais perdre de temps avec vos documents légaux.",
    visual: null,
    cta: 'Allons-y !',
  },
  {
    id: 'dashboard',
    expression: 'point',
    title: 'Votre tableau de bord',
    text: "D'un coup d'œil : ventes du mois, documents générés, dossiers en attente. Tout votre activité en temps réel, sans chercher.",
    visual: 'dashboard',
    cta: 'Continuer',
  },
  {
    id: 'vente',
    expression: 'excited',
    title: 'Une vente en 4 minutes chrono',
    text: "Client → Véhicule → Détails → Documents. Copilote génère tous vos CERFA, certificats et factures automatiquement. Conformes et horodatés.",
    visual: 'steps',
    cta: 'Continuer',
  },
  {
    id: 'livre',
    expression: 'happy',
    title: 'Le Livre de Police numérique',
    text: "Votre registre légal conforme CNPA. Chaque entrée/sortie de véhicule avec marge calculée. Export PDF ou Excel en 1 clic. Fini les cahiers papier.",
    visual: 'livre',
    cta: 'Continuer',
  },
  {
    id: 'clients',
    expression: 'happy',
    title: 'Votre base clients',
    text: "Tous vos acheteurs et vendeurs centralisés. Retrouvez n'importe qui en 2 secondes pour une nouvelle vente ou pour retrouver un historique.",
    visual: 'clients',
    cta: 'Continuer',
  },
  {
    id: 'plan',
    expression: 'think',
    title: 'Quel plan vous convient ?',
    text: "Répondez à 3 questions, je vous recommande le plan parfait pour votre activité.",
    visual: 'quiz',
    cta: 'Voir les tarifs',
  },
]

// ── Composant principal ───────────────────────────────────────────────────────
export default function Tour({ user, onComplete }) {
  const navigate    = useNavigate()
  const [step, setStep]       = useState(0)
  const [answers, setAnswers] = useState({})
  const [leaving, setLeaving] = useState(false)

  const slide = SLIDES[step]
  const isLast = step === SLIDES.length - 1
  const rec = getRecommendation(answers)

  const goNext = () => {
    if (isLast) {
      onComplete()
      navigate('/pricing')
      return
    }
    setLeaving(true)
    setTimeout(() => { setStep(s => s + 1); setLeaving(false) }, 180)
  }

  const goPrev = () => {
    if (step === 0) return
    setLeaving(true)
    setTimeout(() => { setStep(s => s - 1); setLeaving(false) }, 180)
  }

  const canNext = slide.id !== 'plan' || rec !== null

  const renderVisual = () => {
    if (!slide.visual) return null
    const map = {
      dashboard: <DashboardVisual />,
      steps:     <StepsVisual />,
      livre:     <LivreVisual />,
      clients:   <ClientsVisual />,
      quiz:      <QuizVisual answers={answers} setAnswers={setAnswers} />,
    }
    return map[slide.visual] || null
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(10,18,40,0.88)', backdropFilter: 'blur(10px)' }}>

      <div className="w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: '#eef2f5', border: '1px solid #c8d6de' }}>

        {/* Header barre de progression */}
        <div className="px-7 pt-6 pb-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5">
              {SLIDES.map((_, i) => (
                <div key={i} className="h-1.5 rounded-full transition-all"
                  style={{
                    width: i === step ? '24px' : '8px',
                    background: i <= step ? '#2563EB' : '#c8d6de',
                  }} />
              ))}
            </div>
            <button onClick={() => { onComplete() }}
              className="p-1.5 rounded-lg transition-all"
              style={{ color: '#8fa5b5' }}
              onMouseEnter={e => e.currentTarget.style.background = '#dce4e8'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              title="Passer le tour">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Contenu */}
        <div className={`transition-opacity duration-150 ${leaving ? 'opacity-0' : 'opacity-100'}`}>
          <div className="flex gap-6 px-7 pb-6">

            {/* Personnage */}
            <div className="flex flex-col items-center gap-3 shrink-0 pt-2">
              <Bolt expression={slide.expression} />
              {slide.id !== 'welcome' && (
                <div className="text-center">
                  <p className="text-[10px] font-black tracking-widest uppercase"
                    style={{ color: '#2563EB' }}>BOLT</p>
                  <p className="text-[9px]" style={{ color: '#8fa5b5' }}>Assistant PVOI</p>
                </div>
              )}
            </div>

            {/* Bulle de dialogue */}
            <div className="flex-1 flex flex-col justify-between gap-4">
              <div>
                {/* Titre */}
                <h2 className="text-xl font-black mb-2" style={{ color: '#131d2e' }}>
                  {slide.title}
                </h2>
                {/* Texte */}
                <p className="text-sm leading-relaxed mb-4" style={{ color: '#4f6272' }}>
                  {slide.text}
                </p>
                {/* Visual */}
                {renderVisual() && (
                  <div className="rounded-2xl p-3" style={{ background: '#dce4e8', border: '1px solid #c8d6de' }}>
                    {renderVisual()}
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-2">
                {step > 0
                  ? <button onClick={goPrev}
                      className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-xl transition-all"
                      style={{ color: '#8fa5b5' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#dce4e8'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <ArrowLeft size={14} /> Retour
                    </button>
                  : <button onClick={() => onComplete()}
                      className="text-sm transition-colors"
                      style={{ color: '#8fa5b5' }}>
                      Passer
                    </button>
                }

                <button onClick={goNext} disabled={!canNext}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-40"
                  style={{ background: '#2563EB', boxShadow: canNext ? '0 4px 14px rgba(37,99,235,0.3)' : 'none' }}>
                  {isLast ? (
                    <><Star size={14} /> {rec ? `Voir le plan ${PLAN_DETAILS[rec]?.label.replace(' ⭐','')}` : slide.cta}</>
                  ) : (
                    <>{slide.cta} <ArrowRight size={14} /></>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
