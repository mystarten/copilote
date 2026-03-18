import React, { useState } from 'react'
import { Plus, Search, Pencil, Trash2, X, Check, User, Phone, Mail, MapPin, UserPlus } from 'lucide-react'
import { useClients } from '../context/ClientsContext'
import { useToast } from '../components/Toast'

const emptyForm = { nom: '', email: '', telephone: '', adresse: '' }

export default function Clients() {
  const { clients, addClient, updateClient, deleteClient } = useClients()
  const { showToast } = useToast()
  const [search, setSearch] = useState('')
  const [drawer, setDrawer] = useState(null) // null | 'add' | {client}
  const [form, setForm] = useState(emptyForm)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const filtered = clients.filter(c =>
    c.nom.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.telephone.includes(search)
  )

  const openAdd = () => { setForm(emptyForm); setDrawer('add') }
  const openEdit = (client) => { setForm({ nom: client.nom, email: client.email, telephone: client.telephone, adresse: client.adresse || '' }); setDrawer(client) }
  const closeDrawer = () => { setDrawer(null); setForm(emptyForm) }

  const handleSave = () => {
    if (!form.nom || !form.email) return
    if (drawer === 'add') {
      addClient(form)
      showToast(`${form.nom} ajouté à la base clients ✅`)
    } else {
      updateClient(drawer.id, form)
      showToast(`${form.nom} mis à jour ✅`)
    }
    closeDrawer()
  }

  const handleDelete = (id, nom) => {
    deleteClient(id)
    setDeleteConfirm(null)
    showToast(`${nom} supprimé`, 'error')
  }

  return (
    <div className="p-8 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Base Clients</h1>
          <p className="text-slate-500 text-sm mt-1">{clients.length} clients enregistrés</p>
        </div>
        <button onClick={openAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors shadow-sm">
          <UserPlus size={16} /> Nouveau client
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text" placeholder="Rechercher par nom, email, téléphone..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <User size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">Aucun client trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(client => (
            <div key={client.id}
              className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
                    {client.nom[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{client.nom}</p>
                    {client.cni
                      ? <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">📎 CNI ✓</span>
                      : <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">CNI manquante</span>
                    }
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(client)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => setDeleteConfirm(client)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Mail size={12} className="shrink-0 text-slate-400" />
                  <span className="truncate">{client.email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Phone size={12} className="shrink-0 text-slate-400" />
                  <span>{client.telephone}</span>
                </div>
                {client.adresse && (
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <MapPin size={12} className="shrink-0 text-slate-400" />
                    <span className="truncate">{client.adresse}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drawer add/edit */}
      {drawer !== null && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={closeDrawer} />
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col fade-in">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-slate-900 text-lg">
                  {drawer === 'add' ? 'Nouveau client' : `Modifier ${drawer.nom}`}
                </h2>
                <p className="text-slate-500 text-xs mt-0.5">
                  {drawer === 'add' ? 'Sera disponible immédiatement dans Nouvelle Vente' : 'Les modifications sont instantanées'}
                </p>
              </div>
              <button onClick={closeDrawer} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={18} className="text-slate-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5 flex items-center gap-1.5"><User size={12} /> Nom complet*</label>
                <input type="text" value={form.nom} onChange={e => setForm(p => ({ ...p, nom: e.target.value }))}
                  placeholder="Ex: Jean Dupont"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5 flex items-center gap-1.5"><Mail size={12} /> Email*</label>
                <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="jean@exemple.fr"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5 flex items-center gap-1.5"><Phone size={12} /> Téléphone</label>
                <input type="tel" value={form.telephone} onChange={e => setForm(p => ({ ...p, telephone: e.target.value }))}
                  placeholder="06 12 34 56 78"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5 flex items-center gap-1.5"><MapPin size={12} /> Adresse</label>
                <input type="text" value={form.adresse} onChange={e => setForm(p => ({ ...p, adresse: e.target.value }))}
                  placeholder="12 rue de la Paix, 75001 Paris"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div className="p-6 border-t border-slate-100">
              <button onClick={handleSave} disabled={!form.nom || !form.email}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors">
                <Check size={16} />
                {drawer === 'add' ? 'Ajouter le client' : 'Enregistrer les modifications'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-2xl p-6 shadow-2xl w-full max-w-sm mx-4 fade-in">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={20} className="text-red-500" />
            </div>
            <h3 className="text-center font-bold text-slate-900 mb-1">Supprimer ce client ?</h3>
            <p className="text-center text-sm text-slate-500 mb-6">
              <strong>{deleteConfirm.nom}</strong> sera retiré de la base clients.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 border border-slate-200 text-slate-700 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
                Annuler
              </button>
              <button onClick={() => handleDelete(deleteConfirm.id, deleteConfirm.nom)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl text-sm font-medium transition-colors">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
