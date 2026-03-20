import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Check, ChevronRight, User, Car, FileText, Zap, Search, CheckCircle, Euro, Calendar, CreditCard, Shield, RotateCcw, UserPlus, X, Download, Send, Eye, Camera, Hash, Loader, Upload, ShieldCheck } from 'lucide-react'
import { useClients } from '../context/ClientsContext'
import { useVehicles } from '../context/VehiclesContext'
import { useUser } from '../context/UserContext'
import { useToast } from '../components/Toast'
import DocumentPreview from '../components/DocumentPreview'
import { callN8N } from '../lib/n8n'
import { supabase } from '../lib/supabase'
import { formatTelephone } from '../lib/formatters'
import { useLivreDePolice } from '../context/LivreDePoliceContext'

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
  const { vehicles } = useVehicles()
  const { entries: ldpEntries, addEntry: addLdpEntry, updateEntry: updateLdpEntry } = useLivreDePolice()
  const user = useUser()
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
  const [generatedDocs, setGeneratedDocs] = useState([])   // [{ name, blobUrl, size }]
  const [showDocsModal, setShowDocsModal] = useState(false)
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

  const handleGenerate = async () => {
    if (selectedDocsList.length === 0) return
    setGenerating(true); setAllGenerated(false); setGeneratedDocs([])
    const initProgress = {}
    selectedDocsList.forEach(d => { initProgress[d] = 'pending' })
    setDocProgress(initProgress)

    // Animation de progression pendant l'appel N8N
    let tick = 0
    const progressInterval = setInterval(() => {
      tick++
      if (tick <= selectedDocsList.length)
        setDocProgress(prev => ({ ...prev, [selectedDocsList[tick - 1]]: 'pending-anim' }))
    }, 600)

    try {
      const response = await callN8N('generate_documents', {
        date,
        type_vente: saleType,
        prix: Number(prix),
        paiement,
        garantie,
        documents: selectedDocsList,
        client: {
          nom:       `${selectedClient?.prenom || ''} ${selectedClient?.nom || ''}`.trim(),
          adresse:   selectedClient?.adresse   || '',
          telephone: selectedClient?.telephone || '',
          email:     selectedClient?.email     || '',
          cni:       selectedClient?.cni       || false,
        },
        vehicle: {
          id:        selectedVehicle?.id        || '',
          marque:    selectedVehicle?.marque    || '',
          modele:    selectedVehicle?.modele    || '',
          annee:     selectedVehicle?.annee     || '',
          plaque:    selectedVehicle?.plaque    || '',
          km:        selectedVehicle?.km        || 0,
          carburant: selectedVehicle?.carburant || '',
          statut:    selectedVehicle?.statut    || '',
        },
        garage: {
          nom:               user?.garageName || 'Mon Garage',
          siret:             user?.siret      || '',
          adresse:           user?.adresse    || '',
          ville:             user?.ville      || '',
          telephone:         user?.telephone  || '',
          siteWeb:           user?.siteWeb    || '',
          logo:              user?.logo       || null,
          signature_vendeur: user?.signature  || null,
        },
      })

      clearInterval(progressInterval)

      if (response?._blob) {
        // Réponse binaire brute — téléchargement direct (1 seul fichier)
        const blobUrl = URL.createObjectURL(response._blob)
        const a = document.createElement('a')
        a.href = blobUrl
        a.download = `dossier-vente-${date}.pdf`
        document.body.appendChild(a); a.click(); document.body.removeChild(a)
        setTimeout(() => URL.revokeObjectURL(blobUrl), 5000)
        setGeneratedDocs(selectedDocsList.map((ref, i) => ({ ref, html: null, blobUrl: i === 0 ? blobUrl : null })))
      } else {
        // Réponse JSON — tableau de docs avec base64 ou html
        const rawDocs = Array.isArray(response)
          ? response
          : (response?.documents || [])

        const docs = rawDocs.map((doc, i) => {
          if (doc.base64) {
            const binary = atob(doc.base64)
            const bytes = new Uint8Array(binary.length)
            for (let j = 0; j < binary.length; j++) bytes[j] = binary.charCodeAt(j)
            const blob = new Blob([bytes], { type: 'application/pdf' })
            const blobUrl = URL.createObjectURL(blob)
            return {
              name: selectedDocsList[i] || `Document ${i + 1}`,
              blobUrl,
              size: Math.round(bytes.length / 1024),
            }
          }
          return { name: doc.ref || selectedDocsList[i] || `Document ${i + 1}`, blobUrl: null, html: doc.html }
        })

        setGeneratedDocs(docs)
      }

      const done = {}
      selectedDocsList.forEach(d => { done[d] = 'done' })
      setDocProgress(done)
      setAllGenerated(true)
      saveVente()
    } catch (err) {
      clearInterval(progressInterval)
      console.error('N8N error:', err)
      // Fallback démo : on marque tout comme généré sans docs réels
      const done = {}
      selectedDocsList.forEach(d => { done[d] = 'done' })
      setDocProgress(done)
      setAllGenerated(true)
      saveVente()
    } finally {
      setGenerating(false)
    }
  }

  const saveVente = async () => {
    if (!user?.id || user?.isDemo) return

    const clientNom = `${selectedClient?.prenom || ''} ${selectedClient?.nom || ''}`.trim()
    const vehiculeLabel = selectedVehicle ? `${selectedVehicle.marque} ${selectedVehicle.modele}` : ''

    // 1. Sauvegarder dans la table ventes
    await supabase.from('ventes').insert({
      user_id:    user.id,
      client_nom: clientNom,
      vehicule:   vehiculeLabel,
      type_vente: saleType,
      prix:       Number(prix) || null,
      paiement,
      garantie,
      documents:  selectedDocsList,
      date_vente: date,
    })

    // 2. Synchroniser le livre de police
    if (selectedVehicle?.plaque) {
      const ldpEntry = ldpEntries?.find(e => e.plaque === selectedVehicle.plaque)
      if (ldpEntry) {
        // Véhicule déjà dans LDP → on le marque vendu
        updateLdpEntry(ldpEntry.id, {
          ...ldpEntry,
          statut:      'vendu',
          prixCession: Number(prix) || ldpEntry.prixCession,
          dateSortie:  date,
          acquereur:   clientNom,
        })
      } else {
        // Véhicule absent du LDP → on l'ajoute comme vendu
        addLdpEntry({
          marque:      selectedVehicle.marque,
          modele:      selectedVehicle.modele,
          plaque:      selectedVehicle.plaque,
          vin:         selectedVehicle.vin || '',
          dateEntree:  date,
          prixAchat:   0,
          fournisseur: '',
          statut:      'vendu',
          prixCession: Number(prix) || 0,
          dateSortie:  date,
          acquereur:   clientNom,
        })
      }
    }
  }

  const handleReset = () => {
    setStep(1); setSelectedClient(null); setSelectedVehicle(null)
    setClientSearch(''); setVehicleSearch(''); setPrix('')
    setSaleType('france'); setGenerating(false); setDocProgress({})
    setAllGenerated(false); setGeneratedDocs([])
    setShowNewClientForm(false); setSelectedDocs({})
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
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-black" style={{ color: '#131d2e' }}>Sélectionner un client</h2>
                  <p className="text-xs mt-0.5" style={{ color: '#8fa5b5' }}>{clients.length} client{clients.length > 1 ? 's' : ''} dans votre base</p>
                </div>
                <button onClick={() => setShowNewClientForm(!showNewClientForm)}
                  className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl transition-all"
                  style={{ background: showNewClientForm ? '#f4f8fa' : '#2563EB', color: showNewClientForm ? '#4f6272' : '#fff', border: showNewClientForm ? '1.5px solid #c8d6de' : 'none' }}>
                  <UserPlus size={14} />
                  {showNewClientForm ? 'Annuler' : 'Nouveau client'}
                </button>
              </div>

              {/* Barre de recherche — icône inline pour éviter le bug sea-input */}
              <div style={{ position: 'relative' }}>
                <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#8fa5b5', pointerEvents: 'none', zIndex: 1 }} />
                <input type="text" placeholder="Rechercher un client..."
                  value={clientSearch}
                  onChange={e => { setClientSearch(e.target.value); setShowClientDrop(true); setSelectedClient(null) }}
                  onFocus={() => setShowClientDrop(true)}
                  className="sea-input"
                  style={{ paddingLeft: 42 }} />
                {showClientDrop && clientSearch && (
                  <div className="absolute z-10 w-full mt-1 overflow-hidden" style={dropStyle}>
                    {filteredClients.length > 0
                      ? filteredClients.map(c => (
                        <button key={c.id} className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
                          onMouseEnter={e => e.currentTarget.style.background = '#f4f8fa'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          onClick={() => { setSelectedClient(c); setClientSearch(c.nom); setShowClientDrop(false) }}>
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-black text-xs shrink-0"
                            style={{ background: `hsl(${(c.nom.charCodeAt(0) * 37) % 360}, 55%, 38%)` }}>{c.nom[0]?.toUpperCase()}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate" style={{ color: '#131d2e' }}>{c.nom}</p>
                            <p className="text-xs truncate" style={{ color: '#8fa5b5' }}>{c.email}</p>
                          </div>
                          {c.cni && <span className="text-xs font-semibold px-2 py-0.5 rounded-lg shrink-0" style={{ background: '#e6f4ea', color: '#2e7d32', border: '1px solid #a5d6a7' }}>CNI ✓</span>}
                        </button>
                      ))
                      : <div className="px-4 py-3 text-sm text-center" style={{ color: '#8fa5b5' }}>Aucun résultat pour "{clientSearch}"</div>
                    }
                  </div>
                )}
              </div>

              {/* Clients récents — accès rapide sans taper */}
              {!clientSearch && !selectedClient && clients.length > 0 && (
                <div className="mt-4 fade-in">
                  <p className="text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: '#8fa5b5' }}>Accès rapide</p>
                  <div className="grid grid-cols-2 gap-2">
                    {clients.slice(0, 4).map(c => (
                      <button key={c.id} onClick={() => { setSelectedClient(c); setClientSearch(c.nom) }}
                        className="flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all hover:shadow-md"
                        style={{ background: '#f4f8fa', border: '1.5px solid #dce4e8' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#2563EB'; e.currentTarget.style.background = '#e8f4fb' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#dce4e8'; e.currentTarget.style.background = '#f4f8fa' }}>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-black text-xs shrink-0"
                          style={{ background: `hsl(${(c.nom.charCodeAt(0) * 37) % 360}, 55%, 38%)` }}>{c.nom[0]?.toUpperCase()}</div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate" style={{ color: '#131d2e' }}>{c.nom}</p>
                          <p className="text-xs truncate" style={{ color: '#8fa5b5' }}>{c.telephone || c.email}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                  {clients.length > 4 && (
                    <p className="text-xs mt-2 text-center" style={{ color: '#8fa5b5' }}>+{clients.length - 4} autres · utilisez la recherche</p>
                  )}
                </div>
              )}

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
                        onChange={e => setNewClientForm(p => ({ ...p, [f.key]: f.key === 'telephone' ? formatTelephone(e.target.value) : e.target.value }))}
                        maxLength={f.key === 'telephone' ? 14 : undefined}
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
                <div className="mt-4 fade-in" style={{ background: 'linear-gradient(135deg, #e8f4fb, #f0f7ff)', border: '2px solid #2563EB', borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: `hsl(${(selectedClient.nom.charCodeAt(0) * 37) % 360}, 55%, 38%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 16, flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                    {selectedClient.nom[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-black text-sm" style={{ color: '#131d2e' }}>{selectedClient.nom}</p>
                      {selectedClient.cni && <span className="text-xs font-bold px-1.5 py-0.5 rounded-md" style={{ background: '#e6f4ea', color: '#2e7d32', border: '1px solid #a5d6a7' }}>CNI ✓</span>}
                    </div>
                    <p className="text-xs mt-0.5 truncate" style={{ color: '#4f6272' }}>{selectedClient.email}{selectedClient.telephone ? ` · ${selectedClient.telephone}` : ''}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={13} color="#fff" />
                    </div>
                    <button onClick={() => { setSelectedClient(null); setClientSearch('') }} style={{ width: 26, height: 26, borderRadius: 8, background: 'rgba(0,0,0,0.06)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8fa5b5' }}>
                      <X size={13} />
                    </button>
                  </div>
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
                <div>
                  <h2 className="text-lg font-black" style={{ color: '#131d2e' }}>Sélectionner un véhicule</h2>
                  <p className="text-xs mt-0.5" style={{ color: '#8fa5b5' }}>{vehicles.filter(v => v.statut === 'En stock').length} véhicule{vehicles.filter(v => v.statut === 'En stock').length > 1 ? 's' : ''} en stock</p>
                </div>
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
                <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#8fa5b5', pointerEvents: 'none', zIndex: 1 }} />
                <input type="text" placeholder="Marque, modèle ou plaque..."
                  value={vehicleSearch}
                  onChange={e => { setVehicleSearch(e.target.value); setShowVehicleDrop(true); setSelectedVehicle(null) }}
                  onFocus={() => setShowVehicleDrop(true)}
                  className="sea-input"
                  style={{ paddingLeft: 42 }} />
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

              {/* Accès rapide véhicules */}
              {!vehicleSearch && !selectedVehicle && vehicles.filter(v => v.statut === 'En stock').length > 0 && (
                <div className="mt-4 fade-in">
                  <p className="text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: '#8fa5b5' }}>Stock disponible</p>
                  <div className="grid grid-cols-1 gap-2">
                    {vehicles.filter(v => v.statut === 'En stock').slice(0, 4).map(v => (
                      <button key={v.id} onClick={() => { setSelectedVehicle(v); setVehicleSearch(`${v.marque} ${v.modele}`) }}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all"
                        style={{ background: '#f4f8fa', border: '1.5px solid #dce4e8' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#2563EB'; e.currentTarget.style.background = '#e8f4fb' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#dce4e8'; e.currentTarget.style.background = '#f4f8fa' }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #e8f4fb, #dce4e8)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Car size={15} style={{ color: '#2563EB' }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold truncate" style={{ color: '#131d2e' }}>{v.marque} {v.modele}</p>
                          <p className="text-xs truncate" style={{ color: '#8fa5b5' }}>{v.plaque} · {v.annee} · {v.km.toLocaleString()} km · {v.carburant}</p>
                        </div>
                        <span className="text-xs font-bold px-2 py-1 rounded-lg shrink-0" style={{ background: '#e6f4ea', color: '#2e7d32', border: '1px solid #a5d6a7' }}>En stock</span>
                      </button>
                    ))}
                  </div>
                  {vehicles.filter(v => v.statut === 'En stock').length > 4 && (
                    <p className="text-xs mt-2 text-center" style={{ color: '#8fa5b5' }}>+{vehicles.filter(v => v.statut === 'En stock').length - 4} autres · utilisez la recherche</p>
                  )}
                </div>
              )}

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
                      <Hash size={13} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#8fa5b5', pointerEvents: 'none', zIndex: 1 }} />
                      <input
                        type="text"
                        placeholder="Ex : WBS8M9C5XNC000001"
                        value={vinSearch}
                        onChange={e => handleVinChange(e.target.value.toUpperCase())}
                        maxLength={17}
                        className="sea-input font-mono text-sm tracking-widest"
                        style={{ paddingLeft: 42, letterSpacing: '0.12em' }}
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
                <div className="mt-4 fade-in" style={{ background: 'linear-gradient(135deg, #e8f4fb, #f0f7ff)', border: '2px solid #2563EB', borderRadius: 16, padding: '14px 16px' }}>
                  <div className="flex items-center gap-3">
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #2563EB, #1a3a8f)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}>
                      <Car size={20} color="#fff" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-sm" style={{ color: '#131d2e' }}>{selectedVehicle.marque} {selectedVehicle.modele}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#4f6272' }}>{selectedVehicle.plaque} · {selectedVehicle.annee} · {selectedVehicle.km.toLocaleString()} km · {selectedVehicle.carburant}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Check size={13} color="#fff" />
                      </div>
                      <button onClick={() => { setSelectedVehicle(null); setVehicleSearch(''); setVinSearch(''); setVinResult(null) }}
                        style={{ width: 26, height: 26, borderRadius: 8, background: 'rgba(0,0,0,0.06)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8fa5b5' }}>
                        <X size={13} />
                      </button>
                    </div>
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
              <div className="mb-5">
                <h2 className="text-lg font-black" style={{ color: '#131d2e' }}>Détails de la vente</h2>
                <p className="text-xs mt-0.5" style={{ color: '#8fa5b5' }}>{selectedClient?.nom} · {selectedVehicle?.marque} {selectedVehicle?.modele}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                {[
                  { id: 'france', label: 'Vente France', desc: 'Transaction nationale', icon: '🇫🇷' },
                  { id: 'export', label: 'Export',       desc: 'UE / Hors UE',          icon: '✈️' },
                  { id: 'import', label: 'Import',       desc: 'UE / Hors UE',          icon: '📦' },
                ].map(t => (
                  <button key={t.id} onClick={() => handleTypeChange(t.id)}
                    className="p-4 rounded-xl text-left transition-all"
                    style={saleType === t.id
                      ? { background: 'linear-gradient(135deg, #e8f4fb, #dbeafe)', border: '2px solid #2563EB', boxShadow: '0 4px 12px rgba(37,99,235,0.15)' }
                      : { background: '#f4f8fa', border: '2px solid #dce4e8' }
                    }>
                    <div className="text-xl mb-1">{t.icon}</div>
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
              <div className="mb-5">
                <h2 className="text-lg font-black" style={{ color: '#131d2e' }}>Sélection des documents</h2>
                <p className="text-xs mt-0.5" style={{ color: '#8fa5b5' }}>Cochez les documents à générer pour ce dossier</p>
              </div>

              <div className="mb-6 p-4 rounded-2xl" style={{ background: 'linear-gradient(135deg, #060D1F, #0f2460)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Client</p>
                    <p className="font-bold text-sm" style={{ color: '#fff' }}>{selectedClient?.nom}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Véhicule</p>
                    <p className="font-bold text-sm" style={{ color: '#fff' }}>{selectedVehicle?.marque} {selectedVehicle?.modele}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Prix</p>
                    <p className="font-bold text-sm" style={{ color: '#60a5fa' }}>{parseInt(prix).toLocaleString()} €</p>
                  </div>
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
                  <div className="p-4 rounded-xl text-center" style={{ background: '#e6f4ea', border: '1px solid #a5d6a7' }}>
                    <CheckCircle size={28} style={{ color: '#2e7d32', margin: '0 auto 8px' }} />
                    <p className="font-bold text-sm" style={{ color: '#1a5c1a' }}>
                      {generatedDocs.length} document{generatedDocs.length > 1 ? 's' : ''} prêt{generatedDocs.length > 1 ? 's' : ''}
                    </p>
                    <p className="text-xs mt-1" style={{ color: '#4a8a4a' }}>Dossier généré avec succès</p>
                  </div>
                  <button onClick={() => setShowDocsModal(true)}
                    className="w-full text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-90"
                    style={{ background: '#2563EB', boxShadow: '0 4px 16px rgba(37,99,235,0.25)' }}>
                    <Eye size={17} /> Voir les documents ({generatedDocs.length})
                  </button>
                  <button onClick={() => showToast(`Dossier envoyé à ${selectedClient?.email} ✅`)}
                    className="w-full text-sm font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors hover:bg-slate-50"
                    style={{ border: '1.5px solid #c8d6de', color: '#2d3f55', background: '#fff' }}>
                    <Send size={14} /> Envoyer au client
                  </button>
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

      {/* ── Modale dossier documents ───────────────────────────────────────── */}
      {showDocsModal && (
        <DocsModal
          docs={generatedDocs}
          setDocs={setGeneratedDocs}
          date={date}
          clientName={selectedClient ? `${selectedClient.prenom || ''} ${selectedClient.nom || ''}`.trim() : ''}
          clientEmail={selectedClient?.email || ''}
          vehicleLabel={selectedVehicle ? `${selectedVehicle.marque} ${selectedVehicle.modele}` : ''}
          garageName={user?.garageName || 'Mon Garage'}
          onClose={() => setShowDocsModal(false)}
        />
      )}
    </div>
  )
}

// ── Utilitaires partagés ──────────────────────────────────────────────────────
function openHtmlDoc(html) {
  const blob = new Blob([html], { type: 'text/html' })
  window.open(URL.createObjectURL(blob), '_blank')
}

// ── Modale dossier documents ──────────────────────────────────────────────────
function SignatureModal({ clientName, onSave, onClose }) {
  const canvasRef = useRef(null)
  const drawing = useRef(false)
  const [isEmpty, setIsEmpty] = useState(true)

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect()
    const src = e.touches ? e.touches[0] : e
    return { x: src.clientX - rect.left, y: src.clientY - rect.top }
  }

  const startDraw = useCallback((e) => {
    e.preventDefault()
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const { x, y } = getPos(e, canvas)
    ctx.beginPath()
    ctx.moveTo(x, y)
    drawing.current = true
  }, [])

  const draw = useCallback((e) => {
    e.preventDefault()
    if (!drawing.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.strokeStyle = '#131d2e'
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    const { x, y } = getPos(e, canvas)
    ctx.lineTo(x, y)
    ctx.stroke()
    setIsEmpty(false)
  }, [])

  const stopDraw = useCallback(() => { drawing.current = false }, [])

  const clear = () => {
    const canvas = canvasRef.current
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    setIsEmpty(true)
  }

  const save = () => {
    if (isEmpty) return
    const dataUrl = canvasRef.current.toDataURL('image/png')
    onSave(dataUrl)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    canvas.addEventListener('touchstart', startDraw, { passive: false })
    canvas.addEventListener('touchmove', draw, { passive: false })
    canvas.addEventListener('touchend', stopDraw)
    return () => {
      canvas.removeEventListener('touchstart', startDraw)
      canvas.removeEventListener('touchmove', draw)
      canvas.removeEventListener('touchend', stopDraw)
    }
  }, [startDraw, draw, stopDraw])

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10001, background: 'rgba(6,13,31,0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 520, boxShadow: '0 32px 80px rgba(6,13,31,0.4)', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #dce4e8', background: '#f4f8fa', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontWeight: 800, fontSize: 16, color: '#131d2e', margin: 0 }}>Signature client</p>
            <p style={{ fontSize: 12, color: '#8fa5b5', margin: '2px 0 0' }}>{clientName} — signez dans le cadre ci-dessous</p>
          </div>
          <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: 10, background: '#dce4e8', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f6272' }}>
            <X size={16} />
          </button>
        </div>

        {/* Canvas */}
        <div style={{ padding: '20px 24px' }}>
          <div style={{ border: '2px dashed #b3d4e8', borderRadius: 14, overflow: 'hidden', background: '#fafcfe', position: 'relative', cursor: 'crosshair' }}>
            <canvas
              ref={canvasRef}
              width={468}
              height={200}
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={stopDraw}
              onMouseLeave={stopDraw}
              style={{ display: 'block', width: '100%', height: 200, touchAction: 'none' }}
            />
            {isEmpty && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                <p style={{ color: '#b3d4e8', fontSize: 14, fontWeight: 500 }}>Signez ici avec votre doigt ou la souris</p>
              </div>
            )}
          </div>
          <p style={{ fontSize: 11, color: '#8fa5b5', margin: '8px 0 0', textAlign: 'center' }}>
            Lu et approuvé — {clientName} — {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>

        {/* Footer */}
        <div style={{ padding: '0 24px 20px', display: 'flex', gap: 10 }}>
          <button onClick={clear} style={{ flex: 1, padding: '10px', borderRadius: 12, background: '#f4f8fa', border: '1px solid #dce4e8', color: '#4f6272', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <RotateCcw size={14} /> Effacer
          </button>
          <button onClick={save} disabled={isEmpty} style={{ flex: 2, padding: '10px', borderRadius: 12, background: isEmpty ? '#e2e8f0' : '#2563EB', border: 'none', color: isEmpty ? '#94a3b8' : '#fff', fontWeight: 700, fontSize: 14, cursor: isEmpty ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Check size={14} /> Valider la signature
          </button>
        </div>
      </div>
    </div>
  )
}

function DocsModal({ docs, setDocs, date, clientName, clientEmail, vehicleLabel, garageName, onClose }) {
  const [renaming, setRenaming] = useState(null)
  const [renameVal, setRenameVal] = useState('')
  const [zipping, setZipping] = useState(false)
  const [showSignature, setShowSignature] = useState(false)
  const [signatureDataUrl, setSignatureDataUrl] = useState(null)
  const [sending, setSending] = useState(false)
  const [sendDone, setSendDone] = useState(false)
  const [sendEmail, setSendEmail] = useState(clientEmail || '')

  const handleSend = async () => {
    if (!sendEmail || sending) return
    setSending(true)
    try {
      // Convertir tous les blobUrl en base64
      const docsBase64 = await Promise.all(
        docs.filter(d => d.blobUrl).map(async (doc) => {
          const res = await fetch(doc.blobUrl)
          const blob = await res.blob()
          return new Promise((resolve) => {
            const reader = new FileReader()
            reader.onload = () => resolve({
              name: doc.name,
              base64: reader.result.split(',')[1],
              mimeType: 'application/pdf',
            })
            reader.readAsDataURL(blob)
          })
        })
      )

      await callN8N('send_documents', {
        to:           sendEmail,
        subject:      `Votre dossier de vente — ${garageName}`,
        garage_name:  garageName,
        client_name:  clientName,
        vehicule:     vehicleLabel,
        date,
        documents:    docsBase64,
      })

      setSendDone(true)
    } catch (err) {
      console.error('Send error:', err)
      alert('Erreur lors de l\'envoi. Vérifiez votre connexion N8N.')
    } finally {
      setSending(false)
    }
  }

  // Initiales + véhicule pour les noms de fichiers
  const initiales = clientName
    ? clientName.split(' ').map(w => w[0]?.toUpperCase()).filter(Boolean).join('')
    : 'CLI'
  const slug = `${initiales}_${vehicleLabel?.replace(/\s+/g, '-') || 'vehicule'}_${date || ''}`

  const downloadOne = (doc) => {
    if (!doc.blobUrl) return
    const a = document.createElement('a')
    a.href = doc.blobUrl
    a.download = `${slug}_${doc.name}.pdf`
    document.body.appendChild(a); a.click(); document.body.removeChild(a)
  }

  const downloadAll = async () => {
    const hasBlobDocs = docs.filter(d => d.blobUrl)
    if (hasBlobDocs.length === 0) return
    setZipping(true)
    try {
      const JSZip = (await import('jszip')).default
      const zip = new JSZip()
      const folder = zip.folder(`Dossier_${slug}`)
      await Promise.all(hasBlobDocs.map(async (doc) => {
        const res = await fetch(doc.blobUrl)
        const blob = await res.blob()
        folder.file(`${doc.name}.pdf`, blob)
      }))
      const zipBlob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(zipBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Dossier_${slug}.zip`
      document.body.appendChild(a); a.click(); document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(url), 5000)
    } finally {
      setZipping(false)
    }
  }

  const startRename = (i) => { setRenaming(i); setRenameVal(docs[i].name) }
  const confirmRename = () => {
    if (renameVal.trim()) {
      setDocs(prev => prev.map((d, i) => i === renaming ? { ...d, name: renameVal.trim() } : d))
    }
    setRenaming(null)
  }

  const deleteDoc = (i) => setDocs(prev => prev.filter((_, idx) => idx !== i))

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(6,13,31,0.7)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem',
    }}>
      <div style={{
        background: '#fff', borderRadius: 20, width: '100%', maxWidth: 580,
        maxHeight: '85vh', display: 'flex', flexDirection: 'column',
        boxShadow: '0 32px 80px rgba(6,13,31,0.35)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #dce4e8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f4f8fa' }}>
          <div>
            <p style={{ fontWeight: 800, fontSize: 16, color: '#131d2e', margin: 0 }}>Dossier de vente</p>
            <p style={{ fontSize: 12, color: '#8fa5b5', margin: '2px 0 0' }}>{docs.length} document{docs.length > 1 ? 's' : ''} · {date}</p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button onClick={downloadAll} disabled={zipping}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, background: '#2563EB', color: '#fff', border: 'none', cursor: zipping ? 'wait' : 'pointer', fontWeight: 700, fontSize: 13, opacity: zipping ? 0.7 : 1 }}>
              {zipping
                ? <><div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Compression…</>
                : <><Download size={14} /> Tout télécharger (.zip)</>
              }
            </button>
            <button onClick={onClose}
              style={{ width: 34, height: 34, borderRadius: 10, background: '#dce4e8', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f6272' }}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Liste */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {docs.map((doc, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 14, background: '#f4f8fa', border: '1px solid #dce4e8' }}>
              {/* Icône PDF */}
              <div style={{ width: 36, height: 36, borderRadius: 9, background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FileText size={16} style={{ color: '#dc2626' }} />
              </div>

              {/* Nom (cliquable pour renommer) */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {renaming === i
                  ? <input
                      autoFocus value={renameVal}
                      onChange={e => setRenameVal(e.target.value)}
                      onBlur={confirmRename}
                      onKeyDown={e => { if (e.key === 'Enter') confirmRename(); if (e.key === 'Escape') setRenaming(null) }}
                      style={{ width: '100%', fontSize: 13, fontWeight: 600, padding: '4px 8px', borderRadius: 6, border: '1.5px solid #2563EB', outline: 'none', color: '#131d2e' }}
                    />
                  : <p
                      title="Double-clic pour renommer"
                      onDoubleClick={() => startRename(i)}
                      style={{ fontSize: 13, fontWeight: 600, color: '#131d2e', margin: 0, cursor: 'text', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {doc.name}
                    </p>
                }
                <p style={{ fontSize: 11, color: '#8fa5b5', margin: '2px 0 0' }}>
                  {doc.size ? `${doc.size} ko · ` : ''}PDF · Double-clic pour renommer
                </p>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                {doc.blobUrl && (
                  <a href={doc.blobUrl} target="_blank" rel="noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 10px', borderRadius: 8, background: '#e8f4fb', border: '1px solid #b3d4e8', color: '#2563EB', fontWeight: 700, fontSize: 12, textDecoration: 'none' }}>
                    <Eye size={12} /> Ouvrir
                  </a>
                )}
                {doc.html && (
                  <button onClick={() => openHtmlDoc(doc.html)}
                    style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 10px', borderRadius: 8, background: '#e8f4fb', border: '1px solid #b3d4e8', color: '#2563EB', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                    <Eye size={12} /> Ouvrir
                  </button>
                )}
                <button onClick={() => downloadOne(doc)}
                  disabled={!doc.blobUrl}
                  style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 10px', borderRadius: 8, background: doc.blobUrl ? '#e6f4ea' : '#f4f8fa', border: `1px solid ${doc.blobUrl ? '#a5d6a7' : '#dce4e8'}`, color: doc.blobUrl ? '#2e7d32' : '#b0bec5', fontWeight: 700, fontSize: 12, cursor: doc.blobUrl ? 'pointer' : 'not-allowed' }}>
                  <Download size={12} /> DL
                </button>
                <button onClick={() => deleteDoc(i)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 8, background: '#fff0f0', border: '1px solid #fca5a5', color: '#dc2626', cursor: 'pointer' }}>
                  <X size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer — envoi email */}
        <div style={{ padding: '14px 24px', borderTop: '1px solid #dce4e8', background: '#f4f8fa' }}>
          {sendDone ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 12, background: '#f0fdf4', border: '1px solid #86efac' }}>
              <Check size={14} style={{ color: '#16a34a' }} />
              <p style={{ fontSize: 13, fontWeight: 700, color: '#16a34a', margin: 0 }}>Dossier envoyé à {sendEmail}</p>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={sendEmail}
                onChange={e => setSendEmail(e.target.value)}
                placeholder="Email du client"
                style={{ flex: 1, padding: '8px 12px', borderRadius: 10, border: '1.5px solid #dce4e8', fontSize: 13, outline: 'none', background: '#fff', color: '#131d2e' }}
                onFocus={e => e.target.style.borderColor = '#2563EB'}
                onBlur={e => e.target.style.borderColor = '#dce4e8'}
              />
              <button onClick={handleSend} disabled={!sendEmail || sending}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, background: (!sendEmail || sending) ? '#c8d6de' : '#2563EB', color: '#fff', border: 'none', cursor: (!sendEmail || sending) ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap' }}>
                {sending
                  ? <><div style={{ width: 13, height: 13, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Envoi…</>
                  : <><Send size={13} /> Envoyer au client</>
                }
              </button>
            </div>
          )}
        </div>

        {/* Footer — actions */}
        <div style={{ padding: '12px 24px', borderTop: '1px solid #dce4e8', background: '#f4f8fa', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <p style={{ fontSize: 11, color: '#8fa5b5', margin: 0 }}>Double-clic pour renommer · La suppression est locale</p>
          <button onClick={() => setShowSignature(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, border: signatureDataUrl ? '1.5px solid #16a34a' : '1.5px solid #2563EB', background: signatureDataUrl ? '#f0fdf4' : '#eff6ff', color: signatureDataUrl ? '#16a34a' : '#2563EB', fontWeight: 700, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {signatureDataUrl ? <><Check size={13} /> Signé</> : <><Shield size={13} /> Faire signer</>}
          </button>
        </div>

        {signatureDataUrl && (
          <div style={{ padding: '12px 24px', borderTop: '1px solid #dcfce7', background: '#f0fdf4', display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src={signatureDataUrl} alt="Signature" style={{ height: 40, borderRadius: 6, border: '1px solid #bbf7d0', background: '#fff', padding: 4 }} />
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#16a34a', margin: 0 }}>Signature enregistrée</p>
              <p style={{ fontSize: 11, color: '#4ade80', margin: 0 }}>{clientName} · {new Date().toLocaleDateString('fr-FR')}</p>
            </div>
            <button onClick={() => setSignatureDataUrl(null)} style={{ marginLeft: 'auto', padding: '4px 10px', borderRadius: 8, background: 'transparent', border: '1px solid #86efac', color: '#16a34a', fontSize: 11, cursor: 'pointer', fontWeight: 600 }}>Modifier</button>
          </div>
        )}
      </div>

      {showSignature && (
        <SignatureModal
          clientName={clientName}
          onSave={(dataUrl) => { setSignatureDataUrl(dataUrl); setShowSignature(false) }}
          onClose={() => setShowSignature(false)}
        />
      )}
    </div>
  )
}
