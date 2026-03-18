import React, { useState } from 'react'
import { Check, ChevronRight, User, Car, FileText, Zap, Search, CheckCircle, Euro, Calendar, CreditCard, Shield, RotateCcw, UserPlus, X } from 'lucide-react'
import { mockVehicles } from '../data/mockData'
import { useClients } from '../context/ClientsContext'
import { useToast } from '../components/Toast'

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
  const [generating, setGenerating] = useState(false)
  const [docProgress, setDocProgress] = useState([])
  const [allGenerated, setAllGenerated] = useState(false)

  const filteredClients = clients.filter(c =>
    c.nom.toLowerCase().includes(clientSearch.toLowerCase()) ||
    c.email.toLowerCase().includes(clientSearch.toLowerCase())
  )
  const filteredVehicles = mockVehicles.filter(v =>
    v.statut === 'En stock' && (
      v.plaque.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
      v.marque.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
      v.modele.toLowerCase().includes(vehicleSearch.toLowerCase())
    )
  )

  const handleAddNewClient = () => {
    if (!newClientForm.nom || !newClientForm.email) return
    const created = addClient(newClientForm)
    setSelectedClient(created)
    setClientSearch(created.nom)
    setShowNewClientForm(false)
    setNewClientForm({ nom: '', email: '', telephone: '', adresse: '' })
    showToast(`${created.nom} ajouté et sélectionné ✅`)
  }

  const handleGenerate = () => {
    const docs = DOCS[saleType]
    setGenerating(true)
    setAllGenerated(false)
    setDocProgress(docs.map(() => 'pending'))
    let completed = 0
    docs.forEach((_, i) => {
      setTimeout(() => {
        setDocProgress(prev => {
          const next = [...prev]
          next[i] = 'done'
          return next
        })
        completed++
        if (completed === docs.length) {
          setGenerating(false)
          setAllGenerated(true)
        }
      }, 1200 + i * 350)
    })
  }

  const handleReset = () => {
    setStep(1); setSelectedClient(null); setSelectedVehicle(null)
    setClientSearch(''); setVehicleSearch(''); setPrix('')
    setSaleType('france'); setGenerating(false); setDocProgress([])
    setAllGenerated(false); setShowNewClientForm(false)
    showToast('Nouvelle vente initialisée ✅')
  }

  return (
    <div className="p-8 fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Nouvelle Vente</h1>
          <p className="text-slate-500 text-sm mt-1">Générez tous vos documents en moins de 5 minutes</p>
        </div>
        <button onClick={handleReset} className="flex items-center gap-2 text-sm text-slate-500 border border-slate-200 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors">
          <RotateCcw size={14} /> Recommencer
        </button>
      </div>

      {/* Stepper */}
      <div className="flex items-center mb-10">
        {steps.map((s, i) => {
          const Icon = s.icon
          const done = step > s.id
          const active = step === s.id
          return (
            <React.Fragment key={s.id}>
              <div className="flex items-center gap-2">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold transition-all ${done ? 'bg-blue-600 text-white' : active ? 'bg-blue-600 text-white ring-4 ring-blue-100' : 'bg-slate-100 text-slate-400'}`}>
                  {done ? <Check size={16} /> : <Icon size={16} />}
                </div>
                <span className={`text-sm font-medium ${active ? 'text-blue-600' : done ? 'text-slate-700' : 'text-slate-400'}`}>{s.label}</span>
              </div>
              {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-3 transition-all ${step > s.id ? 'bg-blue-600' : 'bg-slate-200'}`} />}
            </React.Fragment>
          )
        })}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 max-w-2xl mx-auto">

        {/* STEP 1 */}
        {step === 1 && (
          <div className="fade-in">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Sélectionner un client</h2>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Rechercher dans la base clients..."
                value={clientSearch}
                onChange={e => { setClientSearch(e.target.value); setShowClientDrop(true); setSelectedClient(null) }}
                onFocus={() => setShowClientDrop(true)}
                className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {showClientDrop && clientSearch && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
                  {filteredClients.length > 0
                    ? filteredClients.map(c => (
                      <button key={c.id} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 text-left transition-colors"
                        onClick={() => { setSelectedClient(c); setClientSearch(c.nom); setShowClientDrop(false) }}>
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-xs">{c.nom[0]}</div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{c.nom}</p>
                          <p className="text-xs text-slate-500">{c.email}</p>
                        </div>
                        {c.cni && <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">CNI ✓</span>}
                      </button>
                    ))
                    : (
                      <div className="px-4 py-3 text-sm text-slate-500 text-center">
                        Aucun client trouvé pour "<strong>{clientSearch}</strong>"
                      </div>
                    )
                  }
                </div>
              )}
            </div>

            {/* Bouton créer nouveau client */}
            <button onClick={() => setShowNewClientForm(!showNewClientForm)}
              className="mt-3 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
              <UserPlus size={15} />
              {showNewClientForm ? 'Annuler la création' : '+ Créer un nouveau client'}
            </button>

            {/* Formulaire inline nouveau client */}
            {showNewClientForm && (
              <div className="mt-4 p-5 bg-blue-50 border border-blue-200 rounded-xl fade-in space-y-3">
                <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Nouveau client — sera ajouté à la base</p>
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="Nom complet*" value={newClientForm.nom}
                    onChange={e => setNewClientForm(p => ({ ...p, nom: e.target.value }))}
                    className="px-3 py-2.5 border border-blue-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white" />
                  <input type="email" placeholder="Email*" value={newClientForm.email}
                    onChange={e => setNewClientForm(p => ({ ...p, email: e.target.value }))}
                    className="px-3 py-2.5 border border-blue-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white" />
                  <input type="tel" placeholder="Téléphone" value={newClientForm.telephone}
                    onChange={e => setNewClientForm(p => ({ ...p, telephone: e.target.value }))}
                    className="px-3 py-2.5 border border-blue-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white" />
                  <input type="text" placeholder="Adresse" value={newClientForm.adresse}
                    onChange={e => setNewClientForm(p => ({ ...p, adresse: e.target.value }))}
                    className="px-3 py-2.5 border border-blue-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white" />
                </div>
                <button onClick={handleAddNewClient} disabled={!newClientForm.nom || !newClientForm.email}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors">
                  <Check size={15} /> Créer et sélectionner ce client
                </button>
              </div>
            )}

            {selectedClient && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl fade-in flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold">{selectedClient.nom[0]}</div>
                <div>
                  <p className="font-semibold text-slate-900">{selectedClient.nom}</p>
                  <p className="text-sm text-slate-600">{selectedClient.email} · {selectedClient.telephone}</p>
                </div>
                <button onClick={() => { setSelectedClient(null); setClientSearch('') }} className="ml-auto p-1 text-slate-400 hover:text-slate-600">
                  <X size={14} />
                </button>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button onClick={() => setStep(2)} disabled={!selectedClient}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-sm font-medium px-6 py-2.5 rounded-xl flex items-center gap-2 transition-colors">
                Suivant <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="fade-in">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Sélectionner un véhicule</h2>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Rechercher par plaque, marque ou modèle..."
                value={vehicleSearch}
                onChange={e => { setVehicleSearch(e.target.value); setShowVehicleDrop(true); setSelectedVehicle(null) }}
                onFocus={() => setShowVehicleDrop(true)}
                className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {showVehicleDrop && vehicleSearch && filteredVehicles.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
                  {filteredVehicles.map(v => (
                    <button key={v.id} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 text-left transition-colors"
                      onClick={() => { setSelectedVehicle(v); setVehicleSearch(`${v.marque} ${v.modele}`); setShowVehicleDrop(false) }}>
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center"><Car size={14} className="text-slate-600" /></div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{v.marque} {v.modele} · {v.plaque}</p>
                        <p className="text-xs text-slate-500">{v.annee} · {v.km.toLocaleString()} km · {v.carburant}</p>
                      </div>
                      <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">En stock</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {selectedVehicle && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl fade-in flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center"><Car size={18} className="text-white" /></div>
                <div>
                  <p className="font-semibold text-slate-900">{selectedVehicle.marque} {selectedVehicle.modele}</p>
                  <p className="text-sm text-slate-600">{selectedVehicle.plaque} · {selectedVehicle.annee} · {selectedVehicle.km.toLocaleString()} km · {selectedVehicle.carburant}</p>
                </div>
              </div>
            )}
            <div className="mt-6 flex justify-between">
              <button onClick={() => setStep(1)} className="text-sm text-slate-500 border border-slate-200 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">← Retour</button>
              <button onClick={() => setStep(3)} disabled={!selectedVehicle}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-sm font-medium px-6 py-2.5 rounded-xl flex items-center gap-2 transition-colors">
                Suivant <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="fade-in">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Détails de la vente</h2>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { id: 'france', emoji: '🇫🇷', label: 'Vente France', desc: 'Transaction nationale' },
                { id: 'export', emoji: '🌍', label: 'Export', desc: 'UE / Hors UE' },
                { id: 'import', emoji: '📥', label: 'Import', desc: 'UE / Hors UE' },
              ].map(t => (
                <button key={t.id} onClick={() => setSaleType(t.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${saleType === t.id ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}>
                  <div className="text-2xl mb-2">{t.emoji}</div>
                  <p className={`text-sm font-semibold ${saleType === t.id ? 'text-blue-700' : 'text-slate-900'}`}>{t.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{t.desc}</p>
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5"><Euro size={13} /> Prix de vente (€)*</label>
                <input type="number" value={prix} onChange={e => setPrix(e.target.value)} placeholder="Ex: 12500"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5"><Calendar size={13} /> Date de vente*</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5"><CreditCard size={13} /> Mode de paiement</label>
                <select value={paiement} onChange={e => setPaiement(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  {['Virement', 'Chèque', 'Espèces', 'Financement'].map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5"><Shield size={13} /> Garantie commerciale</label>
                <button onClick={() => setGarantie(!garantie)}
                  className={`w-full flex items-center justify-between px-4 py-3 border-2 rounded-xl text-sm transition-all ${garantie ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600'}`}>
                  <span>{garantie ? '✓ Incluse' : 'Non incluse'}</span>
                  <div className={`w-10 h-5 rounded-full relative transition-all ${garantie ? 'bg-blue-600' : 'bg-slate-300'}`}>
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${garantie ? 'left-5' : 'left-0.5'}`} />
                  </div>
                </button>
              </div>
            </div>
            <div className="mt-6 flex justify-between">
              <button onClick={() => setStep(2)} className="text-sm text-slate-500 border border-slate-200 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">← Retour</button>
              <button onClick={() => setStep(4)} disabled={!prix}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-sm font-medium px-6 py-2.5 rounded-xl flex items-center gap-2 transition-colors">
                Suivant <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div className="fade-in">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Génération des documents</h2>
            <div className="grid grid-cols-3 gap-3 mb-6 p-4 bg-slate-50 rounded-xl text-sm">
              <div><p className="text-xs text-slate-500 mb-0.5">Client</p><p className="font-semibold text-slate-900">{selectedClient?.nom}</p></div>
              <div><p className="text-xs text-slate-500 mb-0.5">Véhicule</p><p className="font-semibold text-slate-900">{selectedVehicle?.marque} {selectedVehicle?.modele}</p></div>
              <div><p className="text-xs text-slate-500 mb-0.5">Prix / Type</p>
                <p className="font-semibold text-slate-900">{parseInt(prix).toLocaleString()} € · {saleType === 'france' ? '🇫🇷' : saleType === 'export' ? '🌍' : '📥'}</p>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              {DOCS[saleType].map((doc, i) => (
                <div key={doc} className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-300 ${docProgress[i] === 'done' ? 'border-green-200 bg-green-50' : 'border-slate-200 bg-white'}`}>
                  {docProgress[i] === 'done'
                    ? <CheckCircle size={18} className="text-green-500 check-pop shrink-0" />
                    : generating
                      ? <div className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin shrink-0" />
                      : <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0" />
                  }
                  <span className={`text-sm ${docProgress[i] === 'done' ? 'text-green-700 font-medium' : 'text-slate-700'}`}>{doc}</span>
                </div>
              ))}
            </div>

            {generating && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-5 h-5 border-2 border-blue-400 border-t-blue-700 rounded-full animate-spin" />
                  <p className="text-sm font-medium text-blue-800">Génération en cours… IA en action ✨</p>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-1.5">
                  <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${(docProgress.filter(d => d === 'done').length / DOCS[saleType].length) * 100}%` }} />
                </div>
              </div>
            )}

            {!generating && !allGenerated && (
              <>
                <button onClick={handleGenerate}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors">
                  <Zap size={18} /> 🚀 Générer tous les documents
                </button>
                <button onClick={() => setStep(3)} className="mt-3 w-full text-sm text-slate-400 hover:text-slate-600 py-2 transition-colors">← Retour</button>
              </>
            )}

            {allGenerated && (
              <div className="fade-in space-y-3">
                <div className="p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  <p className="text-sm font-medium text-green-800">Tous les documents générés avec succès ! ✅</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => showToast(`Dossier envoyé à ${selectedClient?.email} ✅`)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
                    📨 Envoyer au client
                  </button>
                  <button onClick={() => showToast('Téléchargement simulé 📥')}
                    className="flex-1 border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
                    📥 Télécharger tout
                  </button>
                </div>
                <button onClick={handleReset} className="w-full text-sm text-slate-400 hover:text-slate-600 py-2 transition-colors">
                  + Créer une nouvelle vente
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
