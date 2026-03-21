import React from 'react'
import Navbar from './Navbar'

export default function Layout({ children, user, onLogout }) {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', transition: 'background 0.3s ease' }}>
      <Navbar user={user} onLogout={onLogout} />
      <main className="pt-[70px]">
        {children}
      </main>
    </div>
  )
}
