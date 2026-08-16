import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ChevronRight, Truck, ShieldCheck, RotateCcw } from 'lucide-react'
import ProductCard from '@/components/store/ProductCard'
import FeaturedCarousel from '@/components/store/FeaturedCarousel'
import { getFeaturedProducts } from '@/lib/supabase/queries'
import { FEATURED_PRODUCTS } from '@/lib/mock-data'

export const revalidate = 30 // 30 saniyede bir Supabase'den taze veri

export const metadata: Metadata = {
  title: 'Altunel Bisiklet — Türkiye\'nin Güvenilir Bisiklet Mağazası',
  description:
    'Bisiklet, elektrikli bisiklet, aksesuar ve yedek parça kategorilerinde en kaliteli ürünleri keşfedin. Dağ, şehir, yol ve çocuk bisikletleri.',
}

// ── Hero section görsel özellikleri ─────────────────────────────────────
const HERO_IMAGE = '/hero-bisiklet.jpg'

// ── Kategori kartları ────────────────────────────────────────────────────
const CATEGORY_CARDS = [
  {
    label: 'Elektrikli',
    href: '/kategori/elektrikli-bisikletler',
    image: '/elektrikli-kategori.png',
    bgColor: '#ffffff',
  },
  {
    label: 'Dağ',
    href: '/kategori/dag-bisikleti',
    image: '/dag-kategori.png',
    bgColor: '#ffffff',
  },
  {
    label: 'Şehir',
    href: '/kategori/sehir-bisikleti',
    image: '/sehir-kategori.png',
    bgColor: '#ffffff',
  },
]

export default async function HomePage() {
  // Supabase'den öne çıkan ürünleri çek, hata durumunda mock'a düş
  const featuredFromDB = await getFeaturedProducts().catch(() => [])
  const featuredProducts = featuredFromDB.length > 0 ? featuredFromDB : FEATURED_PRODUCTS

  return (
    <>
      {/* ── Hero Section ── */}
      <section
        className="relative w-full overflow-hidden"
        style={{
          minHeight: '82vh',
          backgroundImage: `url('${HERO_IMAGE}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Karartma gradient — soldan siyaha, sağ açık */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
        {/* Alt gradient — okunabilirlik */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* İçerik */}
        <div className="relative z-10 flex items-center" style={{ minHeight: '82vh' }}>
          <div className="page-container">
            <div className="max-w-xl py-20 space-y-7">
              <span className="inline-block px-3 py-1 bg-primary/90 text-white text-xs font-bold tracking-widest uppercase">
                Elektrikli Bisiklet
              </span>

              <h1 className="font-display text-display-sm md:text-display text-white leading-tight drop-shadow-lg">
                Geleceğin Sürüş{' '}
                <span className="text-red-400">Deneyimi</span>
              </h1>

              <p className="text-base md:text-lg text-white/85 leading-relaxed max-w-md">
                Güçlü motorlar ve uzun menzilli bataryalarla tanışın. Yokuşları düzlüğe çevirin,
                şehri zahmetsizce keşfedin.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  href="/kategori/elektrikli-bisikletler"
                  className="btn-primary"
                  id="hero-discover-btn"
                >
                  Hemen Keşfet
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/kategori/bisikletler"
                  className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/70 text-white font-semibold text-sm hover:bg-white hover:text-on-surface transition-all duration-200"
                  id="hero-all-bikes-btn"
                >
                  Tüm Bisikletler
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ── Trust Bar ── */}
      <section className="border-t border-b border-surface-container">
        <div className="max-w-container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-surface-container">
            {[
              { icon: Truck, title: 'Hızlı Kargo', desc: 'Tüm Türkiye\'ye teslimat' },
              { icon: ShieldCheck, title: '2 Yıl Garanti', desc: 'Tüm ürünlerde garanti' },
              { icon: RotateCcw, title: '14 Gün İade', desc: 'Koşulsuz iade hakkı' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-4 py-5 px-8">
                <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <p className="font-semibold text-on-surface text-sm">{title}</p>
                  <p className="text-xs text-secondary mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category Cards ── */}
      <section className="w-full max-w-container mx-auto px-4 md:px-10 py-16 border-t border-surface-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {CATEGORY_CARDS.map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="group block relative overflow-hidden border border-surface-container aspect-[3/2] flex items-end p-8 transition-colors hover:border-secondary"
              id={`home-cat-${cat.label.toLowerCase()}`}
              style={{ backgroundColor: cat.bgColor ?? 'transparent' }}
            >
              <div
                className={`absolute inset-0 w-full h-full opacity-90 group-hover:opacity-100 transition-opacity duration-300 ${
                  cat.bgColor ? 'bg-contain bg-center bg-no-repeat' : 'bg-cover bg-center'
                }`}
                style={{ backgroundImage: `url('${cat.image}')` }}
              />
              <div className="relative z-10 w-full flex justify-between items-center">
                <h3 className="font-headline font-bold text-on-surface text-headline-md bg-white/90 px-4 py-2">
                  {cat.label}
                </h3>
                <span className="w-9 h-9 bg-white/90 flex items-center justify-center text-on-surface group-hover:bg-primary group-hover:text-white transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Products — Carousel ── */}
      <section className="w-full max-w-container mx-auto px-4 md:px-10 py-16">
        <div className="flex items-end justify-between mb-10 border-b border-surface-container pb-4">
          <h2 className="font-headline font-bold text-headline-md md:text-headline-lg text-on-surface">
            Öne Çıkan Ürünler
          </h2>
          <Link
            href="/urunler"
            className="hidden md:flex items-center gap-1 text-label-md text-secondary hover:text-primary transition-colors"
          >
            Tümünü Gör <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <FeaturedCarousel products={featuredProducts} />

        <div className="text-center mt-10 md:hidden">
          <Link href="/urunler" className="btn-outline" id="mobile-view-all-btn">
            Tüm Ürünleri Gör
          </Link>
        </div>
      </section>

      {/* ── Banner — Elektrikli CTA ── */}
      <section className="w-full border-t border-surface-container">
        <div className="max-w-container mx-auto px-4 md:px-10 py-20 grid grid-cols-1 md:grid-cols-2 gap-gutter items-center">
          <div className="space-y-6">
            <p className="text-label-md text-primary uppercase">Yeni Sezon</p>
            <h2 className="font-headline font-bold text-headline-md md:text-headline-lg text-on-surface">
              Geleceğin Ulaşımına<br />Şimdiden Geç
            </h2>
            <p className="text-body-md text-secondary max-w-md">
              60–100 km menzil, sıfır emisyon, maksimum konfor. Elektrikli bisikletlerimizle
              şehir trafiğini geride bırakın.
            </p>
            <Link
              href="/kategori/elektrikli-bisikletler"
              className="btn-primary"
              id="ebike-banner-btn"
            >
              Elektrikli Bisikletleri Keşfet
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="relative w-full aspect-video md:aspect-square bg-white border border-surface-container overflow-hidden flex items-center justify-center p-6">
            <Image
              src="/elektrikli-bisiklet-promo.png"
              alt="Altunel Elektrikli Bisiklet Koleksiyonu"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

    </>
  )
}
