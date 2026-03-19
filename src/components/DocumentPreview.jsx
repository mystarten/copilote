import React from 'react'
import { X, Download, Shield } from 'lucide-react'

function formatRef() {
  const d = new Date()
  return `PVOI-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}-${Math.floor(Math.random()*9000+1000)}`
}

export default function DocumentPreview({ doc, sale, user, onClose }) {
  const ref = formatRef()
  const today = new Date().toLocaleDateString('fr-FR', { day:'2-digit', month:'long', year:'numeric' })

  const getTitle = () => {
    if (doc.includes('Facture')) return 'FACTURE DE VENTE'
    if (doc.includes('Bon de commande')) return 'BON DE COMMANDE'
    if (doc.includes('Bon de livraison')) return 'BON DE LIVRAISON'
    if (doc.includes('CERFA')) return 'CERFA N°15776*01'
    if (doc.includes('cession')) return 'CERTIFICAT DE CESSION'
    if (doc.includes('Garantie')) return 'CERTIFICAT DE GARANTIE'
    return doc.toUpperCase()
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto p-4 md:p-8"
      style={{ background: 'rgba(10,18,40,0.9)', backdropFilter: 'blur(8px)' }}>

      {/* Toolbar */}
      <div className="fixed top-4 right-4 flex items-center gap-2 z-[201]">
        <button className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl text-white opacity-50 cursor-not-allowed"
          style={{ background: '#2563EB' }} title="Téléchargement disponible en production">
          <Download size={14} /> Télécharger
        </button>
        <button onClick={onClose}
          className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl text-white"
          style={{ background: '#2d3f55' }}>
          <X size={14} /> Fermer
        </button>
      </div>

      {/* Document A4 */}
      <div className="w-full max-w-2xl mt-14 mb-8 relative"
        style={{ background: '#fff', boxShadow: '0 25px 80px rgba(0,0,0,0.4)', borderRadius: '4px', minHeight: '842px' }}>

        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
          <p className="font-black select-none"
            style={{ color: 'rgba(37,99,235,0.04)', transform: 'rotate(-35deg)', whiteSpace: 'nowrap', fontSize: '96px', fontWeight: 900 }}>
            APERÇU APERÇU APERÇU
          </p>
        </div>

        {/* Simulated banner */}
        <div className="flex items-center justify-center gap-2 py-2 text-xs font-bold"
          style={{ background: '#fff8e1', borderBottom: '1px solid #fcd34d', color: '#b45309', position: 'relative', zIndex: 2 }}>
          ⚠️ DOCUMENT SIMULÉ — Les données réelles seront générées en production
        </div>

        <div className="p-8 md:p-10" style={{ position: 'relative', zIndex: 2 }}>

          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-3">
              {user?.logo
                ? <img src={user.logo} alt="logo" className="w-14 h-14 object-contain rounded-lg"
                    style={{ border: '1px solid #e5e7eb' }} />
                : <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: '#e8f4fb' }}>
                    <Shield size={24} style={{ color: '#2563EB' }} />
                  </div>
              }
              <div>
                <p className="font-black text-lg" style={{ color: '#131d2e' }}>{user?.garageName || 'Votre Garage'}</p>
                {user?.siret && <p className="text-xs" style={{ color: '#4f6272' }}>SIRET : {user.siret}</p>}
                {user?.adresse && <p className="text-xs" style={{ color: '#4f6272' }}>{user.adresse}</p>}
                {(user?.codePostal || user?.ville) && (
                  <p className="text-xs" style={{ color: '#4f6272' }}>{[user.codePostal, user.ville].filter(Boolean).join(' ')}</p>
                )}
                {user?.telephone && <p className="text-xs" style={{ color: '#4f6272' }}>Tél. : {user.telephone}</p>}
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-black mb-1" style={{ color: '#2563EB' }}>{getTitle()}</p>
              <p className="text-xs font-mono font-bold px-2 py-1 rounded"
                style={{ background: '#e8f4fb', color: '#2563EB' }}>{ref}</p>
              <p className="text-xs mt-1" style={{ color: '#8fa5b5' }}>Le {today}</p>
            </div>
          </div>

          {/* Blue separator */}
          <div className="h-0.5 mb-6 rounded-full"
            style={{ background: 'linear-gradient(90deg, #2563EB, #8fa5b5)' }} />

          {/* Parties */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-xl" style={{ background: '#f8fafc', border: '1px solid #e5e7eb' }}>
              <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#2563EB' }}>Vendeur</p>
              <p className="font-bold text-sm" style={{ color: '#131d2e' }}>{user?.garageName || 'Votre Garage'}</p>
              {user?.siret && <p className="text-xs" style={{ color: '#4f6272' }}>SIRET : {user.siret}</p>}
              {user?.adresse && (
                <p className="text-xs" style={{ color: '#4f6272' }}>
                  {user.adresse}, {[user.codePostal, user.ville].filter(Boolean).join(' ')}
                </p>
              )}
            </div>
            <div className="p-4 rounded-xl" style={{ background: '#f8fafc', border: '1px solid #e5e7eb' }}>
              <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#2563EB' }}>Acquéreur</p>
              <p className="font-bold text-sm" style={{ color: '#131d2e' }}>{sale?.client || '—'}</p>
              <p className="text-xs" style={{ color: '#4f6272' }}>Pièce d'identité vérifiée ✓</p>
            </div>
          </div>

          {/* Véhicule */}
          <div className="mb-6">
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: '#131d2e' }}>
              Désignation du véhicule
            </p>
            <table className="w-full" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#2563EB' }}>
                  {['Désignation', 'Marque / Modèle', 'Immatriculation', 'Kilométrage'].map(h => (
                    <th key={h} className="text-left px-3 py-2 text-xs font-bold text-white">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr style={{ background: '#f8fafc', border: '1px solid #e5e7eb' }}>
                  <td className="px-3 py-3 text-sm" style={{ color: '#131d2e' }}>Véhicule d'occasion</td>
                  <td className="px-3 py-3 text-sm font-semibold" style={{ color: '#131d2e' }}>{sale?.vehicule || '—'}</td>
                  <td className="px-3 py-3">
                    <span className="font-mono text-xs font-bold px-2 py-1 rounded"
                      style={{ background: '#e8f4fb', color: '#2563EB' }}>
                      {sale?.plaque || '—'}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-sm" style={{ color: '#4f6272' }}>À convenir</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Financier */}
          <div className="mb-6">
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: '#131d2e' }}>
              Conditions financières
            </p>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl text-center" style={{ background: '#e8f4fb', border: '1px solid #b3d4e8' }}>
                <p className="text-xs font-semibold mb-1" style={{ color: '#8fa5b5' }}>Prix de cession TTC</p>
                <p className="text-xl font-black" style={{ color: '#131d2e' }}>
                  {sale?.prix ? `${Number(sale.prix).toLocaleString()} €` : '— €'}
                </p>
              </div>
              <div className="p-3 rounded-xl text-center" style={{ background: '#f8fafc', border: '1px solid #e5e7eb' }}>
                <p className="text-xs font-semibold mb-1" style={{ color: '#8fa5b5' }}>Mode de règlement</p>
                <p className="text-sm font-bold" style={{ color: '#131d2e' }}>{sale?.paiement || 'Virement'}</p>
              </div>
              <div className="p-3 rounded-xl text-center" style={{ background: '#f8fafc', border: '1px solid #e5e7eb' }}>
                <p className="text-xs font-semibold mb-1" style={{ color: '#8fa5b5' }}>Type de vente</p>
                <p className="text-sm font-bold capitalize" style={{ color: '#131d2e' }}>{sale?.type || 'France'}</p>
              </div>
            </div>
          </div>

          {/* Mentions légales */}
          <div className="p-4 rounded-xl mb-6 text-xs leading-relaxed"
            style={{ background: '#f8fafc', border: '1px solid #e5e7eb', color: '#6b7280' }}>
            <p className="font-bold mb-1" style={{ color: '#374151' }}>Mentions légales :</p>
            Le présent document vaut {getTitle().toLowerCase()} du véhicule désigné ci-dessus. La vente est conclue en l'état,
            le véhicule ayant été présenté à l'acquéreur qui déclare le connaître parfaitement.
            Conformément aux dispositions du Code de la Route, le vendeur remet à l'acquéreur l'ensemble des documents
            nécessaires au transfert de propriété. Document conforme aux exigences CNPA et horodaté électroniquement.
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {['Signature du vendeur', "Signature de l'acquéreur"].map(s => (
              <div key={s} className="text-center">
                <p className="text-xs font-semibold mb-3" style={{ color: '#4f6272' }}>{s}</p>
                <div className="h-16 rounded-xl border-2 border-dashed" style={{ borderColor: '#c8d6de' }} />
                <p className="text-xs mt-2" style={{ color: '#8fa5b5' }}>Lu et approuvé</p>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="pt-4 flex items-center justify-between text-xs"
            style={{ borderTop: '1px solid #e5e7eb', color: '#9ca3af' }}>
            <span>Document généré par <strong>Copilote PVOI</strong> — Conforme CNPA</span>
            <span>Horodaté le {today} à {new Date().toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' })}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
