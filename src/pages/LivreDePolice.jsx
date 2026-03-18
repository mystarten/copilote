import React from 'react'
import { Download, FileSpreadsheet } from 'lucide-react'
import { mockLivreDePolice } from '../data/mockData'
import { useToast } from '../components/Toast'

export default function LivreDePolice() {
  const { showToast } = useToast()

  return (
    <div className="p-8 fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Livre de Police Numérique</h1>
          <p className="text-slate-500 text-sm mt-1">Registre horodaté — conforme aux obligations légales</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => showToast('Export PDF simulé ✅')}
            className="flex items-center gap-2 text-sm border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
            <Download size={15} /> Export PDF
          </button>
          <button onClick={() => showToast('Export Excel simulé ✅')}
            className="flex items-center gap-2 text-sm bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl transition-colors">
            <FileSpreadsheet size={15} /> Export Excel
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {['N°', 'Date entrée', 'Marque / Modèle', 'Plaque', 'VIN', 'Prix achat', 'Fournisseur', 'Date sortie', 'Acquéreur', 'Prix cession', 'Statut'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockLivreDePolice.map(row => (
                <tr key={row.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-slate-500 font-mono text-xs">{String(row.id).padStart(3, '0')}</td>
                  <td className="px-4 py-3 text-slate-700 whitespace-nowrap">{row.dateEntree}</td>
                  <td className="px-4 py-3 font-medium text-slate-900 whitespace-nowrap">{row.marque} {row.modele}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-700">{row.plaque}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{row.vin}</td>
                  <td className="px-4 py-3 text-slate-700 whitespace-nowrap">{row.prixAchat.toLocaleString()} €</td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{row.fournisseur}</td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{row.dateSortie || <span className="text-slate-300">—</span>}</td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{row.acquereur || <span className="text-slate-300">—</span>}</td>
                  <td className="px-4 py-3 text-slate-700 whitespace-nowrap">{row.prixCession ? `${row.prixCession.toLocaleString()} €` : <span className="text-slate-300">—</span>}</td>
                  <td className="px-4 py-3">
                    {row.statut === 'vendu'
                      ? <span className="text-xs font-medium bg-red-100 text-red-600 px-2.5 py-1 rounded-full">🔴 Vendu</span>
                      : <span className="text-xs font-medium bg-green-100 text-green-700 px-2.5 py-1 rounded-full">🟢 En stock</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <p className="text-xs text-slate-500">{mockLivreDePolice.length} véhicules · {mockLivreDePolice.filter(v => v.statut === 'vendu').length} vendus · {mockLivreDePolice.filter(v => v.statut === 'stock').length} en stock</p>
          <p className="text-xs text-slate-400">Dernière mise à jour : 18/03/2026</p>
        </div>
      </div>
    </div>
  )
}
