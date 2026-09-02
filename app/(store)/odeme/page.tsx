'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  ArrowRight, Lock, User, UserX, CheckCircle,
  Loader2, ShoppingCart, Bike, MapPin, Phone, Mail,
} from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

/**
 * İyzico Checkout Form HTML'ini güvenli şekilde render eden bileşen.
 * Script etiketleri dinamik olarak yeniden oluşturulup çalıştırılır.
 */
function IyzicoFormRenderer({ html }: { html: string }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el || !html) return

    // HTML'i yerleştir
    el.innerHTML = html

    // Script etiketlerini bul ve yeniden oluştur (innerHTML ile eklenen script'ler çalışmaz)
    const scripts = el.querySelectorAll('script')
    scripts.forEach((oldScript) => {
      const newScript = document.createElement('script')
      // Tüm attribute'ları kopyala
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value)
      })
      if (!oldScript.src) {
        newScript.textContent = oldScript.textContent
      }
      oldScript.parentNode?.replaceChild(newScript, oldScript)
    })
  }, [html])

  return <div ref={containerRef} id="iyzipay-checkout-form" className="w-full min-h-[400px]" />
}

const TURKEY_CITIES = [
  "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir", "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman", "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"
].sort((a, b) => a.localeCompare(b, 'tr'));

const SHIPPING_THRESHOLD = 2000
const SHIPPING_FEE = 99.90

type Step = 'identity' | 'address' | 'confirm'

interface AddressForm {
  full_name: string
  phone: string
  email: string
  address: string
  city: string
  district: string
  postal_code: string
}

