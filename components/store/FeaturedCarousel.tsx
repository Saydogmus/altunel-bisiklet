'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ProductCard from '@/components/store/ProductCard'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  images?: string[]
  category?: string
  [key: string]: unknown
}

interface FeaturedCarouselProps {
  products: Product[]
}

export default function FeaturedCarousel({ products }: FeaturedCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const CARD_WIDTH = 288 // px — yaklaşık kart genişliği + gap

  const updateButtons = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 8)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateButtons()
    el.addEventListener('scroll', updateButtons, { passive: true })
    return () => el.removeEventListener('scroll', updateButtons)
  }, [updateButtons])

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir === 'right' ? CARD_WIDTH * 2 : -CARD_WIDTH * 2, behavior: 'smooth' })
  }

  if (products.length === 0) return null

  return (
    <div className="relative group/carousel">
      {/* Sol Ok */}
      <button
        onClick={() => scroll('left')}
        disabled={!canScrollLeft}
        aria-label="Önceki ürünler"
        className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20
          w-11 h-11 border border-surface-container bg-white shadow-soft
          flex items-center justify-center
          hover:bg-primary hover:text-white hover:border-primary
          transition-all duration-200
          disabled:opacity-0 disabled:pointer-events-none
          opacity-0 group-hover/carousel:opacity-100`}
        id="carousel-prev-btn"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Sağ Ok */}
      <button
        onClick={() => scroll('right')}
        disabled={!canScrollRight}
        aria-label="Sonraki ürünler"
        className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20
          w-11 h-11 border border-surface-container bg-white shadow-soft
          flex items-center justify-center
          hover:bg-primary hover:text-white hover:border-primary
          transition-all duration-200
          disabled:opacity-0 disabled:pointer-events-none
          opacity-0 group-hover/carousel:opacity-100`}
        id="carousel-next-btn"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Kaydırılabilir Liste */}
      <div
        ref={scrollRef}
        className="flex gap-gutter overflow-x-auto scroll-smooth
          snap-x snap-mandatory
          pb-2
          scrollbar-hide
          [-ms-overflow-style:none]
          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="flex-shrink-0 w-[270px] sm:w-[288px] snap-start"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Mobil swipe ipucu — sadece dokunmatik */}
      {products.length > 2 && (
        <p className="text-center text-xs text-secondary mt-4 md:hidden">
          Daha fazla ürün için kaydırın →
        </p>
      )}
    </div>
  )
}
