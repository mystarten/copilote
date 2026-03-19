import React, { useState, useEffect } from 'react'
import { ArrowRight, ArrowLeft, Check, Star, Shield } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// ── Bolt character — bouclier mascotte ───────────────────────────────────────
function Bolt({ expression = 'happy', size = 1 }) {
  const w = Math.round(110 * size)
  const h = Math.round(128 * size)

  const eyeY = { wave: 33, happy: 34, think: 35, excited: 31, point: 34 }[expression] ?? 34
  const smiles = {
    wave:    'M29 46 Q40 55 51 46',
    happy:   'M30 46 Q40 54 50 46',
    think:   'M31 47 Q40 51 49 47',
    excited: 'M26 45 Q40 58 54 45',
    point:   'M30 46 Q40 53 50 46',
  }
  const smile = smiles[expression] || smiles.happy

  return (
    <svg width={w} height={h} viewBox="0 0 80 96"
      style={{ filter: 'drop-shadow(0 10px 32px rgba(37,99,235,0.6)) drop-shadow(0 0 18px rgba(59,130,246,0.3))' }}>
      <defs>
        <radialGradient id="bolt-body" cx="42%" cy="28%" r="70%">
          <stop offset="0%"   stopColor="#1e3d82" />
          <stop offset="100%" stopColor="#060d1c" />
        </radialGradient>
        <radialGradient id="bolt-eye" cx="32%" cy="28%" r="68%">
          <stop offset="0%"   stopColor="#bfdbfe" />
          <stop offset="60%"  stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </radialGradient>
        <radialGradient id="bolt-gloss" cx="50%" cy="0%" r="80%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.13)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>

      {/* Outer glow halo */}
      <path d="M8 18 Q8 5 21 5 L59 5 Q72 5 72 18 L72 54 Q72 70 40 83 Q8 70 8 54 Z"
        fill="none" stroke="#3b82f6" strokeWidth="3" opacity="0.18" />

      {/* Shield border / frame */}
      <path d="M10 18 Q10 7 21 7 L59 7 Q70 7 70 18 L70 54 Q70 68 40 81 Q10 68 10 54 Z"
        fill="#0e1c3a" />

      {/* Shield inner body */}
      <path d="M13 19 Q13 10 22 10 L58 10 Q67 10 67 19 L67 54 Q67 66 40 78 Q13 66 13 54 Z"
        fill="url(#bolt-body)" />

      {/* Gloss highlight — top third */}
      <path d="M13 19 Q13 10 22 10 L58 10 Q67 10 67 19 L67 33 Q54 26 40 26 Q26 26 13 33 Z"
        fill="url(#bolt-gloss)" />

      {/* Inner border edge */}
      <path d="M13 19 Q13 10 22 10 L58 10 Q67 10 67 19 L67 54 Q67 66 40 78 Q13 66 13 54 Z"
        fill="none" stroke="rgba(59,130,246,0.25)" strokeWidth="1" />

      {/* ── Arms ── */}
      {/* Left arm */}
      {expression === 'wave' && (
        <path d="M10 52 Q0 39 -1 29" stroke="#0a1628" strokeWidth="9" strokeLinecap="round" fill="none" />
      )}
      {expression === 'excited' && (
        <path d="M10 50 Q0 36 2 25" stroke="#0a1628" strokeWidth="9" strokeLinecap="round" fill="none" />
      )}
      {(expression === 'happy' || expression === 'think' || expression === 'point') && (
        <path d="M10 55 Q1 63 1 71" stroke="#0a1628" strokeWidth="9" strokeLinecap="round" fill="none" />
      )}

      {/* Right arm */}
      {expression === 'point' && (
        <path d="M70 50 Q80 44 87 41" stroke="#0a1628" strokeWidth="9" strokeLinecap="round" fill="none" />
      )}
      {expression === 'excited' && (
        <path d="M70 50 Q80 36 78 25" stroke="#0a1628" strokeWidth="9" strokeLinecap="round" fill="none" />
      )}
      {(expression === 'happy' || expression === 'think' || expression === 'wave') && (
        <path d="M70 55 Q79 63 79 71" stroke="#0a1628" strokeWidth="9" strokeLinecap="round" fill="none" />
      )}

      {/* ── Eyes ── */}
      {/* Outer glow ring */}
      <circle cx="30" cy={eyeY} r="6.2" fill="rgba(59,130,246,0.25)" />
      <circle cx="50" cy={eyeY} r="6.2" fill="rgba(59,130,246,0.25)" />
      {/* Eye fill */}
      <circle cx="30" cy={eyeY} r="5"   fill="url(#bolt-eye)" />
      <circle cx="50" cy={eyeY} r="5"   fill="url(#bolt-eye)" />
      {/* Eye rim */}
      <circle cx="30" cy={eyeY} r="5"   fill="none" stroke="#93c5fd" strokeWidth="0.8" opacity="0.6" />
      <circle cx="50" cy={eyeY} r="5"   fill="none" stroke="#93c5fd" strokeWidth="0.8" opacity="0.6" />
      {/* Specular highlight */}
      <circle cx="28.4" cy={eyeY - 2} r="1.7" fill="rgba(255,255,255,0.82)" />
      <circle cx="48.4" cy={eyeY - 2} r="1.7" fill="rgba(255,255,255,0.82)" />

      {/* ── Smile ── */}
      <path d={smile} stroke="#93c5fd" strokeWidth="2.4" fill="none" strokeLinecap="round" />

      {/* ── Legs ── */}
      <path d="M34 78 L32 90" stroke="#0a1628" strokeWidth="9" strokeLinecap="round" fill="none" />
      <path d="M46 78 L48 90" stroke="#0a1628" strokeWidth="9" strokeLinecap="round" fill="none" />
    </svg>
  )
}

