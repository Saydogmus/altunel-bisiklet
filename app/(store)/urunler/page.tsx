import type { Metadata } from 'next'
import Link from 'next/link'
import ProductCard from '@/components/store/ProductCard'
import { getAllProducts } from '@/lib/supabase/queries'
import { MOCK_PRODUCTS } from '@/lib/mock-data'

export const metadata: Metadata = {
  title: 'Tüm Ürünler',
  description: 'Tüm bisiklet ve aksesuar ürünlerimizi keşfedin.',
}

export const revalidate = 0 // Her istekte Supabase'den taze veri al

export default async function AllProductsPage() {
  // Supabase'den ürünleri çek, hata durumunda mock data'ya düş
  let products = await getAllProducts()
  if (!products || products.length === 0) {
    products = MOCK_PRODUCTS
  }

  return (
    <div className="page-container py-10">
      <div className="mb-10 pb-6 border-b border-surface-container">
        <p className="text-xs font-semibold text-secondary uppercase tracking-widest mb-2">
          <Link href="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
          {' / '}Tüm Ürünler
        </p>
        <h1 className="font-headline font-bold text-headline-md md:text-headline-lg text-on-surface">
          Tüm Ürünler
        </h1>
        <p className="text-secondary mt-1">{products.length} ürün listeleniyor</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
