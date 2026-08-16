'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value
    const confirm = (form.elements.namedItem('password_confirm') as HTMLInputElement).value

    if (password !== confirm) {
      setError('Şifreler eşleşmiyor.')
      setLoading(false)
      return
    }

    const supabase = createClient()

    // emailRedirectTo ve options.emailConfirm kapatılarak direkt kayıt
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // E-posta doğrulamasını atla — otomatik giriş
        emailRedirectTo: undefined,
        data: {
          full_name: (form.elements.namedItem('full_name') as HTMLInputElement).value,
          phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
        },
      },
    })

    if (signUpError) {
      setError(signUpError.message === 'User already registered'
        ? 'Bu e-posta adresi zaten kayıtlı.'
        : signUpError.message)
      setLoading(false)
      return
    }

    // Kayıt sonrası direkt giriş yap
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError) {
      // Giriş yapılamazsa yine de ana sayfaya yönlendir
      router.push('/')
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
            Hesap Oluştur
          </h1>
          <p className="text-body-md text-secondary">
            Ücretsiz hesap oluşturun ve kolayca alışveriş yapın.
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
            <label htmlFor="full_name" className="block text-label-md text-on-surface mb-1.5">
              Ad Soyad
            </label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              autoComplete="name"
              required
              placeholder="Adınız Soyadınız"
              className="input-field"
            />
          </div>

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
            <label htmlFor="phone" className="block text-label-md text-on-surface mb-1.5">
              Telefon Numarası
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="0 (5XX) XXX XX XX"
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-label-md text-on-surface mb-1.5">
              Şifre
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              placeholder="En az 8 karakter"
              minLength={8}
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="password_confirm" className="block text-label-md text-on-surface mb-1.5">
              Şifre Tekrar
            </label>
            <input
              id="password_confirm"
              name="password_confirm"
              type="password"
              autoComplete="new-password"
              required
              placeholder="Şifrenizi tekrar girin"
              className="input-field"
            />
          </div>

          <label className="flex items-start gap-2 text-sm text-secondary cursor-pointer">
            <input
              type="checkbox"
              required
              className="w-4 h-4 mt-0.5 border-surface-container text-primary focus:ring-primary flex-shrink-0"
            />
            <span>
              <Link href="/mesafeli-satis-sozlesmesi" className="text-primary hover:underline" target="_blank">
                Kullanım Koşulları
              </Link>
              {' '}ve{' '}
              <Link href="/gizlilik-politikasi" className="text-primary hover:underline" target="_blank">
                KVKK
              </Link>
              {' '}metnini okudum ve kabul ediyorum.
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center mt-2 disabled:opacity-60"
            id="register-submit-btn"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Hesap Oluşturuluyor...</>
            ) : (
              'Hesap Oluştur'
            )}
          </button>
        </form>

        <p className="text-center text-sm text-secondary mt-6">
          Zaten hesabınız var mı?{' '}
          <Link href="/hesap/giris" className="text-primary hover:underline font-medium">
            Giriş yapın
          </Link>
        </p>
      </div>
    </div>
  )
}