// ── Spotlight steps ───────────────────────────────────────────────────────────
const STEPS = [
  {
    id: 'dashboard',
    route: '/dashboard',
    targetId: 'tour-kpis',
    expression: 'point',
    label: 'Tableau de bord',
    title: 'Vue d\'ensemble en temps réel',
    text: 'Vos ventes du mois, documents générés, dossiers en attente. Tout votre activité sans chercher.',
  },
  {
    id: 'vente',
    route: '/nouvelle-vente',
    targetId: 'tour-stepper',
    expression: 'excited',
    label: 'Nouvelle Vente',
    title: 'Une vente complète en 4 minutes',
    text: 'Client → Véhicule → Détails → Documents. Copilote génère automatiquement tous vos CERFA, certificats et factures. Conformes et horodatés.',
  },
  {
    id: 'livre',
    route: '/livre-de-police',
    targetId: 'tour-livre',
    expression: 'happy',
    label: 'Livre de Police',
    title: 'Registre légal conforme CNPA',
    text: 'Stock, ventes et marge totale en un coup d\'œil. Chaque véhicule tracé de l\'entrée à la cession. Export PDF/Excel en 1 clic.',
  },
  {
    id: 'stats',
    route: '/stats',
    targetId: 'tour-stats',
    expression: 'happy',
    label: 'Statistiques',
    title: 'Pilotez avec des données claires',
    text: 'CA total, marge brute, taux de marge — calculés automatiquement depuis votre livre de police. Zéro saisie manuelle.',
  },
]

// ── Quiz data ─────────────────────────────────────────────────────────────────
const QUIZ = [
  {
    id: 'volume',
    emoji: '🚗',
    question: 'Combien de véhicules vendez-vous par mois ?',
    options: [
      { value: 'low',  label: 'Moins de 20',  sub: 'Petit garage',     score: 0 },
      { value: 'mid',  label: 'De 20 à 60',   sub: 'Garage actif',     score: 1 },
      { value: 'high', label: 'Plus de 60',   sub: 'Fort volume',      score: 2 },
    ],
  },
  {
    id: 'type',
    emoji: '🌍',
    question: 'Faites-vous des opérations Export ou Import ?',
    options: [
      { value: 'no',  label: 'Non — France uniquement', sub: 'Marché national',    score: 0 },
      { value: 'occ', label: 'Oui, occasionnellement',  sub: 'Quelques fois/mois', score: 1 },
      { value: 'yes', label: 'Oui, régulièrement',      sub: "Cœur de l'activité", score: 2 },
    ],
  },
  {
    id: 'sites',
    emoji: '🏢',
    question: 'Combien de garages gérez-vous ?',
    options: [
      { value: 'one',  label: '1 seul garage',     sub: 'Indépendant',   score: 0 },
      { value: 'few',  label: '2 à 5 garages',     sub: 'Petit réseau',  score: 3 },
      { value: 'many', label: '6 garages et plus', sub: 'Grand réseau',  score: 4 },
    ],
  },
  {
    id: 'need',
    emoji: '🎯',
    question: 'Quel est votre besoin principal ?',
    options: [
      { value: 'docs',  label: 'Documents légaux',       sub: 'CERFA, certificats…',   score: 0 },
      { value: 'stats', label: 'Gestion & statistiques', sub: 'Marges, performances…', score: 1 },
      { value: 'all',   label: 'Solution complète',      sub: 'Tout intégré',          score: 2 },
    ],
  },
]

