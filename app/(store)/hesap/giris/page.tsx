'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPw, setShowPw] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value

    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError) {
      if (signInError.message.toLowerCase().includes('invalid')) {
        setError('E-posta veya şifre hatalı. Lütfen tekrar deneyin.')
      } else {
        setError(signInError.message)
      }
      setLoading(false)
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <div className="page-container py-16 flex justify-center">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="font-headline font-bold text-xl tracking-tighter text-on-surface">
            ALTUNEL BİSİKLET
          </Link>
          <h1 className="font-headline font-bold text-headline-lg text-on-surface mt-6 mb-2">
            Giriş Yap
          </h1>
          <p className="text-body-md text-secondary">
            Hesabınıza giriş yapın veya{' '}
            <Link href="/hesap/kayit" className="text-primary hover:underline font-medium">
              yeni hesap oluşturun
            </Link>
          </p>
        </div>

        {/* Hata */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-label-md text-on-surface mb-1.5">
              E-posta Adresi
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="ornek@eposta.com"
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-label-md text-on-surface mb-1.5">
              Şifre
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPw ? 'text' : 'password'}
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="input-field pr-10"
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
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-secondary cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 border-surface-container text-primary focus:ring-primary"
              />
              Beni hatırla
            </label>
            <Link href="#" className="text-sm text-primary hover:underline">
              Şifremi unuttum
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center mt-2 disabled:opacity-60"
            id="login-submit-btn"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Giriş Yapılıyor...</>
            ) : (
              'Giriş Yap'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-surface-container" />
          <span className="text-xs text-secondary">veya</span>
          <div className="flex-1 h-px bg-surface-container" />
        </div>

        {/* Misafir */}
        <div className="bg-surface-container-low border border-surface-container p-4 mb-6">
          <p className="text-sm text-secondary leading-relaxed">
            💡 <strong className="text-on-surface">Üye olmadan devam etmek</strong> ister misiniz?
            Sepetinize giderek misafir olarak alışveriş yapabilirsiniz.
          </p>
          <Link
            href="/sepet"
            className="block mt-3 text-sm text-primary font-semibold hover:underline"
            id="guest-checkout-link"
          >
            Misafir olarak devam et →
          </Link>
        </div>

        <p className="text-center text-sm text-secondary">
          Hesabınız yok mu?{' '}
          <Link href="/hesap/kayit" className="text-primary hover:underline font-medium">
            Hemen kayıt olun
          </Link>
        </p>
      </div>
    </div>
  )
}
