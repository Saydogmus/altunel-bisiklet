import Link from 'next/link'
import { XCircle, Home, ShoppingCart } from 'lucide-react'

export default function OdemeIptalPage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="card p-10">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-3">Ödeme İptal Edildi</h1>
          <p className="text-neutral-500 mb-8 text-sm">
            Ödeme işlemi iptal edildi. Sepetinizdeki ürünler korunmaktadır.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/sepet" className="btn-primary" id="back-to-cart-btn">
              <ShoppingCart className="w-4 h-4" />
              Sepete Dön
            </Link>
            <Link href="/" className="btn-ghost justify-center" id="cancel-back-home-btn">
              <Home className="w-4 h-4" />
              Ana Sayfa
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
