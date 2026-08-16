'use client'

import { useState, useEffect, useCallback } from 'react'
import { Edit3, Save, Package, TrendingDown, AlertTriangle, CheckCircle, Loader2, RefreshCw } from 'lucide-react'

interface Variant {
  id: string
  frame_size?: string
  color?: string
  stock: number
  sku?: string
}

interface ProductStock {
  id: string
  name: string
  sku?: string
  brand?: string
  product_variants?: Variant[]
}

export default function StokPage() {
  const [products, setProducts] = useState<ProductStock[]>([])
  const [loading, setLoading] = useState(true)
  const [editState, setEditState] = useState<{ variantId: string; stock: number } | null>(null)
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      setProducts(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const startEdit = (variantId: string, currentStock: number) => {
    setEditState({ variantId, stock: currentStock })
  }

  const saveStock = async (variantId: string) => {
    if (!editState) return
    setSaving(variantId)
    try {
      const res = await fetch(`/api/stock/${variantId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: editState.stock }),
      })
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => ({
            ...p,
            product_variants: p.product_variants?.map((v) =>
              v.id === variantId ? { ...v, stock: editState.stock } : v
            ),
          }))
        )
        setSaved(variantId)
        setTimeout(() => setSaved(null), 2500)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(null)
      setEditState(null)
    }
  }

  const getTotalStock = (p: ProductStock) =>
    p.product_variants?.reduce((s, v) => s + (v.stock ?? 0), 0) ?? 0

  // Tüm varyasyonları düzleştir
  const allRows = products.flatMap((p) =>
    (p.product_variants ?? [{ id: `${p.id}-default`, stock: 0, frame_size: undefined, color: undefined }]).map((v) => ({
      product: p,
      variant: v,
    }))
  )

  const totalStock = allRows.reduce((s, r) => s + r.variant.stock, 0)
  const outOfStock = allRows.filter((r) => r.variant.stock === 0).length
  const lowStock = allRows.filter((r) => r.variant.stock > 0 && r.variant.stock < 5).length

  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="mb-8 pb-5 border-b border-surface-container flex items-center justify-between">
        <div>
          <h1 className="font-headline font-bold text-headline-md text-on-surface">Stok Yönetimi</h1>
          <p className="text-secondary mt-1 text-sm">Varyasyon bazlı stok görüntüleme ve güncelleme</p>
        </div>
        <button onClick={fetchProducts} className="btn-outline py-2.5 px-4 text-sm">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {[
          { label: 'Toplam Stok (Varyasyon)', value: totalStock, Icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Stokta Yok', value: outOfStock, Icon: TrendingDown, color: 'text-primary', bg: 'bg-red-50' },
          { label: 'Düşük Stok (1–4)', value: lowStock, Icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-50' },
        ].map(({ label, value, Icon, color, bg }) => (
          <div key={label} className="bg-white border border-surface-container p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-secondary font-medium">{label}</p>
              <div className={`w-9 h-9 ${bg} flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
            </div>
            <p className="font-headline font-bold text-2xl text-on-surface">{value}</p>
          </div>
        ))}
      </div>

      {/* Stok Tablosu */}
      <div className="bg-white border border-surface-container">
        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3 text-secondary">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-medium">Stok verileri yükleniyor...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-container-low border-b border-surface-container">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold text-secondary">Ürün</th>
                  <th className="text-left px-5 py-3 font-semibold text-secondary hidden md:table-cell">Varyasyon</th>
                  <th className="text-right px-5 py-3 font-semibold text-secondary hidden sm:table-cell">SKU</th>
                  <th className="text-center px-5 py-3 font-semibold text-secondary">Stok</th>
                  <th className="text-right px-5 py-3 font-semibold text-secondary">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {allRows.map(({ product, variant }) => {
                  const isEditing = editState?.variantId === variant.id
                  const wasSaved = saved === variant.id
                  const isSaving = saving === variant.id

                  return (
                    <tr key={variant.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-medium text-on-surface">{product.name}</p>
                        <p className="text-xs text-secondary mt-0.5">{product.brand ?? ''}</p>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className="text-xs text-secondary bg-surface-container px-2.5 py-1">
                          {[variant.frame_size, variant.color].filter(Boolean).join(' / ') || 'Standart'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right hidden sm:table-cell">
                        <span className="text-xs font-mono text-secondary">{variant.sku ?? product.sku ?? '—'}</span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editState.stock}
                              onChange={(e) => setEditState({ variantId: variant.id, stock: parseInt(e.target.value) || 0 })}
                              className="w-20 text-center border border-primary py-1.5 text-sm font-bold focus:outline-none"
                              min={0}
                              autoFocus
                              id={`stock-input-${variant.id}`}
                            />
                          ) : (
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold ${
                              variant.stock === 0 ? 'bg-red-50 text-primary'
                              : variant.stock < 5 ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-green-100 text-green-700'
                            }`}>
                              {variant.stock === 0 ? 'Tükendi' : `${variant.stock} adet`}
                            </span>
                          )}
                          {wasSaved && (
                            <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                              <CheckCircle className="w-3 h-3" /> Kaydedildi
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        {isSaving ? (
                          <Loader2 className="w-4 h-4 animate-spin ml-auto text-secondary" />
                        ) : isEditing ? (
                          <button
                            onClick={() => saveStock(variant.id)}
                            className="inline-flex items-center gap-1.5 ml-auto px-3 py-1.5 bg-on-surface text-white text-xs font-semibold hover:bg-green-700 transition-colors"
                            id={`save-stock-${variant.id}`}
                          >
                            <Save className="w-3 h-3" />
                            Kaydet
                          </button>
                        ) : (
                          <button
                            onClick={() => startEdit(variant.id, variant.stock)}
                            className="inline-flex items-center gap-1.5 ml-auto px-3 py-1.5 border border-surface-container text-secondary text-xs font-semibold hover:border-on-surface hover:text-on-surface transition-colors"
                            id={`edit-stock-${variant.id}`}
                          >
                            <Edit3 className="w-3 h-3" />
                            Güncelle
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {allRows.length === 0 && (
              <div className="text-center py-16">
                <Package className="w-10 h-10 text-secondary mx-auto mb-3" />
                <p className="font-semibold text-on-surface">Ürün bulunamadı</p>
                <p className="text-sm text-secondary mt-1">Admin panelinden ürün ekleyin.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
