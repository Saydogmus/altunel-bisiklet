import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProductBySlug, getAllProducts } from '@/lib/supabase/queries'
import { MOCK_PRODUCTS } from '@/lib/mock-data'
import ProductDetailClient from './ProductDetailClient'

export const revalidate = 0

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product =
    (await getProductBySlug(slug).catch(() => null)) ??
    MOCK_PRODUCTS.find((p) => p.slug === slug)
  if (!product) return { title: 'Ürün bulunamadı' }
  return {
    title: product.name,
    description: product.description,
  }
}

export async function generateStaticParams() {
  // SSG için mock slug'ları kullan; Supabase'den gelenler runtime'da çalışır
  return MOCK_PRODUCTS.map((p) => ({ slug: p.slug }))
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params

  // Önce Supabase'den ara, bulamazsan mock'a düş
  const product =
    (await getProductBySlug(slug).catch(() => null)) ??
    MOCK_PRODUCTS.find((p) => p.slug === slug)

  if (!product) notFound()

  // İlgili ürünler — aynı kategoriden
  const allProducts = await getAllProducts().catch(() => MOCK_PRODUCTS)
  const relatedProducts = allProducts
    .filter((p) => p.category_id === product.category_id && p.id !== product.id)
    .slice(0, 4)

  return (
    <div className="page-container py-8 md:py-12">
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </div>
  )
}
