import React, { createContext, useContext, useState } from 'react'
import { initialClients } from '../data/mockData'

const ClientsContext = createContext(null)

export function ClientsProvider({ children, isDemo = false }) {
  const [clients, setClients] = useState(isDemo ? initialClients : [])

  const addClient = (client) => {
    const newClient = { ...client, id: Date.now(), cni: false }
    setClients(prev => [newClient, ...prev])
    return newClient
  }

  const updateClient = (id, data) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...data } : c))
  }

  const deleteClient = (id) => {
    setClients(prev => prev.filter(c => c.id !== id))
  }

  return (
    <ClientsContext.Provider value={{ clients, addClient, updateClient, deleteClient }}>
      {children}
    </ClientsContext.Provider>
  )
}

export function useClients() {
  return useContext(ClientsContext)
}
