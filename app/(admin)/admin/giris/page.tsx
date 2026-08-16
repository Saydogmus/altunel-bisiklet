'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Bike, Lock, ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AdminGirisPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Supabase Auth + rol kontrolü
      // const supabase = createClient()
      // const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })
      // if (authError) throw authError
      // const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()
      // if (profile?.role !== 'admin') throw new Error('Yetkisiz erişim')
      // router.push('/admin')

      // Demo mode
      await new Promise((r) => setTimeout(r, 1200))
      if (email === 'admin@altunelbisiklet.com' && password === 'admin123') {
        router.push('/admin')
      } else {
        setError('Hatalı e-posta veya şifre. Demo: admin@altunelbisiklet.com / admin123')
      }
    } catch {
      setError('Giriş başarısız. Yetkili bir hesap kullanın.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '32px 32px' }}
      />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 group mb-4">
            <div className="w-12 h-12 bg-accent-500 rounded-2xl flex items-center justify-center">
              <Bike className="w-6 h-6 text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-black text-white">Admin Paneli</h1>
          <p className="text-neutral-400 text-sm mt-1">Altunel Bisiklet Yönetimi</p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <ShieldCheck className="w-4 h-4 text-accent-400" />
            <p className="text-xs text-neutral-400 font-medium">Güvenli Admin Girişi</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1.5">E-posta</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@altunelbisiklet.com"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                id="admin-email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1.5">Şifre</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                  id="admin-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-accent-500 text-white font-semibold rounded-xl hover:bg-accent-600 transition-colors disabled:opacity-50 mt-2"
              id="admin-login-btn"
            >
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Giriş Yapılıyor...
                </span>
              ) : (
                'Admin Girişi'
              )}
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-6 p-3 bg-white/5 rounded-xl">
            <p className="text-xs text-neutral-500 text-center">
              Demo: <span className="text-neutral-400 font-mono">admin@altunelbisiklet.com</span> / <span className="text-neutral-400 font-mono">admin123</span>
            </p>
          </div>
        </div>

        <p className="text-center mt-4">
          <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors">
            ← Mağazaya Dön
          </Link>
        </p>
      </div>
    </div>
  )
}