export default function CheckoutPage() {
  const { items, getTotalPrice, getTotalItems, clearCart } = useCartStore()
  const [step, setStep] = useState<Step>('identity')
  const [mode, setMode] = useState<'member' | 'guest' | null>(null)
  const [guestEmail, setGuestEmail] = useState('')
  const [placing, setPlacing] = useState(false)
  const [orderError, setOrderError] = useState<string | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [iyzicoFormHtml, setIyzicoFormHtml] = useState<string | null>(null)
  const router = useRouter()

  const [address, setAddress] = useState<AddressForm>({
    full_name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    district: '',
    postal_code: '',
  })

  const subtotal = getTotalPrice()
  const shippingFee = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
  const total = subtotal + shippingFee
  const finalEmail = guestEmail || address.email

  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setAddress(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!address.district.trim()) {
      alert("Lütfen geçerli bir ilçe girin.")
      return
    }
    
    if (!/^\d{5}$/.test(address.postal_code)) {
      alert("Lütfen 5 haneli geçerli bir posta kodu girin.")
      return
    }
    
    setStep('confirm')
  }

  // İyzico Checkout Form başlat
  const handleStartPayment = async () => {
    setPlacing(true)
    setOrderError(null)
    setIyzicoFormHtml(null)

    try {
      const orderItems = items.map(item => ({
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        unit_price: item.product.price,
        category: 'Bisiklet',
      }))

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          customer_email: finalEmail,
          shipping_address: {
            full_name: address.full_name,
            phone: address.phone,
            email: finalEmail,
            address: address.address,
            city: address.city,
            district: address.district,
            postal_code: address.postal_code,
          },
          items: orderItems,
          shipping_fee: shippingFee,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Ödeme başlatılamadı.')

      // İyzico'dan dönen form HTML'ini göster (kart formu burada açılacak)
      if (data.checkoutFormContent) {
        setIyzicoFormHtml(data.checkoutFormContent)
        // NOT: clearCart() burada yapılmaz — sadece ödeme başarılı olursa (/odeme/basarili) yapılır
      } else {
        throw new Error('İyzico form içeriği alınamadı.')
      }
    } catch (err: unknown) {
      setOrderError(err instanceof Error ? err.message : 'Beklenmeyen bir hata oluştu.')
    } finally {
      setPlacing(false)
    }
  }

  // Hydration sorunu için mounted state'i
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
    
    // Auth init ve pre-fill
    const initAuth = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (session?.user) {
        setMode('member')
        setUserId(session.user.id)
        setStep('address') // Auto skip step 1
        const meta = session.user.user_metadata
        setAddress(prev => ({
          ...prev,
          full_name: meta?.full_name || '',
          phone: meta?.phone || '',
          email: session.user.email || '',
          address: meta?.address || '',
        }))
      }
      setAuthLoading(false)
    }

    initAuth()
  }, [])

  if (!mounted || authLoading) {
    return (
      <div className="page-container py-16 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="page-container py-16 flex flex-col items-center justify-center text-center min-h-[50vh]">
        <div className="w-24 h-24 bg-surface-container flex items-center justify-center mb-6">
          <ShoppingCart className="w-12 h-12 text-secondary" />
        </div>
        <h1 className="font-headline font-bold text-headline-md text-on-surface mb-3">Sepetiniz Boş</h1>
        <p className="text-secondary mb-8 max-w-sm">Ödeme yapabilmek için önce sepetinize ürün eklemeniz gerekmektedir.</p>
        <Link href="/urunler" className="btn-primary">
          Alışverişe Başla <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    )
  }

  // ── Adım göstergesi ──────────────────────────────────────────────────────
  const STEPS = [
    { id: 'identity', label: '1. Kimlik' },
    { id: 'address',  label: '2. Adres' },
    { id: 'confirm',  label: '3. Onay' },
  ]

  return (
    <div className="page-container py-10">
      <h1 className="font-headline font-bold text-headline-md md:text-headline-lg text-on-surface mb-8 border-b border-surface-container pb-4">
        Ödeme
      </h1>

      {/* Adım Çubuğu */}
      <div className="flex items-center gap-0 mb-10 border border-surface-container overflow-hidden">
        {STEPS.map(({ id, label }) => (
          <div
            key={id}
            className={`flex-1 flex items-center justify-center py-3 text-sm font-semibold border-r last:border-0 border-surface-container transition-colors ${
              step === id ? 'bg-primary text-white' : 'bg-surface-container-low text-secondary'
            }`}
          >
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* ── Sol: Form ── */}
        <div className="lg:col-span-2">

          {/* ══ ADIM 1: Kimlik ══ */}
          {step === 'identity' && (
            <div className="space-y-4">
              <h2 className="font-headline font-bold text-on-surface text-xl mb-6">
                Nasıl devam etmek istersiniz?
              </h2>

              <button
                onClick={() => { setMode('member'); setStep('address') }}
                className={`w-full p-5 border-2 text-left transition-all ${
                  mode === 'member' ? 'border-primary bg-red-50' : 'border-surface-container hover:border-secondary'
                }`}
                id="checkout-member-btn"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-headline font-bold text-on-surface">Üye Girişi ile Devam Et</p>
                    <p className="text-sm text-secondary mt-0.5">Siparişlerinizi takip edin, hızlı ödeme yapın.</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-secondary ml-auto flex-shrink-0" />
                </div>
              </button>

              <div className="border-2 border-surface-container">
                <button
                  onClick={() => setMode(mode === 'guest' ? null : 'guest')}
                  className="w-full p-5 text-left"
                  id="checkout-guest-btn"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-surface-container flex items-center justify-center flex-shrink-0">
                      <UserX className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="font-headline font-bold text-on-surface">Üye Olmadan Devam Et</p>
                      <p className="text-sm text-secondary mt-0.5">Sadece e-posta adresiniz yeterli.</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-secondary ml-auto flex-shrink-0" />
                  </div>
                </button>
                {mode === 'guest' && (
                  <div className="px-5 pb-5 border-t border-surface-container">
                    <label htmlFor="guest_email" className="block text-sm font-semibold text-on-surface mb-2 mt-4">
                      E-posta Adresi <span className="text-primary">*</span>
                    </label>
                    <input
                      id="guest_email"
                      type="email"
                      value={guestEmail}
                      onChange={e => setGuestEmail(e.target.value)}
                      placeholder="ornek@eposta.com"
                      className="input-field mb-4"
                    />
                    <button
                      onClick={() => setStep('address')}
                      disabled={!guestEmail}
                      className="btn-primary w-full justify-center disabled:opacity-60"
                    >
                      Devam Et <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══ ADIM 2: Adres ══ */}
          {step === 'address' && (
            <div>
              <h2 className="font-headline font-bold text-on-surface text-xl mb-6">Teslimat Adresi</h2>
              <form
                className="space-y-4"
                onSubmit={handleAddressSubmit}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="full_name" className="block text-sm font-semibold text-on-surface mb-1.5">
                      Ad Soyad <span className="text-primary">*</span>
                    </label>
                    <input id="full_name" name="full_name" type="text" required
                      value={address.full_name} onChange={handleAddressChange}
                      className="input-field" placeholder="Adınız Soyadınız" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-on-surface mb-1.5">
                      Telefon <span className="text-primary">*</span>
                    </label>
                    <input id="phone" name="phone" type="tel" required
                      value={address.phone} onChange={handleAddressChange}
                      className="input-field" placeholder="0 (5XX) XXX XX XX" />
                  </div>
                </div>

                {!guestEmail && (
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-on-surface mb-1.5">
                      E-posta <span className="text-primary">*</span>
                    </label>
                    <input id="email" name="email" type="email" required
                      value={address.email} onChange={handleAddressChange}
                      className="input-field" placeholder="ornek@eposta.com" />
                  </div>
                )}

                <div>
                  <label htmlFor="address" className="block text-sm font-semibold text-on-surface mb-1.5">
                    Adres <span className="text-primary">*</span>
                  </label>
                  <textarea id="address" name="address" required rows={3}
                    value={address.address} onChange={handleAddressChange}
                    className="input-field resize-none"
                    placeholder="Mahalle, Cadde, Sokak, Bina No, Daire No" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-semibold text-on-surface mb-1.5">İl <span className="text-primary">*</span></label>
                    <select 
                      id="city" 
                      name="city" 
                      required 
                      value={address.city}
                      onChange={handleAddressChange} 
                      className="input-field appearance-none bg-white"
                    >
                      <option value="" disabled>İl Seçiniz</option>
                      {TURKEY_CITIES.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="district" className="block text-sm font-semibold text-on-surface mb-1.5">İlçe <span className="text-primary">*</span></label>
                    <input id="district" name="district" type="text" required value={address.district}
                      onChange={handleAddressChange} className="input-field" placeholder="Kadıköy" />
                  </div>
                  <div>
                    <label htmlFor="postal_code" className="block text-sm font-semibold text-on-surface mb-1.5">Posta Kodu <span className="text-primary">*</span></label>
                    <input id="postal_code" name="postal_code" type="text" required value={address.postal_code}
                      onChange={handleAddressChange} className="input-field" placeholder="34710" maxLength={5} />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setStep('identity')} className="btn-outline">Geri</button>
                  <button type="submit" className="btn-primary flex-1 justify-center" id="address-next-btn">
                    Devam Et <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ══ ADIM 3: Onay ══ */}
          {step === 'confirm' && (
            <div className="space-y-5">
              <h2 className="font-headline font-bold text-on-surface text-xl">Siparişi Onayla</h2>

              {/* Teslimat özeti */}
              <div className="border border-surface-container bg-white">
                <div className="px-5 py-3 border-b border-surface-container bg-surface-container-low">
                  <p className="text-sm font-bold text-on-surface">Teslimat Bilgileri</p>
                </div>
                <div className="px-5 py-4 space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <User className="w-4 h-4 text-secondary flex-shrink-0" />
                    <span className="font-medium text-on-surface">{address.full_name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-secondary flex-shrink-0" />
                    <span className="text-on-surface">{address.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-secondary flex-shrink-0" />
                    <span className="text-on-surface">{finalEmail}</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-on-surface">
                      {address.address}<br />
                      {address.district} / {address.city} {address.postal_code}
                    </span>
                  </div>
                </div>
                <div className="px-5 pb-4">
                  <button
                    type="button"
                    onClick={() => setStep('address')}
                    className="text-xs text-primary hover:underline font-medium"
                  >
                    Adresi Değiştir
                  </button>
                </div>
              </div>

              {/* İyzico Ödeme Formu */}
              {iyzicoFormHtml ? (
                <div className="border border-surface-container bg-white p-5">
                  <p className="text-sm font-bold text-on-surface mb-3">💳 Kart Bilgilerinizi Girin</p>
                  <IyzicoFormRenderer html={iyzicoFormHtml} />
                </div>
              ) : (
                <>
                  {/* Ödeme yöntemi bilgisi */}
                  <div className="border border-surface-container bg-white p-5">
                    <p className="text-sm font-bold text-on-surface mb-3">Ödeme Yöntemi</p>
                    <div className="flex items-center gap-3 p-4 border-2 border-primary bg-red-50">
                      <div className="w-9 h-9 bg-primary flex items-center justify-center flex-shrink-0">
                        <Lock className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-on-surface">Kredi / Banka Kartı ile Öde</p>
                        <p className="text-xs text-secondary mt-0.5">İyzico güvencesiyle güvenli ödeme yapın.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-surface-container-low border border-surface-container">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M2 6l8 6-8 6V6z" fill="url(#iz1)" /><defs><linearGradient id="iz1" x1="2" y1="6" x2="2" y2="18"><stop stopColor="#7DB9FF" /><stop offset="1" stopColor="#3A56FF" /></linearGradient></defs></svg>
                        <span className="text-[11px] font-bold text-[#3A56FF]">iyzico</span>
                      </div>
                      <span className="text-[11px] text-secondary">ile güvenli ödeme</span>
                    </div>
                  </div>

                  {/* Hata */}
                  {orderError && (
                    <div className="p-4 bg-red-50 border border-red-200 text-primary text-sm font-medium">
                      {orderError}
                    </div>
                  )}

                  {/* Zorunlu Sözleşme Onayı */}
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      id="contract-agreement"
                      required
                      className="w-4 h-4 mt-0.5 accent-primary flex-shrink-0 cursor-pointer"
                      onChange={e => {
                        const btn = document.getElementById('place-order-btn') as HTMLButtonElement | null
                        if (btn) btn.disabled = !e.target.checked || placing
                      }}
                    />
                    <span className="text-sm text-secondary leading-relaxed">
                      <a
                        href="/mesafeli-satis-sozlesmesi"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary font-semibold hover:underline"
                        onClick={e => e.stopPropagation()}
                      >
                        Mesafeli Satış Sözleşmesi
                      </a>
                      &apos;ni ve{' '}
                      <a
                        href="/mesafeli-satis-sozlesmesi"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary font-semibold hover:underline"
                        onClick={e => e.stopPropagation()}
                      >
                        Ön Bilgilendirme Formu
                      </a>
                      &apos;nu okudum ve onaylıyorum.{' '}
                      <span className="text-primary font-semibold">*</span>
                    </span>
                  </label>

                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep('address')} className="btn-outline">Geri</button>
                    <button
                      onClick={handleStartPayment}
                      disabled={placing}
                      className="btn-primary flex-1 justify-center disabled:opacity-60"
                      id="place-order-btn"
                    >
                      {placing ? (
                        <><Loader2 className="w-4 h-4 animate-spin" />Ödeme Hazırlanıyor...</>
                      ) : (
                        <><Lock className="w-4 h-4" />Ödemeye Geç — {formatPrice(total)}</>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* ── Sağ: Sipariş Özeti ── */}
        <div className="lg:col-span-1">
          <div className="border border-surface-container bg-white sticky top-24">
            <div className="px-5 py-4 border-b border-surface-container">
              <h3 className="font-headline font-bold text-on-surface">
                Sipariş Özeti ({getTotalItems()} ürün)
              </h3>
            </div>

            <div className="px-5 py-4 space-y-3 max-h-80 overflow-y-auto divide-y divide-surface-container">
              {items.map(item => (
                <div
                  key={`${item.product.id}-${item.selectedFrameSize}-${item.selectedColor}`}
                  className="flex items-center gap-3 pt-3 first:pt-0"
                >
                  <div className="w-12 h-12 bg-surface-container-low border border-surface-container flex-shrink-0 overflow-hidden">
                    {item.product.images?.[0] ? (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-contain p-0.5"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Bike className="w-5 h-5 text-secondary opacity-40" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-on-surface leading-snug truncate">{item.product.name}</p>
                    {item.selectedFrameSize && (
                      <p className="text-xs text-secondary">{item.selectedFrameSize}</p>
                    )}
                    <p className="text-xs text-secondary">x{item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold text-on-surface flex-shrink-0">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="px-5 py-4 border-t border-surface-container space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Ara Toplam</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Kargo</span>
                <span className={shippingFee === 0 ? 'text-green-600 font-semibold' : 'font-medium'}>
                  {shippingFee === 0 ? 'ÜCRETSİZ' : formatPrice(shippingFee)}
                </span>
              </div>
              {subtotal < SHIPPING_THRESHOLD && (
                <p className="text-xs text-secondary bg-surface-container-low px-3 py-2">
                  💡 {formatPrice(SHIPPING_THRESHOLD - subtotal)} daha ekle, kargo bedava!
                </p>
              )}
              <div className="flex justify-between font-bold text-base pt-2 border-t border-surface-container">
                <span>Toplam</span>
                <span className="text-primary">{formatPrice(total)}</span>
              </div>
            </div>

            <div className="px-5 pb-5 flex items-center justify-center gap-1.5 text-xs text-secondary">
              <Lock className="w-3 h-3" />
              Güvenli & Şifreli Bağlantı
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
