import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { mockVehicles } from '../data/mockData'

const VehiclesContext = createContext(null)

// ── Conversions DB ↔ app ──────────────────────────────────────────────────────
function dbToVehicle(row) {
  return {
    id:        row.id,
    marque:    row.marque    || '',
    modele:    row.modele    || '',
    annee:     row.annee     || null,
    km:        row.km        || 0,
    carburant: row.carburant || 'Essence',
    plaque:    row.plaque    || '',
    vin:       row.vin       || '',
    statut:    row.statut    || 'En stock',
    prixAchat: row.prix_achat ?? null,
  }
}

function vehicleToDb(vehicle, userId) {
  const row = {
    marque:     vehicle.marque    || '',
    modele:     vehicle.modele    || '',
    annee:      vehicle.annee     || null,
    km:         vehicle.km        || 0,
    carburant:  vehicle.carburant || 'Essence',
    plaque:     vehicle.plaque    || '',
    vin:        vehicle.vin       || '',
    statut:     vehicle.statut    || 'En stock',
    prix_achat: vehicle.prixAchat || null,
  }
  if (userId) row.user_id = userId
  return row
}

export function VehiclesProvider({ children, userId, isDemo = false }) {
  const [vehicles, setVehicles] = useState(isDemo ? mockVehicles : [])
  const [loading, setLoading]   = useState(!isDemo && !!userId)

  // ── Chargement initial ──────────────────────────────────────────────────────
  useEffect(() => {
    if (isDemo || !userId) { setLoading(false); return }

    supabase
      .from('vehicles')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setVehicles(data.map(dbToVehicle))
        else if (error) console.error('Vehicles load error:', error.message)
        setLoading(false)
      })
  }, [userId, isDemo])

  // ── CRUD ────────────────────────────────────────────────────────────────────
  const addVehicle = async (vehicle) => {
    const tempId = `temp_${Date.now()}`
    const optimistic = { ...vehicle, id: tempId, statut: vehicle.statut || 'En stock' }
    setVehicles(prev => [optimistic, ...prev])

    if (!isDemo && userId) {
      const { data, error } = await supabase
        .from('vehicles')
        .insert(vehicleToDb(vehicle, userId))
        .select()
        .single()

      if (!error && data) {
        setVehicles(prev => prev.map(v => v.id === tempId ? { ...optimistic, id: data.id } : v))
        return { ...optimistic, id: data.id }
      } else {
        console.error('Vehicle insert error:', error?.message)
      }
    }
    return optimistic
  }

  const updateVehicle = async (id, data) => {
    setVehicles(prev => prev.map(v => v.id === id ? { ...v, ...data } : v))

    if (!isDemo && userId) {
      const { error } = await supabase
        .from('vehicles')
        .update(vehicleToDb(data))
        .eq('id', id)
        .eq('user_id', userId)
      if (error) console.error('Vehicle update error:', error.message)
    }
  }

  const deleteVehicle = async (id) => {
    setVehicles(prev => prev.filter(v => v.id !== id))

    if (!isDemo && userId) {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)
      if (error) console.error('Vehicle delete error:', error.message)
    }
  }

  return (
    <VehiclesContext.Provider value={{ vehicles, addVehicle, updateVehicle, deleteVehicle, loading }}>
      {children}
    </VehiclesContext.Provider>
  )
}

export function useVehicles() {
  return useContext(VehiclesContext)
}
