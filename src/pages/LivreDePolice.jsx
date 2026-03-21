import React, { useState } from 'react'
import { Download, FileSpreadsheet, Plus, X, Check, Car, Hash, Calendar, Euro, Building2, Pencil, Package, ShoppingCart, BarChart2 } from 'lucide-react'
import { useToast } from '../components/Toast'
import { useLivreDePolice } from '../context/LivreDePoliceContext'
import { formatPlaque } from '../lib/formatters'
import PriceEstimator from '../components/PriceEstimator'

const emptyVehicle = {
  marque: '', modele: '', plaque: '', vin: '',
  prixAchat: '', fournisseur: '',
  dateEntree: new Date().toISOString().split('T')[0],
}

export default function LivreDePolice() {
  const { showToast } = useToast()
  const { entries, addEntry, updateEntry } = useLivreDePolice()
  const [addDrawer, setAddDrawer] = useState(false)
  const [editDrawer, setEditDrawer] = useState(null)
  const [addForm, setAddForm] = useState(emptyVehicle)
  const [editForm, setEditForm] = useState(null)
  const [errors, setErrors] = useState({})

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

  // ---- Validation add ----
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
      id: entries.length + 1,
      marque: addForm.marque,
      modele: addForm.modele,
      plaque: addForm.plaque.toUpperCase(),
      vin: addForm.vin || '—',
      prixAchat: Number(addForm.prixAchat),
      fournisseur: addForm.fournisseur,
      dateEntree: new Date(addForm.dateEntree).toLocaleDateString('fr-FR'),
      dateSortie: null, acquereur: null, prixCession: null,
      statut: 'stock',
    }
    addEntry(newEntry)
    setAddDrawer(false); setAddForm(emptyVehicle); setErrors({})
    showToast(`${addForm.marque} ${addForm.modele} ajouté ✅`)
  }

  // ---- Edit ----
  const openEdit = (entry) => {
    setEditForm({
      marque: entry.marque,
      modele: entry.modele,
      plaque: entry.plaque,
      vin: entry.vin === '—' ? '' : entry.vin,
      prixAchat: entry.prixAchat,
      fournisseur: entry.fournisseur,
      dateEntree: entry.dateEntree,
      statut: entry.statut,
      acquereur: entry.acquereur || '',
      prixCession: entry.prixCession || '',
      dateSortie: entry.dateSortie || '',
    })
    setEditDrawer(entry)
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
      acquereur: editForm.statut === 'vendu' ? editForm.acquereur || null : null,
      prixCession: editForm.statut === 'vendu' ? Number(editForm.prixCession) || null : null,
      dateSortie: editForm.statut === 'vendu' ? editForm.dateSortie || null : null,
    })
    setEditDrawer(null); setEditForm(null)
    showToast(`${editForm.marque} ${editForm.modele} mis à jour ✅`)
  }

  const addFields = [
    { key: 'marque', label: 'Marque*', icon: Car, placeholder: 'BMW', type: 'text' },
    { key: 'modele', label: 'Modèle*', icon: Car, placeholder: 'Série 3', type: 'text' },
    { key: 'plaque', label: 'Plaque*', icon: Hash, placeholder: 'AB-123-CD', type: 'text' },
    { key: 'vin', label: 'Numéro VIN', icon: Hash, placeholder: 'WBA3A5C50CF256521', type: 'text' },
    { key: 'prixAchat', label: "Prix d'achat (€)*", icon: Euro, placeholder: '16500', type: 'number' },
    { key: 'fournisseur', label: 'Fournisseur*', icon: Building2, placeholder: 'BCA Auction', type: 'text' },
    { key: 'dateEntree', label: "Date d'entrée*", icon: Calendar, placeholder: '', type: 'date' },
  ]

  return (
    <div className="p-4 md:p-8 fade-in max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 md:mb-8">
        <div>
          <h1 className="text-xl md:text-2xl font-bold" style={{ color: '#131d2e' }}>Livre de Police Numérique</h1>
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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
        {entries.map(entry => (
          <div key={entry.id}
            className="sea-card sea-card-hover p-5 transition-all cursor-pointer group"
            onClick={() => openEdit(entry)}>

            {/* Header card */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: entry.statut === 'vendu' ? '#fff8e1' : '#e8f4fb', border: `1px solid ${entry.statut === 'vendu' ? '#fcd34d' : '#b3d4e8'}` }}>
                  <Car size={17} style={{ color: entry.statut === 'vendu' ? '#b45309' : '#2563EB' }} />
                </div>
                <div>
                  <p className="font-black text-sm" style={{ color: '#131d2e' }}>{entry.marque} {entry.modele}</p>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-lg"
                    style={{ background: '#e8f4fb', color: '#2563EB', border: '1px solid #b3d4e8' }}>
                    {entry.plaque}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {entry.statut === 'vendu'
                  ? <span className="text-xs font-bold px-2.5 py-1 rounded-lg" style={{ background: '#fff8e1', color: '#b45309', border: '1px solid #fcd34d' }}>Vendu</span>
                  : <span className="text-xs font-bold px-2.5 py-1 rounded-lg" style={{ background: '#e8f4fb', color: '#2563EB', border: '1px solid #b3d4e8' }}>En stock</span>
                }
                <div className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: '#dce4e8' }}>
                  <Pencil size={12} style={{ color: '#2563EB' }} />
                </div>
              </div>
            </div>

            {/* Infos */}
            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t" style={{ borderColor: '#c8d6de' }}>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: '#8fa5b5' }}>Entrée</p>
                <p className="text-sm font-semibold" style={{ color: '#131d2e' }}>{entry.dateEntree}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: '#8fa5b5' }}>Prix achat</p>
                <p className="text-sm font-bold" style={{ color: '#2d3f55' }}>{(entry.prixAchat ?? 0).toLocaleString()} €</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: '#8fa5b5' }}>Fournisseur</p>
                <p className="text-sm" style={{ color: '#4f6272' }}>{entry.fournisseur}</p>
              </div>
              {entry.statut === 'vendu' && entry.prixCession ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: '#8fa5b5' }}>Prix cession</p>
                  <p className="text-sm font-bold" style={{ color: '#2e7d32' }}>{entry.prixCession.toLocaleString()} €</p>
                </div>
              ) : (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: '#8fa5b5' }}>N° VIN</p>
                  <p className="text-xs font-mono truncate" style={{ color: '#8fa5b5' }}>{entry.vin}</p>
                </div>
              )}
            </div>

            {entry.statut === 'vendu' && entry.acquereur && (
              <div className="mt-2 pt-2 border-t flex items-center gap-2" style={{ borderColor: '#c8d6de' }}>
                <div className="w-5 h-5 rounded-md flex items-center justify-center text-white text-[10px] font-black shrink-0"
                  style={{ background: '#2d3f55' }}>{entry.acquereur[0]}</div>
                <p className="text-xs font-semibold" style={{ color: '#4f6272' }}>{entry.acquereur}</p>
                {entry.dateSortie && <span className="ml-auto text-xs" style={{ color: '#8fa5b5' }}>{entry.dateSortie}</span>}
              </div>
            )}
          </div>
        ))}
      </div>

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
          <div className="w-full max-w-md h-full shadow-2xl flex flex-col fade-in"
            style={{ background: '#eef2f5', borderLeft: '1px solid #c8d6de' }}>
            <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: '#c8d6de' }}>
              <div>
                <h2 className="font-bold text-lg" style={{ color: '#131d2e' }}>Ajouter un véhicule</h2>
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
              {addFields.map(f => (
                <div key={f.key}>
                  <label className="text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5"
                    style={{ color: errors[f.key] ? '#dc2626' : '#4f6272' }}>
                    <f.icon size={11} /> {f.label}
                  </label>
                  <input type={f.type} placeholder={f.placeholder} value={addForm[f.key]}
                    onChange={e => {
                      const val = f.key === 'plaque' ? formatPlaque(e.target.value) : e.target.value
                      setAddForm(p => ({ ...p, [f.key]: val }))
                      if (errors[f.key]) setErrors(p => ({ ...p, [f.key]: false }))
                    }}
                    className="sea-input"
                    maxLength={f.key === 'plaque' ? 9 : undefined}
                    style={errors[f.key] ? { borderColor: '#dc2626' } : {}} />
                  {errors[f.key] && <p className="text-xs mt-1" style={{ color: '#dc2626' }}>Champ requis</p>}
                </div>
              ))}
              {addForm.marque && addForm.modele && addForm.prixAchat && (
                <div className="p-4 rounded-xl fade-in" style={{ background: '#e8f4fb', border: '1px solid #b3d4e8' }}>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#2563EB' }}>Aperçu</p>
                  <p className="font-bold text-sm" style={{ color: '#131d2e' }}>{addForm.marque} {addForm.modele}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#4f6272' }}>
                    {addForm.plaque && <span className="font-mono font-bold" style={{ color: '#2563EB' }}>{addForm.plaque.toUpperCase()}</span>}
                    {addForm.plaque && ' · '}
                    {addForm.prixAchat && `${Number(addForm.prixAchat).toLocaleString()} €`}
                    {addForm.fournisseur && ` · ${addForm.fournisseur}`}
                  </p>
                </div>
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
          <div className="w-full max-w-md h-full shadow-2xl flex flex-col fade-in"
            style={{ background: '#eef2f5', borderLeft: '1px solid #c8d6de' }}>
            <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: '#c8d6de' }}>
              <div>
                <h2 className="font-bold text-lg" style={{ color: '#131d2e' }}>
                  Modifier · {editDrawer.marque} {editDrawer.modele}
                </h2>
                <p className="text-xs mt-0.5" style={{ color: '#8fa5b5' }}>Fiche véhicule N° {String(editDrawer.id).padStart(3, '0')}</p>
              </div>
              <button onClick={() => { setEditDrawer(null); setEditForm(null) }}
                className="p-2 rounded-lg transition-colors"
                onMouseEnter={e => e.currentTarget.style.background = '#dce4e8'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <X size={17} style={{ color: '#4f6272' }} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">

              {/* Infos de base */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: 'marque', label: 'Marque*', icon: Car, type: 'text', placeholder: 'BMW' },
                  { key: 'modele', label: 'Modèle*', icon: Car, type: 'text', placeholder: 'Série 3' },
                  { key: 'plaque', label: 'Plaque*', icon: Hash, type: 'text', placeholder: 'AB-123-CD' },
                  { key: 'vin', label: 'VIN', icon: Hash, type: 'text', placeholder: '—' },
                  { key: 'fournisseur', label: 'Fournisseur*', icon: Building2, type: 'text', placeholder: 'BCA Auction' },
                  { key: 'prixAchat', label: "Prix achat (€)*", icon: Euro, type: 'number', placeholder: '16500' },
                ].map(f => (
                  <div key={f.key} className={f.key === 'fournisseur' || f.key === 'vin' ? 'col-span-2' : ''}>
                    <label className="text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5" style={{ color: '#4f6272' }}>
                      <f.icon size={10} /> {f.label}
                    </label>
                    <input type={f.type} placeholder={f.placeholder}
                      value={editForm[f.key]}
                      maxLength={f.key === 'plaque' ? 9 : undefined}
                      onChange={e => setEditForm(p => ({ ...p, [f.key]: f.key === 'plaque' ? formatPlaque(e.target.value) : e.target.value }))}
                      className="sea-input" />
                  </div>
                ))}
              </div>

              {/* Estimateur de prix */}
              <PriceEstimator
                marque={editForm.marque}
                modele={editForm.modele}
                annee={editForm.annee}
                km={editForm.km}
                carburant={editForm.carburant}
              />

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

              {/* Champs vente — apparaissent si statut = vendu */}
              {editForm.statut === 'vendu' && (
                <div className="space-y-3 fade-in p-4 rounded-xl" style={{ background: '#fff8e1', border: '1px solid #fcd34d' }}>
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#b45309' }}>Infos de cession</p>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5" style={{ color: '#4f6272' }}>
                      <Hash size={10} /> Acquéreur
                    </label>
                    <input type="text" placeholder="Martin Bernard"
                      value={editForm.acquereur}
                      onChange={e => setEditForm(p => ({ ...p, acquereur: e.target.value }))}
                      className="sea-input" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5" style={{ color: '#4f6272' }}>
                        <Euro size={10} /> Prix cession (€)
                      </label>
                      <input type="number" placeholder="19900"
                        value={editForm.prixCession}
                        onChange={e => setEditForm(p => ({ ...p, prixCession: e.target.value }))}
                        className="sea-input" />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5" style={{ color: '#4f6272' }}>
                        <Calendar size={10} /> Date sortie
                      </label>
                      <input type="date"
                        value={editForm.dateSortie}
                        onChange={e => setEditForm(p => ({ ...p, dateSortie: e.target.value }))}
                        className="sea-input" />
                    </div>
                  </div>
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
