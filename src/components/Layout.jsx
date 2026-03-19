import React from 'react'
import Navbar from './Navbar'

export default function Layout({ children, user, onLogout }) {
  return (
    <div className="min-h-screen" style={{ background: '#dce4e8' }}>
      <Navbar user={user} onLogout={onLogout} />
      <main className="pt-[70px]">
        {children}
      </main>
    </div>
  )
}
