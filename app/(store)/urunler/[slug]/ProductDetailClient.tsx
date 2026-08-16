'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ShoppingCart, Minus, Plus, Check, Truck, ShieldCheck, RotateCcw, ChevronRight, Bike } from 'lucide-react'
import Link from 'next/link'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'
import ProductCard from '@/components/store/ProductCard'
import { MOCK_CATEGORIES } from '@/lib/mock-data'

export default function ProductDetailClient({
  product,
  relatedProducts,
}: {
  product: Product
  relatedProducts: Product[]
}) {
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const [selectedFrameSize, setSelectedFrameSize] = useState<string | undefined>(
    product.frame_sizes?.[0]
  )
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.colors?.[0]
  )
  const { addItem, openCart } = useCartStore()

  const category = MOCK_CATEGORIES.find((c) => c.id === product.category_id)
  const parentCategory = category?.parent_id
    ? MOCK_CATEGORIES.find((c) => c.id === category.parent_id)
    : null

  const discountPercent = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product, selectedFrameSize, selectedColor)
    }
    setAddedToCart(true)
    setTimeout(() => {
      setAddedToCart(false)
      openCart()
    }, 1200)
  }

  return (
    <>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-secondary mb-10 flex-wrap" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        {parentCategory && (
          <>
            <Link href={`/kategori/${parentCategory.slug}`} className="hover:text-primary transition-colors">
              {parentCategory.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
          </>
        )}
        {category && (
          <>
            <Link href={`/kategori/${category.slug}`} className="hover:text-primary transition-colors">
              {category.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
          </>
        )}
        <span className="text-on-surface font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        {/* LEFT — Images */}
        <div className="space-y-3">
          {/* Ana Görsel */}
          <div className="relative aspect-square bg-surface-container-low border border-surface-container overflow-hidden">
            {product.images[activeImage] ? (
              <Image
                src={product.images[activeImage]}
                alt={product.name}
                fill
                className="object-contain p-8 transition-opacity duration-300"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                <div className="w-24 h-24 bg-surface-container flex items-center justify-center">
                  <Bike className="w-12 h-12 text-secondary opacity-50" />
                </div>
                <p className="text-sm text-secondary">Görsel Yok</p>
              </div>
            )}
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-2.5 py-1">
                -%{discountPercent}
              </span>
            )}
          </div>

          {/* Thumbnail Gallery — 2+ görsel varsa */}
          {product.images.filter(Boolean).length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {product.images.filter(Boolean).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative w-20 h-20 border-2 overflow-hidden flex-shrink-0 transition-all duration-200 ${
                    activeImage === idx
                      ? 'border-primary shadow-sm'
                      : 'border-surface-container hover:border-secondary opacity-70 hover:opacity-100'
                  }`}
                  aria-label={`Görsel ${idx + 1}`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} görsel ${idx + 1}`}
                    fill
                    className="object-contain p-1"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — Info */}
        <div>
          {product.brand && (
            <p className="text-label-md text-secondary uppercase mb-2">{product.brand}</p>
          )}

          <h1 className="font-headline font-bold text-display-sm text-on-surface mb-4 leading-tight">
            {product.name}
          </h1>

          {/* Stars */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <svg
                  key={s}
                  className={`w-4 h-4 ${s <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-surface-container fill-surface-container'}`}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-secondary">4.0 (24 değerlendirme)</span>
            <span className="text-surface-container">|</span>
            {product.stock > 0 ? (
              <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                Stokta var ({product.stock} adet)
              </span>
            ) : (
              <span className="text-sm text-primary font-medium">Stok Tükendi</span>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-surface-container">
            <span className="font-headline font-bold text-3xl text-primary">
              {formatPrice(product.price)}
            </span>
            {product.original_price && (
              <>
                <span className="text-lg text-secondary line-through">
                  {formatPrice(product.original_price)}
                </span>
                <span className="bg-red-50 text-primary text-xs font-bold px-2 py-1">
                  %{discountPercent} indirim
                </span>
              </>
            )}
          </div>

          {product.description && (
            <p className="text-body-md text-secondary leading-relaxed mb-6">
              {product.description}
            </p>
          )}

          {/* ── Kadro Boyu Seçimi ── */}
          {product.frame_sizes && product.frame_sizes.length > 0 && (
            <div className="mb-5">
              <p className="text-label-md font-semibold text-on-surface mb-2">
                Kadro Boyu:{' '}
                <span className="text-primary">{selectedFrameSize}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.frame_sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedFrameSize(size)}
                    className={`min-w-[52px] h-10 px-3 border text-label-md font-semibold transition-all duration-200 ${
                      selectedFrameSize === size
                        ? 'border-primary bg-primary text-white'
                        : 'border-surface-container text-secondary hover:border-on-surface hover:text-on-surface'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Renk Seçimi ── */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <p className="text-label-md font-semibold text-on-surface mb-2">
                Renk:{' '}
                <span className="text-primary">{selectedColor}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 h-10 border text-label-md font-semibold transition-all duration-200 ${
                      selectedColor === color
                        ? 'border-primary bg-primary text-white'
                        : 'border-surface-container text-secondary hover:border-on-surface hover:text-on-surface'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + Add to Cart */}
          {product.stock > 0 ? (
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="flex items-center border border-surface-container">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-12 flex items-center justify-center hover:bg-surface-container transition-colors"
                  aria-label="Azalt"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-bold text-on-surface border-x border-surface-container h-12 flex items-center justify-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-12 flex items-center justify-center hover:bg-surface-container transition-colors"
                  aria-label="Artır"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={addedToCart}
                className={`flex-1 h-12 flex items-center justify-center gap-2 font-semibold text-label-md transition-all duration-300 active:scale-95 ${
                  addedToCart
                    ? 'bg-green-600 text-white'
                    : 'bg-primary text-white hover:bg-primary-dark'
                }`}
                id="product-add-to-cart"
              >
                {addedToCart ? (
                  <>
                    <Check className="w-4 h-4" />
                    Sepete Eklendi!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    Sepete Ekle
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-surface-container border border-surface-container mb-6">
              <span className="text-secondary font-medium">Bu ürün şu an stokta bulunmuyor.</span>
            </div>
          )}

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-3 pt-5 border-t border-surface-container">
            {[
              { icon: Truck, text: 'Hızlı Kargo', sub: 'Türkiye geneli' },
              { icon: ShieldCheck, text: '2 Yıl Garanti', sub: 'Resmi garanti' },
              { icon: RotateCcw, text: '30 Gün İade', sub: 'Koşulsuz iade' },
            ].map(({ icon: Icon, text, sub }) => (
              <div key={text} className="flex flex-col items-center gap-1.5 p-3 text-center border border-surface-container">
                <Icon className="w-4 h-4 text-primary" />
                <p className="text-xs font-semibold text-on-surface">{text}</p>
                <p className="text-[10px] text-secondary">{sub}</p>
              </div>
            ))}
          </div>

          {/* Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="mt-6 border border-surface-container">
              <div className="px-5 py-3 bg-surface-container-low border-b border-surface-container">
                <h3 className="font-headline font-bold text-on-surface">Teknik Özellikler</h3>
              </div>
              <div className="divide-y divide-surface-container">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex items-center px-5 py-3">
                    <span className="text-sm text-secondary w-1/2">{key}</span>
                    <span className="text-sm text-on-surface font-semibold w-1/2">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-surface-container pt-12">
          <h2 className="font-headline font-bold text-headline-md md:text-headline-lg text-on-surface mb-8 border-b border-surface-container pb-4">
            Benzer Ürünler
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </>
  )
}
