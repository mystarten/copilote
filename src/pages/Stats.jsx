import React, { useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, CartesianGrid
} from 'recharts'
import { useUser } from '../context/UserContext'
import { useLivreDePolice } from '../context/LivreDePoliceContext'
import { TrendingUp, Euro, Car, Percent, BarChart2 } from 'lucide-react'
import { mockLivreDePolice } from '../data/mockData'

const MOIS = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc']

function computeStats(entries) {
  const vendus = entries.filter(e => e.statut === 'vendu' && e.prixCession)

  const ca = vendus.reduce((s, e) => s + e.prixCession, 0)
  const marge = vendus.reduce((s, e) => s + (e.prixCession - e.prixAchat), 0)
  const margeMoy = vendus.length > 0 ? Math.round(marge / vendus.length) : 0
  const tauxMarge = ca > 0 ? ((marge / ca) * 100).toFixed(1) : '0.0'

  // Monthly data — 6 derniers mois
  const now = new Date()
  const monthly = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const m = d.getMonth(); const y = d.getFullYear()
    const inMonth = vendus.filter(e => {
      const ds = e.dateSortie
      if (!ds) return false
      // Support both dd/mm/yyyy and yyyy-mm-dd
      let date
      if (ds.includes('/')) {
        const [day, mo, yr] = ds.split('/')
        date = new Date(yr, mo - 1, day)
      } else {
        date = new Date(ds)
      }
      return date.getMonth() === m && date.getFullYear() === y
    })
    monthly.push({
      mois: MOIS[m],
      ventes: inMonth.length,
      marge: inMonth.reduce((s, e) => s + (e.prixCession - e.prixAchat), 0),
    })
  }

  // Top véhicules par marge
  const top = vendus
    .map(e => ({
      vehicule: `${e.marque} ${e.modele}`,
      marque: e.marque,
      marge: e.prixCession - e.prixAchat,
      tx: e.prixCession > 0 ? (((e.prixCession - e.prixAchat) / e.prixCession) * 100).toFixed(1) : '0.0',
    }))
    .sort((a, b) => b.marge - a.marge)
    .slice(0, 5)

  return { ca, marge, margeMoy, tauxMarge, monthly, top, nbVendus: vendus.length }
}

// Demo hardcoded data
const demoMonthly = [
  { mois: 'Oct', ventes: 8,  marge: 5200  },
  { mois: 'Nov', ventes: 11, marge: 7800  },
  { mois: 'Déc', ventes: 7,  marge: 4100  },
  { mois: 'Jan', ventes: 14, marge: 9600  },
  { mois: 'Fév', ventes: 12, marge: 8300  },
  { mois: 'Mar', ventes: 18, marge: 12400 },
]
const demoTypeData = [
  { name: 'France',  value: 58, color: '#2563EB' },
  { name: 'Export',  value: 27, color: '#2d3f55' },
  { name: 'Import',  value: 15, color: '#8fa5b5' },
]
const demoTop = [
  { vehicule: 'BMW Série 3 2021',       marque: 'BMW',      marge: 6800, tx: '28.3' },
  { vehicule: 'Mercedes GLC 2020',      marque: 'Mercedes', marge: 6200, tx: '26.1' },
  { vehicule: 'Porsche Macan 2019',     marque: 'Porsche',  marge: 5900, tx: '24.7' },
  { vehicule: 'Audi Q5 2021',           marque: 'Audi',     marge: 5400, tx: '22.5' },
  { vehicule: 'Volkswagen Tiguan 2022', marque: 'VW',       marge: 4100, tx: '19.8' },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="text-xs rounded-xl px-3 py-2 shadow-lg"
        style={{ background: '#131d2e', color: '#fff', border: '1px solid #2d3f55' }}>
        <p className="font-bold mb-1" style={{ color: '#8fa5b5' }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>
            {p.name === 'ventes' ? `${p.value} ventes` : `${p.value.toLocaleString()} € marge`}
          </p>
        ))}
      </div>
    )
  }
  return null
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: '#e8f4fb', border: '1px solid #b3d4e8' }}>
        <BarChart2 size={28} style={{ color: '#2563EB' }} />
      </div>
      <h2 className="text-lg font-black mb-2" style={{ color: '#131d2e' }}>Aucune donnée à afficher</h2>
      <p className="text-sm max-w-xs" style={{ color: '#4f6272' }}>
        Commencez par enregistrer vos véhicules dans le{' '}
        <a href="/livre-de-police" className="font-semibold" style={{ color: '#2563EB' }}>
          Livre de Police
        </a>{' '}
        et marquez-les comme vendus pour voir vos statistiques ici.
      </p>
    </div>
  )
}

