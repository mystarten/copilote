import React from 'react'
import Navbar from './Navbar'

export default function Layout({ children, user, onLogout }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} onLogout={onLogout} />
      <main className="pt-16">
        {children}
      </main>
    </div>
  )
}
