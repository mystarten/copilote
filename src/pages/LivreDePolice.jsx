import React, { useState, useRef } from 'react'
import { Download, FileSpreadsheet, Plus, X, Check, Car, Hash, Calendar, Euro, Building2, Pencil, Package, ShoppingCart, BarChart2, Globe, Share2, Camera, Trash2, ImagePlus, Wand2, Loader } from 'lucide-react'
import { useToast } from '../components/Toast'
import { useLivreDePolice } from '../context/LivreDePoliceContext'
import { useUser } from '../context/UserContext'
import PriceEstimator from '../components/PriceEstimator'
import { PAYS_CONFIG, formatPlaqueByPays } from '../lib/pays'
import { getDefaultVehiclePhoto } from '../lib/vehiclePhoto'
import { MAKES, getModels } from '../lib/vehicleData'
import { uploadFile } from '../lib/supabase'
import { lookupByPlaque, lookupByVin } from '../lib/autoways'

const PAYS_LIST = Object.values(PAYS_CONFIG)

const emptyVehicle = {
  marque: '', modele: '', plaque: '', vin: '',
  annee: '', carburant: '', km: '',
  prixAchat: '', fournisseur: '',
  dateEntree: new Date().toISOString().split('T')[0],
  pays: 'FR',
  photos: [],
}

/* ── Sélecteur de pays ─────────────────────────────────────── */
function CountrySelector({ value, onChange }) {
  return (
    <div>
      <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#4f6272', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <Globe size={11} /> Pays d'origine du véhicule
      </label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {PAYS_LIST.map(p => {
          const selected = value === p.code
          return (
            <button key={p.code} type="button" onClick={() => onChange(p.code)} style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '6px 10px', borderRadius: 8, cursor: 'pointer',
              border: selected ? `2px solid ${p.couleur || '#2563EB'}` : '1.5px solid #e2e8f0',
              background: selected ? (p.couleur ? p.couleur + '18' : '#eff6ff') : '#fff',
              fontWeight: selected ? 700 : 500, fontSize: 12,
              color: selected ? (p.couleur || '#2563EB') : '#475569',
              transition: 'all 0.15s',
            }}>
              <span style={{ fontSize: 16 }}>{p.flag}</span>
              <span>{p.code}</span>
            </button>
          )
        })}
      </div>
      {value !== 'FR' && (
        <div style={{ marginTop: 8, padding: '8px 10px', borderRadius: 8, background: '#fefce8', border: '1px solid #fde68a', display: 'flex', alignItems: 'flex-start', gap: 6 }}>
          <span style={{ fontSize: 16 }}>{PAYS_CONFIG[value]?.flag}</span>
          <p style={{ margin: 0, fontSize: 11, color: '#92400e' }}>
            <strong>Import {PAYS_CONFIG[value]?.nom}</strong> — des documents spécifiques seront requis (COC, quitus fiscal, etc.)
          </p>
        </div>
      )}
    </div>
  )
}

/* ── Badge plaque avec drapeau ─────────────────────────────── */
function PlaqueBadge({ plaque, pays = 'FR' }) {
  const config = PAYS_CONFIG[pays] || PAYS_CONFIG.FR
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <span style={{ fontSize: 12 }}>{config.flag}</span>
      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-lg"
        style={{ background: '#e8f4fb', color: '#2563EB', border: '1px solid #b3d4e8' }}>
        {plaque}
      </span>
    </div>
  )
}

/* ── Fetch photo Wikipedia ────────────────────────────────── */
async function fetchCarPhoto(marque, modele) {
  if (!marque || !modele) return null
  try {
    // 1. Try direct Wikipedia article (most reliable for known models)
    const title = `${marque} ${modele}`.replace(/\s+/g, '_')
    const r1 = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=800&origin=*`
    )
    const d1 = await r1.json()
    const pages1 = Object.values(d1.query?.pages || {})
    const img1 = pages1[0]?.thumbnail?.source
    if (img1) return img1

    // 2. Fallback: search engine style
    const r2 = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(marque + ' ' + modele + ' automobile')}&gsrlimit=5&prop=pageimages&format=json&pithumbsize=800&origin=*`
    )
    const d2 = await r2.json()
    const pages2 = Object.values(d2.query?.pages || {})
    const img2 = pages2.find(p => p.thumbnail)?.thumbnail?.source
    return img2 || null
  } catch {
    return null
  }
}

