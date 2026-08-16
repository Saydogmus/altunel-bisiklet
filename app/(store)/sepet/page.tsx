'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Minus, Plus, Trash2, ArrowRight, ShoppingCart, Lock, Bike } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'

const SHIPPING_FEE = 99.90

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCartStore()

  const subtotal = getTotalPrice()
  const total = subtotal + SHIPPING_FEE

  if (items.length === 0) {
    return (
      <div className="page-container py-16 flex flex-col items-center justify-center text-center min-h-[50vh]">
        <div className="w-24 h-24 bg-surface-container flex items-center justify-center mb-6">
          <ShoppingCart className="w-12 h-12 text-secondary" />
        </div>
        <h1 className="font-headline font-bold text-headline-md text-on-surface mb-3">
          Sepetiniz Boş
        </h1>
        <p className="text-secondary mb-8 max-w-sm">
          Sepetinizde henüz ürün bulunmuyor. Alışverişe başlamak için ürünleri keşfedin.
        </p>
        <Link href="/urunler" className="btn-primary" id="empty-cart-shop-btn">
          Alışverişe Başla
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    )
  }

  return (
    <div className="page-container py-10">
      <h1 className="font-headline font-bold text-headline-md md:text-headline-lg text-on-surface mb-8 border-b border-surface-container pb-4">
        Sepetim ({getTotalItems()} ürün)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-px">
          {items.map((item) => (
            <div
              key={`${item.product.id}-${item.selectedFrameSize}-${item.selectedColor}`}
              className="flex gap-5 p-5 bg-white border border-surface-container hover:border-secondary transition-colors"
            >
              {/* Image */}
              <Link href={`/urunler/${item.product.slug}`} className="flex-shrink-0">
                <div className="w-24 h-24 bg-surface-container-low border border-surface-container overflow-hidden">
                  {item.product.images?.[0] ? (
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-contain p-1 hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Bike className="w-8 h-8 text-secondary opacity-40" />
                    </div>
                  )}
                </div>
              </Link>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-4">
                  <div className="min-w-0">
                    {item.product.brand && (
                      <p className="text-label-md text-secondary uppercase mb-0.5">{item.product.brand}</p>
                    )}
                    <Link href={`/urunler/${item.product.slug}`}>
                      <h3 className="font-headline font-bold text-on-surface hover:text-primary transition-colors leading-snug">
                        {item.product.name}
                      </h3>
                    </Link>
                    {(item.selectedFrameSize || item.selectedColor) && (
                      <p className="text-sm text-secondary mt-1">
                        {[item.selectedFrameSize && `Kadro: ${item.selectedFrameSize}`, item.selectedColor && `Renk: ${item.selectedColor}`]
                          .filter(Boolean)
                          .join(' · ')}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id, item.selectedFrameSize, item.selectedColor)}
                    className="text-secondary hover:text-primary transition-colors p-1 flex-shrink-0"
                    aria-label="Ürünü kaldır"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
                  {/* Quantity */}
                  <div className="flex items-center border border-surface-container">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedFrameSize, item.selectedColor)}
                      className="w-9 h-9 flex items-center justify-center hover:bg-surface-container transition-colors"
                      aria-label="Azalt"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center font-bold text-on-surface text-sm border-x border-surface-container h-9 flex items-center justify-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedFrameSize, item.selectedColor)}
                      className="w-9 h-9 flex items-center justify-center hover:bg-surface-container transition-colors"
                      aria-label="Artır"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="font-bold text-primary text-lg">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="border border-surface-container bg-white sticky top-24">
            <div className="px-6 py-4 border-b border-surface-container">
              <h2 className="font-headline font-bold text-on-surface">Sipariş Özeti</h2>
            </div>

            <div className="px-6 py-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Ürünler ({getTotalItems()} adet)</span>
                <span className="text-on-surface font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Kargo (Sabit Ücret)</span>
                <span className="text-on-surface font-medium">{formatPrice(SHIPPING_FEE)}</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-3 border-t border-surface-container">
                <span className="text-on-surface">Genel Toplam</span>
                <span className="text-primary">{formatPrice(total)}</span>
              </div>
            </div>

            <div className="px-6 pb-6 space-y-3">
              <Link
                href="/odeme"
                className="btn-primary w-full justify-center"
                id="cart-to-checkout-btn"
              >
                Ödemeye Geç
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="flex items-center justify-center gap-1.5 text-xs text-secondary">
                <Lock className="w-3 h-3" />
                SSL ile güvenli ödeme
              </div>

              <Link
                href="/urunler"
                className="block text-center text-label-md text-secondary hover:text-primary transition-colors"
              >
                Alışverişe Devam Et
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
