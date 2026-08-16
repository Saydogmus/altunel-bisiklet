'use client'

import { useState } from 'react'
import { Lock, Eye, EyeOff, ShieldAlert } from 'lucide-react'

const ADMIN_PASSWORD = 'altunel123'

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [input, setInput] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [error, setError] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [shake, setShake] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (input === ADMIN_PASSWORD) {
      setUnlocked(true)
      setError(false)
    } else {
      setError(true)
      setShake(true)
      setInput('')
      setTimeout(() => setShake(false), 600)
    }
  }

  if (unlocked) return <>{children}</>

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-headline font-bold text-xl text-on-surface tracking-tight">
            ALTUNEL BİSİKLET
          </h1>
          <p className="text-sm text-secondary mt-1">Yönetim Paneli</p>
        </div>

        {/* Kart */}
        <div
          className={`border border-surface-container bg-white p-8 transition-transform ${
            shake ? 'animate-[shake_0.5s_ease-in-out]' : ''
          }`}
          style={shake ? { animation: 'shake 0.5s ease-in-out' } : {}}
        >
          <div className="flex items-center gap-2 mb-6">
            <ShieldAlert className="w-4 h-4 text-secondary" />
            <p className="text-sm text-secondary">Devam etmek için şifrenizi girin</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="admin-password" className="block text-sm font-semibold text-on-surface mb-1.5">
                Şifre
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPw ? 'text' : 'password'}
                  value={input}
                  onChange={e => { setInput(e.target.value); setError(false) }}
                  autoFocus
                  placeholder="••••••••"
                  className={`input-field pr-10 ${error ? 'border-red-400 bg-red-50' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-on-surface"
                  tabIndex={-1}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {error && (
                <p className="text-xs text-red-600 mt-1.5 font-medium">Yanlış şifre. Tekrar deneyin.</p>
              )}
            </div>

            <button
              type="submit"
              className="btn-primary w-full justify-center"
              id="admin-login-btn"
            >
              Giriş Yap
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-secondary mt-6">
          Yetkisiz erişim yasaktır.
        </p>
      </div>

      {/* Shake animasyonu */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-8px); }
          30% { transform: translateX(8px); }
          45% { transform: translateX(-6px); }
          60% { transform: translateX(6px); }
          75% { transform: translateX(-3px); }
          90% { transform: translateX(3px); }
        }
      `}</style>
    </div>
  )
}
