import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid
} from 'recharts'
import { useUser } from '../context/UserContext'
import { TrendingUp, Euro, Car, Percent } from 'lucide-react'

const monthlyData = [
  { mois: 'Oct', ventes: 8,  marge: 5200  },
  { mois: 'Nov', ventes: 11, marge: 7800  },
  { mois: 'Déc', ventes: 7,  marge: 4100  },
  { mois: 'Jan', ventes: 14, marge: 9600  },
  { mois: 'Fév', ventes: 12, marge: 8300  },
  { mois: 'Mar', ventes: 18, marge: 12400 },
]

const typeData = [
  { name: 'France',  value: 58, color: '#2563EB' },
  { name: 'Export',  value: 27, color: '#2d3f55' },
  { name: 'Import',  value: 15, color: '#8fa5b5' },
]

const topVehicules = [
  { vehicule: 'BMW Série 3 2021',       marque: 'BMW',       marge: 6800, tx: 28.3 },
  { vehicule: 'Mercedes GLC 2020',      marque: 'Mercedes',  marge: 6200, tx: 26.1 },
  { vehicule: 'Porsche Macan 2019',     marque: 'Porsche',   marge: 5900, tx: 24.7 },
  { vehicule: 'Audi Q5 2021',           marque: 'Audi',      marge: 5400, tx: 22.5 },
  { vehicule: 'Volkswagen Tiguan 2022', marque: 'VW',        marge: 4100, tx: 19.8 },
]

const kpis = [
  {
    label: "Chiffre d'affaires total",
    value: '187 400 €',
    icon: Euro,
    color: '#2563EB',
    bg: '#e8f4fb',
    sub: '+12% vs période préc.',
  },
  {
    label: 'Marge brute',
    value: '42 300 €',
    icon: TrendingUp,
    color: '#2e7d32',
    bg: '#e6f4ea',
    sub: '+8% vs période préc.',
  },
  {
    label: 'Marge moy. / véhicule',
    value: '4 230 €',
    icon: Car,
    color: '#2d3f55',
    bg: '#f0f4f8',
    sub: 'Sur 10 véhicules vendus',
  },
  {
    label: 'Taux de marge moyen',
    value: '22,5 %',
    icon: Percent,
    color: '#b45309',
    bg: '#fff8e1',
    sub: 'Objectif : 25%',
  },
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

const PieLabel = ({ cx, cy, midAngle, outerRadius, name, value }) => {
  const RADIAN = Math.PI / 180
  const r = outerRadius + 20
  const x = cx + r * Math.cos(-midAngle * RADIAN)
  const y = cy + r * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central"
      style={{ fontSize: 11, fill: '#4f6272', fontWeight: 600 }}>
      {name} {value}%
    </text>
  )
}

export default function Stats() {
  const user = useUser()

  return (
    <div className="p-6 md:p-8 fade-in max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black" style={{ color: '#131d2e' }}>Statistiques</h1>
        <p className="text-sm mt-1" style={{ color: '#4f6272' }}>
          Analyse de vos performances — {user?.isDemo ? 'données de démonstration' : 'données réelles'}
        </p>
      </div>

      {/* KPI Cards */}
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

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

        {/* Bar chart — 2/3 width */}
        <div className="sea-card p-6 lg:col-span-2">
          <h2 className="text-sm font-black mb-1" style={{ color: '#131d2e' }}>Ventes & Marge par mois</h2>
          <p className="text-xs mb-5" style={{ color: '#8fa5b5' }}>6 derniers mois</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} barGap={4} barCategoryGap="30%">
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

        {/* Pie chart — 1/3 width */}
        <div className="sea-card p-6">
          <h2 className="text-sm font-black mb-1" style={{ color: '#131d2e' }}>Répartition par type</h2>
          <p className="text-xs mb-4" style={{ color: '#8fa5b5' }}>France / Export / Import</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={typeData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
                labelLine={false}
              >
                {typeData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${value}%`, name]}
                contentStyle={{ background: '#131d2e', border: '1px solid #2d3f55', borderRadius: 10, fontSize: 11, color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {typeData.map(t => (
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
      </div>

      {/* Top 5 véhicules */}
      <div className="sea-card p-6">
        <h2 className="text-sm font-black mb-1" style={{ color: '#131d2e' }}>Top 5 véhicules les plus rentables</h2>
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
              {topVehicules.map((v, i) => (
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
                    <p className="text-sm font-black" style={{ color: '#2e7d32' }}>{v.marge.toLocaleString()} €</p>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full" style={{ background: '#e5e7eb', maxWidth: 80 }}>
                        <div className="h-1.5 rounded-full" style={{ background: '#2563EB', width: `${(v.tx / 30) * 100}%` }} />
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
    </div>
  )
}
