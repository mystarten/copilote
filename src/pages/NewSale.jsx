import React, { useState, useRef } from 'react'
import { Check, ChevronRight, User, Car, FileText, Zap, Search, CheckCircle, Euro, Calendar, CreditCard, Shield, RotateCcw, UserPlus, X, Download, Send, Eye, Camera, Hash, Loader, Upload, ShieldCheck } from 'lucide-react'
import { mockVehicles } from '../data/mockData'
import { useClients } from '../context/ClientsContext'
import { useUser } from '../context/UserContext'
import { useToast } from '../components/Toast'
import DocumentPreview from '../components/DocumentPreview'

const DOCS = {
  france: ['Facture de vente', 'Bon de commande', 'Bon de livraison', 'CERFA 15776', 'Certificat de cession', 'Certificat de situation administrative', 'Garantie commerciale', "Déclaration d'achat"],
  export: ['Facture export', 'COC (Certificat de conformité)', 'Radiation ANTS', 'Justificatifs fiscaux', 'Déclaration en douane', 'Packing list', 'Attestation de sortie territoire UE'],
  import: ["Facture d'achat", 'COC (Certificat de conformité)', 'Quitus fiscal', 'Formulaire 846A', 'Certificat déclaration en douane', 'Homologation UTAC/DREAL', 'Demande immatriculation ANTS'],
}

const steps = [
  { id: 1, label: 'Client',    icon: User     },
  { id: 2, label: 'Véhicule',  icon: Car      },
  { id: 3, label: 'Détails',   icon: FileText },
  { id: 4, label: 'Documents', icon: Zap      },
]

// ── VIN database (démo) ───────────────────────────────────────────────────────
const VIN_DB = {
  'WBS8M9C5XNC000001': { id: 101, marque: 'BMW',         modele: 'M3 Competition',    annee: 2022, km: 18500,  carburant: 'Essence',    plaque: 'AB-123-CD', statut: 'En stock' },
  'WP1AB2AY5LDA00002': { id: 102, marque: 'Porsche',     modele: 'Cayenne S',          annee: 2021, km: 22000,  carburant: 'Essence',    plaque: 'EF-456-GH', statut: 'En stock' },
  'W1N1671671A000003': { id: 103, marque: 'Mercedes',    modele: 'GLE 400d',           annee: 2021, km: 34000,  carburant: 'Diesel',     plaque: 'IJ-789-KL', statut: 'En stock' },
  'WAUZZZF17LD000004': { id: 104, marque: 'Audi',        modele: 'Q8 55 TFSI',         annee: 2022, km: 27000,  carburant: 'Essence',    plaque: 'MN-012-OP', statut: 'En stock' },
  'SALWA2FE5LA000005': { id: 105, marque: 'Range Rover', modele: 'Sport HSE',          annee: 2020, km: 48000,  carburant: 'Diesel',     plaque: 'QR-345-ST', statut: 'En stock' },
  '5YJ3E1EB9NF000006': { id: 106, marque: 'Tesla',       modele: 'Model 3 Long Range', annee: 2022, km: 28000,  carburant: 'Électrique', plaque: 'UV-678-WX', statut: 'En stock' },
  '5UXCR6C09N0000007': { id: 107, marque: 'BMW',         modele: 'X5 xDrive40d',      annee: 2021, km: 41000,  carburant: 'Diesel',     plaque: 'YZ-901-AB', statut: 'En stock' },
}