function computePlan(answers) {
  if (answers.sites === 'few' || answers.sites === 'many') return 'reseau'
  const score =
    (QUIZ[0].options.find(o => o.value === answers.volume)?.score ?? 0) +
    (QUIZ[1].options.find(o => o.value === answers.type)?.score ?? 0) +
    (QUIZ[3].options.find(o => o.value === answers.need)?.score ?? 0)
  return score >= 2 ? 'pro' : 'solo'
}

const PLANS = {
  solo: {
    label: 'Solo', price: '79€', color: '#4f6272', bg: 'rgba(255,255,255,0.07)', border: 'rgba(255,255,255,0.12)',
    features: ['1 garage', '30 ventes/mois', 'France uniquement', 'Documents légaux', 'Livre de Police PDF/Excel'],
    why: 'Idéal pour un garage indépendant avec un volume modéré.',
  },
  pro: {
    label: 'Pro', price: '149€', color: '#2563EB', bg: '#e8f4fb', border: '#2563EB',
    features: ['1 garage', 'Ventes illimitées', 'France + Export + Import', 'Statistiques avancées', 'Logo sur documents', 'Support prioritaire'],
    why: 'Le choix des garages actifs qui veulent tout gérer depuis un seul endroit.',
  },
  reseau: {
    label: 'Réseau', price: '349€', color: '#2d3f55', bg: 'rgba(255,255,255,0.07)', border: 'rgba(255,255,255,0.12)',
    features: ["Jusqu'à 10 garages", 'Ventes illimitées', 'France + Export + Import', 'Dashboard multi-sites', 'Support WhatsApp dédié', 'Onboarding accompagné'],
    why: 'Conçu pour les réseaux multi-sites avec déploiement personnalisé.',
  },
}

const SALE_HINTS = [
  null, // step 0 unused
  {
    title: '👤 Étape 1 — Votre client',
    text: 'Cliquez sur "+ Créer un nouveau client" et entrez ces infos :',
    examples: ['Nom : Martin Bernard', 'Email : martin.b@gmail.com', 'Tél : 06 12 34 56 78'],
    expression: 'point',
  },
  {
    title: '🚗 Étape 2 — Le véhicule',
    text: 'Tapez "BMW" dans la barre de recherche et sélectionnez :',
    examples: ['BMW Série 3 · 2021', 'Plaque : AB-123-CD', '45 000 km · Diesel'],
    expression: 'excited',
  },
  {
    title: '💰 Étape 3 — Les détails',
    text: 'Renseignez les conditions de la vente :',
    examples: ['Prix : 19 900 €', 'Type : Vente France', 'Paiement : Virement'],
    expression: 'happy',
  },
  {
    title: '📄 Étape 4 — Documents',
    text: 'Cliquez "Tout sélectionner" puis "Générer les documents" !',
    examples: ['Facture de vente', 'CERFA 15776', 'Certificat de cession'],
    expression: 'excited',
  },
]

