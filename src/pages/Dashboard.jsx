import React, { useState, useEffect } from 'react'
import { TrendingUp, FileText, Clock, AlertCircle, Eye, ChevronRight, X, Car, User, Calendar, CreditCard, Hash, Tag, Timer, TrendingDown } from 'lucide-react'
import { mockSales } from '../data/mockData'
import { useUser } from '../context/UserContext'
import { useLivreDePolice } from '../context/LivreDePoliceContext'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const typeMeta = {
  france: { label: 'France', style: { background: '#e8f4fb', color: '#2563EB', border: '1px solid #b3d4e8' } },
  export: { label: 'Export', style: { background: '#eef3f7', color: '#2d3f55', border: '1px solid #8fa5b5' } },
  import: { label: 'Import', style: { background: '#f0f5f8', color: '#4f6272', border: '1px solid #8fa5b5' } },
}
const statutMeta = {
  genere:   { label: 'Généré',   style: { background: '#e6f4ea', color: '#2e7d32', border: '1px solid #a5d6a7' } },
  envoye:   { label: 'Envoyé',   style: { background: '#e8f4fb', color: '#2563EB', border: '1px solid #b3d4e8' } },
  en_cours: { label: 'En cours', style: { background: '#fff8e1', color: '#b45309', border: '1px solid #fcd34d' } },
}

function daysInStock(dateStr) {
  if (!dateStr) return 0
  // Supporte formats ISO (2024-03-15) et FR (15/03/2024)
  let d
  if (dateStr.includes('/')) {
    const [day, month, year] = dateStr.split('/')
    d = new Date(`${year}-${month}-${day}`)
  } else {
    d = new Date(dateStr)
  }
  if (isNaN(d)) return 0
  return Math.floor((Date.now() - d.getTime()) / 86400000)
}

