import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import NewSale from './pages/NewSale'
import LivreDePolice from './pages/LivreDePolice'
import Clients from './pages/Clients'
import Login from './pages/Login'
import { ToastProvider } from './components/Toast'
import { ClientsProvider } from './context/ClientsContext'

export default function App() {
  const [user, setUser] = useState(null)

  if (!user) {
    return (
      <ToastProvider>
        <Login onLogin={setUser} />
      </ToastProvider>
    )
  }

  return (
    <ToastProvider>
      <ClientsProvider>
        <Layout user={user} onLogout={() => setUser(null)}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/nouvelle-vente" element={<NewSale />} />
            <Route path="/livre-de-police" element={<LivreDePolice />} />
          </Routes>
        </Layout>
      </ClientsProvider>
    </ToastProvider>
  )
}
