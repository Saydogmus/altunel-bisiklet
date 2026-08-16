'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { Loader2, CheckCircle2, User as UserIcon } from 'lucide-react'

export default function HesabimPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Form State
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push('/hesap/giris')
        return
      }

      const u = session.user
      setUser(u)
      setFullName(u.user_metadata?.full_name || '')
      setPhone(u.user_metadata?.phone || '')
      setAddress(u.user_metadata?.address || '')
      setLoading(false)
    }

    fetchUser()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess(false)

    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        full_name: fullName,
        phone: phone,
        address: address
      }
    })

    if (updateError) {
      setError('Bilgiler güncellenirken bir hata oluştu: ' + updateError.message)
    } else {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 4000)
    }
    
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="page-container py-16 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="page-container py-12 md:py-16 max-w-3xl min-h-[60vh]">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-primary flex items-center justify-center rounded-full text-white shadow-sm">
          <UserIcon className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-headline font-bold text-headline-md text-on-surface">
            Hesap Bilgileri
          </h1>
          <p className="text-sm text-secondary">
            Kişisel bilgilerinizi ve teslimat adresinizi buradan güncelleyebilirsiniz.
          </p>
        </div>
      </div>

      <div className="border border-surface-container bg-white p-6 md:p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* E-posta (Read Only) */}
          <div className="bg-surface-container-low p-4 border border-surface-container mb-6">
            <label className="block text-label-md text-on-surface mb-1.5 font-bold">
              Kayıtlı E-posta Adresi
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-3 bg-white border border-surface-container text-secondary text-sm font-medium cursor-not-allowed opacity-80"
            />
            <p className="text-xs text-secondary mt-2">
              * E-posta adresi güvenliğiniz için doğrudan değiştirilemez.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* İsim Soyisim */}
            <div>
              <label htmlFor="fullName" className="block text-label-md text-on-surface mb-1.5">
                İsim Soyisim <span className="text-red-500">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="input-field border-surface-container focus:border-primary"
                placeholder="Adınız Soyadınız"
              />
            </div>

            {/* Telefon */}
            <div>
              <label htmlFor="phone" className="block text-label-md text-on-surface mb-1.5">
                Telefon Numarası
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field border-surface-container focus:border-primary"
                placeholder="0 (5XX) XXX XX XX"
              />
            </div>
          </div>

          {/* Adres */}
          <div className="pt-2">
            <label htmlFor="address" className="block text-label-md text-on-surface mb-1.5">
              Açık Adres (Teslimat için)
            </label>
            <textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={4}
              className="input-field resize-none border-surface-container focus:border-primary"
              placeholder="Mahalle, sokak, bina no, iç kapı no, ilçe/il..."
            />
            <p className="text-xs text-secondary mt-1.5">
              Siparişlerinizin daha hızlı ulaşması için adresinizi eksiksiz girin.
            </p>
          </div>

          {/* Aksiyon */}
          <div className="pt-6 border-t border-surface-container flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
            <div className="w-full sm:w-auto h-8 flex items-center">
              {error && <p className="text-sm font-medium text-red-600">{error}</p>}
              {success && (
                <p className="text-sm font-bold text-green-600 flex items-center gap-1.5 bg-green-50 px-3 py-1.5 border border-green-200">
                  <CheckCircle2 className="w-4 h-4" />
                  Bilgileriniz başarıyla kaydedildi!
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary w-full sm:w-auto min-w-[160px] justify-center"
            >
              {saving ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Kaydediliyor...</>
              ) : (
                'Bilgileri Kaydet'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
