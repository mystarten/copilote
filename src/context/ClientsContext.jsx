import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase, uploadFile } from '../lib/supabase'
import { initialClients } from '../data/mockData'

// ── Convertit un base64 dataUrl en File uploadable ────────────────────────────
function dataUrlToFile(dataUrl, filename = 'cni') {
  const [header, base64] = dataUrl.split(',')
  const mime = (header.match(/:(.*?);/) || [])[1] || 'application/octet-stream'
  const ext  = mime.split('/')[1]?.replace('jpeg', 'jpg') || 'jpg'
  const bytes = atob(base64)
  const arr = new Uint8Array(bytes.length)
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i)
  return new File([arr], `${filename}.${ext}`, { type: mime })
}

// ── Upload le CNI si c'est un base64 (pas encore sur Storage) ─────────────────
async function uploadCniIfNeeded(cniFile, userId) {
  if (!cniFile?.dataUrl) return null
  if (cniFile.dataUrl.startsWith('http')) return cniFile.dataUrl   // déjà uploadé
  if (!cniFile.dataUrl.startsWith('data:')) return null             // format inconnu
  try {
    const file = dataUrlToFile(cniFile.dataUrl, `cni_${Date.now()}`)
    const url  = await uploadFile(userId, `cni/cni_${Date.now()}`, file)
    return url
  } catch (e) {
    console.error('CNI upload error:', e)
    return null
  }
}

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
      // Upload CNI si base64
      const cniUrl = await uploadCniIfNeeded(client.cniFile, userId)
      const clientWithUrl = cniUrl
        ? { ...client, cni: true, cniFile: { name: client.cniFile?.name || 'CNI', dataUrl: cniUrl, type: 'url' } }
        : client

      const { data, error } = await supabase
        .from('clients')
        .insert(clientToDb(clientWithUrl, userId))
        .select()
        .single()

      if (!error && data) {
        // Remplace l'id temporaire par le vrai UUID Supabase + CNI URL
        const final = { ...optimistic, id: data.id, ...(cniUrl ? { cni: true, cniFile: clientWithUrl.cniFile } : {}) }
        setClients(prev => prev.map(c => c.id === tempId ? final : c))
        return final
      } else {
        console.error('Client insert error:', error?.message)
      }
    }
    return optimistic
  }

  const updateClient = async (id, data) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...data } : c))

    if (!isDemo && userId) {
      // Upload CNI si base64
      const cniUrl = await uploadCniIfNeeded(data.cniFile, userId)
      const dataWithUrl = cniUrl
        ? { ...data, cni: true, cniFile: { name: data.cniFile?.name || 'CNI', dataUrl: cniUrl, type: 'url' } }
        : data
      if (cniUrl) setClients(prev => prev.map(c => c.id === id ? { ...c, ...dataWithUrl } : c))

      const { error } = await supabase
        .from('clients')
        .update(clientToDb(dataWithUrl))
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