export default function Dashboard() {
  const navigate = useNavigate()
  const user = useUser()
  const { entries: ldpEntries } = useLivreDePolice()
  const [selectedSale, setSelectedSale] = useState(null)

  const stockEntries = (ldpEntries || [])
    .filter(e => e.statut === 'stock')
    .map(e => ({ ...e, jours: daysInStock(e.dateEntree) }))
    .sort((a, b) => b.jours - a.jours)
    .slice(0, 5)

  const topMarges = (ldpEntries || [])
    .filter(e => e.statut === 'vendu' && e.prixCession && e.prixAchat)
    .map(e => ({ ...e, marge: e.prixCession - e.prixAchat }))
    .sort((a, b) => b.marge - a.marge)
    .slice(0, 5)

  const [realSales, setRealSales] = useState([])
  useEffect(() => {
    if (user?.isDemo || !user?.id) return
    supabase.from('ventes').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10)
      .then(({ data }) => { if (data) setRealSales(data) })
  }, [user?.id, user?.isDemo])

  const sales = user?.isDemo ? mockSales : realSales
  const enCours = sales.filter(s => s.statut === 'en_cours').length

  const cards = user?.isDemo
    ? [
        { label: 'Ventes ce mois',      value: '38',      sub: '+23% vs mois dernier',  subStyle: { color: '#2e7d32', fontWeight: 600 }, icon: TrendingUp,  bg: '#e8f4fb', border: '#b3d4e8', iconColor: '#2563EB' },
        { label: 'Documents générés',   value: '247',     sub: 'Ce mois-ci',            subStyle: { color: '#8fa5b5' },                  icon: FileText,    bg: '#eef3f7', border: '#c8d6de', iconColor: '#4f6272' },
        { label: 'Dossiers en attente', value: '5',       sub: 'Voir les dossiers →',   subStyle: { color: '#2563EB', fontWeight: 600, cursor: 'pointer' }, icon: AlertCircle, bg: '#f0f5f8', border: '#8fa5b5', iconColor: '#2d3f55', clickable: true, onClick: () => navigate('/nouvelle-vente') },
        { label: 'Temps moyen',         value: '3 min',   sub: 'Par dossier complet',   subStyle: { color: '#8fa5b5' },                  icon: Clock,       bg: '#dce4e8', border: '#8fa5b5', iconColor: '#4f6272' },
      ]
    : [
        { label: 'Ventes ce mois',      value: String(sales.length), sub: 'Ce mois-ci',          subStyle: { color: '#8fa5b5' },                                                                    icon: TrendingUp,  bg: '#e8f4fb', border: '#b3d4e8', iconColor: '#2563EB' },
        { label: 'Documents générés',   value: '0',                  sub: 'Ce mois-ci',          subStyle: { color: '#8fa5b5' },                                                                    icon: FileText,    bg: '#eef3f7', border: '#c8d6de', iconColor: '#4f6272' },
        { label: 'Dossiers en attente', value: String(enCours),      sub: 'Voir les dossiers →', subStyle: { color: '#2563EB', fontWeight: 600, cursor: 'pointer' }, icon: AlertCircle, bg: '#f0f5f8', border: '#8fa5b5', iconColor: '#2d3f55', clickable: true, onClick: () => navigate('/nouvelle-vente') },
        { label: 'Temps moyen',         value: '4 min',              sub: 'Par dossier complet', subStyle: { color: '#8fa5b5' },                                                                    icon: Clock,       bg: '#dce4e8', border: '#8fa5b5', iconColor: '#4f6272' },
      ]

  return (
    <div className="p-4 md:p-8 fade-in max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
          <p className="text-sm mt-0.5" style={{ color: '#4f6272' }}>
            {user?.isDemo ? 'Mode démo — données d\'exemple' : `Bienvenue, ${user?.garageName || 'votre garage'}`}
          </p>
        </div>
        <button onClick={() => navigate('/nouvelle-vente')}
          className="flex items-center gap-1.5 text-sm font-bold px-3 md:px-5 py-2.5 rounded-xl text-white transition-all hover:opacity-90 shrink-0"
          style={{ background: '#2563EB', boxShadow: '0 4px 14px rgba(37,99,235,0.3)' }}>
          + <span className="hidden sm:inline">Nouvelle Vente</span><span className="sm:hidden">Vente</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div id="tour-kpis" className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mb-8">
        {cards.map(card => (
          <div key={card.label}
            onClick={card.clickable ? card.onClick : undefined}
            className={`rounded-2xl p-3 md:p-5 border transition-all ${card.clickable ? 'cursor-pointer hover:shadow-md' : ''}`}
            style={{ background: card.bg, borderColor: card.border }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium" style={{ color: '#4f6272' }}>{card.label}</span>
              <card.icon size={17} style={{ color: card.iconColor }} />
            </div>
            <p className="text-xl md:text-[32px] font-black mb-1.5">{card.value}</p>
            <p className="text-xs" style={card.subStyle}>{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="sea-card overflow-x-auto">
        <div className="px-6 py-4 flex items-center justify-between border-b" style={{ borderColor: '#c8d6de' }}>
          <h2 className="font-bold text-base">Dernières ventes</h2>
          {sales.length > 0 && (
            <button onClick={() => navigate('/livre-de-police')}
              className="flex items-center gap-1 text-xs font-semibold transition-colors"
              style={{ color: '#2563EB' }}>
              Voir tout <ChevronRight size={12} />
            </button>
          )}
        </div>

        {/* Empty state */}
        {sales.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: '#e8f4fb' }}>
              <TrendingUp size={24} style={{ color: '#2563EB' }} />
            </div>
            <p className="font-bold mb-1">Aucune vente pour le moment</p>
            <p className="text-sm mb-5" style={{ color: '#8fa5b5' }}>
              Créez votre première vente pour générer vos documents PVOI en 4 minutes.
            </p>
            <button onClick={() => navigate('/nouvelle-vente')}
              className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl text-white transition-all hover:opacity-90"
              style={{ background: '#2563EB', boxShadow: '0 4px 14px rgba(37,99,235,0.25)' }}>
              + Créer ma première vente
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ background: '#dce4e8', borderColor: '#c8d6de' }}>
                {['Client', 'Véhicule', 'Type', 'Statut', 'Date', 'Actions'].map(h => (
                  <th key={h} className="text-left text-xs font-bold uppercase tracking-wider px-6 py-3"
                    style={{ color: '#8fa5b5' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sales.map((sale, i) => {
                // Supabase → client_nom/vehicule, mockData → client/vehicule
                const clientName = sale.client_nom || sale.client || '?'
                const vehiculeLabel = sale.vehicule || '—'
                const typeKey = sale.type_vente || sale.type || 'france'
                const statutKey = sale.statut || 'genere'
                return (
                <tr key={sale.id}
                  className="transition-colors"
                  style={{ borderBottom: i < sales.length - 1 ? '1px solid #c8d6de' : 'none' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#dce4e8'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0"
                        style={{ background: '#2d3f55' }}>
                        {clientName[0]?.toUpperCase() || '?'}
                      </div>
                      <span className="text-sm font-semibold">{clientName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ color: '#4f6272' }}>{vehiculeLabel}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-lg" style={(typeMeta[typeKey] || typeMeta.france).style}>
                      {(typeMeta[typeKey] || typeMeta.france).label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-lg" style={(statutMeta[statutKey] || statutMeta.genere).style}>
                      {(statutMeta[statutKey] || statutMeta.genere).label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ color: '#8fa5b5' }}>{sale.date_vente || sale.date || sale.created_at?.slice(0,10) || '—'}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => setSelectedSale(sale)}
                      className="flex items-center gap-1.5 text-xs font-medium px-2 py-1.5 rounded-lg transition-all"
                      style={{ color: '#8fa5b5' }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#2563EB'; e.currentTarget.style.background = '#e8f4fb' }}
                      onMouseLeave={e => { e.currentTarget.style.color = '#8fa5b5'; e.currentTarget.style.background = 'transparent' }}>
                      <Eye size={13} /> Voir
                    </button>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        )}
      </div>

      {/* Radar Rentabilité */}
      {(stockEntries.length > 0 || topMarges.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">

          {/* Véhicules qui dorment */}
          {stockEntries.length > 0 && (
            <div className="sea-card overflow-hidden">
              <div className="px-6 py-4 flex items-center gap-2 border-b" style={{ borderColor: '#c8d6de' }}>
                <Timer size={15} style={{ color: '#b45309' }} />
                <h2 className="font-bold text-sm">Véhicules en stock</h2>
              </div>
              <div className="divide-y" style={{ '--tw-divide-opacity': 1 }}>
                {stockEntries.map(entry => {
                  const j = entry.jours
                  const color = j > 60 ? '#dc2626' : j > 30 ? '#b45309' : '#2e7d32'
                  const bg    = j > 60 ? '#fee2e2' : j > 30 ? '#fff8e1' : '#dcfce7'
                  return (
                    <div key={entry.id} className="px-6 py-3 flex items-center justify-between"
                      style={{ borderColor: '#c8d6de' }}>
                      <div>
                        <p className="text-sm font-bold">{entry.marque} {entry.modele}</p>
                        <p className="text-xs" style={{ color: '#8fa5b5' }}>{entry.plaque}</p>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 800, padding: '3px 10px', borderRadius: 20, background: bg, color }}>
                        {j === 0 ? 'Aujourd\'hui' : `${j} j`}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Meilleures marges */}
          {topMarges.length > 0 && (
            <div className="sea-card overflow-hidden">
              <div className="px-6 py-4 flex items-center gap-2 border-b" style={{ borderColor: '#c8d6de' }}>
                <TrendingDown size={15} style={{ color: '#2563EB' }} />
                <h2 className="font-bold text-sm">Meilleures marges</h2>
              </div>
              <div className="divide-y">
                {topMarges.map(entry => (
                  <div key={entry.id} className="px-6 py-3 flex items-center justify-between"
                    style={{ borderColor: '#c8d6de' }}>
                    <div>
                      <p className="text-sm font-bold">{entry.marque} {entry.modele}</p>
                      <p className="text-xs" style={{ color: '#8fa5b5' }}>{entry.acquereur || entry.plaque}</p>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 800, color: entry.marge >= 0 ? '#16a34a' : '#dc2626' }}>
                      {entry.marge >= 0 ? '+' : ''}{entry.marge.toLocaleString()} €
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Drawer détail vente */}
      {selectedSale && (() => {
        const s = {
          client:   selectedSale.client_nom  || selectedSale.client  || '—',
          vehicule: selectedSale.vehicule    || '—',
          type:     selectedSale.type_vente  || selectedSale.type    || 'france',
          statut:   selectedSale.statut      || 'genere',
          date:     selectedSale.date_vente  || selectedSale.date    || selectedSale.created_at?.slice(0,10) || '—',
          prix:     selectedSale.prix,
          paiement: selectedSale.paiement,
          plaque:   selectedSale.plaque,
          documents: selectedSale.documents,
        }
        return (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/25 backdrop-blur-sm" onClick={() => setSelectedSale(null)} />
          <div className="w-full max-w-md h-full shadow-2xl flex flex-col fade-in"
            style={{ background: '#eef2f5', borderLeft: '1px solid #c8d6de' }}>
            <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: '#c8d6de' }}>
              <div>
                <h2 className="font-bold text-lg">Détail de la vente</h2>
                <p className="text-xs mt-0.5" style={{ color: '#8fa5b5' }}>{s.date}</p>
              </div>
              <button onClick={() => setSelectedSale(null)}
                className="p-2 rounded-lg transition-colors"
                onMouseEnter={e => e.currentTarget.style.background = '#dce4e8'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <X size={17} style={{ color: '#4f6272' }} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="p-4 rounded-xl" style={{ background: '#dce4e8', border: '1px solid #c8d6de' }}>
                <p className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: '#8fa5b5' }}>
                  <User size={11} /> Client
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black shrink-0"
                    style={{ background: '#2d3f55' }}>
                    {s.client[0]?.toUpperCase() || '?'}
                  </div>
                  <p className="font-bold">{s.client}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl" style={{ background: '#dce4e8', border: '1px solid #c8d6de' }}>
                <p className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: '#8fa5b5' }}>
                  <Car size={11} /> Véhicule
                </p>
                <p className="font-bold">{s.vehicule}</p>
              </div>

              <div className="p-4 rounded-xl space-y-3" style={{ background: '#dce4e8', border: '1px solid #c8d6de' }}>
                <p className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: '#8fa5b5' }}>
                  <Tag size={11} /> Informations
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#8fa5b5' }}>Type</p>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg" style={(typeMeta[s.type] || typeMeta.france).style}>
                      {(typeMeta[s.type] || typeMeta.france).label}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#8fa5b5' }}>Statut</p>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg" style={(statutMeta[s.statut] || statutMeta.genere).style}>
                      {(statutMeta[s.statut] || statutMeta.genere).label}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#8fa5b5' }}>Date</p>
                    <p className="text-sm font-semibold flex items-center gap-1.5">
                      <Calendar size={12} style={{ color: '#8fa5b5' }} /> {s.date}
                    </p>
                  </div>
                  {s.prix && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#8fa5b5' }}>Prix</p>
                      <p className="text-sm font-bold" style={{ color: '#2e7d32' }}>{Number(s.prix).toLocaleString()} €</p>
                    </div>
                  )}
                  {s.paiement && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#8fa5b5' }}>Paiement</p>
                      <p className="text-sm font-semibold flex items-center gap-1.5">
                        <CreditCard size={12} style={{ color: '#8fa5b5' }} /> {s.paiement}
                      </p>
                    </div>
                  )}
                  {s.plaque && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#8fa5b5' }}>Plaque</p>
                      <span className="font-mono text-xs font-bold px-2 py-1 rounded-lg"
                        style={{ background: '#e8f4fb', color: '#2563EB', border: '1px solid #b3d4e8' }}>
                        {s.plaque}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {s.documents && s.documents.length > 0 && (
                <div className="p-4 rounded-xl" style={{ background: '#dce4e8', border: '1px solid #c8d6de' }}>
                  <p className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: '#8fa5b5' }}>
                    <Hash size={11} /> Documents générés
                  </p>
                  <div className="space-y-1.5">
                    {s.documents.map(doc => (
                      <div key={doc} className="flex items-center gap-2 text-xs py-1.5 px-3 rounded-lg"
                        style={{ background: '#e6f4ea', border: '1px solid #a5d6a7', color: '#2e7d32' }}>
                        <span>✓</span> {doc}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t space-y-2" style={{ borderColor: '#c8d6de' }}>
              <button
                onClick={() => { setSelectedSale(null); navigate('/livre-de-police') }}
                className="w-full text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-90"
                style={{ background: '#2563EB', boxShadow: '0 4px 14px rgba(37,99,235,0.25)' }}>
                Voir dans le Livre de Police
              </button>
              <button onClick={() => setSelectedSale(null)}
                className="w-full text-sm py-2 transition-colors" style={{ color: '#8fa5b5' }}>
                Fermer
              </button>
            </div>
          </div>
        </div>
        )
      })()}
    </div>
  )
}
