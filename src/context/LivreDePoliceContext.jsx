import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { mockLivreDePolice } from '../data/mockData'

const LivreDePoliceContext = createContext(null)

// ── Conversions DB ↔ app ──────────────────────────────────────────────────────
function dbToEntry(row) {
  return {
    id:           row.id,
    dateEntree:   row.date_entree   || '',
    marque:       row.marque        || '',
    modele:       row.modele        || '',
    plaque:       row.plaque        || '',
    vin:          row.vin           || '',
    prixAchat:    row.prix_achat    ?? null,
    fournisseur:  row.fournisseur   || '',
    dateSortie:   row.date_sortie   || '',
    acquereur:    row.acquereur     || '',
    prixCession:  row.prix_cession  ?? null,
    statut:       row.statut        || 'stock',
  }
}

function entryToDb(entry, userId) {
  const row = {
    date_entree:  entry.dateEntree  || null,
    marque:       entry.marque      || '',
    modele:       entry.modele      || '',
    plaque:       entry.plaque      || '',
    vin:          entry.vin         || '',
    prix_achat:   entry.prixAchat   || null,
    fournisseur:  entry.fournisseur || '',
    date_sortie:  entry.dateSortie  || null,
    acquereur:    entry.acquereur   || '',
    prix_cession: entry.prixCession || null,
    statut:       entry.statut      || 'stock',
  }
  if (userId) row.user_id = userId
  return row
}

export function LivreDePoliceProvider({ children, userId, isDemo = false }) {
  const [entries, setEntries] = useState(isDemo ? mockLivreDePolice : [])
  const [loading, setLoading] = useState(!isDemo && !!userId)

  // ── Chargement initial ──────────────────────────────────────────────────────
  useEffect(() => {
    if (isDemo || !userId) { setLoading(false); return }

    supabase
      .from('livre_de_police')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setEntries(data.map(dbToEntry))
        else if (error) console.error('LDP load error:', error.message)
        setLoading(false)
      })
  }, [userId, isDemo])

  // ── CRUD ────────────────────────────────────────────────────────────────────
  const addEntry = async (entry) => {
    const tempId = `temp_${Date.now()}`
    const optimistic = { ...entry, id: tempId }
    setEntries(prev => [optimistic, ...prev])

    if (!isDemo && userId) {
      const { data, error } = await supabase
        .from('livre_de_police')
        .insert(entryToDb(entry, userId))
        .select()
        .single()

      if (!error && data) {
        setEntries(prev => prev.map(e => e.id === tempId ? { ...optimistic, id: data.id } : e))
        return { ...optimistic, id: data.id }
      } else {
        console.error('LDP insert error:', error?.message)
      }
    }
    return optimistic
  }

  const updateEntry = async (id, data) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, ...data } : e))

    if (!isDemo && userId) {
      const { error } = await supabase
        .from('livre_de_police')
        .update(entryToDb(data))
        .eq('id', id)
        .eq('user_id', userId)
      if (error) console.error('LDP update error:', error.message)
    }
  }

  const deleteEntry = async (id) => {
    setEntries(prev => prev.filter(e => e.id !== id))

    if (!isDemo && userId) {
      const { error } = await supabase
        .from('livre_de_police')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)
      if (error) console.error('LDP delete error:', error.message)
    }
  }

  return (
    <LivreDePoliceContext.Provider value={{ entries, addEntry, updateEntry, deleteEntry, loading }}>
      {children}
    </LivreDePoliceContext.Provider>
  )
}

export function useLivreDePolice() {
  return useContext(LivreDePoliceContext)
}
