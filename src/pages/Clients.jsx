import React, { useState } from 'react'
import { Search, Pencil, Trash2, X, Check, User, Phone, Mail, MapPin, UserPlus } from 'lucide-react'
import { useClients } from '../context/ClientsContext'
import { useToast } from '../components/Toast'

const emptyForm = { nom: '', email: '', telephone: '', adresse: '' }

export default function Clients() {
  const { clients, addClient, updateClient, deleteClient } = useClients()
  const { showToast } = useToast()
  const [search, setSearch] = useState('')
  const [drawer, setDrawer] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const filtered = clients.filter(c =>
    c.nom.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    (c.telephone || '').includes(search)
  )

  const openAdd = () => { setForm(emptyForm); setDrawer('add') }
  const openEdit = (c) => { setForm({ nom: c.nom, email: c.email, telephone: c.telephone || '', adresse: c.adresse || '' }); setDrawer(c) }
  const closeDrawer = () => { setDrawer(null); setForm(emptyForm) }
  const handleSave = () => {
    if (!form.nom || !form.email) return
    if (drawer === 'add') { addClient(form); showToast(`${form.nom} ajouté ✅`) }
    else { updateClient(drawer.id, form); showToast(`${form.nom} mis à jour ✅`) }
    closeDrawer()
  }
  const handleDelete = (id, nom) => { deleteClient(id); setDeleteConfirm(null); showToast(`${nom} supprimé`, 'error') }

  return (
    <div className="p-8 fade-in max-w-7xl mx-auto">
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
                    {client.cni
                      ? <span className="text-xs font-semibold px-2 py-0.5 rounded-lg" style={{ background: '#e6f4ea', color: '#2e7d32', border: '1px solid #a5d6a7' }}>CNI ✓</span>
                      : <span className="text-xs font-semibold px-2 py-0.5 rounded-lg" style={{ background: '#fff8e1', color: '#b45309', border: '1px solid #fcd34d' }}>CNI manquante</span>
                    }
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

      {/* Drawer */}
      {drawer !== null && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/25 backdrop-blur-sm" onClick={closeDrawer} />
          <div className="w-full max-w-md h-full shadow-2xl flex flex-col fade-in"
            style={{ background: '#eef2f5', borderLeft: '1px solid #c8d6de' }}>
            <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: '#c8d6de' }}>
              <div>
                <h2 className="font-bold text-lg" style={{ color: '#131d2e' }}>
                  {drawer === 'add' ? 'Nouveau client' : `Modifier ${drawer.nom}`}
                </h2>
                <p className="text-xs mt-0.5" style={{ color: '#8fa5b5' }}>
                  {drawer === 'add' ? 'Disponible immédiatement dans Nouvelle Vente' : 'Modifications instantanées'}
                </p>
              </div>
              <button onClick={closeDrawer}
                className="p-2 rounded-lg transition-colors"
                onMouseEnter={e => e.currentTarget.style.background = '#dce4e8'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <X size={17} style={{ color: '#4f6272' }} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {[
                { key: 'nom',       label: 'Nom complet*', icon: User,    placeholder: 'Jean Dupont' },
                { key: 'email',     label: 'Email*',        icon: Mail,    placeholder: 'jean@garage.fr' },
                { key: 'telephone', label: 'Téléphone',     icon: Phone,   placeholder: '06 12 34 56 78' },
                { key: 'adresse',   label: 'Adresse',       icon: MapPin,  placeholder: '12 rue de la Paix, 75001 Paris' },
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
            </div>
            <div className="p-6 border-t" style={{ borderColor: '#c8d6de' }}>
              <button onClick={handleSave} disabled={!form.nom || !form.email}
                className="w-full text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                style={{ background: '#2563EB' }}>
                <Check size={16} /> {drawer === 'add' ? 'Ajouter le client' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
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