/* ── Sélecteur marque + modèle avec autocomplete ───────────── */
function VehicleSelect({ marque, modele, onMarqueChange, onModeleChange, onPhotoFetched }) {
  const models = getModels(marque)
  const [fetching, setFetching] = useState(false)

  const handleModeleChange = async (val) => {
    onModeleChange(val)
    if (marque && val && onPhotoFetched) {
      setFetching(true)
      const photo = await fetchCarPhoto(marque, val)
      setFetching(false)
      if (photo) onPhotoFetched(photo)
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      <div>
        <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#4f6272', display: 'block', marginBottom: 6 }}>
          Marque *
        </label>
        <input
          list="marque-list"
          value={marque}
          onChange={e => {
            onMarqueChange(e.target.value)
            onModeleChange('')
          }}
          placeholder="BMW, Peugeot…"
          className="sea-input"
          autoComplete="off"
        />
        <datalist id="marque-list">
          {MAKES.map(m => <option key={m} value={m} />)}
        </datalist>
      </div>
      <div>
        <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#4f6272', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          Modèle *
          {fetching && (
            <span style={{ fontSize: 10, color: '#2563EB', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ display: 'inline-block', width: 8, height: 8, border: '1.5px solid #bfdbfe', borderTopColor: '#2563EB', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              photo…
            </span>
          )}
        </label>
        <input
          list="modele-list"
          value={modele}
          onChange={e => handleModeleChange(e.target.value)}
          placeholder={models.length ? 'Choisir…' : 'Série 3, 3008…'}
          className="sea-input"
          autoComplete="off"
        />
        <datalist id="modele-list">
          {models.map(m => <option key={m.model} value={m.model} />)}
        </datalist>
      </div>
    </div>
  )
}

/* ── Upload photos ─────────────────────────────────────────── */
function PhotoUploader({ photos, setPhotos, userId, disabled }) {
  const fileRef = useRef()
  const [uploading, setUploading] = useState(false)

  const handleFiles = async (files) => {
    if (!files?.length) return
    setUploading(true)
    const newUrls = []
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue
      try {
        if (userId) {
          const path = `vehicles/photo_${Date.now()}_${Math.random().toString(36).slice(2)}`
          const url = await uploadFile(userId, path, file)
          newUrls.push(url)
        } else {
          // Demo : URL blob temporaire
          newUrls.push(URL.createObjectURL(file))
        }
      } catch { /* ignore */ }
    }
    setPhotos(prev => [...prev, ...newUrls])
    setUploading(false)
  }

  const removePhoto = (idx) => setPhotos(prev => prev.filter((_, i) => i !== idx))

  return (
    <div>
      <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#4f6272', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <Camera size={11} /> Photos du véhicule
      </label>

      {/* Zone miniatures */}
      {photos.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
          {photos.map((url, i) => (
            <div key={i} style={{ position: 'relative', width: 72, height: 56, borderRadius: 8, overflow: 'hidden', border: '2px solid #e2e8f0' }}>
              <img src={url} alt={`Photo ${i+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button
                type="button"
                onClick={() => removePhoto(i)}
                style={{ position: 'absolute', top: 2, right: 2, width: 18, height: 18, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={10} color="#fff" />
              </button>
              {i === 0 && (
                <div style={{ position: 'absolute', bottom: 2, left: 2, fontSize: 9, fontWeight: 700, background: '#2563EB', color: '#fff', padding: '1px 4px', borderRadius: 4 }}>
                  Principale
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Bouton ajout */}
      <button
        type="button"
        disabled={uploading || disabled}
        onClick={() => fileRef.current?.click()}
        style={{
          width: '100%', padding: '10px', borderRadius: 10,
          border: '2px dashed #c8d6de', background: '#f8fafc',
          cursor: uploading ? 'wait' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          color: '#4f6272', fontSize: 13, fontWeight: 600,
          transition: 'all 0.15s',
        }}
        onMouseEnter={e => { if (!uploading) e.currentTarget.style.borderColor = '#2563EB' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#c8d6de' }}>
        <ImagePlus size={15} />
        {uploading ? 'Upload en cours...' : photos.length === 0 ? 'Ajouter des photos' : 'Ajouter d\'autres photos'}
      </button>
      <input
        ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }}
        onChange={e => handleFiles(e.target.files)}
      />
      <p style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>
        JPG, PNG, WEBP — La 1ère photo sera la photo principale
      </p>
    </div>
  )
}

/* ── Composant principal ───────────────────────────────────── */
export default function LivreDePolice() {
  const { showToast } = useToast()
  const user = useUser()
  const { entries, addEntry, updateEntry, deleteEntry } = useLivreDePolice()
  const [addDrawer, setAddDrawer] = useState(false)
  const [editDrawer, setEditDrawer] = useState(null)
  const [addForm, setAddForm] = useState(emptyVehicle)
  const [editForm, setEditForm] = useState(null)
  const [errors, setErrors] = useState({})
  const [showOptional, setShowOptional] = useState(false)
  const [imgErrors, setImgErrors] = useState({})
  const [lookupLoading, setLookupLoading] = useState(false)

  const vendus = entries.filter(v => v.statut === 'vendu')
  const enStock = entries.filter(v => v.statut === 'stock')
  const totalAchats = entries.reduce((s, v) => s + (v.prixAchat ?? 0), 0)
  const totalCessions = vendus.reduce((s, v) => s + (v.prixCession || 0), 0)
  const marge = totalCessions - totalAchats

  const kpis = [
    { label: 'Total véhicules', value: entries.length,   bg: '#e8f4fb', border: '#b3d4e8', color: '#2563EB', icon: Car },
    { label: 'En stock',        value: enStock.length,   bg: '#eef3f7', border: '#c8d6de', color: '#2d3f55', icon: Package },
    { label: 'Vendus',          value: vendus.length,    bg: '#fff8e1', border: '#fcd34d', color: '#b45309', icon: ShoppingCart },
    { label: 'Marge totale',    value: `${marge >= 0 ? '+' : ''}${marge.toLocaleString()} €`, bg: '#e6f4ea', border: '#a5d6a7', color: '#2e7d32', icon: BarChart2 },
  ]

  // ── Share — encode les données dans l'URL pour que ça fonctionne sans policy DB ──
  const handleShare = (e, entry) => {
    e.stopPropagation()
    try {
      const meta = {
        m:  entry.marque,
        mo: entry.modele,
        a:  entry.annee,
        k:  entry.km,
        c:  entry.carburant,
        p:  entry.puissance,
        ca: entry.carrosserie,
        co: entry.couleur,
        pl: entry.plaque,
        s:  entry.statut,
        pa: entry.prixAchat,
        ph: entry.photos?.[0] || null,
      }
      const encoded = btoa(encodeURIComponent(JSON.stringify(meta)))
      const url = `${window.location.origin}/v/${entry.id}?d=${encoded}`
      navigator.clipboard.writeText(url).then(() => {
        showToast('🔗 Lien copié dans le presse-papiers !')
      }).catch(() => {
        showToast(`Lien : ${url}`)
      })
    } catch {
      showToast('Erreur lors de la génération du lien', 'error')
    }
  }

  // ── Validation add ──
  const validateAdd = () => {
    const e = {}
    if (!addForm.marque.trim()) e.marque = true
    if (!addForm.modele.trim()) e.modele = true
    if (!addForm.plaque.trim()) e.plaque = true
    if (!addForm.prixAchat || isNaN(Number(addForm.prixAchat))) e.prixAchat = true
    if (!addForm.fournisseur.trim()) e.fournisseur = true
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleAdd = () => {
    if (!validateAdd()) return
    const newEntry = {
      marque: addForm.marque,
      modele: addForm.modele,
      plaque: addForm.plaque.toUpperCase(),
      vin: addForm.vin || '—',
      prixAchat: Number(addForm.prixAchat),
      fournisseur: addForm.fournisseur,
      dateEntree: new Date(addForm.dateEntree).toLocaleDateString('fr-FR'),
      dateSortie: null, acquereur: null, prixCession: null,
      statut: 'stock',
      pays: addForm.pays || 'FR',
      annee: addForm.annee || null,
      km: addForm.km ? Number(addForm.km) : null,
      carburant: addForm.carburant || null,
      puissance: addForm.puissance || null,
      cylindree: addForm.cylindree || null,
      carrosserie: addForm.carrosserie || null,
      couleur: addForm.couleur || null,
      transmission: addForm.transmission || null,
      photos: addForm.photos || [],
    }
    addEntry(newEntry)
    setAddDrawer(false); setAddForm(emptyVehicle); setErrors({})
    showToast(`${addForm.marque} ${addForm.modele} ajouté ✅`)
  }

  // ── Edit ──
  const openEdit = (entry) => {
    setEditForm({
      marque: entry.marque,
      modele: entry.modele,
      plaque: entry.plaque,
      vin: entry.vin === '—' ? '' : (entry.vin || ''),
      prixAchat: entry.prixAchat,
      fournisseur: entry.fournisseur,
      dateEntree: entry.dateEntree,
      statut: entry.statut,
      acquereur: entry.acquereur || '',
      prixCession: entry.prixCession || '',
      dateSortie: entry.dateSortie || '',
      pays: entry.pays || 'FR',
      annee: entry.annee || '',
      km: entry.km || '',
      carburant: entry.carburant || '',
      puissance: entry.puissance || '',
      cylindree: entry.cylindree || '',
      carrosserie: entry.carrosserie || '',
      couleur: entry.couleur || '',
      transmission: entry.transmission || '',
      photos: entry.photos || [],
    })
    setEditDrawer(entry)
    setShowOptional(false)
  }

  // ── Auto-remplissage via AutoWays ──
  const handleAutoFill = async (form, setForm) => {
    const plaque = form.plaque?.trim()
    const vin    = form.vin?.trim()
    if (!plaque && !vin) {
      showToast('Renseigne la plaque ou le VIN d\'abord', 'error'); return
    }
    setLookupLoading(true)
    try {
      const data = plaque
        ? await lookupByPlaque(plaque, form.pays || 'FR')
        : await lookupByVin(vin)
      console.log('[AutoWays] résultat:', data)
      setForm(p => ({
        ...p,
        ...(data.marque       && { marque:       data.marque }),
        ...(data.modele       && { modele:       data.modele }),
        ...(data.annee        && { annee:        data.annee }),
        ...(data.vin          && { vin:          data.vin }),
        ...(data.carburant    && { carburant:    data.carburant }),
        ...(data.puissance    && { puissance:    data.puissance }),
        ...(data.cylindree    && { cylindree:    data.cylindree }),
        ...(data.carrosserie  && { carrosserie:  data.carrosserie }),
        ...(data.couleur      && { couleur:      data.couleur }),
        ...(data.transmission && { transmission: data.transmission }),
      }))
      setShowOptional(true)
      const label = [data.marque, data.modele].filter(Boolean).join(' ') || 'Véhicule'
      showToast(`${label} trouvé ✅`, 'success')
      // Récupère aussi la photo Wikipedia si pas encore de photo
      if (data.marque && data.modele) {
        fetchCarPhoto(data.marque, data.modele).then(photo => {
          if (photo) setForm(p => ({ ...p, photos: p.photos.length ? p.photos : [photo] }))
        })
      }
    } catch (err) {
      showToast(err.message || 'Véhicule non trouvé', 'error')
    } finally {
      setLookupLoading(false)
    }
  }

  const handleDelete = (id, label) => {
    if (!window.confirm(`Supprimer définitivement "${label}" du livre de police ?`)) return
    deleteEntry(id)
    setEditDrawer(null)
    setEditForm(null)
    showToast('Véhicule supprimé', 'success')
  }

  const handleSaveEdit = () => {
    if (!editForm.marque || !editForm.modele || !editForm.plaque || !editForm.prixAchat || !editForm.fournisseur) {
      showToast('Remplis les champs obligatoires', 'error'); return
    }
    updateEntry(editDrawer.id, {
      marque: editForm.marque,
      modele: editForm.modele,
      plaque: editForm.plaque.toUpperCase(),
      vin: editForm.vin || '—',
      prixAchat: Number(editForm.prixAchat),
      fournisseur: editForm.fournisseur,
      statut: editForm.statut,
      pays: editForm.pays || 'FR',
      annee: editForm.annee || null,
      km: editForm.km ? Number(editForm.km) : null,
      carburant: editForm.carburant || null,
      puissance: editForm.puissance || null,
      cylindree: editForm.cylindree || null,
      carrosserie: editForm.carrosserie || null,
      couleur: editForm.couleur || null,
      transmission: editForm.transmission || null,
      photos: editForm.photos || [],
      acquereur: editForm.statut === 'vendu' ? editForm.acquereur || null : null,
      prixCession: editForm.statut === 'vendu' ? Number(editForm.prixCession) || null : null,
      dateSortie: editForm.statut === 'vendu' ? editForm.dateSortie || null : null,
    })
    setEditDrawer(null); setEditForm(null)
    showToast(`${editForm.marque} ${editForm.modele} mis à jour ✅`)
  }

  // ── Champs obligatoires
  const requiredFields = (pays) => {
    const config = PAYS_CONFIG[pays] || PAYS_CONFIG.FR
    return [
      { key: 'marque',     label: 'Marque*',               icon: Car,       placeholder: 'BMW',                   type: 'text'   },
      { key: 'modele',     label: 'Modèle*',                icon: Car,       placeholder: 'Série 3',               type: 'text'   },
      { key: 'plaque',     label: `${config.plaqueLabel}*`, icon: Hash,      placeholder: config.plaquePlaceholder, type: 'text', maxLen: config.plaqueMaxLen },
      { key: 'prixAchat',  label: "Prix d'achat (€)*",     icon: Euro,      placeholder: '16500',                  type: 'number' },
      { key: 'fournisseur',label: 'Fournisseur*',           icon: Building2, placeholder: 'BCA Auction',            type: 'text'   },
      { key: 'dateEntree', label: "Date d'entrée*",         icon: Calendar,  placeholder: '',                       type: 'date'   },
    ]
  }

  const optionalFields = [
    { key: 'annee',        label: 'Année',           placeholder: '2020',             type: 'number' },
    { key: 'km',           label: 'Kilométrage (km)', placeholder: '45000',           type: 'number' },
    { key: 'carburant',    label: 'Carburant',        placeholder: 'Diesel',           type: 'text'   },
    { key: 'puissance',    label: 'Puissance (ch)',   placeholder: '130',              type: 'number' },
    { key: 'cylindree',    label: 'Cylindrée',       placeholder: '1.5L',             type: 'text'   },
    { key: 'carrosserie',  label: 'Carrosserie',      placeholder: 'Berline',          type: 'text'   },
    { key: 'couleur',      label: 'Couleur',          placeholder: 'Gris Nardo',       type: 'text'   },
    { key: 'transmission', label: 'Transmission',     placeholder: 'Automatique',      type: 'text'   },
    { key: 'vin',          label: 'Numéro VIN',       placeholder: 'WBA3A5C50CF256521',type: 'text', fullWidth: true },
  ]

  return (
    <div className="p-4 md:p-8 fade-in max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 md:mb-8">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Livre de Police Numérique</h1>
          <p className="text-sm mt-0.5" style={{ color: '#4f6272' }}>Registre horodaté — conforme aux obligations légales</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => showToast('Export PDF généré ✅')}
            className="flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-xl transition-colors"
            style={{ border: '1.5px solid #c8d6de', color: '#2d3f55', background: '#eef2f5' }}
            onMouseEnter={e => e.currentTarget.style.background = '#dce4e8'}
            onMouseLeave={e => e.currentTarget.style.background = '#eef2f5'}>
            <Download size={14} /> <span className="hidden sm:inline">Export PDF</span>
          </button>
          <button onClick={() => showToast('Export Excel généré ✅')}
            className="flex items-center gap-1.5 text-sm font-bold px-3 py-2 rounded-xl text-white hover:opacity-90 transition-all"
            style={{ background: '#2d7a3a', boxShadow: '0 4px 12px rgba(45,122,58,0.2)' }}>
            <FileSpreadsheet size={14} /> <span className="hidden sm:inline">Export Excel</span>
          </button>
          <button onClick={() => setAddDrawer(true)}
            className="flex items-center gap-1.5 text-sm font-bold px-3 md:px-4 py-2 md:py-2.5 rounded-xl text-white hover:opacity-90 transition-all"
            style={{ background: '#2563EB', boxShadow: '0 4px 12px rgba(37,99,235,0.25)' }}>
            <Plus size={15} /> <span className="hidden sm:inline">Ajouter un véhicule</span><span className="sm:hidden">Ajouter</span>
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div id="tour-livre" className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        {kpis.map(k => (
          <div key={k.label} className="rounded-2xl p-5 border flex items-center gap-4" style={{ background: k.bg, borderColor: k.border }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: k.color + '20' }}>
              <k.icon size={18} style={{ color: k.color }} />
            </div>
            <div>
              <p className="text-xs font-semibold" style={{ color: '#4f6272' }}>{k.label}</p>
              <p className="text-2xl font-black" style={{ color: k.color }}>{k.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Grid de cards véhicules */}
      {entries.length === 0 ? (
        <div className="sea-card flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: '#e8f4fb' }}>
            <Car size={24} style={{ color: '#2563EB' }} />
          </div>
          <p className="font-bold mb-1">Aucun véhicule enregistré</p>
          <p className="text-sm mb-5" style={{ color: '#8fa5b5' }}>Ajoutez votre premier véhicule dans le registre.</p>
          <button onClick={() => setAddDrawer(true)}
            className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl text-white transition-all hover:opacity-90"
            style={{ background: '#2563EB', boxShadow: '0 4px 14px rgba(37,99,235,0.25)' }}>
            <Plus size={15} /> Ajouter un véhicule
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
          {entries.map(entry => {
            const paysEntry = entry.pays || 'FR'
            const paysConfig = PAYS_CONFIG[paysEntry] || PAYS_CONFIG.FR
            const isImport = paysEntry !== 'FR'
            const photoUrl = (!imgErrors[entry.id] && entry.photos?.[0])
              ? entry.photos[0]
              : getDefaultVehiclePhoto(entry.marque, entry.modele)

            return (
              <div key={entry.id}
                className="sea-card sea-card-hover transition-all cursor-pointer group overflow-hidden"
                style={{ padding: 0 }}
                onClick={() => openEdit(entry)}>

                {/* Photo */}
                <div style={{ position: 'relative', height: 150, overflow: 'hidden', background: '#dce4e8' }}>
                  <img
                    src={photoUrl}
                    alt={`${entry.marque} ${entry.modele}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                    onError={() => setImgErrors(p => ({ ...p, [entry.id]: true }))}
                    className="group-hover:scale-105"
                  />
                  {/* Overlay gradient */}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 60%)' }} />
                  {/* Badges flottants */}
                  <div style={{ position: 'absolute', top: 10, left: 10, right: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    {isImport && (
                      <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 20, background: 'rgba(0,0,0,0.5)', color: '#fff', backdropFilter: 'blur(4px)' }}>
                        {paysConfig.flag} Import
                      </span>
                    )}
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                      {/* Bouton partager */}
                      <button
                        type="button"
                        onClick={(e) => handleShare(e, entry)}
                        title="Copier le lien de la fiche"
                        style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255,255,255,0.85)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#fff'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.85)'}>
                        <Share2 size={13} color="#2563EB" />
                      </button>
                    </div>
                  </div>
                  {/* Statut en bas */}
                  <div style={{ position: 'absolute', bottom: 10, left: 12, right: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontSize: 11, fontWeight: 800, padding: '3px 8px', borderRadius: 20,
                      background: entry.statut === 'vendu' ? 'rgba(180,83,9,0.9)' : 'rgba(37,99,235,0.9)',
                      color: '#fff', backdropFilter: 'blur(4px)',
                    }}>
                      {entry.statut === 'vendu' ? '✓ Vendu' : '📦 En stock'}
                    </span>
                    {entry.photos?.length > 1 && (
                      <span style={{ fontSize: 10, color: '#fff', opacity: 0.8 }}>
                        <Camera size={11} style={{ display: 'inline', marginRight: 3 }} />{entry.photos.length}
                      </span>
                    )}
                  </div>
                </div>

                {/* Contenu card */}
                <div style={{ padding: '14px 16px 16px' }}>
                  {/* Titre */}
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-black text-sm">{entry.marque} {entry.modele}</p>
                      <PlaqueBadge plaque={entry.plaque} pays={paysEntry} />
                    </div>
                    <div className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: '#dce4e8' }}>
                      <Pencil size={12} style={{ color: '#2563EB' }} />
                    </div>
                  </div>

                  {/* Infos */}
                  <div className="grid grid-cols-2 gap-2 pt-2 mt-1 border-t" style={{ borderColor: '#e8eef2' }}>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: '#8fa5b5' }}>Entrée</p>
                      <p className="text-sm font-semibold">{entry.dateEntree}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: '#8fa5b5' }}>Prix achat</p>
                      <p className="text-sm font-bold" style={{ color: '#2d3f55' }}>{(entry.prixAchat ?? 0).toLocaleString()} €</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: '#8fa5b5' }}>Fournisseur</p>
                      <p className="text-sm truncate" style={{ color: '#4f6272' }}>{entry.fournisseur}</p>
                    </div>
                    {entry.statut === 'vendu' && entry.prixCession ? (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: '#8fa5b5' }}>Prix cession</p>
                        <p className="text-sm font-bold" style={{ color: '#2e7d32' }}>{entry.prixCession.toLocaleString()} €</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: '#8fa5b5' }}>
                          {entry.annee ? 'Année' : entry.km ? 'Kilométrage' : 'VIN'}
                        </p>
                        <p className="text-xs font-mono truncate" style={{ color: '#8fa5b5' }}>
                          {entry.annee || (entry.km ? `${Number(entry.km).toLocaleString()} km` : (entry.vin || '—'))}
                        </p>
                      </div>
                    )}
                  </div>

                  {entry.statut === 'vendu' && entry.acquereur && (
                    <div className="mt-2 pt-2 border-t flex items-center gap-2" style={{ borderColor: '#e8eef2' }}>
                      <div className="w-5 h-5 rounded-md flex items-center justify-center text-white text-[10px] font-black shrink-0"
                        style={{ background: '#2d3f55' }}>{entry.acquereur[0]}</div>
                      <p className="text-xs font-semibold" style={{ color: '#4f6272' }}>{entry.acquereur}</p>
                      {entry.dateSortie && <span className="ml-auto text-xs" style={{ color: '#8fa5b5' }}>{entry.dateSortie}</span>}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between px-1">
        <p className="text-xs font-medium" style={{ color: '#4f6272' }}>
          {entries.length} véhicules · {vendus.length} vendus · {enStock.length} en stock
        </p>
        <p className="text-xs" style={{ color: '#8fa5b5' }}>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
      </div>

      {/* ===== DRAWER AJOUT ===== */}
      {addDrawer && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/25 backdrop-blur-sm" onClick={() => { setAddDrawer(false); setAddForm(emptyVehicle); setErrors({}) }} />
          <div className="w-full max-w-md h-full shadow-2xl flex flex-col fade-in" style={{ background: '#eef2f5', borderLeft: '1px solid #c8d6de' }}>
            <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: '#c8d6de' }}>
              <div>
                <h2 className="font-bold text-lg">Ajouter un véhicule</h2>
                <p className="text-xs mt-0.5" style={{ color: '#8fa5b5' }}>Enregistrement immédiat dans le registre</p>
              </div>
              <button onClick={() => { setAddDrawer(false); setAddForm(emptyVehicle); setErrors({}) }}
                className="p-2 rounded-lg transition-colors"
                onMouseEnter={e => e.currentTarget.style.background = '#dce4e8'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <X size={17} style={{ color: '#4f6272' }} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">

              {/* ── Auto-remplissage AutoWays ── */}
              <div style={{ padding: '12px 14px', borderRadius: 12, background: 'linear-gradient(135deg, #eff6ff, #f5f3ff)', border: '1.5px solid #c7d2fe', display: 'flex', alignItems: 'center', gap: 12 }}>
                <Wand2 size={16} style={{ color: '#4F46E5', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#3730a3' }}>Auto-remplissage</p>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: '#6366f1' }}>Renseigne la plaque ou le VIN puis clique pour tout remplir automatiquement</p>
                </div>
                <button
                  type="button"
                  disabled={lookupLoading}
                  onClick={() => handleAutoFill(addForm, setAddForm)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: 'none', cursor: lookupLoading ? 'wait' : 'pointer', background: '#4F46E5', color: '#fff', fontSize: 12, fontWeight: 700, flexShrink: 0, opacity: lookupLoading ? 0.7 : 1 }}>
                  {lookupLoading ? <Loader size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Wand2 size={13} />}
                  {lookupLoading ? 'Recherche…' : 'Auto-remplir'}
                </button>
              </div>

              {/* Sélecteur pays */}
              <CountrySelector value={addForm.pays} onChange={(pays) => setAddForm(p => ({ ...p, pays, plaque: '' }))} />

              {/* Marque + Modèle avec autocomplete */}
              <VehicleSelect
                marque={addForm.marque}
                modele={addForm.modele}
                onMarqueChange={v => { setAddForm(p => ({ ...p, marque: v })); setErrors(p => ({ ...p, marque: false })) }}
                onModeleChange={v => { setAddForm(p => ({ ...p, modele: v })); setErrors(p => ({ ...p, modele: false })) }}
                onPhotoFetched={url => setAddForm(p => ({ ...p, photos: p.photos.length ? p.photos : [url] }))}
              />
              {(errors.marque || errors.modele) && (
                <p className="text-xs -mt-2" style={{ color: '#dc2626' }}>Marque et modèle requis</p>
              )}

              {/* Autres champs obligatoires */}
              {requiredFields(addForm.pays).filter(f => f.key !== 'marque' && f.key !== 'modele').map(f => (
                <div key={f.key}>
                  <label className="text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5"
                    style={{ color: errors[f.key] ? '#dc2626' : '#4f6272' }}>
                    <f.icon size={11} /> {f.label}
                  </label>
                  <input type={f.type} placeholder={f.placeholder} value={addForm[f.key] ?? ''}
                    onChange={e => {
                      let val = e.target.value
                      if (f.key === 'plaque') val = formatPlaqueByPays(val, addForm.pays)
                      setAddForm(p => ({ ...p, [f.key]: val }))
                      if (errors[f.key]) setErrors(p => ({ ...p, [f.key]: false }))
                    }}
                    className="sea-input" maxLength={f.maxLen}
                    style={errors[f.key] ? { borderColor: '#dc2626' } : {}}
                  />
                  {errors[f.key] && <p className="text-xs mt-1" style={{ color: '#dc2626' }}>Champ requis</p>}
                </div>
              ))}

              {/* Photos */}
              <PhotoUploader
                photos={addForm.photos}
                setPhotos={(fn) => setAddForm(p => ({ ...p, photos: typeof fn === 'function' ? fn(p.photos) : fn }))}
                userId={user?.isDemo ? null : user?.id}
              />

              {/* Champs optionnels — accordéon */}
              <div style={{ borderRadius: 10, border: '1.5px solid #e2e8f0', overflow: 'hidden' }}>
                <button type="button" onClick={() => setShowOptional(v => !v)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: showOptional ? '#f1f5f9' : '#fff', border: 'none', cursor: 'pointer' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#4f6272' }}>
                    Infos complémentaires <span style={{ fontWeight: 400, color: '#94a3b8' }}>(optionnel — pour les documents)</span>
                  </span>
                  <span style={{ fontSize: 16, color: '#94a3b8', lineHeight: 1 }}>{showOptional ? '−' : '+'}</span>
                </button>
                {showOptional && (
                  <div style={{ padding: '14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, borderTop: '1px solid #e2e8f0' }}>
                    {optionalFields.map(f => (
                      <div key={f.key} style={f.fullWidth ? { gridColumn: '1 / -1' } : {}}>
                        <label style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', display: 'block', marginBottom: 4 }}>
                          {f.label}
                        </label>
                        <input type={f.type} placeholder={f.placeholder} value={addForm[f.key] ?? ''}
                          onChange={e => {
                            let val = e.target.value
                            if (f.key === 'vin') val = val.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 17)
                            setAddForm(p => ({ ...p, [f.key]: val }))
                          }}
                          className="sea-input" maxLength={f.key === 'vin' ? 17 : undefined}
                          style={{ fontFamily: f.key === 'vin' ? 'monospace' : undefined }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Estimateur de prix */}
              {addForm.marque && addForm.modele && (
                <PriceEstimator marque={addForm.marque} modele={addForm.modele} annee={addForm.annee} km={addForm.km} carburant={addForm.carburant} />
              )}
            </div>

            <div className="p-6 border-t space-y-2" style={{ borderColor: '#c8d6de' }}>
              <button onClick={handleAdd}
                className="w-full text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-90"
                style={{ background: '#2563EB', boxShadow: '0 4px 14px rgba(37,99,235,0.25)' }}>
                <Check size={16} /> Enregistrer dans le registre
              </button>
              <button onClick={() => { setAddDrawer(false); setAddForm(emptyVehicle); setErrors({}) }}
                className="w-full text-sm py-2 transition-colors" style={{ color: '#8fa5b5' }}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== DRAWER ÉDITION ===== */}
      {editDrawer && editForm && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/25 backdrop-blur-sm" onClick={() => { setEditDrawer(null); setEditForm(null) }} />
          <div className="w-full max-w-md h-full shadow-2xl flex flex-col fade-in" style={{ background: '#eef2f5', borderLeft: '1px solid #c8d6de' }}>
            <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: '#c8d6de' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h2 className="font-bold text-lg">
                    {PAYS_CONFIG[editForm.pays]?.flag} {editDrawer.marque} {editDrawer.modele}
                  </h2>
                </div>
                <p className="text-xs mt-0.5" style={{ color: '#8fa5b5' }}>
                  Fiche N° {String(editDrawer.id).padStart ? String(editDrawer.id).slice(-6) : editDrawer.id}
                  {editForm.pays !== 'FR' ? ` · Import ${PAYS_CONFIG[editForm.pays]?.nom}` : ''}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={(e) => handleShare(e, editDrawer)} title="Partager la fiche"
                  className="p-2 rounded-lg transition-colors"
                  style={{ background: '#e8f4fb', border: '1px solid #b3d4e8' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#dbeafe'}
                  onMouseLeave={e => e.currentTarget.style.background = '#e8f4fb'}>
                  <Share2 size={15} style={{ color: '#2563EB' }} />
                </button>
                <button
                  title="Supprimer ce véhicule"
                  onClick={() => handleDelete(editDrawer.id, `${editDrawer.marque} ${editDrawer.modele}`)}
                  className="p-2 rounded-lg transition-colors"
                  style={{ background: '#fee2e2', border: '1px solid #fca5a5' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fecaca'}
                  onMouseLeave={e => e.currentTarget.style.background = '#fee2e2'}>
                  <Trash2 size={15} style={{ color: '#dc2626' }} />
                </button>
                <button onClick={() => { setEditDrawer(null); setEditForm(null) }}
                  className="p-2 rounded-lg transition-colors"
                  onMouseEnter={e => e.currentTarget.style.background = '#dce4e8'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <X size={17} style={{ color: '#4f6272' }} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">

              {/* ── Auto-remplissage AutoWays ── */}
              <div style={{ padding: '12px 14px', borderRadius: 12, background: 'linear-gradient(135deg, #eff6ff, #f5f3ff)', border: '1.5px solid #c7d2fe', display: 'flex', alignItems: 'center', gap: 12 }}>
                <Wand2 size={16} style={{ color: '#4F46E5', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#3730a3' }}>Auto-remplissage</p>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: '#6366f1' }}>Plaque ou VIN renseigné → tout se remplit automatiquement</p>
                </div>
                <button
                  type="button"
                  disabled={lookupLoading}
                  onClick={() => handleAutoFill(editForm, setEditForm)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: 'none', cursor: lookupLoading ? 'wait' : 'pointer', background: '#4F46E5', color: '#fff', fontSize: 12, fontWeight: 700, flexShrink: 0, opacity: lookupLoading ? 0.7 : 1 }}>
                  {lookupLoading ? <Loader size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Wand2 size={13} />}
                  {lookupLoading ? 'Recherche…' : 'Auto-remplir'}
                </button>
              </div>

              {/* Sélecteur pays */}
              <CountrySelector value={editForm.pays} onChange={(pays) => setEditForm(p => ({ ...p, pays }))} />

              {/* Marque + Modèle avec autocomplete */}
              <VehicleSelect
                marque={editForm.marque}
                modele={editForm.modele}
                onMarqueChange={v => setEditForm(p => ({ ...p, marque: v }))}
                onModeleChange={v => setEditForm(p => ({ ...p, modele: v }))}
                onPhotoFetched={url => setEditForm(p => ({ ...p, photos: p.photos.length ? p.photos : [url] }))}
              />

              {/* Autres champs de base */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: 'plaque',     label: `${PAYS_CONFIG[editForm.pays]?.plaqueLabel || 'Plaque'}*`, icon: Hash, type: 'text', placeholder: PAYS_CONFIG[editForm.pays]?.plaquePlaceholder || 'AB-123-CD', maxLen: PAYS_CONFIG[editForm.pays]?.plaqueMaxLen },
                  { key: 'fournisseur',label: 'Fournisseur*', icon: Building2, type: 'text',   placeholder: 'BCA Auction', fullWidth: true },
                  { key: 'prixAchat',  label: 'Prix achat (€)*', icon: Euro,  type: 'number', placeholder: '16500' },
                ].map(f => (
                  <div key={f.key} className={f.fullWidth ? 'col-span-2' : ''}>
                    <label className="text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5" style={{ color: '#4f6272' }}>
                      <f.icon size={10} /> {f.label}
                    </label>
                    <input type={f.type} placeholder={f.placeholder} value={editForm[f.key] ?? ''}
                      maxLength={f.maxLen}
                      onChange={e => {
                        let val = e.target.value
                        if (f.key === 'plaque') val = formatPlaqueByPays(val, editForm.pays)
                        setEditForm(p => ({ ...p, [f.key]: val }))
                      }}
                      className="sea-input" />
                  </div>
                ))}
              </div>

              {/* Photos */}
              <PhotoUploader
                photos={editForm.photos}
                setPhotos={(fn) => setEditForm(p => ({ ...p, photos: typeof fn === 'function' ? fn(p.photos) : fn }))}
                userId={user?.isDemo ? null : user?.id}
              />

              {/* Champs optionnels */}
              <div style={{ borderRadius: 10, border: '1.5px solid #e2e8f0', overflow: 'hidden' }}>
                <button type="button" onClick={() => setShowOptional(v => !v)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: showOptional ? '#f1f5f9' : '#fff', border: 'none', cursor: 'pointer' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#4f6272' }}>
                    Infos complémentaires <span style={{ fontWeight: 400, color: '#94a3b8' }}>(optionnel)</span>
                  </span>
                  <span style={{ fontSize: 16, color: '#94a3b8', lineHeight: 1 }}>{showOptional ? '−' : '+'}</span>
                </button>
                {showOptional && (
                  <div style={{ padding: '14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, borderTop: '1px solid #e2e8f0' }}>
                    {optionalFields.map(f => (
                      <div key={f.key} style={f.fullWidth ? { gridColumn: '1 / -1' } : {}}>
                        <label style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', display: 'block', marginBottom: 4 }}>
                          {f.label}
                        </label>
                        <input type={f.type} placeholder={f.placeholder} value={editForm[f.key] ?? ''}
                          onChange={e => {
                            let val = e.target.value
                            if (f.key === 'vin') val = val.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 17)
                            setEditForm(p => ({ ...p, [f.key]: val }))
                          }}
                          className="sea-input"
                          maxLength={f.key === 'vin' ? 17 : undefined}
                          style={{ fontFamily: f.key === 'vin' ? 'monospace' : undefined }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Estimateur de prix */}
              <PriceEstimator marque={editForm.marque} modele={editForm.modele} annee={editForm.annee} km={editForm.km} carburant={editForm.carburant} />

              {/* Statut */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: '#4f6272' }}>
                  Statut du véhicule
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setEditForm(p => ({ ...p, statut: 'stock' }))}
                    className="py-3 rounded-xl font-bold text-sm transition-all"
                    style={editForm.statut === 'stock'
                      ? { background: '#e8f4fb', border: '2px solid #2563EB', color: '#2563EB' }
                      : { background: '#dce4e8', border: '2px solid #c8d6de', color: '#8fa5b5' }}>
                    📦 En stock
                  </button>
                  <button onClick={() => setEditForm(p => ({ ...p, statut: 'vendu' }))}
                    className="py-3 rounded-xl font-bold text-sm transition-all"
                    style={editForm.statut === 'vendu'
                      ? { background: '#fff8e1', border: '2px solid #b45309', color: '#b45309' }
                      : { background: '#dce4e8', border: '2px solid #c8d6de', color: '#8fa5b5' }}>
                    ✅ Vendu
                  </button>
                </div>
              </div>

              {/* Champs vente */}
              {editForm.statut === 'vendu' && (
                <div className="space-y-3 fade-in p-4 rounded-xl" style={{ background: '#fff8e1', border: '1px solid #fcd34d' }}>
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#b45309' }}>Infos de cession</p>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5" style={{ color: '#4f6272' }}>
                      <Hash size={10} /> Acquéreur
                    </label>
                    <input type="text" placeholder="Martin Bernard" value={editForm.acquereur}
                      onChange={e => setEditForm(p => ({ ...p, acquereur: e.target.value }))} className="sea-input" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5" style={{ color: '#4f6272' }}>
                        <Euro size={10} /> Prix cession (€)
                      </label>
                      <input type="number" placeholder="19900" value={editForm.prixCession}
                        onChange={e => setEditForm(p => ({ ...p, prixCession: e.target.value }))} className="sea-input" />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5" style={{ color: '#4f6272' }}>
                        <Calendar size={10} /> Date de sortie
                      </label>
                      <input type="date" value={editForm.dateSortie}
                        onChange={e => setEditForm(p => ({ ...p, dateSortie: e.target.value }))} className="sea-input" />
                    </div>
                  </div>
                  {editForm.prixCession && editForm.prixAchat && (
                    <div style={{ padding: '8px 12px', borderRadius: 8, background: Number(editForm.prixCession) >= Number(editForm.prixAchat) ? '#dcfce7' : '#fee2e2', border: `1px solid ${Number(editForm.prixCession) >= Number(editForm.prixAchat) ? '#86efac' : '#fca5a5'}` }}>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: Number(editForm.prixCession) >= Number(editForm.prixAchat) ? '#16a34a' : '#dc2626' }}>
                        Marge : {Number(editForm.prixCession) >= Number(editForm.prixAchat) ? '+' : ''}{(Number(editForm.prixCession) - Number(editForm.prixAchat)).toLocaleString()} €
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-6 border-t space-y-2" style={{ borderColor: '#c8d6de' }}>
              <button onClick={handleSaveEdit}
                className="w-full text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-90"
                style={{ background: '#2563EB', boxShadow: '0 4px 14px rgba(37,99,235,0.25)' }}>
                <Check size={16} /> Enregistrer les modifications
              </button>
              <button onClick={() => { setEditDrawer(null); setEditForm(null) }}
                className="w-full text-sm py-2 transition-colors" style={{ color: '#8fa5b5' }}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
