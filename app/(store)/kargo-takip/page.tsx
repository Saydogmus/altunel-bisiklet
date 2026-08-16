'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Package, ChevronRight, Loader2, CheckCircle, Truck, MapPin, Clock } from 'lucide-react'

const STATUS_STEPS = [
  { key: 'paid', label: 'Sipariş Onaylandı', icon: CheckCircle },
  { key: 'processing', label: 'Hazırlanıyor', icon: Package },
  { key: 'shipped', label: 'Kargoya Verildi', icon: Truck },
  { key: 'delivered', label: 'Teslim Edildi', icon: MapPin },
]

export default function KargoTakipPage() {
  const [orderNo, setOrderNo] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<null | { found: boolean; status?: string; name?: string }>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderNo.trim()) return
    setLoading(true)
    setResult(null)

    // API'den sipariş ara
    try {
      const res = await fetch(`/api/orders`)
      const orders = await res.json()
      const found = Array.isArray(orders)
        ? orders.find((o: { id: string; status: string; shipping_address?: { full_name?: string } }) =>
            o.id.startsWith(orderNo.trim().toLowerCase()) ||
            o.id.toLowerCase() === orderNo.trim().toLowerCase()
          )
        : null

      if (found) {
        setResult({ found: true, status: found.status, name: found.shipping_address?.full_name })
      } else {
        setResult({ found: false })
      }
    } catch {
      setResult({ found: false })
    } finally {
      setLoading(false)
    }
  }

  const activeStep = result?.status
    ? STATUS_STEPS.findIndex((s) => s.key === result.status)
    : -1

  return (
    <div className="page-container py-12 md:py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-secondary mb-10">
        <Link href="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-on-surface font-medium">Kargo Takip</span>
      </nav>

      {/* Başlık */}
      <div className="mb-12 pb-6 border-b border-surface-container">
        <h1 className="font-headline font-bold text-headline-md md:text-headline-lg text-on-surface mb-3">
          Kargo Takip
        </h1>
        <p className="text-body-md text-secondary max-w-xl">
          Sipariş numaranızı girerek siparişinizin güncel durumunu öğrenin.
        </p>
      </div>

      <div className="max-w-2xl">
        {/* Arama Formu */}
        <form onSubmit={handleSearch} className="mb-8">
          <label htmlFor="order_no" className="block text-label-md text-on-surface mb-2">
            Sipariş Numarası
          </label>
          <div className="flex gap-3">
            <div className="flex-1 flex items-center border border-surface-container bg-white px-4 gap-3 focus-within:border-primary transition-colors">
              <Search className="w-4 h-4 text-secondary flex-shrink-0" />
              <input
                id="order_no"
                type="text"
                value={orderNo}
                onChange={(e) => setOrderNo(e.target.value)}
                placeholder="Örn: 3fa85f64..."
                className="flex-1 py-3 text-sm text-on-surface placeholder-secondary focus:outline-none bg-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={!orderNo.trim() || loading}
              className="btn-primary px-6 disabled:opacity-60"
              id="track-order-btn"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sorgula'}
            </button>
          </div>
          <p className="text-xs text-secondary mt-2">
            Sipariş numaranızı onay e-postasında bulabilirsiniz.
          </p>
        </form>

        {/* Sonuç */}
        {result && (
          <div className="border border-surface-container bg-white p-6">
            {!result.found ? (
              <div className="text-center py-8">
                <Package className="w-10 h-10 text-secondary mx-auto mb-3" />
                <p className="font-semibold text-on-surface mb-1">Sipariş Bulunamadı</p>
                <p className="text-sm text-secondary">
                  Bu numarayla kayıtlı bir sipariş bulunamadı. Lütfen tekrar kontrol edin.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-surface-container">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-1">Sipariş No</p>
                    <p className="font-mono font-bold text-on-surface">{orderNo.toUpperCase()}</p>
                  </div>
                  {result.name && (
                    <div className="text-right">
                      <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-1">Alıcı</p>
                      <p className="font-semibold text-on-surface">{result.name}</p>
                    </div>
                  )}
                </div>

                {/* Durum Adımları */}
                <div className="relative">
                  {/* Connecting line */}
                  <div className="absolute left-4 top-4 bottom-4 w-px bg-surface-container" />
                  <div className="space-y-6">
                    {STATUS_STEPS.map((step, idx) => {
                      const Icon = step.icon
                      const isPast = idx <= activeStep
                      const isCurrent = idx === activeStep
                      return (
                        <div key={step.key} className="flex items-center gap-4 relative">
                          <div className={`w-8 h-8 flex items-center justify-center flex-shrink-0 z-10 border-2 transition-colors ${
                            isCurrent
                              ? 'bg-primary border-primary'
                              : isPast
                              ? 'bg-green-100 border-green-400'
                              : 'bg-white border-surface-container'
                          }`}>
                            <Icon className={`w-3.5 h-3.5 ${
                              isCurrent ? 'text-white'
                              : isPast ? 'text-green-600'
                              : 'text-secondary'
                            }`} />
                          </div>
                          <div>
                            <p className={`text-sm font-semibold ${isPast ? 'text-on-surface' : 'text-secondary'}`}>
                              {step.label}
                            </p>
                            {isCurrent && (
                              <p className="text-xs text-primary font-medium mt-0.5">
                                Güncel durum
                              </p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Yardım */}
        <div className="mt-8 p-5 bg-surface-container-low border border-surface-container flex items-start gap-4">
          <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-on-surface mb-1">Kargo hakkında sorunuz mu var?</p>
            <p className="text-sm text-secondary">
              Siparişinizle ilgili detaylı bilgi için{' '}
              <Link href="/iletisim" className="text-primary hover:underline font-medium">
                iletişim sayfamızdan
              </Link>{' '}
              bize ulaşabilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
