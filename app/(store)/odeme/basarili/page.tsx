import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, Package, Home, ArrowRight } from 'lucide-react'

export const metadata: Metadata = { title: 'Siparişiniz Alındı' }

export default function OrderSuccessPage() {
  const orderNumber = `ALT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

  return (
    <div className="page-container py-16 flex justify-center">
      <div className="w-full max-w-md text-center">
        <div className="w-20 h-20 bg-green-50 border-2 border-green-200 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        <h1 className="font-headline font-bold text-headline-md md:text-headline-lg text-on-surface mb-3">
          Siparişiniz Alındı!
        </h1>
        <p className="text-body-md text-secondary mb-6">
          Teşekkürler! Siparişiniz başarıyla oluşturuldu. Sipariş durumunuzu e-posta ile bilgilendireceğiz.
        </p>

        <div className="border border-surface-container bg-surface-container-low p-5 mb-8 text-left space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-secondary">Sipariş No</span>
            <span className="font-bold text-on-surface">{orderNumber}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-secondary">Durum</span>
            <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2.5 py-1">
              Hazırlanıyor
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-secondary">Tahmini Teslimat</span>
            <span className="text-sm font-medium text-on-surface">2-4 İş Günü</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Link href="/" className="btn-primary justify-center" id="order-success-home-btn">
            <Home className="w-4 h-4" />
            Ana Sayfaya Dön
          </Link>
          <Link href="/urunler" className="btn-outline justify-center">
            Alışverişe Devam Et
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
