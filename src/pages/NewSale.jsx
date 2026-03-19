import React, { useState } from 'react'
import { Check, ChevronRight, User, Car, FileText, Zap, Search, CheckCircle, Euro, Calendar, CreditCard, Shield, RotateCcw, UserPlus, X, Download, Send, Eye } from 'lucide-react'
import { mockVehicles } from '../data/mockData'
import { useClients } from '../context/ClientsContext'
import { useUser } from '../context/UserContext'
import { useToast } from '../components/Toast'
import { useNavigate } from 'react-router-dom'
import DocumentPreview from '../components/DocumentPreview'

const DOCS = {
  france: ['Facture de vente', 'Bon de commande', 'Bon de livraison', 'CERFA 15776', 'Certificat de cession', 'Certificat de situation administrative', 'Garantie commerciale', "Déclaration d'achat"],
  export: ['Facture export', 'COC (Certificat de conformité)', 'Radiation ANTS', 'Justificatifs fiscaux', 'Déclaration en douane', 'Packing list', 'Attestation de sortie territoire UE'],
  import: ["Facture d'achat", 'COC (Certificat de conformité)', 'Quitus fiscal', 'Formulaire 846A', 'Certificat déclaration en douane', 'Homologation UTAC/DREAL', 'Demande immatriculation ANTS'],
}

const steps = [
  { id: 1, label: 'Client', icon: User },
  { id: 2, label: 'Véhicule', icon: Car },
  { id: 3, label: 'Détails', icon: FileText },
  { id: 4, label: 'Documents', icon: Zap },
]

export default function NewSale() {
  const { showToast } = useToast()
  const { clients, addClient } = useClients()
  const user = useUser()
  const vehicles = user?.isDemo ? mockVehicles : []
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [selectedClient, setSelectedClient] = useState(null)
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [clientSearch, setClientSearch] = useState('')
  const [vehicleSearch, setVehicleSearch] = useState('')
  const [showClientDrop, setShowClientDrop] = useState(false)
  const [showVehicleDrop, setShowVehicleDrop] = useState(false)
  const [showNewClientForm, setShowNewClientForm] = useState(false)
  const [newClientForm, setNewClientForm] = useState({ nom: '', email: '', telephone: '', adresse: '' })
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
    const created = addClient(newClientForm)
    setSelectedClient(created); setClientSearch(created.nom)
    setShowNewClientForm(false); setNewClientForm({ nom: '', email: '', telephone: '', adresse: '' })
    showToast(`${created.nom} ajouté et sélectionné ✅`)
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
    showToast('Nouvelle vente initialisée ✅')
  }

  const dropStyle = { background: '#fff', border: '1.5px solid #c8d6de', borderRadius: 12, boxShadow: '0 8px 24px rgba(19,29,46,0.12)' }

  return (
    <div className="p-8 fade-in max-w-7xl mx-auto">
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
      <div className="flex items-center mb-8">
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
                <span className="text-sm font-semibold" style={{ color: active ? '#131d2e' : done ? '#2d3f55' : '#8fa5b5' }}>
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

      {/* Card */}
      <div className="sea-card p-8 max-w-2xl mx-auto">

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
                <div className="grid grid-cols-2 gap-3">
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
            <h2 className="text-lg font-bold mb-6" style={{ color: '#131d2e' }}>Sélectionner un véhicule</h2>
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

            {selectedVehicle && (
              <div className="mt-4 p-4 rounded-xl fade-in flex items-center gap-3"
                style={{ background: '#e8f4fb', border: '1.5px solid #b3d4e8' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: '#eef3f7', border: '1px solid #c8d6de' }}>
                  <Car size={17} style={{ color: '#2563EB' }} />
                </div>
                <div>
                  <p className="font-bold" style={{ color: '#131d2e' }}>{selectedVehicle.marque} {selectedVehicle.modele}</p>
                  <p className="text-sm" style={{ color: '#4f6272' }}>{selectedVehicle.plaque} · {selectedVehicle.annee} · {selectedVehicle.km.toLocaleString()} km</p>
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

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { id: 'france', label: 'Vente France', desc: 'Transaction nationale' },
                { id: 'export', label: 'Export', desc: 'UE / Hors UE' },
                { id: 'import', label: 'Import', desc: 'UE / Hors UE' },
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5" style={{ color: '#4f6272' }}>
                  <Euro size={11} /> Prix de vente (€)*
                </label>
                <input type="number" value={prix} onChange={e => setPrix(e.target.value)}
                  placeholder="Ex: 12500" className="sea-input" />
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
                  <Shield size={11} /> Garantie commerciale
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

            {/* Récap */}
            <div className="grid grid-cols-3 gap-3 mb-6 p-4 rounded-xl"
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

            {/* Sélection rapide */}
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

            {/* Liste */}
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

            {/* Progress */}
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

            {/* Bouton générer */}
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

            {/* Résultat */}
            {allGenerated && (
              <div className="fade-in space-y-3">
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
                      <button
                        onClick={() => setPreviewDoc(docName)}
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