// ── Main Tour component ───────────────────────────────────────────────────────
export default function Tour({ user, onComplete }) {
  const navigate = useNavigate()
  const [phase, setPhase] = useState('welcome')  // welcome | spotlight | quiz | result
  const [spotIdx, setSpotIdx] = useState(0)
  const [rect, setRect] = useState(null)
  const [answers, setAnswers] = useState({})
  const [quizStep, setQuizStep] = useState(0)
  const [fading, setFading] = useState(false)
  const [guidedSaleStep, setGuidedSaleStep] = useState(0)
  const [guidedDone, setGuidedDone] = useState(false)
  const [vp, setVp] = useState({ w: window.innerWidth, h: window.innerHeight })
  const isMobile = vp.w < 768

  // Track viewport size
  useEffect(() => {
    const fn = () => setVp({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  // Navigate + measure target element
  useEffect(() => {
    if (phase !== 'spotlight') return
    const step = STEPS[spotIdx]
    setRect(null)
    navigate(step.route)

    let tries = 0
    const poll = setInterval(() => {
      const el = document.getElementById(step.targetId)
      if (el) {
        clearInterval(poll)
        setRect(el.getBoundingClientRect())
      }
      if (++tries > 80) clearInterval(poll)
    }, 50)
    return () => clearInterval(poll)
  }, [phase, spotIdx])

  // Re-measure on resize
  useEffect(() => {
    if (phase !== 'spotlight') return
    const el = document.getElementById(STEPS[spotIdx].targetId)
    if (el) setRect(el.getBoundingClientRect())
  }, [vp])

  // Navigate to /nouvelle-vente when guided-sale starts
  useEffect(() => {
    if (phase !== 'guided-sale') return
    navigate('/nouvelle-vente')
    setGuidedSaleStep(0)
    setGuidedDone(false)
  }, [phase])

  // Poll for guided sale step progress
  useEffect(() => {
    if (phase !== 'guided-sale') return
    const poll = setInterval(() => {
      const el = document.querySelector('[data-sale-step]')
      if (el) {
        const s = parseInt(el.getAttribute('data-sale-step'))
        if (!isNaN(s)) setGuidedSaleStep(s)
      }
      if (document.querySelector('[data-sale-done]')) {
        clearInterval(poll)
        setTimeout(() => setPhase('guided-done'), 600)
      }
    }, 300)
    return () => clearInterval(poll)
  }, [phase])

  const fade = (fn) => {
    setFading(true)
    setTimeout(() => { fn(); setFading(false) }, 200)
  }

  const startTour = () => fade(() => { setPhase('spotlight'); setSpotIdx(0) })
  const skip = () => onComplete()

  const nextSpot = () => {
    if (spotIdx < STEPS.length - 1) fade(() => setSpotIdx(i => i + 1))
    else fade(() => { setPhase('quiz'); setQuizStep(0) })
  }
  const prevSpot = () => {
    if (spotIdx > 0) fade(() => setSpotIdx(i => i - 1))
    else fade(() => setPhase('welcome'))
  }

  const answerQuiz = (qId, value) => {
    const next = { ...answers, [qId]: value }
    setAnswers(next)
    setTimeout(() => {
      if (quizStep < QUIZ.length - 1) setQuizStep(s => s + 1)
      else setPhase('result')
    }, 280)
  }

  // ── WELCOME ────────────────────────────────────────────────────────────────
  if (phase === 'welcome') {
    return (
      <div className="fixed inset-0 flex items-center justify-center px-4"
        style={{ zIndex: 999, background: 'linear-gradient(135deg, #060D1F 0%, #0F2460 45%, #1a3a8f 65%, #060D1F 100%)' }}>
        {/* Subtle floating orbs */}
        {[
          { size: 300, x: '10%', y: '15%', delay: '0s'  },
          { size: 200, x: '75%', y: '60%', delay: '3s'  },
          { size: 150, x: '55%', y: '10%', delay: '6s'  },
        ].map((o, i) => (
          <div key={i} className="absolute rounded-full pointer-events-none"
            style={{ width: o.size, height: o.size, left: o.x, top: o.y, background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)', animation: `float ${9 + i * 2}s ease-in-out infinite`, animationDelay: o.delay }} />
        ))}

        <div className={`flex flex-col items-center text-center transition-opacity duration-300 ${fading ? 'opacity-0' : 'opacity-100'}`}
          style={{ maxWidth: 480, position: 'relative', zIndex: 1 }}>

          {/* Bolt */}
          <div className="blob" style={{ marginBottom: 12 }}>
            <Bolt expression="wave" size={1.7} />
          </div>

          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 14 }}>
            VISITE INTERACTIVE
          </p>
          <h1 style={{ color: '#fff', fontSize: 30, fontWeight: 900, lineHeight: 1.25, marginBottom: 14 }}>
            Bienvenue sur Copilote,{' '}
            <span style={{ color: '#60a5fa' }}>
              {user?.garageName ? user.garageName : 'votre garage'}
            </span> !
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, lineHeight: 1.65, marginBottom: 32, maxWidth: 400 }}>
            Je suis <strong style={{ color: 'rgba(255,255,255,0.85)' }}>Bolt</strong>, votre copilote PVOI.
            En 2 minutes, je vous montre chaque fonctionnalité directement sur le logiciel — puis je vous aide à choisir votre plan.
          </p>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button onClick={startTour}
              style={{ background: '#2563EB', color: '#fff', fontWeight: 800, fontSize: 15, padding: '13px 28px', borderRadius: 14, border: 'none', cursor: 'pointer', boxShadow: '0 8px 32px rgba(37,99,235,0.5)', display: 'flex', alignItems: 'center', gap: 8 }}>
              Commencer la visite <ArrowRight size={17} />
            </button>
            <button onClick={skip}
              style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.45)', fontWeight: 600, fontSize: 13, padding: '13px 22px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>
              Passer
            </button>
          </div>

          {/* Step dots preview */}
          <div style={{ display: 'flex', gap: 6, marginTop: 32, alignItems: 'center' }}>
            {[...STEPS, { id: 'quiz' }, { id: 'result' }].map((_, i) => (
              <div key={i} style={{ width: 6, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.18)' }} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── SPOTLIGHT ─────────────────────────────────────────────────────────────
  if (phase === 'spotlight') {
    const step = STEPS[spotIdx]
    const PAD = 14

    // Compute spotlight geometry
    const sx = rect ? rect.left - PAD : 0
    const sy = rect ? rect.top - PAD : 0
    const sw = rect ? rect.width + PAD * 2 : 0
    const sh = rect ? rect.height + PAD * 2 : 0

    // Position Bolt+bubble: prefer below spotlight, fallback above
    const BUBBLE_W = isMobile ? Math.min(300, vp.w - 32) : 320
    const spaceBelow = rect ? vp.h - (sy + sh) : 0
    const spaceAbove = rect ? sy : 0
    const placeBoltBelow = spaceBelow >= 220 || spaceBelow >= spaceAbove

    let boltLeft = rect ? sx + sw / 2 - 55 : vp.w / 2 - 55
    let boltTop  = rect ? (placeBoltBelow ? sy + sh + 12 : sy - 150) : vp.h - 200
    let bubbleLeft = Math.max(16, Math.min(vp.w - BUBBLE_W - 16, rect ? sx + sw / 2 - BUBBLE_W / 2 : vp.w / 2 - BUBBLE_W / 2))
    let bubbleTop  = rect ? (placeBoltBelow ? boltTop + 135 : boltTop - 155) : vp.h - 200

    // Clamp
    boltLeft  = Math.max(16, Math.min(vp.w - 120, boltLeft))
    boltTop   = Math.max(80, Math.min(vp.h - 170, boltTop))
    bubbleTop = Math.max(80, Math.min(vp.h - 200, bubbleTop))

    return (
      <>
        {/* Invisible event blocker — prevents all page interaction */}
        <div className="fixed inset-0" style={{ zIndex: 990, cursor: 'not-allowed', background: 'transparent' }} />

        {/* SVG spotlight overlay */}
        <svg className="fixed inset-0 pointer-events-none"
          style={{ width: vp.w, height: vp.h, zIndex: 991 }}>
          <defs>
            <mask id="tour-spotlight-mask">
              <rect x={0} y={0} width={vp.w} height={vp.h} fill="white" />
              {rect && <rect x={sx} y={sy} width={sw} height={sh} rx={14} fill="black" />}
            </mask>
          </defs>
          {/* Dark overlay with hole */}
          <rect x={0} y={0} width={vp.w} height={vp.h}
            fill="rgba(6,13,31,0.84)" mask="url(#tour-spotlight-mask)" />
          {/* Spotlight border */}
          {rect && <>
            <rect x={sx} y={sy} width={sw} height={sh} rx={14}
              fill="none" stroke="#2563EB" strokeWidth="2" opacity="0.8" />
            <rect x={sx - 5} y={sy - 5} width={sw + 10} height={sh + 10} rx={19}
              fill="none" stroke="#2563EB" strokeWidth="1" opacity="0.25">
              <animate attributeName="opacity" values="0.25;0.08;0.25" dur="2.5s" repeatCount="indefinite" />
            </rect>
          </>}
        </svg>

        {/* Bolt character */}
        {rect && (
          <div className="fixed pointer-events-none"
            style={{ left: boltLeft, top: boltTop, zIndex: 993, transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)', opacity: fading ? 0 : 1 }}>
            <Bolt expression={step.expression} size={0.85} />
          </div>
        )}

        {/* Speech bubble */}
        {rect && (
          <div className="fixed"
            style={{
              left: bubbleLeft, top: bubbleTop, width: BUBBLE_W, zIndex: 994,
              background: '#fff', borderRadius: 16, padding: '14px 16px',
              boxShadow: '0 20px 60px rgba(6,13,31,0.5)', border: '1px solid #dce4e8',
              transition: 'all 0.35s ease', opacity: fading ? 0 : 1,
              pointerEvents: 'all', cursor: 'default',
            }}>
            {/* Step badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 7 }}>
              <span style={{ background: '#2563EB', color: '#fff', fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 20, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {spotIdx + 1}/{STEPS.length}
              </span>
              <span style={{ color: '#8fa5b5', fontSize: 10, fontWeight: 600 }}>{step.label}</span>
            </div>
            <h3 style={{ color: '#131d2e', fontWeight: 800, fontSize: 13, margin: '0 0 5px', lineHeight: 1.35 }}>
              {step.title}
            </h3>
            <p style={{ color: '#4f6272', fontSize: 12, lineHeight: 1.55, margin: '0 0 12px' }}>
              {step.text}
            </p>
            <button onClick={nextSpot}
              style={{
                width: '100%', background: '#2563EB', color: '#fff', border: 'none',
                cursor: 'pointer', padding: '11px 16px', borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 7, fontSize: 14, fontWeight: 800,
                boxShadow: '0 4px 18px rgba(37,99,235,0.38)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#1D4ED8'}
              onMouseLeave={e => e.currentTarget.style.background = '#2563EB'}>
              {spotIdx === STEPS.length - 1
                ? <><Star size={14} /> Trouver mon plan</>
                : <>Suivant <ArrowRight size={15} /></>
              }
            </button>
          </div>
        )}

        {/* Loading state while navigating */}
        {!rect && (
          <div className="fixed" style={{ zIndex: 993, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
            <div className="blob">
              <Bolt expression={step.expression} size={1.2} />
            </div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 12 }}>Chargement…</p>
          </div>
        )}

        {/* Bottom nav bar */}
        <div className="fixed" style={{
          zIndex: 994, bottom: 20, left: '50%', transform: 'translateX(-50%)',
          background: '#0d1520', borderRadius: 22, padding: '10px 18px',
          display: 'flex', alignItems: 'center', gap: 14,
          boxShadow: '0 12px 40px rgba(6,13,31,0.7)', border: '1px solid rgba(37,99,235,0.2)',
          pointerEvents: 'all', cursor: 'default', whiteSpace: 'nowrap',
        }}>
          {/* Progress */}
          <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            {STEPS.map((_, i) => (
              <div key={i} style={{
                height: 5, borderRadius: 3, transition: 'all 0.3s ease',
                width: i === spotIdx ? 22 : 6,
                background: i <= spotIdx ? '#2563EB' : 'rgba(255,255,255,0.15)',
              }} />
            ))}
          </div>

          <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.1)' }} />

          <button onClick={prevSpot}
            style={{ background: 'transparent', border: 'none', color: '#8fa5b5', cursor: 'pointer', padding: '5px 10px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600 }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <ArrowLeft size={13} /> Retour
          </button>

          <button onClick={skip}
            style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.25)', cursor: 'pointer', fontSize: 11, padding: '5px 6px', borderRadius: 8 }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}>
            Passer
          </button>
        </div>
      </>
    )
  }

  // ── QUIZ ──────────────────────────────────────────────────────────────────
  if (phase === 'quiz') {
    const q = QUIZ[quizStep]
    return (
      <div className="fixed inset-0 flex items-center justify-center px-4"
        style={{ zIndex: 999, background: 'rgba(6,13,31,0.95)', backdropFilter: 'blur(10px)' }}>
        <div style={{ width: '100%', maxWidth: 520 }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 8px' }}>
                CONSTRUCTION DE VOTRE PROFIL · {quizStep + 1}/{QUIZ.length}
              </p>
              <div style={{ display: 'flex', gap: 5 }}>
                {QUIZ.map((_, i) => (
                  <div key={i} style={{
                    height: 3, width: isMobile ? 42 : 56, borderRadius: 2, transition: 'all 0.3s',
                    background: i < quizStep ? '#2563EB' : i === quizStep ? '#60a5fa' : 'rgba(255,255,255,0.12)',
                  }} />
                ))}
              </div>
            </div>
            <button onClick={skip}
              style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 600 }}>
              Passer
            </button>
          </div>

          {/* Card */}
          <div className={`transition-opacity duration-200 ${fading ? 'opacity-0' : 'opacity-100'}`}
            style={{ background: '#111827', borderRadius: 24, padding: '24px', border: '1px solid rgba(37,99,235,0.18)', boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }}>

            {/* Bolt + question bubble */}
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 20 }}>
              <div style={{ flexShrink: 0, marginTop: 4 }}>
                <Bolt expression={Object.keys(answers).length > quizStep ? 'happy' : 'think'} size={0.65} />
              </div>
              <div style={{ background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: '4px 16px 16px 16px', padding: '12px 15px', flex: 1 }}>
                <p style={{ color: '#fff', fontWeight: 700, fontSize: 14, lineHeight: 1.45, margin: 0 }}>
                  {q.emoji} {q.question}
                </p>
              </div>
            </div>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {q.options.map(opt => {
                const selected = answers[q.id] === opt.value
                return (
                  <button key={opt.value} onClick={() => answerQuiz(q.id, opt.value)}
                    style={{
                      background: selected ? 'rgba(37,99,235,0.22)' : 'rgba(255,255,255,0.04)',
                      border: selected ? '2px solid #2563EB' : '1.5px solid rgba(255,255,255,0.1)',
                      borderRadius: 14, padding: '13px 16px', cursor: 'pointer',
                      textAlign: 'left', display: 'flex', alignItems: 'center',
                      justifyContent: 'space-between', gap: 12, transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { if (!selected) e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
                    onMouseLeave={e => { if (!selected) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}>
                    <div>
                      <p style={{ color: selected ? '#93c5fd' : '#fff', fontWeight: 600, fontSize: 13, margin: 0 }}>{opt.label}</p>
                      <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, margin: '2px 0 0' }}>{opt.sub}</p>
                    </div>
                    <div style={{
                      width: 22, height: 22, borderRadius: 11, flexShrink: 0, transition: 'all 0.15s',
                      background: selected ? '#2563EB' : 'rgba(255,255,255,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {selected && <Check size={13} color="white" />}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Back link */}
          {quizStep > 0 && (
            <button onClick={() => setQuizStep(s => s - 1)}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: 12, marginTop: 12, display: 'block', marginLeft: 'auto', marginRight: 'auto' }}>
              ← Question précédente
            </button>
          )}
        </div>
      </div>
    )
  }

  // ── RESULT ────────────────────────────────────────────────────────────────
  if (phase === 'result') {
    const rec = computePlan(answers)
    const order = ['solo', 'pro', 'reseau']
    const recPlan = PLANS[rec]

    return (
      <div className="fixed inset-0 overflow-y-auto"
        style={{ zIndex: 999, background: 'linear-gradient(135deg, #060D1F 0%, #0F2460 45%, #060D1F 100%)' }}>
        <div className="min-h-screen flex items-center justify-center px-4 py-8">
          <div style={{ width: '100%', maxWidth: 700 }}>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 36 }}>
              <div className="blob" style={{ display: 'inline-block', marginBottom: 8 }}>
                <Bolt expression="excited" size={1.3} />
              </div>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 10 }}>
                MA RECOMMANDATION
              </p>
              <h2 style={{ color: '#fff', fontWeight: 900, fontSize: isMobile ? 22 : 28, margin: '0 0 10px', lineHeight: 1.25 }}>
                Le plan <span style={{ color: '#60a5fa' }}>{recPlan.label}</span> est fait pour vous
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, margin: 0 }}>{recPlan.why}</p>
            </div>

            {/* Plan cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {order.map(id => {
                const p = PLANS[id]
                const isRec = id === rec
                return (
                  <div key={id} style={{
                    background: isRec ? '#fff' : 'rgba(255,255,255,0.05)',
                    border: `2px solid ${isRec ? '#2563EB' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: 20, padding: '20px 18px',
                    transform: isRec ? 'scale(1.03)' : 'scale(0.97)',
                    opacity: isRec ? 1 : 0.55,
                    transition: 'all 0.4s ease',
                    position: 'relative',
                  }}>
                    {isRec && (
                      <div style={{
                        position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                        background: '#2563EB', color: '#fff', fontSize: 9, fontWeight: 800,
                        padding: '3px 12px', borderRadius: 20, letterSpacing: '0.1em',
                        textTransform: 'uppercase', whiteSpace: 'nowrap',
                      }}>
                        ⭐ Recommandé pour vous
                      </div>
                    )}
                    <h3 style={{ color: isRec ? '#131d2e' : '#fff', fontWeight: 800, fontSize: 16, margin: '0 0 4px' }}>{p.label}</h3>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginBottom: 14 }}>
                      <span style={{ color: isRec ? p.color : 'rgba(255,255,255,0.7)', fontWeight: 900, fontSize: 26 }}>{p.price}</span>
                      <span style={{ color: isRec ? '#8fa5b5' : 'rgba(255,255,255,0.35)', fontSize: 12 }}>/mois</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      {p.features.map(f => (
                        <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Check size={11} style={{ color: isRec ? '#2e7d32' : 'rgba(255,255,255,0.3)', flexShrink: 0 }} />
                          <span style={{ color: isRec ? '#131d2e' : 'rgba(255,255,255,0.55)', fontSize: 11 }}>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => { onComplete(); navigate('/pricing') }}
                style={{ background: '#2563EB', color: '#fff', fontWeight: 800, fontSize: 14, padding: '13px 28px', borderRadius: 14, border: 'none', cursor: 'pointer', boxShadow: '0 8px 32px rgba(37,99,235,0.5)', display: 'flex', alignItems: 'center', gap: 8 }}>
                Démarrer avec {recPlan.label} <ArrowRight size={16} />
              </button>
              <button onClick={() => setPhase('guided-sale')}
                style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', fontWeight: 700, fontSize: 13, padding: '13px 22px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7 }}>
                🎯 Tuto : créer ma 1ère vente
              </button>
              <button onClick={onComplete}
                style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.45)', fontWeight: 600, fontSize: 12, padding: '13px 18px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}>
                Explorer l'application
              </button>
            </div>

            {/* Redo quiz */}
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <button onClick={() => { setAnswers({}); setQuizStep(0); setPhase('quiz') }}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', cursor: 'pointer', fontSize: 11 }}>
                ← Refaire le quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── GUIDED SALE ───────────────────────────────────────────────────────────
  if (phase === 'guided-sale') {
    const hint = SALE_HINTS[guidedSaleStep] || SALE_HINTS[1]
    return (
      <div className="fixed" style={{
        zIndex: 994, bottom: 24, right: 20,
        width: isMobile ? 'calc(100vw - 32px)' : 320,
        ...(isMobile ? { left: 16, right: 16 } : {}),
      }}>
        {/* Progress strip */}
        <div style={{
          background: '#0d1520', borderRadius: '14px 14px 0 0', padding: '8px 14px',
          display: 'flex', alignItems: 'center', gap: 8,
          border: '1px solid rgba(37,99,235,0.25)', borderBottom: 'none',
        }}>
          <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', flex: 1 }}>
            TUTORIEL — 1ère vente
          </span>
          <div style={{ display: 'flex', gap: 4 }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{
                height: 4, width: i === guidedSaleStep ? 18 : 8, borderRadius: 2, transition: 'all 0.3s',
                background: i < guidedSaleStep ? '#2563EB' : i === guidedSaleStep ? '#60a5fa' : 'rgba(255,255,255,0.15)',
              }} />
            ))}
          </div>
          <button onClick={onComplete}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: '0 2px' }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}>
            ×
          </button>
        </div>

        {/* Main card */}
        <div style={{
          background: '#fff', borderRadius: '0 0 14px 14px', padding: '14px 16px',
          boxShadow: '0 16px 48px rgba(6,13,31,0.35)',
          border: '1px solid rgba(37,99,235,0.18)', borderTop: 'none',
        }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            {/* Bolt */}
            <div style={{ flexShrink: 0, marginTop: 2 }}>
              <Bolt expression={hint.expression} size={0.6} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: '#131d2e', fontWeight: 800, fontSize: 13, margin: '0 0 5px', lineHeight: 1.35 }}>
                {hint.title}
              </p>
              <p style={{ color: '#4f6272', fontSize: 12, lineHeight: 1.5, margin: '0 0 10px' }}>
                {hint.text}
              </p>
              {/* Example values */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {hint.examples.map((ex, i) => (
                  <div key={i} style={{
                    background: '#f4f8fa', border: '1px solid #dce4e8',
                    borderRadius: 8, padding: '5px 10px',
                    fontSize: 11, fontWeight: 600, color: '#2d3f55',
                    fontFamily: 'monospace',
                  }}>
                    {ex}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {guidedSaleStep === 0 && (
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <div className="w-4 h-4 border-2 rounded-full animate-spin shrink-0" style={{ borderColor: '#c8d6de', borderTopColor: '#2563EB', width: 14, height: 14 }} />
              <span style={{ color: '#8fa5b5', fontSize: 11 }}>Navigation en cours…</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── GUIDED DONE ───────────────────────────────────────────────────────────
  if (phase === 'guided-done') {
    return (
      <div className="fixed inset-0 flex items-center justify-center px-4"
        style={{ zIndex: 999, background: 'linear-gradient(135deg, #060D1F 0%, #0F2460 45%, #1a3a8f 65%, #060D1F 100%)' }}>
        <div style={{ maxWidth: 420, width: '100%', textAlign: 'center' }}>
          <div className="blob" style={{ display: 'inline-block', marginBottom: 16 }}>
            <Bolt expression="excited" size={1.5} />
          </div>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 12 }}>
            TUTO TERMINÉ
          </p>
          <h2 style={{ color: '#fff', fontWeight: 900, fontSize: isMobile ? 22 : 26, margin: '0 0 12px', lineHeight: 1.25 }}>
            🎉 Bravo, votre première vente est{' '}
            <span style={{ color: '#60a5fa' }}>maîtrisée !</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 1.6, marginBottom: 32, maxWidth: 360, margin: '0 auto 32px' }}>
            Vous savez maintenant créer un client, sélectionner un véhicule, renseigner les détails et générer vos documents. Vous êtes prêt !
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={onComplete}
              style={{ background: '#2563EB', color: '#fff', fontWeight: 800, fontSize: 14, padding: '13px 28px', borderRadius: 14, border: 'none', cursor: 'pointer', boxShadow: '0 8px 32px rgba(37,99,235,0.5)', display: 'flex', alignItems: 'center', gap: 8 }}>
              Parfait, je me lance ! <ArrowRight size={16} />
            </button>
            <button onClick={() => navigate('/pricing')}
              style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.55)', fontWeight: 600, fontSize: 13, padding: '13px 20px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>
              Voir les plans
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
