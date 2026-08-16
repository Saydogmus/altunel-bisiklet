import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import ProductCard from '@/components/store/ProductCard'
import { createServiceClient } from '@/lib/supabase/server'
import { MOCK_CATEGORIES } from '@/lib/mock-data'
import { normalizeProductRow } from '@/lib/supabase/normalize'
import type { Category } from '@/types'

export const revalidate = 30

interface Props {
  params: Promise<{ kategori: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { kategori } = await params
  const cat = MOCK_CATEGORIES.find((c) => c.slug === kategori)
  return { title: cat?.name ?? 'Kategori', description: cat?.description }
}

export async function generateStaticParams() {
  return MOCK_CATEGORIES.map((cat) => ({ kategori: cat.slug }))
}

export default async function CategoryPage({ params }: Props) {
  const { kategori } = await params

  const supabase = createServiceClient()

  // TEK SORGUDA: tüm kategoriler + ürünler
  const [{ data: allCats }, { data: rawProducts }] = await Promise.all([
    supabase
      .from('categories')
      .select('id, name, slug, parent_id, sort_order, description')
      .order('sort_order'),
    supabase
      .from('products')
      .select('id, name, slug, brand, base_price, original_price, images, category_id, is_featured, is_active, created_at, updated_at, specifications, description, sku, product_variants(id, stock, frame_size, color, sku, price_offset)')
      .eq('is_active', true),
  ])

  const cats: Category[] = (allCats ?? []) as Category[]

  // Kategoriyi bul (Supabase veya mock fallback)
  const category =
    cats.find((c) => c.slug === kategori) ??
    MOCK_CATEGORIES.find((c) => c.slug === kategori)

  if (!category) notFound()

  // Bu kategori + alt kategorilerin ID'leri
  const relatedIds = cats
    .filter((c) => c.id === category.id || c.parent_id === category.id)
    .map((c) => c.id)

  // Ürünleri filtrele
  const products = (rawProducts ?? [])
    .filter((p: { category_id: string }) => relatedIds.includes(p.category_id))
    .map(normalizeProductRow)

  // Alt kategoriler
  const subCategories = cats.filter((c) => c.parent_id === category.id)

  // Breadcrumb üst kategori
  const parent = category.parent_id
    ? (cats.find((c) => c.id === category.parent_id) ??
       MOCK_CATEGORIES.find((c) => c.id === category.parent_id))
    : null

  return (
    <div className="page-container py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-secondary mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        {parent && (
          <>
            <Link href={`/kategori/${parent.slug}`} className="hover:text-primary transition-colors">
              {parent.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
          </>
        )}
        <span className="text-on-surface font-medium">{category.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-10 pb-6 border-b border-surface-container">
        <h1 className="font-headline font-bold text-headline-md md:text-headline-lg text-on-surface mb-2">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-body-md text-secondary">{category.description}</p>
        )}
      </div>

      {/* Alt Kategoriler */}
      {subCategories.length > 0 && (
        <div className="mb-10">
          <p className="text-xs font-semibold text-secondary uppercase tracking-widest mb-4">Alt Kategoriler</p>
          <div className="flex flex-wrap gap-2">
            {subCategories.map((sub) => (
              <Link
                key={sub.id}
                href={`/kategori/${sub.slug}`}
                className="px-4 py-2 border border-surface-container text-sm text-secondary hover:border-primary hover:text-primary transition-colors"
              >
                {sub.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Ürün Izgarası */}
      {products.length > 0 ? (
        <>
          <p className="text-sm text-secondary mb-6">{products.length} ürün listeleniyor</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-20 border border-surface-container">
          <p className="font-headline font-bold text-xl text-on-surface mb-3">
            Bu kategoride henüz ürün yok
          </p>
          <p className="text-secondary mb-6">Admin panelinden bu kategoriye ürün ekleyebilirsiniz.</p>
          <Link href="/urunler" className="btn-primary">Tüm Ürünleri Gör</Link>
        </div>
      )}
    </div>
  )
}
