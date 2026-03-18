import React from 'react'
import { TrendingUp, FileText, Clock, AlertCircle, Eye } from 'lucide-react'
import { mockSales } from '../data/mockData'
import { useNavigate } from 'react-router-dom'

const typeBadge = {
  france: { label: '🇫🇷 France', cls: 'bg-blue-100 text-blue-700' },
  export: { label: '🌍 Export', cls: 'bg-purple-100 text-purple-700' },
  import: { label: '📥 Import', cls: 'bg-orange-100 text-orange-700' },
}
const statutBadge = {
  genere: { label: '✅ Généré', cls: 'bg-green-100 text-green-700' },
  envoye: { label: '📨 Envoyé', cls: 'bg-blue-100 text-blue-700' },
  en_cours: { label: '🔄 En cours', cls: 'bg-yellow-100 text-yellow-700' },
}

export default function Dashboard() {
  const navigate = useNavigate()
  return (
    <div className="p-8 fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tableau de bord</h1>
          <p className="text-slate-500 text-sm mt-1">Vue d'ensemble de votre activité</p>
        </div>
        <button onClick={() => navigate('/nouvelle-vente')}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors">
          + Nouvelle Vente
        </button>
      </div>

      <div className="grid grid-cols-4 gap-5 mb-8">
        {[
          { label: "Ventes ce mois", value: "14", sub: "↑ +12% vs mois dernier", subCls: "text-green-600", icon: TrendingUp, iconBg: "bg-blue-50", iconCls: "text-blue-600" },
          { label: "Documents générés", value: "87", sub: "Ce mois-ci", subCls: "text-slate-400", icon: FileText, iconBg: "bg-purple-50", iconCls: "text-purple-600" },
          { label: "Dossiers en attente", value: "3", sub: null, subCls: "", icon: AlertCircle, iconBg: "bg-orange-50", iconCls: "text-orange-500" },
          { label: "Temps moyen", value: "4 min", sub: "Par dossier complet", subCls: "text-slate-400", icon: Clock, iconBg: "bg-green-50", iconCls: "text-green-600" },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-500 text-sm">{card.label}</span>
              <div className={`w-9 h-9 ${card.iconBg} rounded-xl flex items-center justify-center`}>
                <card.icon size={18} className={card.iconCls} />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900">{card.value}</p>
            {card.label === "Dossiers en attente"
              ? <span className="inline-block bg-orange-100 text-orange-600 text-xs font-medium px-2 py-0.5 rounded-full mt-1">Action requise</span>
              : <p className={`text-xs mt-1 font-medium ${card.subCls}`}>{card.sub}</p>
            }
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="p-5 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">Dernières ventes</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              {['Client', 'Véhicule', 'Type', 'Statut', 'Date', 'Actions'].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mockSales.map(sale => (
              <tr key={sale.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xs">{sale.client[0]}</div>
                    <span className="text-sm font-medium text-slate-900">{sale.client}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-slate-600">{sale.vehicule}</td>
                <td className="px-5 py-4"><span className={`text-xs font-medium px-2.5 py-1 rounded-full ${typeBadge[sale.type].cls}`}>{typeBadge[sale.type].label}</span></td>
                <td className="px-5 py-4"><span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statutBadge[sale.statut].cls}`}>{statutBadge[sale.statut].label}</span></td>
                <td className="px-5 py-4 text-sm text-slate-500">{sale.date}</td>
                <td className="px-5 py-4">
                  <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Eye size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
