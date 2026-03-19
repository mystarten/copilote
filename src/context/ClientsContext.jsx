import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { initialClients } from '../data/mockData'

const ClientsContext = createContext(null)

// ── Conversions DB ↔ app ──────────────────────────────────────────────────────
function dbToClient(row) {
  return {
    id:        row.id,
    nom:       row.nom       || '',
    prenom:    row.prenom    || '',
    email:     row.email     || '',
    telephone: row.telephone || '',
    adresse:   row.adresse   || '',
    cni:       row.cni       || false,
    cniFile:   row.cni_file_url ? { name: 'CNI', dataUrl: row.cni_file_url, type: 'url' } : null,
  }
}

function clientToDb(client, userId) {
  const row = {
    nom:       client.nom       || '',
    prenom:    client.prenom    || '',
    email:     client.email     || '',
    telephone: client.telephone || '',
    adresse:   client.adresse   || '',
    cni:       client.cni       || false,
    cni_file_url: client.cniFile?.dataUrl?.startsWith('http') ? client.cniFile.dataUrl : null,
  }
  if (userId) row.user_id = userId
  return row
}

export function ClientsProvider({ children, userId, isDemo = false }) {
  const [clients, setClients]   = useState(isDemo ? initialClients : [])
  const [loading, setLoading]   = useState(!isDemo && !!userId)

  // ── Chargement initial depuis Supabase ──────────────────────────────────────
  useEffect(() => {
    if (isDemo || !userId) { setLoading(false); return }

    supabase
      .from('clients')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setClients(data.map(dbToClient))
        else if (error) console.error('Clients load error:', error.message)
        setLoading(false)
      })
  }, [userId, isDemo])

  // ── CRUD ────────────────────────────────────────────────────────────────────
  const addClient = async (client) => {
    // Optimistic — id temporaire
    const tempId = `temp_${Date.now()}`
    const optimistic = { ...client, id: tempId, cni: client.cni ?? false, cniFile: client.cniFile ?? null }
    setClients(prev => [optimistic, ...prev])

    if (!isDemo && userId) {
      const { data, error } = await supabase
        .from('clients')
        .insert(clientToDb(client, userId))
        .select()
        .single()

      if (!error && data) {
        // Remplace l'id temporaire par le vrai UUID Supabase
        setClients(prev => prev.map(c => c.id === tempId ? { ...optimistic, id: data.id } : c))
        return { ...optimistic, id: data.id }
      } else {
        console.error('Client insert error:', error?.message)
      }
    }
    return optimistic
  }

  const updateClient = async (id, data) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...data } : c))

    if (!isDemo && userId) {
      const { error } = await supabase
        .from('clients')
        .update(clientToDb(data))
        .eq('id', id)
        .eq('user_id', userId)
      if (error) console.error('Client update error:', error.message)
    }
  }

  const deleteClient = async (id) => {
    setClients(prev => prev.filter(c => c.id !== id))

    if (!isDemo && userId) {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)
      if (error) console.error('Client delete error:', error.message)
    }
  }

  return (
    <ClientsContext.Provider value={{ clients, addClient, updateClient, deleteClient, loading }}>
      {children}
    </ClientsContext.Provider>
  )
}

export function useClients() {
  return useContext(ClientsContext)
}
