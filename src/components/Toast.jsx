import React, { createContext, useContext, useState } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = (msg, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, msg, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[999] flex flex-col gap-2">
        {toasts.map(t => (
          <div key={t.id}
            className="px-5 py-3.5 rounded-xl shadow-2xl text-sm font-semibold flex items-center gap-2 toast-enter text-white"
            style={t.type === 'error'
              ? { background: '#ef4444' }
              : { background: 'linear-gradient(135deg,#2563EB,#1D4ED8)' }
            }>
            {t.type === 'error'
              ? <XCircle size={15} />
              : <CheckCircle size={15} />
            }
            {t.msg}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