export default function Stats() {
  const user = useUser()
  const { entries } = useLivreDePolice()

  const stats = useMemo(() => computeStats(entries), [entries])
  const isDemo = user?.isDemo

  const monthly   = isDemo ? demoMonthly : stats.monthly
  const topList   = isDemo ? demoTop     : stats.top
  const hasData   = isDemo || stats.nbVendus > 0

  const kpis = isDemo
    ? [
        { label: "Chiffre d'affaires total", value: '187 400 €', icon: Euro,      color: '#2563EB', bg: '#e8f4fb', sub: '+12% vs période préc.' },
        { label: 'Marge brute',              value: '42 300 €',  icon: TrendingUp, color: '#2e7d32', bg: '#e6f4ea', sub: '+8% vs période préc.' },
        { label: 'Marge moy. / véhicule',    value: '4 230 €',   icon: Car,        color: '#2d3f55', bg: '#f0f4f8', sub: 'Sur 10 véhicules vendus' },
        { label: 'Taux de marge moyen',      value: '22,5 %',    icon: Percent,    color: '#b45309', bg: '#fff8e1', sub: 'Objectif : 25%' },
      ]
    : [
        { label: "Chiffre d'affaires total", value: stats.ca > 0 ? `${stats.ca.toLocaleString()} €` : '—',          icon: Euro,      color: '#2563EB', bg: '#e8f4fb', sub: `${stats.nbVendus} vente${stats.nbVendus > 1 ? 's' : ''} enregistrée${stats.nbVendus > 1 ? 's' : ''}` },
        { label: 'Marge brute',              value: stats.marge > 0 ? `${stats.marge.toLocaleString()} €` : '—',     icon: TrendingUp, color: '#2e7d32', bg: '#e6f4ea', sub: stats.nbVendus > 0 ? 'Calculé depuis le livre de police' : 'Aucune vente' },
        { label: 'Marge moy. / véhicule',    value: stats.margeMoy > 0 ? `${stats.margeMoy.toLocaleString()} €` : '—', icon: Car,     color: '#2d3f55', bg: '#f0f4f8', sub: stats.nbVendus > 0 ? `Sur ${stats.nbVendus} véhicule${stats.nbVendus > 1 ? 's' : ''} vendu${stats.nbVendus > 1 ? 's' : ''}` : 'Aucune vente' },
        { label: 'Taux de marge moyen',      value: stats.ca > 0 ? `${stats.tauxMarge} %` : '—',                     icon: Percent,   color: '#b45309', bg: '#fff8e1', sub: 'Marge / chiffre d\'affaires' },
      ]

  return (
    <div className="p-4 md:p-8 fade-in max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black" style={{ color: '#131d2e' }}>Statistiques</h1>
        <p className="text-sm mt-1" style={{ color: '#4f6272' }}>
          {isDemo ? 'Données de démonstration' : 'Données réelles — calculées depuis votre livre de police'}
        </p>
      </div>

      {/* KPI Cards — always shown */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map(kpi => {
          const Icon = kpi.icon
          return (
            <div key={kpi.label} className="sea-card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: kpi.bg }}>
                  <Icon size={18} style={{ color: kpi.color }} />
                </div>
              </div>
              <p className="text-xs font-semibold mb-1" style={{ color: '#8fa5b5' }}>{kpi.label}</p>
              <p className="text-2xl font-black mb-1" style={{ color: '#131d2e' }}>{kpi.value}</p>
              <p className="text-xs" style={{ color: kpi.color }}>{kpi.sub}</p>
            </div>
          )
        })}
      </div>

      {!hasData ? <EmptyState /> : (
        <>
          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

            {/* Bar chart */}
            <div className="sea-card p-6 lg:col-span-2">
              <h2 className="text-sm font-black mb-1" style={{ color: '#131d2e' }}>Ventes & Marge par mois</h2>
              <p className="text-xs mb-5" style={{ color: '#8fa5b5' }}>6 derniers mois</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthly} barGap={4} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="mois" tick={{ fontSize: 11, fill: '#8fa5b5', fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" tick={{ fontSize: 10, fill: '#8fa5b5' }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#8fa5b5' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(37,99,235,0.05)' }} />
                  <Bar yAxisId="left" dataKey="ventes" name="ventes" fill="#2563EB" radius={[4,4,0,0]} maxBarSize={24} />
                  <Bar yAxisId="right" dataKey="marge" name="marge" fill="#b3d4e8" radius={[4,4,0,0]} maxBarSize={24} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm" style={{ background: '#2563EB' }} />
                  <span className="text-xs" style={{ color: '#8fa5b5' }}>Nbre de ventes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm" style={{ background: '#b3d4e8' }} />
                  <span className="text-xs" style={{ color: '#8fa5b5' }}>Marge (€)</span>
                </div>
              </div>
            </div>

            {/* Pie chart — demo only (no type data in real entries) */}
            {isDemo && (
              <div className="sea-card p-6">
                <h2 className="text-sm font-black mb-1" style={{ color: '#131d2e' }}>Répartition par type</h2>
                <p className="text-xs mb-4" style={{ color: '#8fa5b5' }}>France / Export / Import</p>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={demoTypeData} cx="50%" cy="50%" innerRadius={50} outerRadius={75}
                      paddingAngle={3} dataKey="value" labelLine={false}>
                      {demoTypeData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip formatter={(v, n) => [`${v}%`, n]}
                      contentStyle={{ background: '#131d2e', border: '1px solid #2d3f55', borderRadius: 10, fontSize: 11, color: '#fff' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-2">
                  {demoTypeData.map(t => (
                    <div key={t.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: t.color }} />
                        <span className="text-xs font-semibold" style={{ color: '#4f6272' }}>{t.name}</span>
                      </div>
                      <span className="text-xs font-black" style={{ color: '#131d2e' }}>{t.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Top véhicules */}
          {topList.length > 0 && (
            <div className="sea-card p-6">
              <h2 className="text-sm font-black mb-1" style={{ color: '#131d2e' }}>Top véhicules les plus rentables</h2>
              <p className="text-xs mb-5" style={{ color: '#8fa5b5' }}>Classement par marge brute</p>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                      {['#', 'Véhicule', 'Marque', 'Marge brute', 'Taux de marge'].map(h => (
                        <th key={h} className="text-left pb-3 text-xs font-bold uppercase tracking-wider"
                          style={{ color: '#8fa5b5' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {topList.map((v, i) => (
                      <tr key={v.vehicule} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td className="py-3 pr-4">
                          <span className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black"
                            style={{ background: i === 0 ? '#e8f4fb' : '#f8fafc', color: i === 0 ? '#2563EB' : '#8fa5b5' }}>
                            {i + 1}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <p className="text-sm font-semibold" style={{ color: '#131d2e' }}>{v.vehicule}</p>
                        </td>
                        <td className="py-3 pr-4">
                          <span className="text-xs font-bold px-2 py-1 rounded-lg"
                            style={{ background: '#f0f4f8', color: '#2d3f55' }}>{v.marque}</span>
                        </td>
                        <td className="py-3 pr-4">
                          <p className="text-sm font-black" style={{ color: '#2e7d32' }}>
                            {typeof v.marge === 'number' ? v.marge.toLocaleString() : v.marge} €
                          </p>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 rounded-full" style={{ background: '#e5e7eb', maxWidth: 80 }}>
                              <div className="h-1.5 rounded-full"
                                style={{ background: '#2563EB', width: `${Math.min((parseFloat(v.tx) / 30) * 100, 100)}%` }} />
                            </div>
                            <span className="text-xs font-bold" style={{ color: '#4f6272' }}>{v.tx}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
