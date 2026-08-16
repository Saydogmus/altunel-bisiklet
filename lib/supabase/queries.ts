/**
 * Supabase Data Layer — Ürünler, Kategoriler, Siparişler
 * createServiceClient() ile RLS bypass (service_role key)
 */

import { createServiceClient } from './server'
import type { Product, Category } from '@/types'

// ─── Supabase satırını Product tipine normalize et ───────────────────────────
function normalizeProduct(row: Record<string, unknown>): Product {
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

// ─── KATEGORİLER ─────────────────────────────────────────────────────────────

export async function getAllCategories(): Promise<Category[]> {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, parent_id, sort_order, description, image_url, created_at')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('[getAllCategories]', error.message)
    return []
  }
  return (data ?? []) as Category[]
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (error) return null
  return data as Category | null
}

// ─── ÜRÜNLER ─────────────────────────────────────────────────────────────────

export async function getAllProducts(): Promise<Product[]> {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('products')
    .select('id, name, slug, brand, base_price, original_price, description, sku, is_featured, is_active, images, specifications, category_id, created_at, updated_at, product_variants(id, stock, frame_size, color, sku, price_offset)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[getAllProducts]', error.message)
    return []
  }
  return ((data ?? []) as Record<string, unknown>[]).map(normalizeProduct)
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('products')
    .select('*, product_variants(id, stock, frame_size, color, sku, price_offset)')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle()

  if (error || !data) return null
  return normalizeProduct(data as Record<string, unknown>)
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('products')
    .select('id, name, slug, brand, base_price, original_price, images, category_id, is_featured, is_active, created_at, updated_at, specifications, description, sku, product_variants(id, stock, frame_size, color, sku, price_offset)')
    .eq('is_featured', true)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(8)

  if (error) {
    console.error('[getFeaturedProducts]', error.message)
    return []
  }
  return ((data ?? []) as Record<string, unknown>[]).map(normalizeProduct)
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const supabase = createServiceClient()

  // Kategoriyi ve alt kategorilerini TEK SEFERDE çek
  const { data: allCats } = await supabase
    .from('categories')
    .select('id, slug, parent_id')

  if (!allCats?.length) return []

  const targetCat = allCats.find((c) => c.slug === categorySlug)
  if (!targetCat) return []

  // Hedef kategori + onun çocukları
  const categoryIds = allCats
    .filter((c) => c.id === targetCat.id || c.parent_id === targetCat.id)
    .map((c) => c.id)

  const { data, error } = await supabase
    .from('products')
    .select('id, name, slug, brand, base_price, original_price, images, category_id, is_featured, is_active, created_at, updated_at, specifications, description, sku, product_variants(id, stock, frame_size, color, sku, price_offset)')
    .in('category_id', categoryIds)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[getProductsByCategory]', error.message)
    return []
  }
  return ((data ?? []) as Record<string, unknown>[]).map(normalizeProduct)
}

// ─── SİPARİŞLER (Admin) ──────────────────────────────────────────────────────

export async function getAllOrders() {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*, products(name, sku))')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[getAllOrders]', error.message)
    return []
  }
  return data ?? []
}

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = createServiceClient()
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
  if (error) throw new Error(error.message)
}

// ─── STOK (Admin) ────────────────────────────────────────────────────────────

export async function getAllProductsWithStock() {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('products')
    .select('id, name, sku, brand, product_variants(id, frame_size, color, stock, sku)')
    .order('name', { ascending: true })

  if (error) {
    console.error('[getAllProductsWithStock]', error.message)
    return []
  }
  return data ?? []
}

export async function updateVariantStock(variantId: string, stock: number) {
  const supabase = createServiceClient()
  const { error } = await supabase
    .from('product_variants')
    .update({ stock })
    .eq('id', variantId)
  if (error) throw new Error(error.message)
}

// ─── ÜRÜN CRUD (Admin) ───────────────────────────────────────────────────────

export async function deleteProduct(id: string) {
  const supabase = createServiceClient()
  const { error } = await supabase
    .from('products')
    .update({ is_active: false })
    .eq('id', id)
  if (error) throw new Error(error.message)
}