// ── Live document preview ─────────────────────────────────────────────────────
function LiveDocPreview({ client, vehicle, prix, date, paiement, garantie, saleType, user }) {
  const fmt = (d) => {
    if (!d) return new Date().toLocaleDateString('fr-FR')
    if (d.includes('-')) { const [y, m, day] = d.split('-'); return `${day}/${m}/${y}` }
    return d
  }
  const hasAny = client || vehicle || prix

  return (
    <div className="hidden lg:block w-72 xl:w-80 shrink-0 sticky top-8">
      {/* Browser chrome */}
      <div style={{ background: '#1e293b', borderRadius: '14px 14px 0 0', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 7 }}>
        <div style={{ display: 'flex', gap: 5 }}>
          {['#ef4444','#f59e0b','#22c55e'].map(c => <div key={c} style={{ width: 9, height: 9, borderRadius: 5, background: c }} />)}
        </div>
        <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, flex: 1, textAlign: 'center' }}>facture_vente.pdf</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{
            width: 7, height: 7, borderRadius: 4,
            background: hasAny ? '#22c55e' : '#64748b',
            boxShadow: hasAny ? '0 0 6px #22c55e' : 'none',
            transition: 'all 0.4s',
          }} />
          <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 9 }}>{hasAny ? 'LIVE' : 'EN ATTENTE'}</span>
        </div>
      </div>

      {/* Document */}
      <div style={{
        background: '#fff', borderRadius: '0 0 14px 14px', padding: '20px 18px',
        boxShadow: '0 20px 60px rgba(6,13,31,0.18)',
        border: '1px solid #dce4e8', borderTop: 'none',
        fontFamily: 'Georgia, serif',
      }}>
        {/* En-tête */}
        <div style={{ borderBottom: '2.5px solid #131d2e', paddingBottom: 10, marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ fontWeight: 900, fontSize: 13, color: '#131d2e', margin: 0, fontFamily: 'system-ui' }}>{user?.garageName || 'Mon Garage'}</p>
            <p style={{ fontSize: 8, color: '#8fa5b5', margin: '2px 0 0', fontFamily: 'system-ui' }}>Professionnel de l'automobile</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 8, fontWeight: 700, color: '#2563EB', margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'system-ui' }}>Facture de vente</p>
            <p style={{ fontSize: 8, color: '#8fa5b5', margin: '2px 0 0', fontFamily: 'system-ui' }}>Le {fmt(date)}</p>
          </div>
        </div>

        {/* Acheteur + Véhicule */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
          <div style={{ background: '#f4f8fa', borderRadius: 8, padding: '8px 10px' }}>
            <p style={{ fontSize: 7, fontWeight: 700, color: '#8fa5b5', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 5px', fontFamily: 'system-ui' }}>Acheteur</p>
            <p style={{ fontSize: 11, fontWeight: 700, color: client ? '#131d2e' : '#c8d6de', margin: 0, transition: 'color 0.3s' }}>
              {client?.nom || '———'}
            </p>
            <p style={{ fontSize: 8, color: '#8fa5b5', margin: '2px 0 0', lineHeight: 1.3, fontFamily: 'system-ui' }}>
              {client?.adresse || ''}
            </p>
          </div>
          <div style={{ background: '#f4f8fa', borderRadius: 8, padding: '8px 10px' }}>
            <p style={{ fontSize: 7, fontWeight: 700, color: '#8fa5b5', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 5px', fontFamily: 'system-ui' }}>Véhicule</p>
            <p style={{ fontSize: 11, fontWeight: 700, color: vehicle ? '#131d2e' : '#c8d6de', margin: 0, transition: 'color 0.3s' }}>
              {vehicle ? `${vehicle.marque} ${vehicle.modele}` : '———'}
            </p>
            <p style={{ fontSize: 8, color: '#8fa5b5', margin: '2px 0 0', fontFamily: 'system-ui' }}>
              {vehicle ? `${vehicle.annee} · ${vehicle.plaque}` : ''}
            </p>
          </div>
        </div>

        {/* Prix */}
        <div style={{
          background: prix ? 'linear-gradient(135deg, #e8f4fb, #dbeeff)' : '#f4f8fa',
          border: `1.5px solid ${prix ? '#2563EB' : '#dce4e8'}`,
          borderRadius: 10, padding: '10px 14px', marginBottom: 12,
          transition: 'all 0.4s ease',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 9, color: '#4f6272', fontFamily: 'system-ui' }}>Prix de vente TTC</span>
            <span style={{ fontSize: 22, fontWeight: 900, color: prix ? '#2563EB' : '#c8d6de', transition: 'all 0.4s', fontFamily: 'system-ui', letterSpacing: '-0.5px' }}>
              {prix ? `${parseInt(prix).toLocaleString()} €` : '— €'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5, paddingTop: 5, borderTop: '1px solid rgba(37,99,235,0.1)' }}>
            <span style={{ fontSize: 8, color: '#8fa5b5', fontFamily: 'system-ui' }}>{paiement}</span>
            <span style={{ fontSize: 8, color: garantie ? '#2e7d32' : '#8fa5b5', fontFamily: 'system-ui' }}>
              {garantie ? '✓ Ext. garantie incluse' : 'Sans extension garantie'}
            </span>
          </div>
        </div>

        {/* Type badge */}
        <div style={{ display: 'flex', gap: 5, marginBottom: 14 }}>
          {['france','export','import'].map(t => (
            <span key={t} style={{
              fontSize: 7, fontWeight: 700, padding: '2px 7px', borderRadius: 5,
              textTransform: 'uppercase', letterSpacing: '0.06em',
              background: saleType === t ? '#2563EB' : '#eef3f7',
              color: saleType === t ? '#fff' : '#c8d6de',
              transition: 'all 0.25s', fontFamily: 'system-ui',
            }}>{t}</span>
          ))}
        </div>

        {/* Signatures */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
          {['Vendeur','Acheteur'].map(s => (
            <div key={s} style={{ border: '1px dashed #c8d6de', borderRadius: 8, padding: '8px', textAlign: 'center' }}>
              <p style={{ fontSize: 7, color: '#c8d6de', margin: '0 0 14px', fontFamily: 'system-ui' }}>Signature {s}</p>
              <div style={{ height: 1, background: '#dce4e8' }} />
            </div>
          ))}
        </div>

        <p style={{ fontSize: 7, color: '#c8d6de', textAlign: 'center', margin: 0, fontFamily: 'system-ui' }}>
          Document conforme CNPA — généré par Copilote PVOI
        </p>
      </div>

      <p style={{ textAlign: 'center', fontSize: 10, color: '#8fa5b5', marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
        <span style={{ width: 6, height: 6, borderRadius: 3, background: '#22c55e', display: 'inline-block', boxShadow: '0 0 5px #22c55e' }} />
        Aperçu en temps réel
      </p>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function NewSale() {
  const { showToast } = useToast()
  const { clients, addClient } = useClients()
  const user = useUser()
  const vehicles = user?.isDemo ? mockVehicles : []
  const cgInputRef = useRef(null)

  const [step, setStep] = useState(1)
  const [selectedClient, setSelectedClient] = useState(null)
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [clientSearch, setClientSearch] = useState('')
  const [vehicleSearch, setVehicleSearch] = useState('')
  const [showClientDrop, setShowClientDrop] = useState(false)
  const [showVehicleDrop, setShowVehicleDrop] = useState(false)
  const [showNewClientForm, setShowNewClientForm] = useState(false)
  const [newClientForm, setNewClientForm] = useState({ nom: '', email: '', telephone: '', adresse: '' })
  const [newClientCni, setNewClientCni] = useState(null)
  const cniRef = useRef(null)
  const [saleType, setSaleType] = useState('france')
  const [prix, setPrix] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [paiement, setPaiement] = useState('Virement')
  const [garantie, setGarantie] = useState(true)
  const [selectedDocs, setSelectedDocs] = useState({})
  const [generating, setGenerating] = useState(false)
  const [docProgress, setDocProgress] = useState({})
  const [allGenerated, setAllGenerated] = useState(false)
  const [previewDoc, setPreviewDoc] = useState(null)
  // Nouvelles features
  const [scanning, setScanning] = useState(false)
  const [vinSearch, setVinSearch] = useState('')
  const [vinLoading, setVinLoading] = useState(false)
  const [vinResult, setVinResult] = useState(null) // null | 'found' | 'notfound'
  const [showVinInput, setShowVinInput] = useState(false)

  const filteredClients = clients.filter(c =>
    c.nom.toLowerCase().includes(clientSearch.toLowerCase()) ||
    c.email.toLowerCase().includes(clientSearch.toLowerCase())
  )
  const filteredVehicles = vehicles.filter(v =>
    v.statut === 'En stock' && (
      v.plaque.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
      v.marque.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
      v.modele.toLowerCase().includes(vehicleSearch.toLowerCase())
    )
  )

  const handleTypeChange = (type) => { setSaleType(type); setSelectedDocs({}); setDocProgress({}); setAllGenerated(false) }
  const toggleDoc = (doc) => setSelectedDocs(prev => ({ ...prev, [doc]: !prev[doc] }))
  const selectAllDocs = () => { const all = {}; DOCS[saleType].forEach(d => { all[d] = true }); setSelectedDocs(all) }
  const deselectAllDocs = () => setSelectedDocs({})
  const selectedDocsList = DOCS[saleType].filter(d => selectedDocs[d])

  const handleAddNewClient = () => {
    if (!newClientForm.nom || !newClientForm.email) return
    const created = addClient({ ...newClientForm, cni: !!newClientCni, cniFile: newClientCni })
    setSelectedClient(created); setClientSearch(created.nom)
    setShowNewClientForm(false)
    setNewClientForm({ nom: '', email: '', telephone: '', adresse: '' })
    setNewClientCni(null)
    showToast(`${created.nom} ajouté et sélectionné ✅`)
  }

  const handleNewClientCni = (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => setNewClientCni({ name: file.name, dataUrl: e.target.result, type: file.type })
    reader.readAsDataURL(file)
  }

  // ── Scan carte grise ──────────────────────────────────────────────────────
  const handleScanCG = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setScanning(true)
    const vinList = Object.values(VIN_DB)
    const v = vinList[Math.floor(Math.random() * vinList.length)]
    setTimeout(() => {
      setSelectedVehicle(v)
      setVehicleSearch(`${v.marque} ${v.modele}`)
      setScanning(false)
      showToast(`✅ Carte grise lue — ${v.marque} ${v.modele} ${v.annee} identifié`)
    }, 2200)
    e.target.value = ''
  }

  // ── Recherche VIN ─────────────────────────────────────────────────────────
  const handleVinChange = (val) => {
    setVinSearch(val)
    setVinResult(null)
    if (val.length < 17) return
    setVinLoading(true)
    setTimeout(() => {
      const found = VIN_DB[val.toUpperCase()]
      setVinLoading(false)
      if (found) {
        setVinResult('found')
        setSelectedVehicle(found)
        setVehicleSearch(`${found.marque} ${found.modele}`)
        showToast(`✅ VIN reconnu — ${found.marque} ${found.modele} ${found.annee}`)
      } else {
        setVinResult('notfound')
      }
    }, 1400)
  }

  const handleGenerate = () => {
    if (selectedDocsList.length === 0) return
    setGenerating(true); setAllGenerated(false)
    const initProgress = {}
    selectedDocsList.forEach(d => { initProgress[d] = 'pending' })
    setDocProgress(initProgress)
    let completed = 0
    selectedDocsList.forEach((doc, i) => {
      setTimeout(() => {
        setDocProgress(prev => ({ ...prev, [doc]: 'done' }))
        completed++
        if (completed === selectedDocsList.length) { setGenerating(false); setAllGenerated(true) }
      }, 900 + i * 320)
    })
  }

  const handleReset = () => {
    setStep(1); setSelectedClient(null); setSelectedVehicle(null)
    setClientSearch(''); setVehicleSearch(''); setPrix('')
    setSaleType('france'); setGenerating(false); setDocProgress({})
    setAllGenerated(false); setShowNewClientForm(false); setSelectedDocs({})
    setVinSearch(''); setVinResult(null); setShowVinInput(false)
    showToast('Nouvelle vente initialisée ✅')
  }

  const dropStyle = { background: '#fff', border: '1.5px solid #c8d6de', borderRadius: 12, boxShadow: '0 8px 24px rgba(19,29,46,0.12)' }

  return (
    <div className="p-4 md:p-8 fade-in max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#131d2e' }}>Nouvelle Vente</h1>
          <p className="text-sm mt-0.5" style={{ color: '#4f6272' }}>Générez vos documents administratifs en quelques minutes</p>
        </div>
        <button onClick={handleReset}
          className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-colors hover:bg-slate-50"
          style={{ border: '1.5px solid #c8d6de', color: '#4f6272', background: '#fff' }}>
          <RotateCcw size={14} /> Recommencer
        </button>
      </div>

      {/* Stepper */}
      <div id="tour-stepper" className="flex items-center mb-6 md:mb-8">
        {steps.map((s, i) => {
          const Icon = s.icon
          const done = step > s.id
          const active = step === s.id
          return (
            <React.Fragment key={s.id}>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm transition-all"
                  style={done
                    ? { background: '#2563EB', color: '#fff' }
                    : active
                      ? { background: '#2d3f55', color: '#fff' }
                      : { background: '#fff', border: '2px solid #c8d6de', color: '#8fa5b5' }
                  }>
                  {done ? <Check size={15} /> : <Icon size={15} />}
                </div>
                <span className="text-sm font-semibold hidden sm:block" style={{ color: active ? '#131d2e' : done ? '#2d3f55' : '#8fa5b5' }}>
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="flex-1 h-px mx-3 transition-all"
                  style={{ background: step > s.id ? '#2563EB' : '#c8d6de' }} />
              )}
            </React.Fragment>
          )
        })}
      </div>

      {/* Layout : step 3 élargit avec le preview */}
      <div className={step === 3 ? 'flex gap-6 items-start max-w-5xl mx-auto' : ''}>

        {/* Card */}
        <div
          className={`sea-card p-6 md:p-8 ${step === 3 ? 'flex-1 min-w-0' : 'max-w-2xl mx-auto w-full'}`}
          data-sale-step={step}
        >

          {/* STEP 1 */}
          {step === 1 && (
            <div className="fade-in">
              <h2 className="text-lg font-bold mb-6" style={{ color: '#131d2e' }}>Sélectionner un client</h2>
              <div className="relative">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#8fa5b5' }} />
                <input type="text" placeholder="Rechercher dans la base clients..."
                  value={clientSearch}
                  onChange={e => { setClientSearch(e.target.value); setShowClientDrop(true); setSelectedClient(null) }}
                  onFocus={() => setShowClientDrop(true)}
                  className="sea-input pl-10" />
                {showClientDrop && clientSearch && (
                  <div className="absolute z-10 w-full mt-1 overflow-hidden" style={dropStyle}>
                    {filteredClients.length > 0
                      ? filteredClients.map(c => (
                        <button key={c.id} className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
                          onMouseEnter={e => e.currentTarget.style.background = '#f4f8fa'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          onClick={() => { setSelectedClient(c); setClientSearch(c.nom); setShowClientDrop(false) }}>
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0"
                            style={{ background: '#2d3f55' }}>{c.nom[0]}</div>
                          <div>
                            <p className="text-sm font-semibold" style={{ color: '#131d2e' }}>{c.nom}</p>
                            <p className="text-xs" style={{ color: '#8fa5b5' }}>{c.email}</p>
                          </div>
                          {c.cni && <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-lg" style={{ background: '#e6f4ea', color: '#2e7d32', border: '1px solid #a5d6a7' }}>CNI</span>}
                        </button>
                      ))
                      : <div className="px-4 py-3 text-sm text-center" style={{ color: '#8fa5b5' }}>Aucun résultat</div>
                    }
                  </div>
                )}
              </div>

              <button onClick={() => setShowNewClientForm(!showNewClientForm)}
                className="mt-4 flex items-center gap-2 text-sm font-semibold transition-colors"
                style={{ color: '#2563EB' }}>
                <UserPlus size={14} />
                {showNewClientForm ? 'Annuler' : '+ Créer un nouveau client'}
              </button>

              {showNewClientForm && (
                <div className="mt-4 p-5 rounded-xl fade-in space-y-3"
                  style={{ background: '#f4f8fa', border: '1.5px solid #b3d4e8' }}>
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#2563EB' }}>Nouveau client</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { key: 'nom', placeholder: 'Nom complet*' },
                      { key: 'email', placeholder: 'Email*' },
                      { key: 'telephone', placeholder: 'Téléphone' },
                      { key: 'adresse', placeholder: 'Adresse' },
                    ].map(f => (
                      <input key={f.key} type="text" placeholder={f.placeholder}
                        value={newClientForm[f.key]}
                        onChange={e => setNewClientForm(p => ({ ...p, [f.key]: e.target.value }))}
                        className="sea-input" />
                    ))}
                  </div>

                  {/* CNI upload */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5" style={{ color: '#4f6272' }}>
                      <ShieldCheck size={11} /> CNI / Passeport
                    </p>
                    {newClientCni ? (
                      <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                        style={{ background: '#e6f4ea', border: '1.5px solid #a5d6a7' }}>
                        <Check size={13} style={{ color: '#2e7d32' }} />
                        <span className="text-xs font-semibold flex-1 truncate" style={{ color: '#2e7d32' }}>{newClientCni.name}</span>
                        <button onClick={() => setNewClientCni(null)} style={{ color: '#8fa5b5' }}>
                          <X size={13} />
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => cniRef.current?.click()}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all"
                        style={{ background: '#f4f8fa', border: '1.5px dashed #c8d6de' }}>
                        <Upload size={14} style={{ color: '#8fa5b5' }} />
                        <span className="text-xs font-semibold" style={{ color: '#8fa5b5' }}>Ajouter CNI / Passeport (optionnel)</span>
                      </button>
                    )}
                    <input ref={cniRef} type="file" accept="image/*,.pdf" className="hidden"
                      onChange={e => handleNewClientCni(e.target.files?.[0])} />
                  </div>

                  <button onClick={handleAddNewClient} disabled={!newClientForm.nom || !newClientForm.email}
                    className="w-full text-white text-sm font-bold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-40 transition-all"
                    style={{ background: '#2563EB' }}>
                    <Check size={14} /> Créer et sélectionner
                  </button>
                </div>
              )}

              {selectedClient && (
                <div className="mt-4 p-4 rounded-xl fade-in flex items-center gap-3"
                  style={{ background: '#e8f4fb', border: '1.5px solid #b3d4e8' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black shrink-0"
                    style={{ background: '#2d3f55' }}>{selectedClient.nom[0]}</div>
                  <div>
                    <p className="font-bold" style={{ color: '#131d2e' }}>{selectedClient.nom}</p>
                    <p className="text-sm" style={{ color: '#4f6272' }}>{selectedClient.email} · {selectedClient.telephone}</p>
                  </div>
                  <button onClick={() => { setSelectedClient(null); setClientSearch('') }} className="ml-auto p-1 rounded-lg transition-colors hover:bg-white/50">
                    <X size={14} style={{ color: '#8fa5b5' }} />
                  </button>
                </div>
              )}

              <div className="mt-8 flex justify-end">
                <button onClick={() => setStep(2)} disabled={!selectedClient}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  style={{ background: '#2563EB' }}>
                  Suivant <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="fade-in">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold" style={{ color: '#131d2e' }}>Sélectionner un véhicule</h2>
                {/* Scan CG button */}
                <button
                  onClick={() => cgInputRef.current?.click()}
                  disabled={scanning}
                  className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all disabled:opacity-60"
                  style={{ background: scanning ? '#e8f4fb' : '#131d2e', color: '#fff', border: 'none', cursor: scanning ? 'wait' : 'pointer', boxShadow: '0 4px 14px rgba(19,29,46,0.25)' }}>
                  {scanning
                    ? <><Loader size={13} className="animate-spin" /> Lecture…</>
                    : <><Camera size={13} /> Scanner carte grise</>
                  }
                </button>
                <input ref={cgInputRef} type="file" accept="image/*" capture="environment"
                  className="hidden" onChange={handleScanCG} />
              </div>

              {/* Scanning overlay */}
              {scanning && (
                <div className="mb-4 p-4 rounded-xl fade-in flex items-center gap-3"
                  style={{ background: 'linear-gradient(135deg, #060D1F, #1a3a8f)', border: '1px solid rgba(37,99,235,0.3)' }}>
                  <div className="relative shrink-0">
                    <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(37,99,235,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Camera size={18} style={{ color: '#60a5fa' }} />
                    </div>
                    {/* Scan line animation */}
                    <div style={{
                      position: 'absolute', left: 0, right: 0, height: 2, background: '#2563EB',
                      boxShadow: '0 0 8px #2563EB', borderRadius: 1,
                      animation: 'scanLine 1.2s ease-in-out infinite',
                    }} />
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: '#fff' }}>Lecture OCR en cours…</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>Extraction des données carte grise</p>
                  </div>
                  <div className="ml-auto flex gap-1">
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{ width: 5, height: 5, borderRadius: 3, background: '#2563EB', animation: `bounce 0.8s ${i * 0.2}s infinite` }} />
                    ))}
                  </div>
                </div>
              )}

              {/* Recherche texte */}
              <div className="relative">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#8fa5b5' }} />
                <input type="text" placeholder="Marque, modèle ou plaque..."
                  value={vehicleSearch}
                  onChange={e => { setVehicleSearch(e.target.value); setShowVehicleDrop(true); setSelectedVehicle(null) }}
                  onFocus={() => setShowVehicleDrop(true)}
                  className="sea-input pl-10" />
                {showVehicleDrop && vehicleSearch && filteredVehicles.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 overflow-hidden" style={dropStyle}>
                    {filteredVehicles.map(v => (
                      <button key={v.id} className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
                        onMouseEnter={e => e.currentTarget.style.background = '#f4f8fa'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        onClick={() => { setSelectedVehicle(v); setVehicleSearch(`${v.marque} ${v.modele}`); setShowVehicleDrop(false) }}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: '#eef3f7', border: '1px solid #c8d6de' }}>
                          <Car size={13} style={{ color: '#4f6272' }} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: '#131d2e' }}>{v.marque} {v.modele} · {v.plaque}</p>
                          <p className="text-xs" style={{ color: '#8fa5b5' }}>{v.annee} · {v.km.toLocaleString()} km · {v.carburant}</p>
                        </div>
                        <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-lg" style={{ background: '#e6f4ea', color: '#2e7d32', border: '1px solid #a5d6a7' }}>En stock</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Recherche VIN */}
              <div className="mt-3">
                <button onClick={() => { setShowVinInput(v => !v); setVinSearch(''); setVinResult(null) }}
                  className="flex items-center gap-2 text-sm font-semibold transition-colors"
                  style={{ color: '#2563EB' }}>
                  <Hash size={13} />
                  {showVinInput ? 'Masquer la recherche VIN' : 'Rechercher par numéro VIN'}
                </button>

                {showVinInput && (
                  <div className="mt-3 fade-in">
                    <div className="relative">
                      <Hash size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#8fa5b5' }} />
                      <input
                        type="text"
                        placeholder="Ex : WBS8M9C5XNC000001"
                        value={vinSearch}
                        onChange={e => handleVinChange(e.target.value.toUpperCase())}
                        maxLength={17}
                        className="sea-input pl-10 font-mono text-sm tracking-widest"
                        style={{ letterSpacing: '0.12em' }}
                      />
                      {vinLoading && (
                        <Loader size={13} className="animate-spin absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: '#2563EB' }} />
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-1.5 px-1">
                      <span className="text-xs" style={{ color: '#8fa5b5' }}>{vinSearch.length}/17 caractères</span>
                      {vinResult === 'found' && <span className="text-xs font-semibold" style={{ color: '#2e7d32' }}>✓ Véhicule trouvé</span>}
                      {vinResult === 'notfound' && <span className="text-xs font-semibold" style={{ color: '#dc2626' }}>VIN non trouvé dans le stock</span>}
                    </div>
                    {/* VIN hints */}
                    {vinSearch.length === 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {Object.keys(VIN_DB).slice(0, 3).map(vin => (
                          <button key={vin} onClick={() => handleVinChange(vin)}
                            className="text-xs px-2 py-1 rounded-lg font-mono"
                            style={{ background: '#e8f4fb', color: '#2563EB', border: '1px solid #b3d4e8', letterSpacing: '0.05em' }}>
                            {vin}
                          </button>
                        ))}
                        <span className="text-xs self-center" style={{ color: '#c8d6de' }}>← exemples</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {selectedVehicle && (
                <div className="mt-4 p-4 rounded-xl fade-in"
                  style={{ background: '#e8f4fb', border: '1.5px solid #b3d4e8' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: '#eef3f7', border: '1px solid #c8d6de' }}>
                      <Car size={17} style={{ color: '#2563EB' }} />
                    </div>
                    <div>
                      <p className="font-bold" style={{ color: '#131d2e' }}>{selectedVehicle.marque} {selectedVehicle.modele}</p>
                      <p className="text-sm" style={{ color: '#4f6272' }}>{selectedVehicle.plaque} · {selectedVehicle.annee} · {selectedVehicle.km.toLocaleString()} km · {selectedVehicle.carburant}</p>
                    </div>
                    <button onClick={() => { setSelectedVehicle(null); setVehicleSearch(''); setVinSearch(''); setVinResult(null) }}
                      className="ml-auto p-1 rounded-lg hover:bg-white/50">
                      <X size={14} style={{ color: '#8fa5b5' }} />
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-between">
                <button onClick={() => setStep(1)} className="text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors hover:bg-slate-50"
                  style={{ border: '1.5px solid #c8d6de', color: '#4f6272' }}>← Retour</button>
                <button onClick={() => setStep(3)} disabled={!selectedVehicle}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ background: '#2563EB' }}>
                  Suivant <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="fade-in">
              <h2 className="text-lg font-bold mb-6" style={{ color: '#131d2e' }}>Détails de la vente</h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                {[
                  { id: 'france', label: 'Vente France', desc: 'Transaction nationale' },
                  { id: 'export', label: 'Export',       desc: 'UE / Hors UE'          },
                  { id: 'import', label: 'Import',       desc: 'UE / Hors UE'          },
                ].map(t => (
                  <button key={t.id} onClick={() => handleTypeChange(t.id)}
                    className="p-4 rounded-xl text-left transition-all"
                    style={saleType === t.id
                      ? { background: '#e8f4fb', border: '2px solid #2563EB' }
                      : { background: '#f4f8fa', border: '2px solid #dce4e8' }
                    }>
                    <p className="text-sm font-bold mb-0.5" style={{ color: saleType === t.id ? '#2563EB' : '#2d3f55' }}>{t.label}</p>
                    <p className="text-xs" style={{ color: '#8fa5b5' }}>{t.desc}</p>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5" style={{ color: '#4f6272' }}>
                    <Euro size={11} /> Prix de vente (€)*
                  </label>
                  <input type="number" value={prix} onChange={e => setPrix(e.target.value)}
                    placeholder="Ex: 19900" className="sea-input" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5" style={{ color: '#4f6272' }}>
                    <Calendar size={11} /> Date de vente*
                  </label>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)}
                    className="sea-input" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5" style={{ color: '#4f6272' }}>
                    <CreditCard size={11} /> Mode de paiement
                  </label>
                  <select value={paiement} onChange={e => setPaiement(e.target.value)} className="sea-input">
                    {['Virement', 'Chèque', 'Espèces', 'Financement'].map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5" style={{ color: '#4f6272' }}>
                    <Shield size={11} /> Extension de garantie
                  </label>
                  <button onClick={() => setGarantie(!garantie)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all"
                    style={garantie
                      ? { background: '#e8f4fb', border: '2px solid #2563EB', color: '#2563EB' }
                      : { background: '#f4f8fa', border: '2px solid #dce4e8', color: '#8fa5b5' }
                    }>
                    <span className="font-semibold">{garantie ? '✓ Incluse' : 'Non incluse'}</span>
                    <div className="w-10 h-5 rounded-full relative transition-all" style={{ background: garantie ? '#2563EB' : '#c8d6de' }}>
                      <div className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all" style={{ left: garantie ? '1.25rem' : '0.125rem' }} />
                    </div>
                  </button>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button onClick={() => setStep(2)} className="text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors hover:bg-slate-50"
                  style={{ border: '1.5px solid #c8d6de', color: '#4f6272' }}>← Retour</button>
                <button onClick={() => setStep(4)} disabled={!prix}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ background: '#2563EB' }}>
                  Suivant <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="fade-in">
              <h2 className="text-lg font-bold mb-1" style={{ color: '#131d2e' }}>Sélection des documents</h2>
              <p className="text-sm mb-5" style={{ color: '#4f6272' }}>Cochez uniquement les documents dont vous avez besoin</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 p-4 rounded-xl"
                style={{ background: '#f4f8fa', border: '1px solid #dce4e8' }}>
                <div>
                  <p className="text-xs uppercase tracking-wide mb-0.5" style={{ color: '#8fa5b5' }}>Client</p>
                  <p className="font-bold text-sm" style={{ color: '#131d2e' }}>{selectedClient?.nom}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide mb-0.5" style={{ color: '#8fa5b5' }}>Véhicule</p>
                  <p className="font-bold text-sm" style={{ color: '#131d2e' }}>{selectedVehicle?.marque} {selectedVehicle?.modele}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide mb-0.5" style={{ color: '#8fa5b5' }}>Prix / Type</p>
                  <p className="font-bold text-sm" style={{ color: '#131d2e' }}>{parseInt(prix).toLocaleString()} € · {saleType}</p>
                </div>
              </div>

              {!generating && !allGenerated && (
                <div className="flex gap-2 mb-4 items-center">
                  <button onClick={selectAllDocs}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                    style={{ color: '#2563EB', border: '1px solid #b3d4e8', background: '#e8f4fb' }}>
                    Tout sélectionner
                  </button>
                  <button onClick={deselectAllDocs}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors hover:bg-slate-50"
                    style={{ color: '#4f6272', border: '1px solid #c8d6de', background: '#fff' }}>
                    Tout décocher
                  </button>
                  <span className="ml-auto text-xs" style={{ color: '#8fa5b5' }}>
                    {selectedDocsList.length} / {DOCS[saleType].length} sélectionnés
                  </span>
                </div>
              )}

              <div className="space-y-2 mb-6">
                {DOCS[saleType].map(doc => {
                  const isSelected = !!selectedDocs[doc]
                  const isDone = docProgress[doc] === 'done'
                  const isPending = docProgress[doc] === 'pending'
                  return (
                    <div key={doc}
                      onClick={() => !generating && !allGenerated && toggleDoc(doc)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all"
                      style={{
                        cursor: !generating && !allGenerated ? 'pointer' : 'default',
                        background: isDone ? '#e6f4ea' : isSelected ? '#e8f4fb' : '#f4f8fa',
                        borderColor: isDone ? '#a5d6a7' : isSelected ? '#b3d4e8' : '#dce4e8',
                      }}>
                      {isDone
                        ? <CheckCircle size={16} className="check-pop shrink-0" style={{ color: '#2e7d32' }} />
                        : isPending
                          ? <div className="w-4 h-4 border-2 rounded-full animate-spin shrink-0" style={{ borderColor: '#c8d6de', borderTopColor: '#2563EB' }} />
                          : (
                            <div className="w-4 h-4 rounded-md border-2 shrink-0 flex items-center justify-center transition-all"
                              style={{ background: isSelected ? '#2563EB' : '#fff', borderColor: isSelected ? '#2563EB' : '#c8d6de' }}>
                              {isSelected && <Check size={10} className="text-white" />}
                            </div>
                          )
                      }
                      <span className="text-sm font-medium" style={{ color: isDone ? '#2e7d32' : isSelected ? '#2563EB' : '#4f6272' }}>{doc}</span>
                    </div>
                  )
                })}
              </div>

              {generating && (
                <div className="mb-5 p-4 rounded-xl" style={{ background: '#e8f4fb', border: '1px solid #b3d4e8' }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-4 h-4 border-2 rounded-full animate-spin shrink-0" style={{ borderColor: '#b3d4e8', borderTopColor: '#2563EB' }} />
                    <p className="text-sm font-semibold" style={{ color: '#2563EB' }}>Génération en cours…</p>
                    <span className="ml-auto text-xs" style={{ color: '#4f6272' }}>
                      {Object.values(docProgress).filter(v => v === 'done').length}/{selectedDocsList.length}
                    </span>
                  </div>
                  <div className="w-full rounded-full h-1.5" style={{ background: '#c8d6de' }}>
                    <div className="h-1.5 rounded-full transition-all duration-500" style={{
                      background: '#2563EB',
                      width: `${(Object.values(docProgress).filter(v => v === 'done').length / selectedDocsList.length) * 100}%`
                    }} />
                  </div>
                </div>
              )}

              {!generating && !allGenerated && (
                <div>
                  <button onClick={handleGenerate} disabled={selectedDocsList.length === 0}
                    className="w-full text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    style={{ background: '#2563EB', boxShadow: '0 4px 16px rgba(37,99,235,0.25)' }}>
                    <Zap size={17} />
                    Générer {selectedDocsList.length > 0 ? `${selectedDocsList.length} document${selectedDocsList.length > 1 ? 's' : ''}` : 'les documents sélectionnés'}
                  </button>
                  <button onClick={() => setStep(3)} className="mt-3 w-full text-sm py-2 transition-colors" style={{ color: '#8fa5b5' }}>← Retour</button>
                </div>
              )}

              {allGenerated && (
                <div className="fade-in space-y-3" data-sale-done="true">
                  <div className="p-3 rounded-xl flex items-center gap-2" style={{ background: '#e6f4ea', border: '1px solid #a5d6a7' }}>
                    <CheckCircle size={15} style={{ color: '#2e7d32' }} />
                    <p className="text-sm font-semibold" style={{ color: '#2e7d32' }}>
                      {selectedDocsList.length} document{selectedDocsList.length > 1 ? 's' : ''} généré{selectedDocsList.length > 1 ? 's' : ''} avec succès
                    </p>
                  </div>
                  <div className="space-y-2 mb-2">
                    {selectedDocsList.map(docName => (
                      <div key={docName} className="flex items-center justify-between px-3 py-2 rounded-xl"
                        style={{ background: '#f4f8fa', border: '1px solid #dce4e8' }}>
                        <div className="flex items-center gap-2">
                          <CheckCircle size={13} style={{ color: '#2e7d32' }} />
                          <span className="text-xs font-medium" style={{ color: '#2d3f55' }}>{docName}</span>
                        </div>
                        <button onClick={() => setPreviewDoc(docName)}
                          className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg transition-all"
                          style={{ color: '#2563EB', background: '#e8f4fb', border: '1px solid #b3d4e8' }}>
                          <Eye size={11} /> Aperçu
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => showToast(`Dossier envoyé à ${selectedClient?.email} ✅`)}
                      className="flex-1 text-white text-sm font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                      style={{ background: '#2563EB' }}>
                      <Send size={14} /> Envoyer au client
                    </button>
                    <button onClick={() => showToast('Téléchargement en cours 📥')}
                      className="flex-1 text-sm font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors hover:bg-slate-50"
                      style={{ border: '1.5px solid #c8d6de', color: '#2d3f55', background: '#fff' }}>
                      <Download size={14} /> Télécharger
                    </button>
                  </div>
                  <button onClick={handleReset} className="w-full text-sm py-2 transition-colors" style={{ color: '#8fa5b5' }}>
                    + Créer une nouvelle vente
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Live preview — step 3 only */}
        {step === 3 && (
          <LiveDocPreview
            client={selectedClient}
            vehicle={selectedVehicle}
            prix={prix}
            date={date}
            paiement={paiement}
            garantie={garantie}
            saleType={saleType}
            user={user}
          />
        )}
      </div>

      {previewDoc && (
        <DocumentPreview
          doc={previewDoc}
          sale={{
            client: selectedClient?.nom,
            vehicule: selectedVehicle ? selectedVehicle.marque + ' ' + selectedVehicle.modele : vehicleSearch,
            prix,
            paiement,
            date,
            type: saleType,
            plaque: selectedVehicle?.plaque,
          }}
          user={user}
          onClose={() => setPreviewDoc(null)}
        />
      )}
    </div>
  )
}
