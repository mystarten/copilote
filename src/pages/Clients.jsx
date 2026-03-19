import React, { useState, useRef } from 'react'
import { Search, Pencil, Trash2, X, Check, User, Phone, Mail, MapPin, UserPlus, Upload, FileText, Eye, ShieldCheck, ShieldAlert } from 'lucide-react'
import { useClients } from '../context/ClientsContext'
import { useToast } from '../components/Toast'

const emptyForm = { nom: '', email: '', telephone: '', adresse: '' }

// ── Zone upload CNI ──────────────────────────────────────────────────────────
function CniZone({ file, onChange }) {
  const ref = useRef(null)
  const [drag, setDrag] = useState(false)

  const handleFile = (f) => {
    if (!f) return
    if (f.size > 5 * 1024 * 1024) { alert('Fichier trop lourd (max 5 Mo)'); return }
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = { name: f.name, dataUrl: e.target.result, type: f.type }
      onChange(result)
    }
    reader.readAsDataURL(f)
  }

  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: '#4f6272' }}>
        <ShieldCheck size={11} /> CNI / Passeport
      </label>

      {file ? (
        <div className="rounded-xl overflow-hidden fade-in" style={{ border: '1.5px solid #a5d6a7', background: '#e6f4ea' }}>
          {/* Preview */}
          {file.type.startsWith('image/') ? (
            <div className="relative">
              <img src={file.dataUrl} alt="CNI" className="w-full object-cover"
                style={{ maxHeight: 140, objectPosition: 'center top' }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          ) : (
            <div className="flex items-center gap-3 px-4 py-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: '#fff', border: '1px solid #a5d6a7' }}>
                <FileText size={18} style={{ color: '#2e7d32' }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#131d2e' }}>{file.name}</p>
                <p className="text-xs" style={{ color: '#4f6272' }}>Document PDF</p>
              </div>
            </div>
          )}
          {/* Actions */}
          <div className="flex items-center justify-between px-4 py-2.5" style={{ borderTop: '1px solid #a5d6a7' }}>
            <div className="flex items-center gap-2">
              <Check size={13} style={{ color: '#2e7d32' }} />
              <span className="text-xs font-semibold" style={{ color: '#2e7d32' }}>CNI enregistrée</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => ref.current?.click()}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors"
                style={{ color: '#2563EB', background: '#fff', border: '1px solid #b3d4e8' }}>
                Remplacer
              </button>
              <button onClick={() => onChange(null)}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors"
                style={{ color: '#dc2626', background: '#fff', border: '1px solid #fca5a5' }}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => ref.current?.click()}
          onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]) }}
          onDragOver={e => { e.preventDefault(); setDrag(true) }}
          onDragLeave={() => setDrag(false)}
          className="flex flex-col items-center justify-center gap-2 rounded-xl cursor-pointer transition-all"
          style={{
            padding: '28px 16px',
            border: `2px dashed ${drag ? '#2563EB' : '#c8d6de'}`,
            background: drag ? '#e8f4fb' : '#f4f8fa',
          }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: drag ? '#dbeeff' : '#eef3f7' }}>
            <Upload size={18} style={{ color: drag ? '#2563EB' : '#8fa5b5' }} />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold" style={{ color: '#2d3f55' }}>
              {drag ? 'Déposez ici' : 'Ajouter la CNI / Passeport'}
            </p>
            <p className="text-xs mt-0.5" style={{ color: '#8fa5b5' }}>Glissez ou cliquez · JPG, PNG, PDF · max 5 Mo</p>
          </div>
        </div>
      )}

      <input ref={ref} type="file" accept="image/*,.pdf" className="hidden"
        onChange={e => handleFile(e.target.files?.[0])} />
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Clients() {
  const { clients, addClient, updateClient, deleteClient } = useClients()
  const { showToast } = useToast()
  const [search, setSearch] = useState('')
  const [drawer, setDrawer] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [cniFile, setCniFile] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [cniPreviewModal, setCniPreviewModal] = useState(null)

  const filtered = clients.filter(c =>
    c.nom.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    (c.telephone || '').includes(search)
  )

  const openAdd = () => { setForm(emptyForm); setCniFile(null); setDrawer('add') }
  const openEdit = (c) => {
    setForm({ nom: c.nom, email: c.email, telephone: c.telephone || '', adresse: c.adresse || '' })
    setCniFile(c.cniFile || null)
    setDrawer(c)
  }
  const closeDrawer = () => { setDrawer(null); setForm(emptyForm); setCniFile(null) }

  const handleSave = () => {
    if (!form.nom || !form.email) return
    const clientData = { ...form, cni: !!cniFile, cniFile: cniFile || null }
    if (drawer === 'add') { addClient(clientData); showToast(`${form.nom} ajouté ✅`) }
    else { updateClient(drawer.id, clientData); showToast(`${form.nom} mis à jour ✅`) }
    closeDrawer()
  }

  const handleDelete = (id, nom) => { deleteClient(id); setDeleteConfirm(null); showToast(`${nom} supprimé`, 'error') }

  return (
    <div className="p-4 md:p-8 fade-in max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#131d2e' }}>Base Clients</h1>
          <p className="text-sm mt-0.5" style={{ color: '#4f6272' }}>{clients.length} clients enregistrés</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl text-white hover:opacity-90 transition-all"
          style={{ background: '#2563EB', boxShadow: '0 4px 14px rgba(37,99,235,0.25)' }}>
          <UserPlus size={15} /> Nouveau client
        </button>
      </div>

      <div className="relative mb-6 max-w-sm">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#8fa5b5' }} />
        <input type="text" placeholder="Rechercher..." value={search}
          onChange={e => setSearch(e.target.value)}
          className="sea-input pl-10" />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20" style={{ color: '#8fa5b5' }}>
          <User size={36} className="mx-auto mb-3 opacity-40" />
          <p className="font-medium">Aucun client trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(client => (
            <div key={client.id} className="sea-card sea-card-hover p-5 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-black text-lg shrink-0"
                    style={{ background: '#2d3f55' }}>
                    {client.nom[0]}
                  </div>
                  <div>
                    <p className="font-bold text-sm mb-1" style={{ color: '#131d2e' }}>{client.nom}</p>
                    {client.cni ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-lg"
                          style={{ background: '#e6f4ea', color: '#2e7d32', border: '1px solid #a5d6a7' }}>
                          CNI ✓
                        </span>
                        {client.cniFile?.type?.startsWith('image/') && (
                          <button onClick={() => setCniPreviewModal(client)}
                            className="text-xs font-semibold px-1.5 py-0.5 rounded-lg transition-colors"
                            style={{ color: '#2563EB', background: '#e8f4fb', border: '1px solid #b3d4e8' }}>
                            <Eye size={10} />
                          </button>
                        )}
                      </div>
                    ) : (
                      <button onClick={() => openEdit(client)}
                        className="text-xs font-semibold px-2 py-0.5 rounded-lg transition-all hover:opacity-80"
                        style={{ background: '#fff8e1', color: '#b45309', border: '1px solid #fcd34d', cursor: 'pointer' }}>
                        + Ajouter CNI
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(client)}
                    className="p-2 rounded-lg transition-colors" style={{ color: '#8fa5b5' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#2563EB'; e.currentTarget.style.background = '#e8f4fb' }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#8fa5b5'; e.currentTarget.style.background = 'transparent' }}>
                    <Pencil size={13} />
                  </button>
                  <button onClick={() => setDeleteConfirm(client)}
                    className="p-2 rounded-lg transition-colors" style={{ color: '#8fa5b5' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#dc2626'; e.currentTarget.style.background = '#fee2e2' }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#8fa5b5'; e.currentTarget.style.background = 'transparent' }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs" style={{ color: '#4f6272' }}>
                  <Mail size={11} className="shrink-0" style={{ color: '#8fa5b5' }} />
                  <span className="truncate">{client.email}</span>
                </div>
                {client.telephone && (
                  <div className="flex items-center gap-2 text-xs" style={{ color: '#4f6272' }}>
                    <Phone size={11} className="shrink-0" style={{ color: '#8fa5b5' }} />
                    <span>{client.telephone}</span>
                  </div>
                )}
                {client.adresse && (
                  <div className="flex items-center gap-2 text-xs" style={{ color: '#4f6272' }}>
                    <MapPin size={11} className="shrink-0" style={{ color: '#8fa5b5' }} />
                    <span className="truncate">{client.adresse}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Drawer add / edit ─────────────────────────────────────────────── */}
      {drawer !== null && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/25 backdrop-blur-sm" onClick={closeDrawer} />
          <div className="w-full max-w-md h-full shadow-2xl flex flex-col fade-in"
            style={{ background: '#eef2f5', borderLeft: '1px solid #c8d6de' }}>

            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: '#c8d6de' }}>
              <div>
                <h2 className="font-bold text-lg" style={{ color: '#131d2e' }}>
                  {drawer === 'add' ? 'Nouveau client' : `Modifier ${drawer.nom}`}
                </h2>
                <p className="text-xs mt-0.5" style={{ color: '#8fa5b5' }}>
                  {drawer === 'add' ? 'Disponible immédiatement dans Nouvelle Vente' : 'Modifications instantanées'}
                </p>
              </div>
              <button onClick={closeDrawer} className="p-2 rounded-lg transition-colors"
                onMouseEnter={e => e.currentTarget.style.background = '#dce4e8'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <X size={17} style={{ color: '#4f6272' }} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Champs texte */}
              {[
                { key: 'nom',       label: 'Nom complet*', icon: User,    placeholder: 'Jean Dupont' },
                { key: 'email',     label: 'Email*',       icon: Mail,    placeholder: 'jean@garage.fr' },
                { key: 'telephone', label: 'Téléphone',    icon: Phone,   placeholder: '06 12 34 56 78' },
                { key: 'adresse',   label: 'Adresse',      icon: MapPin,  placeholder: '12 rue de la Paix, 75001 Paris' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5" style={{ color: '#4f6272' }}>
                    <f.icon size={11} /> {f.label}
                  </label>
                  <input type="text" value={form[f.key]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder} className="sea-input" />
                </div>
              ))}

              {/* Séparateur */}
              <div style={{ height: 1, background: '#c8d6de', margin: '8px 0' }} />

              {/* Zone CNI */}
              <CniZone file={cniFile} onChange={setCniFile} />

              {/* Info légale */}
              <div className="flex items-start gap-2 p-3 rounded-xl" style={{ background: '#f0f4f8', border: '1px solid #dce4e8' }}>
                <ShieldAlert size={13} className="shrink-0 mt-0.5" style={{ color: '#8fa5b5' }} />
                <p className="text-xs" style={{ color: '#8fa5b5', lineHeight: 1.5 }}>
                  La CNI est obligatoire pour toute vente de véhicule (article L 321-1 du code de la route). Elle sera stockée de manière sécurisée.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t" style={{ borderColor: '#c8d6de' }}>
              {!cniFile && (
                <p className="text-xs text-center mb-3 font-semibold" style={{ color: '#b45309' }}>
                  ⚠️ CNI non fournie — vous pourrez l'ajouter plus tard
                </p>
              )}
              <button onClick={handleSave} disabled={!form.nom || !form.email}
                className="w-full text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                style={{ background: '#2563EB' }}>
                <Check size={16} /> {drawer === 'add' ? 'Ajouter le client' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal preview CNI ─────────────────────────────────────────────── */}
      {cniPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setCniPreviewModal(null)}
          style={{ background: 'rgba(6,13,31,0.85)', backdropFilter: 'blur(8px)' }}>
          <div className="relative max-w-lg w-full fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-bold text-white">{cniPreviewModal.nom}</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {cniPreviewModal.cniFile?.name}
                </p>
              </div>
              <button onClick={() => setCniPreviewModal(null)}
                className="p-2 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}>
                <X size={16} />
              </button>
            </div>
            <img src={cniPreviewModal.cniFile?.dataUrl} alt="CNI"
              className="w-full rounded-2xl shadow-2xl"
              style={{ border: '1px solid rgba(255,255,255,0.1)' }} />
          </div>
        </div>
      )}

      {/* ── Confirm suppression ──────────────────────────────────────────── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/25 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative rounded-2xl p-6 shadow-2xl w-full max-w-sm mx-4 fade-in border"
            style={{ background: '#eef2f5', borderColor: '#c8d6de' }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#fee2e2' }}>
              <Trash2 size={20} style={{ color: '#dc2626' }} />
            </div>
            <h3 className="text-center font-bold mb-1" style={{ color: '#131d2e' }}>Supprimer ce client ?</h3>
            <p className="text-center text-sm mb-6" style={{ color: '#4f6272' }}>
              <strong style={{ color: '#2d3f55' }}>{deleteConfirm.nom}</strong> sera retiré définitivement.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                style={{ border: '1.5px solid #c8d6de', color: '#4f6272', background: '#dce4e8' }}
                onMouseEnter={e => e.currentTarget.style.background = '#c8d6de'}
                onMouseLeave={e => e.currentTarget.style.background = '#dce4e8'}>
                Annuler
              </button>
              <button onClick={() => handleDelete(deleteConfirm.id, deleteConfirm.nom)}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-colors hover:opacity-90"
                style={{ background: '#dc2626' }}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
