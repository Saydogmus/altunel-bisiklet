'use client'

import { Suspense, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Home, ArrowRight, Loader2 } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order')
  const { clearCart } = useCartStore()

  // Sepeti temizle (iyzico callback'ten dönüş)
  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <div className="page-container py-16 flex justify-center min-h-[60vh]">
      <div className="w-full max-w-md text-center">
        <div className="w-20 h-20 bg-green-50 border-2 border-green-200 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        <h1 className="font-headline font-bold text-headline-md md:text-headline-lg text-on-surface mb-3">
          Ödemeniz Alındı!
        </h1>
        <p className="text-body-md text-secondary mb-6">
          Teşekkürler! Ödemeniz başarıyla tamamlandı ve siparişiniz hazırlanmaya başlandı. Sipariş durumunuzu e-posta ile bilgilendireceğiz.
        </p>

        <div className="border border-surface-container bg-surface-container-low p-5 mb-8 text-left space-y-3">
          {orderId && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-secondary">Sipariş No</span>
              <span className="font-bold text-on-surface text-xs">{orderId.substring(0, 8).toUpperCase()}</span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-sm text-secondary">Ödeme Durumu</span>
            <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1">
              Ödendi ✓
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-secondary">Sipariş Durumu</span>
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1">
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

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="page-container py-16 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  )
}
