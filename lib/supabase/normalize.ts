import type { Product } from '@/types'

/**
 * Supabase'den gelen ham satırı Product tipine normalize eder.
 * base_price → price, product_variants stok toplamı → stock
 */
export function normalizeProductRow(row: Record<string, unknown>): Product {
  const variants = row.product_variants as { stock: number }[] | null
  const totalStock = Array.isArray(variants)
    ? variants.reduce((s, v) => s + (v.stock ?? 0), 0)
    : (row.stock as number ?? 0)

  return {
    ...(row as Omit<Product, 'price' | 'stock'>),
    price: (row.base_price as number) ?? (row.price as number) ?? 0,
    stock: totalStock,
  } as Product
}
