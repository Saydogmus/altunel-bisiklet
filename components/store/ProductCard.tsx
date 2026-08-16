'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Bike } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'

interface ProductCardProps {
  product: Product
}

// Herhangi bir URL'den gelen görseli güvenle göster
function getImageSrc(product: Product): string | null {
  if (Array.isArray(product.images) && product.images.length > 0) {
    const first = product.images[0]
    if (first && first.trim()) return first
  }
  return null
}

// Supabase dışındaki tüm harici URL'lerde unoptimized kullan
function isExternal(url: string): boolean {
  return url.startsWith('http')
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, openCart } = useCartStore()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem(product)
    openCart()
  }

  const discountPercent = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null

  const imageSrc = getImageSrc(product)

  return (
    <article
      className="group flex flex-col border border-surface-container hover:border-secondary transition-colors duration-300 bg-white"
      id={`product-card-${product.id}`}
    >
      {/* Image */}
      <Link href={`/urunler/${product.slug}`} className="block">
        <div className="relative w-full aspect-square bg-surface-container-low overflow-hidden border-b border-surface-container">
          {/* Discount Badge */}
          {discountPercent && discountPercent > 0 && (
            <span className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-2 py-1 z-10">
              -{discountPercent}%
            </span>
          )}

          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              className="object-contain group-hover:scale-105 transition-transform duration-500 p-4"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              unoptimized={isExternal(imageSrc)}
            />
          ) : (
            /* Placeholder */
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-surface-container-low">
              <div className="w-16 h-16 bg-surface-container flex items-center justify-center">
                <Bike className="w-8 h-8 text-secondary opacity-60" />
              </div>
              <p className="text-xs text-secondary">Görsel Yok</p>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        {product.brand && (
          <p className="text-label-md text-secondary uppercase mb-1.5">
            {product.brand}
          </p>
        )}

        <Link href={`/urunler/${product.slug}`}>
          <h3 className="font-headline font-bold text-on-surface text-base leading-snug mb-3 hover:text-primary transition-colors flex-grow line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="font-bold text-lg text-primary">
            {formatPrice(product.price)}
          </span>
          {product.original_price && (
            <span className="text-sm text-secondary line-through">
              {formatPrice(product.original_price)}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white text-label-md font-semibold hover:bg-red-700 transition-colors duration-200 active:scale-95"
          id={`add-to-cart-${product.id}`}
          aria-label={`${product.name} sepete ekle`}
        >
          <ShoppingCart className="w-4 h-4" />
          Sepete Ekle
        </button>
      </div>
    </article>
  )
}
