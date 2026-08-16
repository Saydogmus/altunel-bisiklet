import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Kayıt Ol',
  description: 'Altunel Bisiklet\'e üye olun.',
}

export default function RegisterPage() {
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

        {/* Form */}
        <form className="space-y-4" action="#" method="POST">
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
            <input type="checkbox" required className="w-4 h-4 mt-0.5 border-surface-container text-primary focus:ring-primary flex-shrink-0" />
            <span>
              <Link href="#" className="text-primary hover:underline">Kullanım Koşulları</Link>
              {' '}ve{' '}
              <Link href="#" className="text-primary hover:underline">KVKK</Link>
              {' '}metnini okudum ve kabul ediyorum.
            </span>
          </label>

          <button
            type="submit"
            className="btn-primary w-full justify-center mt-2"
            id="register-submit-btn"
          >
            Hesap Oluştur
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
