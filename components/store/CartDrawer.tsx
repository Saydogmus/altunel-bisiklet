'use client'

import { useEffect } from 'react'
import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight, Bike } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'

const SHIPPING_FEE = 99.90

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotalPrice, getTotalItems } =
    useCartStore()

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [closeCart])

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  const subtotal = getTotalPrice()
  const total = subtotal + SHIPPING_FEE

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-large flex flex-col animate-slide-right"
        role="dialog"
        aria-modal="true"
        aria-label="Alışveriş sepeti"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-surface-container">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            <h2 className="font-headline font-bold text-on-surface text-lg">
              Sepetim
            </h2>
            {getTotalItems() > 0 && (
              <span className="text-sm text-secondary">({getTotalItems()} ürün)</span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="w-9 h-9 flex items-center justify-center hover:bg-surface-container transition-colors"
            aria-label="Sepeti kapat"
            id="cart-close-btn"
          >
            <X className="w-4 h-4 text-secondary" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-8 text-center">
              <div className="w-20 h-20 bg-surface-container flex items-center justify-center mb-5">
                <ShoppingCart className="w-9 h-9 text-secondary" />
              </div>
              <h3 className="font-headline font-bold text-on-surface text-lg mb-2">
                Sepetiniz boş
              </h3>
              <p className="text-sm text-secondary mb-8 leading-relaxed">
                Beğendiğiniz ürünleri sepete ekleyin, burada listelenir.
              </p>
              <Link
                href="/urunler"
                onClick={closeCart}
                className="btn-primary"
                id="browse-products-btn"
              >
                Alışverişe Başla
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-surface-container">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedFrameSize}-${item.selectedColor}`}
                  className="flex gap-4 px-6 py-5 group hover:bg-surface-container-low transition-colors"
                >
                  {/* Image */}
                  <div className="w-20 h-20 bg-surface-container flex-shrink-0 overflow-hidden border border-surface-container">
                    {item.product.images?.[0] ? (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Bike className="w-8 h-8 text-secondary opacity-40" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-label-md font-semibold text-secondary uppercase mb-0.5">
                      {item.product.brand}
                    </p>
                    <h4 className="font-headline font-bold text-on-surface text-sm leading-snug">
                      {item.product.name}
                    </h4>
                    {(item.selectedFrameSize || item.selectedColor) && (
                      <p className="text-xs text-secondary mt-1">
                        {[item.selectedFrameSize, item.selectedColor]
                          .filter(Boolean)
                          .join(' · ')}
                      </p>
                    )}
                    <p className="font-bold text-primary mt-1.5">
                      {formatPrice(item.product.price)}
                    </p>

                    {/* Quantity Control */}
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.quantity - 1,
                            item.selectedFrameSize,
                            item.selectedColor
                          )
                        }
                        className="w-7 h-7 border border-surface-container flex items-center justify-center hover:border-on-surface transition-colors"
                        aria-label="Azalt"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-semibold w-6 text-center text-on-surface">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.quantity + 1,
                            item.selectedFrameSize,
                            item.selectedColor
                          )
                        }
                        className="w-7 h-7 border border-surface-container flex items-center justify-center hover:border-on-surface transition-colors"
                        aria-label="Artır"
                      >
                        <Plus className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() =>
                          removeItem(item.product.id, item.selectedFrameSize, item.selectedColor)
                        }
                        className="ml-auto w-7 h-7 flex items-center justify-center text-secondary hover:text-primary hover:bg-red-50 transition-colors"
                        aria-label="Ürünü kaldır"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-surface-container px-6 py-5 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-secondary">Ara Toplam</span>
              <span className="font-medium text-on-surface">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-secondary">Kargo (Sabit)</span>
              <span className="font-medium text-on-surface">{formatPrice(SHIPPING_FEE)}</span>
            </div>
            <div className="flex items-center justify-between font-bold text-base border-t border-surface-container pt-3">
              <span className="text-on-surface">Toplam</span>
              <span className="text-primary">{formatPrice(total)}</span>
            </div>

            <Link
              href="/odeme"
              onClick={closeCart}
              className="btn-primary w-full justify-center mt-1"
              id="checkout-btn"
            >
              Ödemeye Geç
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={closeCart}
              className="w-full py-3 text-label-md text-secondary hover:text-on-surface transition-colors text-center"
            >
              Alışverişe Devam Et
            </button>
          </div>
        )}
      </div>
    </>
  )
}
