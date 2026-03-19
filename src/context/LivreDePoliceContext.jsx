import React, { createContext, useContext, useState } from 'react'
import { mockLivreDePolice } from '../data/mockData'

const LivreDePoliceContext = createContext(null)

export function LivreDePoliceProvider({ children, isDemo = false }) {
  const [entries, setEntries] = useState(isDemo ? mockLivreDePolice : [])

  const addEntry = (entry) => setEntries(prev => [entry, ...prev])
  const updateEntry = (id, data) => setEntries(prev => prev.map(e => e.id === id ? { ...e, ...data } : e))

  return (
    <LivreDePoliceContext.Provider value={{ entries, addEntry, updateEntry }}>
      {children}
    </LivreDePoliceContext.Provider>
  )
}

export function useLivreDePolice() {
  return useContext(LivreDePoliceContext)
}
