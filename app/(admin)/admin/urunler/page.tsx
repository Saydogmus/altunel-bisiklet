'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Package, Plus, Upload, Search, Edit2, Trash2, Loader2, RefreshCw } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface ProductRow {
  id: string
  name: string
  slug: string
  sku?: string
  brand?: string
  base_price: number
  is_active: boolean
  is_featured: boolean
  category_id?: string
  images: string[]
  product_variants?: { stock: number }[]
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductRow[]>([])
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('')
  const [stockFilter, setStockFilter] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const [pRes, cRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories'),
      ])
      const pData = await pRes.json()
      const cData = await cRes.json()
      setProducts(Array.isArray(pData) ? pData : [])
      setCategories(Array.isArray(cData) ? cData.filter((c: { parent_id: string | null }) => c.parent_id !== null) : [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" ürününü pasif hale getirmek istiyor musunuz?`)) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setProducts((prev) => prev.map((p) => p.id === id ? { ...p, is_active: false } : p))
      }
    } catch (err) {
      console.error(err)
    } finally {
      setDeleting(null)
    }
  }

  const getStock = (p: ProductRow) =>
    p.product_variants?.reduce((s, v) => s + (v.stock ?? 0), 0) ?? 0

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku ?? '').toLowerCase().includes(search.toLowerCase())
    const matchCat = !catFilter || p.category_id === catFilter
    const stock = getStock(p)
    const matchStock =
      !stockFilter ||
      (stockFilter === 'out' && stock === 0) ||
      (stockFilter === 'low' && stock > 0 && stock <= 3)
    return matchSearch && matchCat && matchStock
  })

  const catName = (id?: string) => categories.find((c) => c.id === id)?.name ?? '—'

  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-5 border-b border-surface-container">
        <div>
          <h1 className="font-headline font-bold text-headline-md text-on-surface">Ürünler</h1>
          <p className="text-secondary mt-1 text-sm">
            {loading ? 'Yükleniyor...' : `${filtered.length} ürün`}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchProducts}
            className="btn-outline text-sm py-2.5 px-4"
            title="Yenile"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link href="/admin/urunler/yukle" className="btn-outline text-sm py-2.5 px-4">
            <Upload className="w-4 h-4" />
            CSV Yükle
          </Link>
          <Link href="/admin/urunler/yeni" className="btn-primary text-sm py-2.5 px-4" id="admin-products-new">
            <Plus className="w-4 h-4" />
            Yeni Ürün
          </Link>
        </div>
      </div>

      {/* Filtreler */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="flex-1 min-w-[200px] flex items-center border border-surface-container bg-white px-3 gap-2">
          <Search className="w-4 h-4 text-secondary flex-shrink-0" />
          <input
            type="text"
            placeholder="Ürün adı veya SKU ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 py-2.5 text-sm text-on-surface placeholder-secondary focus:outline-none bg-transparent"
            id="admin-product-search"
          />
        </div>
        <div className="flex items-center border border-surface-container bg-white px-3 gap-2 min-w-[160px]">
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className="py-2.5 text-sm text-secondary bg-transparent focus:outline-none flex-1"
          >
            <option value="">Tüm Kategoriler</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center border border-surface-container bg-white px-3 gap-2">
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="py-2.5 text-sm text-secondary bg-transparent focus:outline-none"
          >
            <option value="">Tüm Stok</option>
            <option value="low">Düşük Stok (≤3)</option>
            <option value="out">Stok Yok</option>
          </select>
        </div>
      </div>

      {/* Tablo */}
      <div className="bg-white border border-surface-container">
        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3 text-secondary">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-medium">Ürünler yükleniyor...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-container-low border-b border-surface-container">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-secondary">Ürün</th>
                  <th className="text-left px-4 py-3 font-semibold text-secondary hidden lg:table-cell">Kategori</th>
                  <th className="text-right px-4 py-3 font-semibold text-secondary">Fiyat</th>
                  <th className="text-right px-4 py-3 font-semibold text-secondary">Stok</th>
                  <th className="text-center px-4 py-3 font-semibold text-secondary hidden md:table-cell">Durum</th>
                  <th className="text-right px-4 py-3 font-semibold text-secondary">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {filtered.map((product) => {
                  const stock = getStock(product)
                  return (
                    <tr key={product.id} className={`hover:bg-surface-container-low transition-colors ${!product.is_active ? 'opacity-50' : ''}`}>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-surface-container flex-shrink-0 overflow-hidden">
                            {product.images?.[0] && (
                              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                            )}
                            {!product.images?.[0] && (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-4 h-4 text-secondary" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-on-surface truncate max-w-[200px]">{product.name}</p>
                            <p className="text-xs text-secondary">{product.sku ?? '—'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-secondary hidden lg:table-cell text-xs">
                        {catName(product.category_id)}
                      </td>
                      <td className="px-4 py-4 text-right font-semibold text-on-surface">
                        {formatPrice(product.base_price ?? 0)}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className={`inline-flex items-center justify-center min-w-[36px] px-2 py-0.5 text-xs font-bold ${
                          stock === 0 ? 'bg-red-50 text-primary'
                          : stock <= 3 ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                        }`}>
                          {stock}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center hidden md:table-cell">
                        <span className={`text-xs font-semibold px-2.5 py-1 ${
                          product.is_active ? 'bg-green-100 text-green-700' : 'bg-surface-container text-secondary'
                        }`}>
                          {product.is_active ? 'Aktif' : 'Pasif'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/urunler/${product.id}/duzenle`}
                            className="p-1.5 text-secondary hover:text-primary transition-colors"
                            aria-label="Düzenle"
                            title="Düzenle"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id, product.name)}
                            disabled={deleting === product.id || !product.is_active}
                            className="p-1.5 text-secondary hover:text-red-600 transition-colors disabled:opacity-40"
                            aria-label="Pasif yap"
                            id={`delete-product-${product.id}`}
                          >
                            {deleting === product.id
                              ? <Loader2 className="w-4 h-4 animate-spin" />
                              : <Trash2 className="w-4 h-4" />
                            }
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-16">
                <Package className="w-10 h-10 text-secondary mx-auto mb-3" />
                <p className="font-semibold text-on-surface">Ürün bulunamadı</p>
                <p className="text-sm text-secondary mt-1">Filtrelerinizi değiştirin veya yeni ürün ekleyin.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
